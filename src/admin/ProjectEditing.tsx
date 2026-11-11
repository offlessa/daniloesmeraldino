import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Eye, EyeOff, ImagePlus, Sofa, Star, Trash2, Upload } from 'lucide-react'
import { STATUS_LABEL, projectsUrl, type Project, type Status } from '../data/projects'
import type { Photo } from '../data/store'
import { useEdit } from './edit'

// Controles que só aparecem no modo edição, na página de uma obra

const BAR_BTN =
  'inline-flex items-center gap-2 bg-white/95 px-4 py-2.5 text-[10px] tracking-[0.25em] uppercase text-olive shadow-lg hover:bg-olive hover:text-sand-light transition-colors'
const ICON_BTN =
  'w-8 h-8 flex items-center justify-center bg-white/95 text-olive hover:bg-olive hover:text-sand-light transition-colors disabled:opacity-30 disabled:pointer-events-none'

/** Botão sobre a capa para enviar outra foto */
export function CoverButton({ project }: { project: Project }) {
  const { editing, api } = useEdit()
  const input = useRef<HTMLInputElement>(null)
  if (!editing || !api) return null
  return (
    <div className="absolute bottom-6 right-6 z-10">
      <button onClick={() => input.current?.click()} className={BAR_BTN}>
        <Upload className="w-4 h-4" strokeWidth={1.5} /> Trocar capa
      </button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) api.uploadCover(project, file)
          e.target.value = ''
        }}
      />
    </div>
  )
}

/** Situação da obra: lista para escolher no modo edição */
export function StatusValue({ project }: { project: Project }) {
  const { editing, api } = useEdit()
  if (!editing || !api) return <>{STATUS_LABEL[project.status]}</>
  return (
    <select
      value={project.status}
      onChange={(e) => api.saveProject(project, { status: e.target.value as Status })}
      className="editable bg-transparent pr-2"
    >
      <option value="projeto">Em projeto</option>
      <option value="andamento">Em andamento</option>
      <option value="concluido">Concluído</option>
    </select>
  )
}

/** Publicar/ocultar e excluir a obra */
export function ProjectAdminBar({ project }: { project: Project }) {
  const { editing, api } = useEdit()
  if (!editing || !api) return null
  const hidden = project.published === false

  const remove = async () => {
    if (!window.confirm(`Excluir "${project.title}" e todas as fotos dela? Não dá para desfazer.`)) return
    if (await api.deleteProject(project)) window.location.href = projectsUrl()
  }

  return (
    <div className="mt-10 flex flex-wrap items-center gap-3 border border-dashed border-olive/40 p-4">
      <button
        onClick={() => {
          if (hidden && !project.image) return window.alert('Escolha uma capa antes de publicar.')
          api.saveProject(project, { published: hidden })
        }}
        className={`inline-flex items-center gap-2 px-4 py-2.5 text-[10px] tracking-[0.25em] uppercase transition-colors ${
          hidden ? 'bg-olive text-sand-light hover:bg-olive-dark' : 'border border-olive/30 text-olive hover:border-olive'
        }`}
      >
        {hidden ? <Eye className="w-4 h-4" strokeWidth={1.5} /> : <EyeOff className="w-4 h-4" strokeWidth={1.5} />}
        {hidden ? 'Publicar no site' : 'Ocultar do site'}
      </button>
      <span className="text-sm text-primary-600">
        {hidden ? 'Oculta — só quem está logado vê esta obra.' : 'Publicada — aparece para todos.'}
      </span>
      <button
        onClick={remove}
        className="ml-auto inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-red-700 hover:underline"
      >
        <Trash2 className="w-4 h-4" strokeWidth={1.5} /> Excluir obra
      </button>
    </div>
  )
}

/** Galeria em modo edição: todas as fotos na ordem, com os controles de cada uma */
export function EditGallery({ project, photos }: { project: Project; photos: Photo[] }) {
  const { api } = useEdit()
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  if (!api) return null

  const act = async (fn: () => Promise<void>) => {
    setBusy(true)
    try {
      await fn()
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="px-6 sm:px-10 lg:px-20 pb-24 lg:pb-32">
      <div className="max-w-6xl mx-auto border border-dashed border-olive/40 p-5 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl text-olive">Fotos da obra</h2>
            <p className="mt-2 text-sm text-primary-600">
              Setas mudam a ordem · ★ usa como capa · 🛋 marca como interiores · lixeira apaga. Desligue o modo
              edição para ver a galeria como o visitante vê.
            </p>
          </div>
          <button
            onClick={() => input.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 bg-olive px-5 py-3 text-[10px] tracking-[0.25em] uppercase text-sand-light hover:bg-olive-dark disabled:opacity-40"
          >
            <ImagePlus className="w-4 h-4" strokeWidth={1.5} /> Adicionar fotos
          </button>
          <input
            ref={input}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              const files = e.target.files
              if (files?.length) act(() => api.addPhotos(project, files))
              e.target.value = ''
            }}
          />
        </div>

        {photos.length === 0 ? (
          <p className="mt-8 text-primary-500">Nenhuma foto ainda.</p>
        ) : (
          <ul className={`mt-8 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 ${busy ? 'opacity-60 pointer-events-none' : ''}`}>
            {photos.map((photo, i) => {
              const isCover = photo.src === project.image
              return (
                <li key={photo.id ?? photo.src} className={`relative bg-sand-light ${isCover ? 'ring-2 ring-olive' : ''}`}>
                  <img src={photo.src} alt="" loading="lazy" className="w-full aspect-[4/3] object-cover" />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <button onClick={() => act(() => api.movePhoto(project, photo, -1))} disabled={i === 0} aria-label="Mover para trás" className={ICON_BTN}>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => act(() => api.movePhoto(project, photo, 1))} disabled={i === photos.length - 1} aria-label="Mover para frente" className={ICON_BTN}>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button onClick={() => act(() => api.setCover(project, photo))} aria-label="Usar como capa" title="Usar como capa" className={ICON_BTN}>
                      <Star className={`w-4 h-4 ${isCover ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => window.confirm('Apagar esta foto?') && act(() => api.deletePhoto(project, photo))}
                      aria-label="Apagar foto"
                      title="Apagar foto"
                      className={ICON_BTN}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => act(() => api.toggleInterior(project, photo))}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-colors ${
                      photo.interior ? 'bg-olive text-sand-light' : 'bg-white text-primary-500 hover:text-olive'
                    }`}
                  >
                    <Sofa className="w-4 h-4" strokeWidth={1.5} />
                    {photo.interior ? 'Interiores' : 'Marcar como interiores'}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
