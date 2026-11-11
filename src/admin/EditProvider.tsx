import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { LayoutGrid, LogOut, MessageSquare, Pencil } from 'lucide-react'
import { supabase, type PhotoRow, type ProjectRow } from '../lib/supabase'
import type { TestimonialRow } from '../lib/supabaseConfig'
import { applyRows, loadSiteData, setSiteText, setTestimonials, toPhoto, toProject, updateSiteData } from '../data/store'
import { projectSlug, slugify, type Project } from '../data/projects'
import { ADMIN_PATH } from '../route'
import { EditContext, type EditApi } from './edit'
import { removeStored, uploadPhoto } from './photos'

const MODE_KEY = 'modo-edicao'

const readMode = () => {
  try {
    return localStorage.getItem(MODE_KEY) !== 'off'
  } catch {
    return true
  }
}

/** Mensagem de erro que diz o que fazer (em vez de só "não foi possível") */
function explain(e: unknown) {
  const err = (e ?? {}) as { code?: string; message?: string; status?: number; statusCode?: string }
  const text = `${err.code ?? ''} ${err.message ?? ''}`
  if (err.code === 'PGRST205' || text.includes('site_content'))
    return 'Falta criar a tabela dos textos: rode o arquivo supabase/site_content.sql no Supabase.'
  if (/jwt|token|401|403/i.test(text) || err.status === 401 || err.statusCode === '403')
    return 'Seu login expirou ou não tem permissão. Saia e entre de novo pela Área do administrador.'
  if (/row-level security|policy/i.test(text))
    return 'O banco recusou a gravação (permissões). Confira se o schema.sql foi rodado inteiro.'
  return `Não foi possível salvar (${err.message ?? 'erro desconhecido'}).`
}

/** Recarrega todas as obras do banco, inclusive as ocultas (só o administrador consegue) */
async function reloadAll() {
  const { data, error } = await supabase.from('projects').select('*, project_photos(*)').order('sort_order')
  if (!error && data) applyRows(data as (ProjectRow & { project_photos: PhotoRow[] })[])
}

/** Atualiza na tela os depoimentos aprovados */
async function reloadTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('status', 'approved')
    .order('sort_order')
    .order('created_at')
  if (!error && data) setTestimonials(data as TestimonialRow[])
}

async function pendingCount() {
  const { count } = await supabase.from('testimonials').select('id', { count: 'exact', head: true }).eq('status', 'pending')
  return count ?? 0
}

async function photoRows(p: Project) {
  const { data } = await supabase.from('project_photos').select('*').eq('project_id', p.id!).order('sort_order')
  return (data as PhotoRow[]) ?? []
}

/** Atualiza na tela a galeria de uma obra a partir do banco */
async function reloadGallery(p: Project) {
  const rows = await photoRows(p)
  updateSiteData((d) => ({ ...d, galleries: { ...d.galleries, [projectSlug(p)]: rows.map(toPhoto) } }))
}

const replaceProject = (row: ProjectRow) =>
  updateSiteData((d) => ({ ...d, projects: d.projects.map((x) => (x.id === row.id ? toProject(row) : x)) }))

/**
 * Edição direto no site para quem fez login como administrador: barra com a chave
 * "Modo edição" e as ações que gravam no banco. Baixado só por quem tem sessão salva.
 */
