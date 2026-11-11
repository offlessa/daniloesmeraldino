import { PHOTO_BUCKET, supabase } from '../lib/supabase'

const PUBLIC_PREFIX = `/storage/v1/object/public/${PHOTO_BUCKET}/`

/** Reduz a foto no próprio navegador antes de enviar (máx. 2000 px, JPEG) */
export async function shrink(file: File, max = 2000): Promise<{ blob: Blob; w: number; h: number }> {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image()
      i.onload = () => resolve(i)
      i.onerror = reject
      i.src = url
    })
    const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight))
    const w = Math.round(img.naturalWidth * scale)
    const h = Math.round(img.naturalHeight * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('falha ao converter'))), 'image/jpeg', 0.82)
    )
    return { blob, w, h }
  } finally {
    URL.revokeObjectURL(url)
  }
}

/** Envia uma foto para a pasta da obra (ou do site) e devolve o endereço público */
export async function uploadPhoto(folder: string, file: File) {
  const { blob, w, h } = await shrink(file)
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
  const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, blob, { contentType: 'image/jpeg' })
  if (error) throw error
  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path)
  return { url: data.publicUrl, w, h }
}

/** Apaga do armazenamento uma foto enviada pelo painel (as que vieram com o site ficam) */
export async function removeStored(url: string) {
  const i = url.indexOf(PUBLIC_PREFIX)
  if (i >= 0) await supabase.storage.from(PHOTO_BUCKET).remove([url.slice(i + PUBLIC_PREFIX.length)])
}
