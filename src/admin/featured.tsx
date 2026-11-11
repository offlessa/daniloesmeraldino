import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, Star, X } from 'lucide-react'
import { projectSlug, type Project } from '../data/projects'
import { useSiteData } from '../data/store'
import { useEdit } from './edit'
import { useSiteText } from './SiteContent'

// Projetos em destaque (carrossel da página inicial): lista de endereços das obras, um por linha,
// guardada como um texto do site. Sem escolha salva, valem os destaques originais.
export const FEATURED_KEY = 'portfolio.featured'
const DEFAULT_FEATURED = ['casa-lago', 'casa-je']

export function useFeatured(): Project[] {
  const { projects } = useSiteData()
  const slugs = useSiteText(FEATURED_KEY, DEFAULT_FEATURED.join('\n')).split('\n').filter(Boolean)
  const pick = (list: string[]) =>
    list
      .map((s) => projects.find((p) => projectSlug(p) === s))
      .filter((p): p is Project => !!p && p.published !== false)
  const chosen = pick(slugs)
  // Obras escolhidas que foram ocultadas/excluídas: nunca deixa o carrossel vazio
  return chosen.length ? chosen : pick(DEFAULT_FEATURED)
}

const save = (api: NonNullable<ReturnType<typeof useEdit>['api']>, slugs: string[]) =>
  api.saveText(FEATURED_KEY, slugs.join('\n'))

/** Botão "Escolher destaques" (modo edição): marca as obras e a ordem do carrossel */
export function FeaturedPicker() {
  const { editing, api } = useEdit()
  const { projects } = useSiteData()
  const current = useFeatured().map(projectSlug)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  if (!editing || !api) return null

  const toggle = (slug: string) =>
    setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]))

  return (
    <>
      <button
        onClick={() => {
          setSelected(current)
          setOpen(true)
        }}
        className="mb-8 inline-flex items-center gap-2 bg-olive px-5 py-3 text-[10px] tracking-[0.25em] uppercase text-sand-light hover:bg-olive-dark transition-colors"
      >
        <Star className="w-4 h-4" strokeWidth={1.5} /> Escolher destaques
      </button>

      {open &&
        createPortal(
        <div className="fixed inset-0 z-[95] bg-olive-dark/60 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-4xl max-h-full overflow-y-auto bg-white p-6 sm:p-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-3xl text-olive">Projetos em destaque</h2>
                <p className="mt-2 text-sm text-primary-600">
                  Clique nas obras na ordem em que devem aparecer no carrossel. Clique de novo para tirar.
                </p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Fechar" className="w-10 h-10 flex items-center justify-center text-olive">
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <ul className="mt-8 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {projects
                .filter((p) => p.published !== false && p.image)
                .map((p) => {
                  const slug = projectSlug(p)
                  const order = selected.indexOf(slug)
                  return (
                    <li key={slug}>
                      <button
                        onClick={() => toggle(slug)}
                        className={`relative block w-full text-left border-2 transition-colors ${
                          order >= 0 ? 'border-olive' : 'border-transparent hover:border-olive/30'
                        }`}
                      >
                        <img src={p.image} alt="" loading="lazy" className="w-full aspect-[16/10] object-cover" />
                        <span className="block px-3 py-2 text-[10px] tracking-[0.2em] uppercase text-olive truncate">{p.title}</span>
                        {order >= 0 && (
                          <span className="absolute top-2 left-2 w-7 h-7 rounded-full bg-olive text-sand-light flex items-center justify-center text-xs">
                            {order + 1}
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={async () => {
                  await save(api, selected)
                  setOpen(false)
                }}
                disabled={!selected.length}
                className="inline-flex items-center gap-2 bg-olive px-6 py-3 text-[11px] tracking-[0.25em] uppercase text-sand-light hover:bg-olive-dark disabled:opacity-40"
              >
                <Check className="w-4 h-4" strokeWidth={1.5} /> Salvar destaques ({selected.length})
              </button>
              <button onClick={() => setOpen(false)} className="text-[11px] tracking-[0.25em] uppercase text-primary-500 hover:text-olive">
                Cancelar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

/** Na página de uma obra (modo edição): colocar ou tirar dos destaques da página inicial */
export function FeaturedToggle({ project }: { project: Project }) {
  const { editing, api } = useEdit()
  const current = useFeatured().map(projectSlug)
  if (!editing || !api) return null
  const slug = projectSlug(project)
  const on = current.includes(slug)
  return (
    <button
      onClick={() => {
        if (!on && project.published === false) return window.alert('Publique a obra antes de colocá-la em destaque.')
        if (on && current.length === 1) return window.alert('O carrossel precisa de pelo menos uma obra em destaque.')
        save(api, on ? current.filter((s) => s !== slug) : [...current, slug])
      }}
      className={`inline-flex items-center gap-2 px-4 py-2.5 text-[10px] tracking-[0.25em] uppercase transition-colors ${
        on ? 'bg-olive text-sand-light hover:bg-olive-dark' : 'border border-olive/30 text-olive hover:border-olive'
      }`}
    >
      <Star className={`w-4 h-4 ${on ? 'fill-current' : ''}`} strokeWidth={1.5} />
      {on ? 'Em destaque na página inicial' : 'Destacar na página inicial'}
    </button>
  )
}
