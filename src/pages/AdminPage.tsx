import { useCallback, useEffect, useRef, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  Plus,
  Sofa,
  Star,
  Trash2,
  Upload,
} from 'lucide-react'
import { PHOTO_BUCKET, supabase, type PhotoRow, type ProjectRow } from '../lib/supabase'
import { STATUS_LABEL, slugify } from '../data/projects'

// Visual do painel: o mesmo do site, mais enxuto
const FIELD =
  'w-full border-b border-olive/25 bg-transparent py-2.5 text-base text-primary-800 placeholder:text-primary-400 focus:outline-none focus:border-olive transition-colors'
const LABEL = 'block text-[10px] tracking-[0.3em] uppercase text-olive-light'
const PRIMARY =
  'inline-flex items-center justify-center gap-2 bg-olive px-6 py-3 text-[11px] tracking-[0.25em] uppercase text-sand-light hover:bg-olive-dark transition-colors disabled:opacity-40 disabled:pointer-events-none'
const SECONDARY =
  'inline-flex items-center justify-center gap-2 border border-olive/30 px-5 py-3 text-[11px] tracking-[0.25em] uppercase text-olive hover:border-olive transition-colors disabled:opacity-40 disabled:pointer-events-none'
const ICON_BTN =
  'w-8 h-8 flex items-center justify-center bg-white/90 text-olive hover:bg-olive hover:text-sand-light transition-colors disabled:opacity-30 disabled:pointer-events-none'

const PUBLIC_PREFIX = `/storage/v1/object/public/${PHOTO_BUCKET}/`

