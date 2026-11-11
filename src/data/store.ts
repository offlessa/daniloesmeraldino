import { useSyncExternalStore } from 'react'
import { projects as staticProjects, projectSlug, type Project } from './projects'
import { galleries as staticGalleries } from './galleries'
import { SUPABASE_ANON_KEY, SUPABASE_URL, type PhotoRow, type ProjectRow } from '../lib/supabaseConfig'

/** Foto da galeria; `id` só existe quando veio do banco (é o que permite editar) */
export type Photo = { id?: string; src: string; w: number; h: number; interior?: boolean }

export interface SiteData {
  projects: Project[]
  galleries: Record<string, Photo[]>
  /** Textos e fotos das páginas fixas alterados pelo administrador (chave → valor) */
  texts: Record<string, string>
  /** true depois de tentar buscar no banco (com ou sem sucesso) */
  loaded: boolean
}

// Começa com os dados que já vêm no site (abre na hora e serve de reserva se o banco falhar)
let data: SiteData = { projects: staticProjects, galleries: staticGalleries, texts: {}, loaded: false }
const listeners = new Set<() => void>()

const set = (next: SiteData) => {
  data = next
  listeners.forEach((l) => l())
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

/** Projetos e fotos atuais; atualiza sozinho quando chegam os dados do painel */
export const useSiteData = () => useSyncExternalStore(subscribe, () => data)

/** Altera os dados na tela (usado pela edição no próprio site, depois de gravar no banco) */
export const updateSiteData = (fn: (d: SiteData) => SiteData) => set(fn(data))

export const toProject = (r: ProjectRow): Project => ({
  id: r.id,
  slug: r.slug,
  published: r.published,
  title: r.title,
  category: r.category,
  type: r.type,
  year: r.year,
  status: r.status,
  image: r.cover_url,
  imagePosition: r.cover_position ?? undefined,
  location: r.location ?? undefined,
  area: r.area ?? undefined,
  description: r.description ?? undefined,
})

export const toPhoto = (r: PhotoRow): Photo => ({ id: r.id, src: r.url, w: r.width, h: r.height, interior: r.interior })

/** Troca os dados da tela pelas linhas do banco (obras com as fotos de cada uma) */
export function applyRows(rows: (ProjectRow & { project_photos: PhotoRow[] })[]) {
  const galleries: Record<string, Photo[]> = {}
  const projects = rows.map((r) => {
    galleries[r.slug] = [...r.project_photos].sort((a, b) => a.sort_order - b.sort_order).map(toPhoto)
    return toProject(r)
  })
  set({ ...data, projects, galleries, loaded: true })
}

/** Grava na tela um texto/foto das páginas fixas (null = volta ao original) */
export const setSiteText = (key: string, value: string | null) => {
  const texts = { ...data.texts }
  if (value === null) delete texts[key]
  else texts[key] = value
  set({ ...data, texts })
}

let loading: Promise<void> | null = null

const rest = async (path: string) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  })
  return res.ok ? res.json() : null
}

/**
 * Busca no banco o que o administrador publicou (uma vez por visita). Consulta direta,
 * sem a biblioteca do Supabase, para o site continuar leve.
 */
export function loadSiteData() {
  loading ??= (async () => {
    const [rows, texts] = await Promise.all([
      rest('projects?select=*,project_photos(*)&published=eq.true&order=sort_order').catch(() => null),
      rest('site_content?select=key,value').catch(() => null),
    ])
    if (Array.isArray(texts))
      data = { ...data, texts: Object.fromEntries(texts.map((t: { key: string; value: string }) => [t.key, t.value])) }
    if (Array.isArray(rows) && rows.length) applyRows(rows)
    else set({ ...data, loaded: true })
  })().catch(() => set({ ...data, loaded: true }))
  return loading
}

export const galleryOf = (d: SiteData, p: Project) => d.galleries[projectSlug(p)] ?? []
