import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { Project } from '../data/projects'
import type { Photo } from '../data/store'
import type { ProjectRow, TestimonialRow } from '../lib/supabaseConfig'
import type { Testimonial } from '../data/testimonials'

// Edição direto no site. Este arquivo vai para todos os visitantes, então é só o "esqueleto":
// o código que grava no banco (src/admin/EditProvider.tsx) só é baixado por quem fez login.

/** Há uma sessão de administrador salva neste navegador (o login de verdade é conferido depois) */
export const HAS_ADMIN_SESSION = (() => {
  try {
    return Object.keys(localStorage).some((k) => k.startsWith('sb-') && k.endsWith('-auth-token'))
  } catch {
    return false
  }
})()

export type ProjectPatch = Partial<
  Pick<ProjectRow, 'title' | 'category' | 'type' | 'status' | 'year' | 'location' | 'area' | 'description' | 'published'>
>

/** Ações de edição (implementadas em EditProvider, com o banco) */
export interface EditApi {
  saveProject: (p: Project, patch: ProjectPatch) => Promise<void>
  uploadCover: (p: Project, file: File) => Promise<void>
  setCover: (p: Project, photo: Photo) => Promise<void>
  addPhotos: (p: Project, files: FileList) => Promise<void>
  toggleInterior: (p: Project, photo: Photo) => Promise<void>
  movePhoto: (p: Project, photo: Photo, dir: -1 | 1) => Promise<void>
  deletePhoto: (p: Project, photo: Photo) => Promise<void>
  createProject: (title: string) => Promise<string | null>
  deleteProject: (p: Project) => Promise<boolean>
  /** Texto das páginas fixas; vazio = volta ao texto original */
  saveText: (key: string, value: string) => Promise<void>
  /** Troca uma foto das páginas fixas */
  uploadSiteImage: (key: string, file: File) => Promise<void>
  /** Depoimentos de uma situação (ex.: os pendentes, para aprovar) */
  listTestimonials: (status: TestimonialRow['status']) => Promise<TestimonialRow[]>
  /** Aprovar, recusar ou remover do site */
  setTestimonialStatus: (id: string, status: TestimonialRow['status']) => Promise<void>
  updateTestimonial: (t: Testimonial, patch: Partial<Pick<TestimonialRow, 'name' | 'company' | 'text'>>) => Promise<void>
}

interface EditState {
  /** Modo edição ligado (administrador logado e com a chave ligada) */
  editing: boolean
  api: EditApi | null
  /** Depoimentos aguardando aprovação */
  pending: number
}

export const EditContext = createContext<EditState>({ editing: false, api: null, pending: 0 })

export const useEdit = () => useContext(EditContext)

/**
 * Texto que vira campo editável no modo edição: clica, escreve e, ao sair do campo,
 * grava. Fora do modo edição mostra o texto normal.
 */
export function EditableText({
  value,
  onSave,
  placeholder = 'Escrever…',
  multiline = false,
  className = '',
}: {
  value: string
  onSave: (value: string) => Promise<void> | void
  placeholder?: string
  multiline?: boolean
  className?: string
}) {
  const { editing } = useEdit()
  const ref = useRef<HTMLSpanElement>(null)
  const [saving, setSaving] = useState(false)

  // Texto de uma linha: textContent (innerText viria em MAIÚSCULAS onde o estilo é uppercase);
  // vários parágrafos: innerText, que preserva as quebras de linha digitadas
  const read = () => (multiline ? ref.current?.innerText : ref.current?.textContent) ?? ''
  const write = (text: string) => {
    if (!ref.current) return
    if (multiline) ref.current.innerText = text
    else ref.current.textContent = text
  }

  // Mantém o campo igual ao valor salvo quando ele muda por fora
  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) write(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editing])

  if (!editing) return <>{value}</>

  const commit = async () => {
    const text = read().replace(/\u00a0/g, ' ').trim()
    if (text === value.trim()) return
    setSaving(true)
    try {
      await onSave(text)
    } finally {
      setSaving(false)
    }
  }

  return (
    <span
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-multiline={multiline}
      data-placeholder={placeholder}
      onBlur={commit}
      // Dentro de botões e links: clicar para editar não pode abrir o link
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          write(value)
          ;(e.target as HTMLElement).blur()
        }
        if (e.key === 'Enter' && !multiline) {
          e.preventDefault()
          ;(e.target as HTMLElement).blur()
        }
      }}
      className={`editable ${multiline ? 'whitespace-pre-wrap block' : ''} ${saving ? 'opacity-50' : ''} ${className}`}
    />
  )
}