/** Reduz a foto no próprio navegador antes de enviar (máx. 2000 px, JPEG) */
async function shrink(file: File, max = 2000): Promise<{ blob: Blob; w: number; h: number }> {
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

/** Envia uma foto para a pasta da obra e devolve o endereço público */
async function uploadPhoto(slug: string, file: File) {
  const { blob, w, h } = await shrink(file)
  const path = `${slug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
  const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, blob, { contentType: 'image/jpeg' })
  if (error) throw error
  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path)
  return { url: data.publicUrl, w, h }
}

/** Apaga do armazenamento uma foto enviada pelo painel (as que vieram com o site ficam) */
async function removeStored(url: string) {
  const i = url.indexOf(PUBLIC_PREFIX)
  if (i >= 0) await supabase.storage.from(PHOTO_BUCKET).remove([url.slice(i + PUBLIC_PREFIX.length)])
}

function Notice({ text, error }: { text: string; error?: boolean }) {
  return (
    <p className={`text-sm ${error ? 'text-red-700' : 'text-olive'}`} role="status">
      {text}
    </p>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (!error) return
    // Explica o motivo de verdade (ajuda a resolver sem precisar de suporte)
    if (error.code === 'email_not_confirmed')
      setError('Esta conta ainda não foi confirmada. No Supabase, em Authentication → Users, confirme o usuário.')
    else if (error.code === 'invalid_credentials')
      setError('E-mail ou senha incorretos — ou essa conta não existe no Supabase (Authentication → Users).')
    else if (error.status === 429) setError('Muitas tentativas. Espere alguns minutos e tente de novo.')
    else setError(`Não foi possível entrar (${error.message}).`)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-sand-light px-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-white px-8 py-12 space-y-8">
        <div>
          <img src="/images/danilo-esmeraldino-logo.png" alt="Danilo Esmeraldino" className="h-10 w-auto" />
          <h1 className="mt-8 font-serif text-3xl text-olive">Área do administrador</h1>
        </div>
        <label className="block">
          <span className={LABEL}>E-mail</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" className={FIELD} autoFocus required />
        </label>
        <label className="block">
          <span className={LABEL}>Senha</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className={FIELD} required />
        </label>
        {error && <Notice text={error} error />}
        <button type="submit" disabled={busy} className={`${PRIMARY} w-full`}>
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar'}
        </button>
        <a href="/" className="block text-center text-[10px] tracking-[0.3em] uppercase text-olive-light hover:text-olive">
          ← Voltar ao site
        </a>
      </form>
    </main>
  )
}

type ProjectWithCount = ProjectRow & { project_photos: { count: number }[] }

function ProjectList({ onOpen }: { onOpen: (id: string) => void }) {
  const [rows, setRows] = useState<ProjectWithCount[] | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('projects').select('*, project_photos(count)').order('sort_order')
    if (error) setError('Não foi possível carregar as obras.')
    else setRows(data as ProjectWithCount[])
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Troca de lugar com a obra de cima/baixo (é a ordem do site)
  const move = async (i: number, dir: -1 | 1) => {
    if (!rows) return
    const a = rows[i]
    const b = rows[i + dir]
    if (!b) return
    const next = [...rows]
    next[i] = { ...b, sort_order: a.sort_order }
    next[i + dir] = { ...a, sort_order: b.sort_order }
    setRows(next)
    await Promise.all([
      supabase.from('projects').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('projects').update({ sort_order: a.sort_order }).eq('id', b.id),
    ])
  }

  const create = async () => {
    const title = window.prompt('Nome da nova obra (ex.: Casa Jacarandá):')?.trim()
    if (!title || !rows) return
    let slug = slugify(title) || 'obra'
    for (let n = 2; rows.some((r) => r.slug === slug); n++) slug = `${slugify(title)}-${n}`
    const sort = Math.max(0, ...rows.map((r) => r.sort_order)) + 1
    const { data, error } = await supabase
      .from('projects')
      .insert({ slug, title, cover_url: '', published: false, sort_order: sort })
      .select('id')
      .single()
    if (error) setError('Não foi possível criar a obra.')
    else onOpen(data.id)
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-olive">Obras</h1>
          <p className="mt-2 text-primary-600">A ordem desta lista é a ordem do site.</p>
        </div>
        <button onClick={create} className={PRIMARY}>
          <Plus className="w-4 h-4" strokeWidth={1.5} /> Nova obra
        </button>
      </div>
      {error && <div className="mt-6"><Notice text={error} error /></div>}
      {!rows ? (
        <Loader2 className="mt-16 w-6 h-6 animate-spin text-olive" />
      ) : (
        <ul className="mt-10 divide-y divide-olive/10 border-y border-olive/10 bg-white">
          {rows.map((r, i) => (
            <li key={r.id} className="flex items-center gap-4 px-3 sm:px-5 py-3">
              <div className="flex flex-col">
                <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Subir" className="p-1 text-olive disabled:opacity-20">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button onClick={() => move(i, 1)} disabled={i === rows.length - 1} aria-label="Descer" className="p-1 text-olive disabled:opacity-20">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <span className="w-20 sm:w-28 aspect-[16/10] shrink-0 bg-sand-light overflow-hidden">
                {r.cover_url && <img src={r.cover_url} alt="" loading="lazy" className="w-full h-full object-cover" />}
              </span>
              <button onClick={() => onOpen(r.id)} className="flex-1 min-w-0 text-left">
                <span className="block font-serif text-xl text-olive truncate">{r.title}</span>
                <span className="mt-1 flex flex-wrap gap-x-3 text-[10px] tracking-[0.2em] uppercase text-primary-500">
                  <span>{STATUS_LABEL[r.status]}</span>
                  <span>{r.project_photos[0]?.count ?? 0} fotos</span>
                  {!r.published && <span className="text-red-700">Oculta</span>}
                </span>
              </button>
              <button onClick={() => onOpen(r.id)} className={`${SECONDARY} hidden sm:inline-flex`}>
                Editar
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function ProjectEditor({ id, onBack }: { id: string; onBack: () => void }) {
  const [project, setProject] = useState<ProjectRow | null>(null)
  const [photos, setPhotos] = useState<PhotoRow[]>([])
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(0)
  const fileInput = useRef<HTMLInputElement>(null)
  const coverInput = useRef<HTMLInputElement>(null)

  const say = (text: string, error = false) => {
    setMessage({ text, error })
    if (!error) setTimeout(() => setMessage(null), 3000)
  }

  const loadPhotos = useCallback(async () => {
    const { data } = await supabase.from('project_photos').select('*').eq('project_id', id).order('sort_order')
    setPhotos((data as PhotoRow[]) ?? [])
  }, [id])

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => setProject(data as ProjectRow))
    loadPhotos()
  }, [id, loadPhotos])

  if (!project) return <Loader2 className="w-6 h-6 animate-spin text-olive" />

  const field = <K extends keyof ProjectRow>(key: K, value: ProjectRow[K]) => setProject({ ...project, [key]: value })

  const save = async () => {
    if (project.published && !project.cover_url) return say('Escolha uma capa antes de publicar.', true)
    setSaving(true)
    const { id: _id, ...rest } = project
    const { error } = await supabase
      .from('projects')
      .update({
        ...rest,
        title: rest.title.trim(),
        location: rest.location?.trim() || null,
        area: rest.area?.trim() || null,
        description: rest.description?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
    setSaving(false)
    if (error) say('Não foi possível salvar.', true)
    else say('Salvo! Já está no site.')
  }

  const remove = async () => {
    if (!window.confirm(`Excluir "${project.title}" e todas as fotos dela? Não dá para desfazer.`)) return
    await Promise.all(photos.map((p) => removeStored(p.url)))
    await removeStored(project.cover_url)
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) say('Não foi possível excluir.', true)
    else onBack()
  }

  const addPhotos = async (files: FileList | null) => {
    if (!files?.length) return
    setUploading(files.length)
    let order = Math.max(-1, ...photos.map((p) => p.sort_order)) + 1
    let failed = 0
    for (const file of Array.from(files)) {
      try {
        const { url, w, h } = await uploadPhoto(project.slug, file)
        await supabase
          .from('project_photos')
          .insert({ project_id: id, url, width: w, height: h, interior: false, sort_order: order++ })
      } catch {
        failed++
      }
      setUploading((n) => n - 1)
    }
    await loadPhotos()
    say(failed ? `${failed} foto(s) não foram enviadas.` : 'Fotos adicionadas!', failed > 0)
  }

  const setCover = async (url: string) => {
    setProject({ ...project, cover_url: url })
    await supabase.from('projects').update({ cover_url: url }).eq('id', id)
    say('Capa trocada!')
  }

  const uploadCover = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    setUploading(1)
    try {
      const { url } = await uploadPhoto(project.slug, file)
      await setCover(url)
    } catch {
      say('Não foi possível enviar a capa.', true)
    }
    setUploading(0)
  }

  const updatePhoto = async (photo: PhotoRow, change: Partial<PhotoRow>) => {
    setPhotos(photos.map((p) => (p.id === photo.id ? { ...p, ...change } : p)))
    await supabase.from('project_photos').update(change).eq('id', photo.id)
  }

  const movePhoto = async (i: number, dir: -1 | 1) => {
    const a = photos[i]
    const b = photos[i + dir]
    if (!b) return
    const next = [...photos]
    next[i] = { ...b, sort_order: a.sort_order }
    next[i + dir] = { ...a, sort_order: b.sort_order }
    setPhotos(next)
    await Promise.all([
      supabase.from('project_photos').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('project_photos').update({ sort_order: a.sort_order }).eq('id', b.id),
    ])
  }

  const deletePhoto = async (photo: PhotoRow) => {
    if (!window.confirm('Apagar esta foto?')) return
    setPhotos(photos.filter((p) => p.id !== photo.id))
    await supabase.from('project_photos').delete().eq('id', photo.id)
    if (photo.url !== project.cover_url) await removeStored(photo.url)
  }

  return (
    <section>
      <button onClick={onBack} className="text-[10px] tracking-[0.3em] uppercase text-olive-light hover:text-olive">
        ← Todas as obras
      </button>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-4xl text-olive">{project.title || 'Sem nome'}</h1>
        <a href={`/projetos/${project.slug}`} target="_blank" rel="noopener noreferrer" className={SECONDARY}>
          <ExternalLink className="w-4 h-4" strokeWidth={1.5} /> Ver no site
        </a>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        {/* Capa */}
        <div className="lg:col-span-5">
          <span className={LABEL}>Capa</span>
          <div className="mt-3 aspect-[16/10] bg-white flex items-center justify-center overflow-hidden">
            {project.cover_url ? (
              <img src={project.cover_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm text-primary-500">Sem capa</span>
            )}
          </div>
          <button onClick={() => coverInput.current?.click()} className={`${SECONDARY} mt-3`}>
            <Upload className="w-4 h-4" strokeWidth={1.5} /> Enviar nova capa
          </button>
          <p className="mt-2 text-sm text-primary-500">Ou use a estrela ★ em uma foto da galeria.</p>
          <input ref={coverInput} type="file" accept="image/*" hidden onChange={(e) => uploadCover(e.target.files)} />
        </div>

        {/* Dados */}
        <div className="lg:col-span-7 grid gap-7 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className={LABEL}>Nome</span>
            <input value={project.title} onChange={(e) => field('title', e.target.value)} className={FIELD} />
          </label>
          <label className="block">
            <span className={LABEL}>Tipo</span>
            <select value={project.type} onChange={(e) => field('type', e.target.value as ProjectRow['type'])} className={FIELD}>
              <option value="residencial">Residencial</option>
              <option value="comercial">Comercial</option>
              <option value="interiores">Só interiores</option>
            </select>
          </label>
          <label className="block">
            <span className={LABEL}>Situação</span>
            <select value={project.status} onChange={(e) => field('status', e.target.value as ProjectRow['status'])} className={FIELD}>
              <option value="projeto">Em projeto</option>
              <option value="andamento">Em andamento (obra)</option>
              <option value="concluido">Concluído</option>
            </select>
          </label>
          <label className="block">
            <span className={LABEL}>Categoria (aparece no card)</span>
            <input value={project.category} onChange={(e) => field('category', e.target.value)} placeholder="Residência" className={FIELD} />
          </label>
          <label className="block">
            <span className={LABEL}>Cidade</span>
            <input value={project.location ?? ''} onChange={(e) => field('location', e.target.value)} placeholder="Tubarão, SC" className={FIELD} />
          </label>
          <label className="block">
            <span className={LABEL}>Área construída</span>
            <input value={project.area ?? ''} onChange={(e) => field('area', e.target.value)} placeholder="275,78 m²" className={FIELD} />
          </label>
          <label className="block">
            <span className={LABEL}>Ano</span>
            <input value={project.year} onChange={(e) => field('year', e.target.value)} placeholder="2025" className={FIELD} />
          </label>
          <label className="block sm:col-span-2">
            <span className={LABEL}>Texto de apresentação</span>
            <textarea
              value={project.description ?? ''}
              onChange={(e) => field('description', e.target.value)}
              rows={5}
              className="mt-3 w-full border border-olive/25 bg-white p-4 text-base leading-relaxed text-primary-800 focus:outline-none focus:border-olive"
            />
          </label>
          <label className="flex items-center gap-3 sm:col-span-2 cursor-pointer">
            <input type="checkbox" checked={project.published} onChange={(e) => field('published', e.target.checked)} className="w-4 h-4 accent-olive" />
            <span className="text-primary-700">
              {project.published ? 'Publicada — aparece no site' : 'Oculta — só aparece aqui no painel'}
            </span>
          </label>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
            <button onClick={save} disabled={saving} className={PRIMARY}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
            </button>
            {message && <Notice text={message.text} error={message.error} />}
          </div>
        </div>
      </div>

      {/* Galeria */}
      <div className="mt-16 border-t border-olive/15 pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl text-olive">Fotos</h2>
            <p className="mt-2 text-sm text-primary-600">
              Use as setas para mudar a ordem, o sofá para marcar como interiores e a estrela para usar como capa.
              Essas mudanças valem na hora.
            </p>
          </div>
          <button onClick={() => fileInput.current?.click()} disabled={uploading > 0} className={PRIMARY}>
            {uploading > 0 ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Enviando {uploading}…
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" strokeWidth={1.5} /> Adicionar fotos
              </>
            )}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              addPhotos(e.target.files)
              e.target.value = ''
            }}
          />
        </div>

        {photos.length === 0 ? (
          <p className="mt-8 text-primary-500">Nenhuma foto ainda.</p>
        ) : (
          <ul className="mt-8 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((p, i) => (
              <li key={p.id} className={`relative bg-white ${p.url === project.cover_url ? 'ring-2 ring-olive' : ''}`}>
                <img src={p.url} alt="" loading="lazy" className="w-full aspect-[4/3] object-cover" />
                <div className="absolute top-2 left-2 flex gap-1">
                  <button onClick={() => movePhoto(i, -1)} disabled={i === 0} aria-label="Mover para trás" className={ICON_BTN}>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => movePhoto(i, 1)} disabled={i === photos.length - 1} aria-label="Mover para frente" className={ICON_BTN}>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <button onClick={() => setCover(p.url)} aria-label="Usar como capa" title="Usar como capa" className={ICON_BTN}>
                    <Star className={`w-4 h-4 ${p.url === project.cover_url ? 'fill-current' : ''}`} />
                  </button>
                  <button onClick={() => deletePhoto(p)} aria-label="Apagar foto" title="Apagar foto" className={ICON_BTN}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => updatePhoto(p, { interior: !p.interior })}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-colors ${
                    p.interior ? 'bg-olive text-sand-light' : 'text-primary-500 hover:text-olive'
                  }`}
                >
                  <Sofa className="w-4 h-4" strokeWidth={1.5} />
                  {p.interior ? 'Interiores' : 'Marcar como interiores'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-20 border-t border-olive/15 pt-8">
        <button onClick={remove} className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-red-700 hover:underline">
          <Trash2 className="w-4 h-4" strokeWidth={1.5} /> Excluir esta obra
        </button>
      </div>
    </section>
  )
}

