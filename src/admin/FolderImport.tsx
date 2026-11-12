import { useEffect, useRef, useState } from 'react'
import { Check, Loader2, Sofa, Star, Upload, X } from 'lucide-react'
import { supabase, type PhotoRow } from '../lib/supabase'
import { uploadPhoto } from './photos'

const IMAGE = /\.(jpe?g|png|webp|heic|heif)$/i

export type PickedFile = { file: File; path: string }

type Item = PickedFile & {
  key: string
  url: string
  interior: boolean
  selected: boolean
  /** Parecida com uma foto que já está no site ou com outra desta pasta */
  dup?: 'site' | 'pasta'
  /** Formato que o navegador não abre (HEIC do iPhone no Windows, por exemplo) */
  unreadable?: boolean
}

/** Arquivos de uma pasta arrastada (entra nas subpastas, como INTERIORES) */
export async function filesFromDrop(e: React.DragEvent): Promise<PickedFile[]> {
  const out: PickedFile[] = []
  const walk = async (entry: FileSystemEntry, path: string): Promise<void> => {
    if (entry.isFile) {
      const file = await new Promise<File>((res, rej) => (entry as FileSystemFileEntry).file(res, rej))
      out.push({ file, path: `${path}${file.name}` })
      return
    }
    const reader = (entry as FileSystemDirectoryEntry).createReader()
    // readEntries devolve em blocos: lê até acabar
    for (;;) {
      const batch = await new Promise<FileSystemEntry[]>((res, rej) => reader.readEntries(res, rej))
      if (!batch.length) break
      for (const child of batch) await walk(child, `${path}${entry.name}/`)
    }
  }
  const entries = Array.from(e.dataTransfer.items)
    .map((i) => i.webkitGetAsEntry())
    .filter((x): x is FileSystemEntry => !!x)
  for (const entry of entries) await walk(entry, '')
  return out
}

/** Arquivos escolhidos pelo botão (input com webkitdirectory guarda o caminho de cada um) */
export const filesFromInput = (list: FileList | null): PickedFile[] =>
  Array.from(list ?? []).map((file) => ({ file, path: file.webkitRelativePath || file.name }))

/** "FOTOS CASA BONSAI" → "Casa Bonsai" */
export function nameFromFolder(files: PickedFile[]) {
  const top = files[0]?.path.split('/')[0] ?? ''
  const clean = top.replace(/^(fotos prontas|fotos|interiores)\s+/i, '').trim()
  return clean
    .toLowerCase()
    .replace(/(^|\s)\S/g, (c) => c.toUpperCase())
    .replace(/\b(Da|De|Do|Das|Dos|E)\b/g, (w) => w.toLowerCase())
}

// Impressão digital da imagem (9x8 em cinza): fotos quase iguais dão números parecidos
const canvas = document.createElement('canvas')
canvas.width = 9
canvas.height = 8
const ctx = canvas.getContext('2d', { willReadFrequently: true })!

function hashOf(img: HTMLImageElement) {
  ctx.drawImage(img, 0, 0, 9, 8)
  const d = ctx.getImageData(0, 0, 9, 8).data
  const g = (x: number, y: number) => {
    const i = (y * 9 + x) * 4
    return d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11
  }
  const bits: number[] = []
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) bits.push(g(x, y) > g(x + 1, y) ? 1 : 0)
  return bits
}
const distance = (a: number[], b: number[]) => a.reduce((n, v, i) => n + (v !== b[i] ? 1 : 0), 0)

const loadImg = (src: string, cors = false) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    if (cors) img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

/** Versão leve da foto do site, quando existe (só para comparar) */
const light = (url: string) =>
  /\/images\/web\/.+\.jpg$|-r\.jpg$/.test(url) ? url.replace(/\.jpg$/, '.800.webp') : url

/**
 * Importação de uma pasta inteira: mostra todas as fotos, já separa interiores (subpasta INTERIORES)
 * e desmarca as repetidas. O administrador escolhe quais vão e qual é a capa, e envia de uma vez.
 */
