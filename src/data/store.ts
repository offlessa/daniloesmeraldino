import { useSyncExternalStore } from 'react'
import { projects as staticProjects, projectSlug, type Project } from './projects'
import { galleries as staticGalleries } from './galleries'
import { testimonials as staticTestimonials, type Testimonial } from './testimonials'
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  type PhotoRow,
  type ProjectRow,
  type TestimonialRow,
} from '../lib/supabaseConfig'

/** Foto da galeria; `id` só existe quando veio do banco (é o que permite editar) */
export type Photo = { id?: string; src: string; w: number; h: number; interior?: boolean }

export interface SiteData {
  projects: Project[]
  galleries: Record<string, Photo[]>
  /** Textos e fotos das páginas fixas alterados pelo administrador (chave → valor) */
  texts: Record<string, string>
  /** Depoimentos aprovados, na ordem do site */
  testimonials: Testimonial[]
  /** true depois de tentar buscar no banco (com ou sem sucesso) */
  loaded: boolean
}

// Começa com os dados que já vêm no site (abre na hora e serve de reserva se o banco falhar)
let data: SiteData = {
  projects: staticProjects,
  galleries: staticGalleries,
  texts: {},
  testimonials: staticTestimonials,
  loaded: false,
}
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

export const toTestimonial = (r: TestimonialRow): Testimonial => ({
  id: r.id,
  name: r.name,
  company: r.company,
  text: r.text,
  project: r.project ?? undefined,
})

/** Troca na tela a lista de depoimentos aprovados */
export const setTestimonials = (rows: TestimonialRow[]) => set({ ...data, testimonials: rows.map(toTestimonial) })

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
    const [rows, texts, testimonials] = await Promise.all([
      rest('projects?select=*,project_photos(*)&published=eq.true&order=sort_order').catch(() => null),
      rest('site_content?select=key,value').catch(() => null),
      rest('testimonials?select=*&status=eq.approved&order=sort_order,created_at').catch(() => null),
    ])
    if (Array.isArray(texts))
      data = { ...data, texts: Object.fromEntries(texts.map((t: { key: string; value: string }) => [t.key, t.value])) }
    // Lista vazia no banco também vale (o administrador pode ter removido todos)
    if (Array.isArray(testimonials)) data = { ...data, testimonials: testimonials.map(toTestimonial) }
    if (Array.isArray(rows) && rows.length) applyRows(rows)
    else set({ ...data, loaded: true })
  })().catch(() => set({ ...data, loaded: true }))
  return loading
}

export const galleryOf = (d: SiteData, p: Project) => d.galleries[projectSlug(p)] ?? []

/**
 * Envia um depoimento de visitante. Ele entra como pendente: só aparece no site depois que o
 * administrador aprovar. Consulta direta, sem a biblioteca do Supabase.
 */
export async function sendTestimonial(t: { name: string; company: string; text: string }) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/testimonials`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      // O visitante não pode ler pendentes, então não pede a linha de volta
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(t),
  })
  if (!res.ok) throw new Error(`envio recusado (${res.status})`)
  // Aviso por e-mail ao escritório (endereço escolhido no painel). Se falhar, o depoimento já foi salvo.
  notifyByEmail(data.texts[NOTIFY_KEY], t).catch(() => {})
}

/** Onde fica, entre os textos do site, o e-mail que recebe o aviso de depoimento novo */
export const NOTIFY_KEY = 'notify.email'

/**
 * Manda o aviso pelo FormSubmit (gratuito, sem cadastro): na primeira mensagem para um endereço,
 * ele pede para confirmar por e-mail; depois disso entrega todas.
 */
export async function notifyByEmail(to: string | undefined, t: { name: string; company: string; text: string }) {
  const address = to?.trim()
  if (!address) return
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(address)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      _subject: `Novo depoimento no site: ${t.name}`,
      _template: 'table',
      _captcha: 'false',
      Nome: t.name,
      'Obra ou cidade': t.company || '-',
      Depoimento: t.text,
      'Para aprovar': 'Entre no site com a conta de administrador: https://www.daniloesmeraldino.com.br/#testimonials',
    }),
  })
  if (!res.ok) throw new Error(`aviso recusado (${res.status})`)
}
