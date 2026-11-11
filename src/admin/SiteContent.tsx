import { Fragment, useRef } from 'react'
import { ImagePlus } from 'lucide-react'
import { useSiteData } from '../data/store'
import { EditableText, useEdit } from './edit'

// Textos e fotos das páginas fixas (início, rodapé…). O texto original fica no código; o que o
// administrador muda é guardado no banco pela chave (ex. 'hero.title') e passa a valer no lugar.
//
// Marcação simples nos textos: *palavra* = itálico de destaque · [texto](#contato) = link ·
// quebra de linha = quebra de linha.

const TOKENS = /\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g

/** Converte o texto com a marcação simples em elementos */
export function rich(text: string, emClass = '', linkClass = 'link-underline') {
  return text.split('\n').map((line, li) => {
    const parts: React.ReactNode[] = []
    let last = 0
    for (const m of line.matchAll(TOKENS)) {
      if (m.index! > last) parts.push(line.slice(last, m.index))
      if (m[1]) parts.push(<em key={m.index} className={emClass}>{m[1]}</em>)
      else parts.push(<a key={m.index} href={m[3]} className={linkClass}>{m[2]}</a>)
      last = m.index! + m[0].length
    }
    parts.push(line.slice(last))
    return (
      <Fragment key={li}>
        {li > 0 && <br />}
        {parts}
      </Fragment>
    )
  })
}

/** Valor atual de um trecho (o do banco, ou o original) */
export function useSiteText(key: string, original: string) {
  const { texts } = useSiteData()
  return texts[key] ?? original
}

/**
 * Trecho de texto editável. Fora do modo edição mostra o texto formatado; no modo edição
 * vira campo (apagar tudo volta ao texto original).
 */
export function Txt({
  k,
  d,
  em,
  link,
  multiline,
}: {
  /** Chave no banco, ex. 'hero.title' */
  k: string
  /** Texto original */
  d: string
  /** Classe do itálico de destaque (*palavra*) */
  em?: string
  link?: string
  multiline?: boolean
}) {
  const value = useSiteText(k, d)
  const { editing, api } = useEdit()
  if (editing && api)
    return (
      <EditableText
        value={value}
        onSave={(v) => api.saveText(k, v === d ? '' : v)}
        multiline={multiline ?? d.includes('\n')}
        placeholder="Apague tudo para voltar ao texto original"
      />
    )
  return <>{rich(value, em, link)}</>
}

/** Lista editável: um item por linha */
export function useSiteList(key: string, original: string[]) {
  return useSiteText(key, original.join('\n'))
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

/** Botão "Trocar foto" sobre uma imagem das páginas fixas (só no modo edição) */
export function ImageSwap({ k, label = 'Trocar foto', className = 'top-3 left-3' }: { k: string; label?: string; className?: string }) {
  const { editing, api } = useEdit()
  const input = useRef<HTMLInputElement>(null)
  if (!editing || !api) return null
  return (
    <div className={`absolute z-20 ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          input.current?.click()
        }}
        className="inline-flex items-center gap-2 bg-white/95 px-4 py-2.5 text-[10px] tracking-[0.25em] uppercase text-olive shadow-lg hover:bg-olive hover:text-sand-light transition-colors"
      >
        <ImagePlus className="w-4 h-4" strokeWidth={1.5} /> {label}
      </button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) api.uploadSiteImage(k, file)
          e.target.value = ''
        }}
      />
    </div>
  )
}

/** Endereço atual de uma foto das páginas fixas */
export const useSiteImage = (key: string, original: string) => useSiteText(key, original)