export default function EditProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [on, setOn] = useState(readMode)
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null)
  const [pending, setPending] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  // Logado: traz também as obras ocultas (depois da carga pública, para ela não sobrescrever)
  useEffect(() => {
    if (!session) return
    loadSiteData().then(reloadAll)
    pendingCount().then(setPending)
  }, [session])

  const say = useCallback((text: string, error = false) => {
    setNotice({ text, error })
    setTimeout(() => setNotice((n) => (n?.text === text ? null : n)), error ? 6000 : 2500)
  }, [])

  const toggle = () => {
    const next = !on
    setOn(next)
    try {
      localStorage.setItem(MODE_KEY, next ? 'on' : 'off')
    } catch {
      /* só não lembra a escolha */
    }
  }

  const api = useMemo<EditApi>(() => {
    // Toda ação: confere se a obra veio do banco, grava e avisa se deu certo
    const run = async (p: Project | null, ok: string, fn: () => Promise<unknown>) => {
      if (p && !p.id) return say('Esta obra ainda não está no banco — recarregue a página.', true)
      try {
        await fn()
        if (ok) say(ok)
      } catch (e) {
        say(explain(e), true)
      }
    }

    const update = async (p: Project, patch: Partial<ProjectRow>) => {
      const { data, error } = await supabase
        .from('projects')
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq('id', p.id!)
        .select('*')
        .single()
      if (error) throw error
      replaceProject(data as ProjectRow)
    }

    return {
      saveProject: (p, patch) => run(p, 'Salvo!', () => update(p, patch)),

      uploadCover: (p, file) =>
        run(p, 'Capa trocada!', async () => {
          say('Enviando a capa…')
          const { url } = await uploadPhoto(projectSlug(p), file)
          await update(p, { cover_url: url })
        }),

      setCover: (p, photo) => run(p, 'Capa trocada!', () => update(p, { cover_url: photo.src })),

      addPhotos: (p, files) =>
        run(p, '', async () => {
          const rows = await photoRows(p)
          let order = Math.max(-1, ...rows.map((r) => r.sort_order)) + 1
          let failed = 0
          const list = Array.from(files)
          for (const [i, file] of list.entries()) {
            say(`Enviando foto ${i + 1} de ${list.length}…`)
            try {
              const { url, w, h } = await uploadPhoto(projectSlug(p), file)
              const { error } = await supabase
                .from('project_photos')
                .insert({ project_id: p.id, url, width: w, height: h, interior: false, sort_order: order++ })
              if (error) throw error
            } catch {
              failed++
            }
          }
          await reloadGallery(p)
          say(failed ? `${failed} foto(s) não foram enviadas.` : 'Fotos adicionadas!', failed > 0)
        }),

      toggleInterior: (p, photo) =>
        run(p, '', async () => {
          const { error } = await supabase.from('project_photos').update({ interior: !photo.interior }).eq('id', photo.id!)
          if (error) throw error
          await reloadGallery(p)
        }),

      movePhoto: (p, photo, dir) =>
        run(p, '', async () => {
          const rows = await photoRows(p)
          const i = rows.findIndex((r) => r.id === photo.id)
          const other = rows[i + dir]
          if (i < 0 || !other) return
          await Promise.all([
            supabase.from('project_photos').update({ sort_order: other.sort_order }).eq('id', rows[i].id),
            supabase.from('project_photos').update({ sort_order: rows[i].sort_order }).eq('id', other.id),
          ])
          await reloadGallery(p)
        }),

      deletePhoto: (p, photo) =>
        run(p, 'Foto apagada.', async () => {
          const { error } = await supabase.from('project_photos').delete().eq('id', photo.id!)
          if (error) throw error
          if (photo.src !== p.image) await removeStored(photo.src)
          await reloadGallery(p)
        }),

      createProject: async (title) => {
        const { data: rows } = await supabase.from('projects').select('slug, sort_order')
        const taken = new Set((rows ?? []).map((r) => r.slug))
        const base = slugify(title) || 'obra'
        let slug = base
        for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`
        const sort = Math.max(0, ...(rows ?? []).map((r) => r.sort_order)) + 1
        const { error } = await supabase
          .from('projects')
          .insert({ slug, title, cover_url: '', published: false, sort_order: sort })
        if (error) {
          say('Não foi possível criar a obra.', true)
          return null
        }
        await reloadAll()
        return slug
      },

      deleteProject: async (p) => {
        if (!p.id) return false
        const rows = await photoRows(p)
        await Promise.all(rows.map((r) => removeStored(r.url)))
        await removeStored(p.image)
        const { error } = await supabase.from('projects').delete().eq('id', p.id)
        if (error) {
          say('Não foi possível excluir.', true)
          return false
        }
        await reloadAll()
        return true
      },

      saveText: (key, value) =>
        run(null, value ? 'Salvo!' : 'Voltou ao texto original.', async () => {
          // Texto apagado: remove a linha e o site volta a mostrar o original
          const { error } = value
            ? await supabase.from('site_content').upsert({ key, value, updated_at: new Date().toISOString() })
            : await supabase.from('site_content').delete().eq('key', key)
          if (error) throw error
          setSiteText(key, value || null)
        }),

      listTestimonials: async (status) => {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('status', status)
          .order('created_at', { ascending: false })
        if (error) {
          say(explain(error), true)
          return []
        }
        return data as TestimonialRow[]
      },

      setTestimonialStatus: (id, status) =>
        run(null, status === 'approved' ? 'Depoimento aprovado — já está no site!' : 'Depoimento retirado do site.', async () => {
          // Aprovado entra no fim da lista do site
          let extra = {}
          if (status === 'approved') {
            const { data: last } = await supabase
              .from('testimonials')
              .select('sort_order')
              .order('sort_order', { ascending: false })
              .limit(1)
            extra = { sort_order: (last?.[0]?.sort_order ?? 0) + 1 }
          }
          const { error } = await supabase.from('testimonials').update({ status, ...extra }).eq('id', id)
          if (error) throw error
          await reloadTestimonials()
          setPending(await pendingCount())
        }),

      updateTestimonial: (t, patch) =>
        run(null, 'Salvo!', async () => {
          if (!t.id) throw new Error('Depoimento ainda não está no banco')
          const { error } = await supabase.from('testimonials').update(patch).eq('id', t.id)
          if (error) throw error
          await reloadTestimonials()
        }),

      uploadSiteImage: (key, file) =>
        run(null, 'Foto trocada!', async () => {
          say('Enviando a foto…')
          const { url } = await uploadPhoto('site', file)
          const { error } = await supabase
            .from('site_content')
            .upsert({ key, value: url, updated_at: new Date().toISOString() })
          if (error) throw error
          setSiteText(key, url)
        }),
    }
  }, [say])

  // Sem login válido: o site fica exatamente como para qualquer visitante
  if (!session) return <>{children}</>

  return (
    <EditContext.Provider value={{ editing: on, api, pending }}>
      {children}

      <div className="fixed z-[90] bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-olive-dark text-sand-light shadow-2xl shadow-black/30 px-2 py-2 text-[10px] tracking-[0.2em] uppercase max-w-[calc(100vw-1.5rem)]">
        <button
          onClick={toggle}
          aria-pressed={on}
          className={`flex items-center gap-2 px-3 py-2 uppercase transition-colors ${on ? 'bg-sand-light text-olive' : 'hover:bg-white/10'}`}
        >
          <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
          Modo edição: {on ? 'ligado' : 'desligado'}
        </button>
        {pending > 0 && (
          <a
            href="/#testimonials"
            className="flex items-center gap-2 px-3 py-2 uppercase bg-sand text-olive hover:bg-sand-light"
            title="Depoimentos aguardando aprovação"
          >
            <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.75} />
            {pending} <span className="hidden sm:inline">{pending === 1 ? 'depoimento' : 'depoimentos'}</span>
          </a>
        )}
        <a href={ADMIN_PATH} className="flex items-center gap-2 px-3 py-2 uppercase hover:bg-white/10" title="Lista de todas as obras">
          <LayoutGrid className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span className="hidden sm:inline">Painel</span>
        </a>
        <button
          onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
          className="flex items-center gap-2 px-3 py-2 uppercase hover:bg-white/10"
          title="Sair da conta"
        >
          <LogOut className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>

      {notice && (
        <div
          role="status"
          className={`fixed z-[90] bottom-20 left-1/2 -translate-x-1/2 px-5 py-3 text-sm shadow-xl ${
            notice.error ? 'bg-red-700 text-white' : 'bg-white text-olive border border-sand'
          }`}
        >
          {notice.text}
        </div>
      )}
    </EditContext.Provider>
  )
}
