import { PHOTO_BUCKET, supabase } from '../lib/supabase'
import { VARIANT_WIDTHS } from '../lib/images'

const PUBLIC_PREFIX = `/storage/v1/object/public/${PHOTO_BUCKET}/`

const loadImage = (file: File) =>
  new Promise<{ img: HTMLImageElement; url: string }>((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => resolve({ img, url })
    img.onerror = reject
    img.src = url
  })

/** Desenha a foto reduzida (sem aumentar) e devolve no formato pedido */
async function render(img: HTMLImageElement, max: number, byWidth: boolean, type: string, quality: number) {
  const side = byWidth ? img.naturalWidth : Math.max(img.naturalWidth, img.naturalHeight)
  const scale = Math.min(1, max / side)
  const w = Math.round(img.naturalWidth * scale)
  const h = Math.round(img.naturalHeight * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('falha ao converter'))), type, quality)
  )
  return { blob, w, h }
}

const upload = async (path: string, blob: Blob) => {
  const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, blob, { contentType: blob.type })
  if (error) throw error
}

/**
 * Envia uma foto para a pasta da obra (ou do site) e devolve o endereço público. Junto vão as
 * versões leves (WebP de 800 e 1400 px) que o site usa no celular; o final "-r.jpg" no nome
 * avisa o site de que elas existem. Navegador que não gera WebP: vai só a foto principal.
 */
export async function uploadPhoto(folder: string, file: File) {
  const { img, url } = await loadImage(file)
  try {
    const main = await render(img, 2000, false, 'image/jpeg', 0.82)
    const variants = await Promise.all(VARIANT_WIDTHS.map((w) => render(img, w, true, 'image/webp', 0.76)))
    const withVariants = variants.every((v) => v.blob.type === 'image/webp')

    const base = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const path = withVariants ? `${base}-r.jpg` : `${base}.jpg`
    await upload(path, main.blob)
    if (withVariants)
      await Promise.all(VARIANT_WIDTHS.map((w, i) => upload(`${base}-r.${w}.webp`, variants[i].blob)))

    const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path)
    return { url: data.publicUrl, w: main.w, h: main.h }
  } finally {
    URL.revokeObjectURL(url)
  }
}

/** Apaga do armazenamento uma foto enviada pelo painel, com as versões leves (as que vieram com o site ficam) */
export async function removeStored(url: string) {
  const i = url.indexOf(PUBLIC_PREFIX)
  if (i < 0) return
  const path = url.slice(i + PUBLIC_PREFIX.length)
  const extra = path.endsWith('-r.jpg') ? VARIANT_WIDTHS.map((w) => path.replace(/\.jpg$/, `.${w}.webp`)) : []
  await supabase.storage.from(PHOTO_BUCKET).remove([path, ...extra])
}
