import { useSyncExternalStore } from 'react'
import { projects as staticProjects, projectSlug, type Project } from './projects'
import { galleries as staticGalleries } from './galleries'
import { SUPABASE_ANON_KEY, SUPABASE_URL, type PhotoRow, type ProjectRow } from '../lib/supabaseConfig'

export type Photo = { src: string; w: number; h: number; interior?: boolean }

export interface SiteData {
  projects: Project[]
  galleries: Record<string, Photo[]>
  /** true depois de tentar buscar no banco (com ou sem sucesso) */
  loaded: boolean
}

// Começa com os dados que já vêm no site (abre na hora e serve de reserva se o banco falhar)
let data: SiteData = { projects: staticProjects, galleries: staticGalleries, loaded: false }
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

export const toProject = (r: ProjectRow): Project => ({
  slug: r.slug,
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

export const toPhoto = (r: PhotoRow): Photo => ({ src: r.url, w: r.width, h: r.height, interior: r.interior })

let loading: Promise<void> | null = null

/**
 * Busca no banco o que o administrador publicou (uma vez por visita). Consulta direta,
 * sem a biblioteca do Supabase, para o site continuar leve.
 */
export function loadSiteData() {
  loading ??= (async () => {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/projects?select=*,project_photos(*)&published=eq.true&order=sort_order`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
    )
    const rows = res.ok ? await res.json() : null
    if (!Array.isArray(rows) || !rows.length) {
      set({ ...data, loaded: true })
      return
    }
    const galleries: Record<string, Photo[]> = {}
    const projects = (rows as (ProjectRow & { project_photos: PhotoRow[] })[]).map((r) => {
      galleries[r.slug] = [...r.project_photos].sort((a, b) => a.sort_order - b.sort_order).map(toPhoto)
      return toProject(r)
    })
    set({ projects, galleries, loaded: true })
  })().catch(() => set({ ...data, loaded: true }))
  return loading
}

export const galleryOf = (d: SiteData, p: Project) => d.galleries[projectSlug(p)] ?? []