export default function FolderImport({
  projectId,
  folder,
  existing,
  hasCover,
  initial,
  onDone,
  onCancel,
}: {
  projectId: string
  folder: string
  existing: PhotoRow[]
  hasCover: boolean
  initial: PickedFile[]
  onDone: (result: { added: number; failed: number; cover?: string }) => void
  onCancel: () => void
}) {
  const [items, setItems] = useState<Item[]>([])
  const [checking, setChecking] = useState(true)
  const [cover, setCover] = useState<string | null>(null)
  const [sending, setSending] = useState<{ done: number; total: number } | null>(null)
  const urls = useRef<string[]>([])
  // Fotos que já estão na obra: lidas uma vez, sem recomeçar a análise quando a lista recarrega
  const existingRef = useRef(existing)
  existingRef.current = existing

  useEffect(() => {
    let alive = true
    const picked = initial
      .filter((p) => IMAGE.test(p.file.name) && !p.path.split('/').some((s) => s.startsWith('.')))
      .sort((a, b) => a.path.localeCompare(b.path, 'pt-BR', { numeric: true }))
    const list: Item[] = picked.map((p, i) => {
      const url = URL.createObjectURL(p.file)
      urls.current.push(url)
      return { ...p, key: `${i}-${p.path}`, url, interior: /(^|\/)interior/i.test(p.path), selected: true }
    })
    setItems(list)

    // Compara com as fotos que já estão na obra e entre si, uma de cada vez
    ;(async () => {
      const known: number[][] = []
      for (const p of existingRef.current) {
        try {
          known.push(hashOf(await loadImg(light(p.url), true)))
        } catch {
          /* foto do site que não deu para ler: só não entra na comparação */
        }
      }
      const seen: number[][] = []
      for (const item of list) {
        if (!alive) return
        let patch: Partial<Item>
        try {
          const h = hashOf(await loadImg(item.url))
          if (known.some((k) => distance(k, h) <= 10)) patch = { dup: 'site', selected: false }
          else if (seen.some((k) => distance(k, h) <= 8)) patch = { dup: 'pasta', selected: false }
          else patch = {}
          seen.push(h)
        } catch {
          patch = { unreadable: true, selected: false }
        }
        // Análise antiga (a pasta foi trocada ou o painel fechou): não mexe na lista nova
        if (!alive) return
        setItems((cur) => cur.map((x) => (x.key === item.key ? { ...x, ...patch } : x)))
      }
      if (alive) setChecking(false)
    })()

    return () => {
      alive = false
      urls.current.forEach(URL.revokeObjectURL)
      urls.current = []
    }
  }, [initial])

  const toggle = (key: string, change: (x: Item) => Partial<Item>) =>
    setItems((cur) => cur.map((x) => (x.key === key ? { ...x, ...change(x) } : x)))

  const chosen = items.filter((x) => x.selected)
  // Fotos de fora primeiro, depois interiores, na ordem da pasta
  const ordered = [...chosen.filter((x) => !x.interior), ...chosen.filter((x) => x.interior)]

  const send = async () => {
    setSending({ done: 0, total: ordered.length })
    const results: ({ url: string; w: number; h: number } | null)[] = new Array(ordered.length).fill(null)
    let next = 0
    // Duas por vez: rápido sem travar o navegador
    await Promise.all(
      [0, 1].map(async () => {
        while (next < ordered.length) {
          const i = next++
          try {
            results[i] = await uploadPhoto(folder, ordered[i].file)
          } catch {
            results[i] = null
          }
          setSending((s) => s && { ...s, done: s.done + 1 })
        }
      })
    )

    const { data } = await supabase.from('project_photos').select('sort_order').eq('project_id', projectId)
    let order = Math.max(-1, ...(data ?? []).map((r) => r.sort_order as number)) + 1
    const rows = ordered.flatMap((item, i) => {
      const r = results[i]
      return r ? [{ project_id: projectId, url: r.url, width: r.w, height: r.h, interior: item.interior, sort_order: order++ }] : []
    })
    const { error } = rows.length ? await supabase.from('project_photos').insert(rows) : { error: null }

    // Capa: a marcada com a estrela; sem estrela e sem capa ainda, a primeira foto de fora
    const coverIndex = cover ? ordered.findIndex((x) => x.key === cover) : hasCover ? -1 : 0
    const coverUrl = coverIndex >= 0 ? results[coverIndex]?.url : undefined

    onDone({ added: error ? 0 : rows.length, failed: ordered.length - (error ? 0 : rows.length), cover: coverUrl })
  }

  const groups: [string, Item[]][] = [
    ['Fachada e áreas externas', items.filter((x) => !x.interior)],
    ['Interiores', items.filter((x) => x.interior)],
  ]

  return (
    <div className="mt-8 bg-white">
      {/* Barra fixa com o resumo e o envio */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-olive/10 bg-white px-5 py-4">
        <div>
          <p className="font-serif text-2xl text-olive">
            {chosen.length} de {items.length} fotos escolhidas
          </p>
          <p className="mt-1 text-sm text-primary-500">
            {checking ? 'Procurando fotos repetidas…' : 'Clique na foto para tirar ou colocar. A estrela escolhe a capa.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {sending ? (
            <span className="inline-flex items-center gap-2 text-sm text-olive">
              <Loader2 className="w-4 h-4 animate-spin" /> Enviando {sending.done} de {sending.total}…
            </span>
          ) : (
            <>
              <button
                onClick={onCancel}
                className="inline-flex items-center gap-2 px-4 py-3 text-[11px] tracking-[0.25em] uppercase text-primary-500 hover:text-olive"
              >
                <X className="w-4 h-4" /> Cancelar
              </button>
              <button
                onClick={send}
                disabled={!chosen.length}
                className="inline-flex items-center gap-2 bg-olive px-6 py-3 text-[11px] tracking-[0.25em] uppercase text-sand-light hover:bg-olive-dark disabled:opacity-40"
              >
                <Upload className="w-4 h-4" strokeWidth={1.5} /> Enviar {chosen.length}
              </button>
            </>
          )}
        </div>
      </div>

      <p className="px-5 pt-5 text-sm leading-relaxed text-primary-600">
        Dica: priorize a área social (sala, cozinha, jantar, gourmet) e a suíte master. Nos outros ambientes, no
        máximo duas fotos de cada. Fotos marcadas como <strong>Repetida</strong> já estão no site ou são quase
        iguais a outra da pasta.
      </p>

      {groups.map(
        ([title, list]) =>
          list.length > 0 && (
            <section key={title} className="px-5 py-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-[10px] tracking-[0.3em] uppercase text-olive-light">
                  {title} · {list.filter((x) => x.selected).length}/{list.length}
                </h3>
                <div className="flex gap-4 text-[10px] tracking-[0.2em] uppercase">
                  <button
                    onClick={() => list.forEach((x) => !x.unreadable && toggle(x.key, () => ({ selected: true })))}
                    className="text-olive hover:underline"
                  >
                    Marcar todas
                  </button>
                  <button onClick={() => list.forEach((x) => toggle(x.key, () => ({ selected: false })))} className="text-olive hover:underline">
                    Desmarcar
                  </button>
                </div>
              </div>
              <ul className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
                {list.map((x) => (
                  <li key={x.key} className={`relative ${x.selected ? 'ring-2 ring-olive' : ''}`}>
                    <button
                      onClick={() => !x.unreadable && toggle(x.key, (it) => ({ selected: !it.selected }))}
                      className="block w-full"
                      title={x.path}
                    >
                      {x.unreadable ? (
                        <span className="flex aspect-[4/3] items-center justify-center bg-sand-light px-2 text-center text-xs text-primary-500">
                          {x.file.name}
                          <br />
                          formato não aceito: salve como JPG
                        </span>
                      ) : (
                        <img
                          src={x.url}
                          alt=""
                          loading="lazy"
                          className={`w-full aspect-[4/3] object-cover transition-opacity ${x.selected ? '' : 'opacity-35'}`}
                        />
                      )}
                    </button>
                    {x.selected && (
                      <span className="absolute top-1.5 left-1.5 flex h-6 w-6 items-center justify-center bg-olive text-sand-light">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                    {x.dup && (
                      <span className="absolute bottom-10 left-1.5 bg-white/90 px-1.5 py-0.5 text-[9px] tracking-[0.15em] uppercase text-red-700">
                        Repetida{x.dup === 'site' ? ' (já no site)' : ''}
                      </span>
                    )}
                    <div className="absolute top-1.5 right-1.5 flex gap-1">
                      <button
                        onClick={() => {
                          setCover(cover === x.key ? null : x.key)
                          toggle(x.key, () => ({ selected: true }))
                        }}
                        disabled={x.unreadable}
                        aria-label="Usar como capa"
                        title="Usar como capa"
                        className="flex h-7 w-7 items-center justify-center bg-white/90 text-olive hover:bg-olive hover:text-sand-light disabled:opacity-30"
                      >
                        <Star className={`w-4 h-4 ${cover === x.key ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    <button
                      onClick={() => toggle(x.key, (it) => ({ interior: !it.interior }))}
                      className={`flex w-full items-center justify-center gap-1.5 py-2 text-[9px] tracking-[0.15em] uppercase ${
                        x.interior ? 'bg-olive text-sand-light' : 'text-primary-500 hover:text-olive'
                      }`}
                    >
                      <Sofa className="w-3.5 h-3.5" strokeWidth={1.5} />
                      {x.interior ? 'Interiores' : 'Externa'}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )
      )}
    </div>
  )
}
