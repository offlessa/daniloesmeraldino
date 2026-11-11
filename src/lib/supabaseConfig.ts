// Endereço e chave pública do banco. A chave anon pode ficar no código do site: o banco só
// deixa ler o que está publicado e só deixa alterar quem fez login como administrador.
export const SUPABASE_URL = 'https://fnomjyzmhiqxfvrqmxbs.supabase.co'
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZub21qeXptaGlxeGZ2cnFteGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ0MDE4NTksImV4cCI6MjEwOTk3Nzg1OX0.Etmm5vGfUpfM5W8L53dRln2HJH2sPgQFPvo7at5DT4o'

/** Pasta pública onde ficam as fotos enviadas pelo painel */
export const PHOTO_BUCKET = 'fotos'

/** Linhas das tabelas (ver supabase/schema.sql) */
export interface ProjectRow {
  id: string
  slug: string
  title: string
  category: string
  type: 'residencial' | 'comercial' | 'interiores'
  status: 'concluido' | 'andamento' | 'projeto'
  year: string
  location: string | null
  area: string | null
  description: string | null
  cover_url: string
  cover_position: string | null
  sort_order: number
  published: boolean
}

export interface PhotoRow {
  id: string
  project_id: string
  url: string
  width: number
  height: number
  interior: boolean
  sort_order: number
}

export interface TestimonialRow {
  id: string
  name: string
  company: string
  text: string
  status: 'pending' | 'approved' | 'rejected'
  project: string | null
  sort_order: number
  created_at: string
}