/** Área do administrador: login e edição das obras do site (dados no Supabase). */
export default function AdminPage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  const open = (id: string | null) => {
    setOpenId(id)
    window.scrollTo({ top: 0 })
  }

  if (session === undefined)
    return (
      <main className="min-h-screen flex items-center justify-center bg-sand-light">
        <Loader2 className="w-6 h-6 animate-spin text-olive" />
      </main>
    )
  if (!session) return <Login />

  return (
    <main className="min-h-screen bg-sand-light">
      <header className="bg-white border-b border-sand">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-6 h-20">
          <a href="/" aria-label="Ver o site">
            <img src="/images/danilo-esmeraldino-logo.png" alt="Danilo Esmeraldino" className="h-9 w-auto" />
          </a>
          <div className="flex items-center gap-5">
            <span className="hidden sm:inline text-sm text-primary-500">{session.user.email}</span>
            <a href="/" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-olive">
              <Eye className="w-4 h-4" strokeWidth={1.5} /> Site
            </a>
            <button
              onClick={() => supabase.auth.signOut()}
              className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-olive"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} /> Sair
            </button>
          </div>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {openId ? <ProjectEditor id={openId} onBack={() => open(null)} /> : <ProjectList onOpen={open} />}
      </div>
      <p className="max-w-6xl mx-auto px-6 pb-10 text-xs text-primary-400 flex items-center gap-2">
        <EyeOff className="w-3.5 h-3.5" /> Página privada — só quem tem conta de administrador entra aqui.
      </p>
    </main>
  )
}
