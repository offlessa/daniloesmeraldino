import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, ChevronDown, Home, LayoutGrid, MapPin, Sofa, X } from 'lucide-react'
import BrickLoader from '../components/BrickLoader'
import FadeIn from '../components/FadeIn'
import Footer from '../components/Footer'
import {
  projects,
  INTERIORS_ID,
  STATUS_FILTERS,
  STATUS_LABEL,
  TYPE_FILTERS,
  isStatusFilter,
  isTypeFilter,
  matches,
  projectsUrl,
  projectUrl,
  slugify,
  type Project,
  type ProjectQuery,
  type Status,
  type TypeFilter,
} from '../data/projects'
import { galleries } from '../data/galleries'
import { DEFAULT_LOCATION } from '../data/locations'

const ALL_PLACES = 'todas'

const cityOf = (p: Project) => (p.location ?? DEFAULT_LOCATION).split(',')[0].trim()

const interiorsOf = (p: Project) => (galleries[slugify(p.title)] ?? []).filter((f) => f.interior)

const isMatch = (p: Project, q: ProjectQuery) => matches(p, q, interiorsOf(p).length > 0)

// Endereços antigos (?filtro=residencial, ?filtro=concluido…) continuam funcionando
const legacyQuery = (filtro: string | null): ProjectQuery => ({
  tipo: isTypeFilter(filtro) ? filtro : 'todos',
  situacao: isStatusFilter(filtro) ? filtro : 'todos',
})

// Cidades com projetos, da que tem mais para a que tem menos
const places = Object.entries(
  projects.reduce<Record<string, number>>((acc, p) => {
    const city = cityOf(p)
    acc[city] = (acc[city] ?? 0) + 1
    return acc
  }, {})
)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .map(([city]) => ({ id: slugify(city), label: city }))

const filtersFromUrl = () => {
  const params = new URLSearchParams(window.location.search)
  const tipo = params.get('tipo')
  const situacao = params.get('situacao')
  const local = params.get('local')
  const legacy = legacyQuery(params.get('filtro'))
  return {
    query: {
      tipo: isTypeFilter(tipo) ? tipo : legacy.tipo,
      situacao: isStatusFilter(situacao) ? situacao : legacy.situacao,
    },
    place: places.some((p) => p.id === local) ? local! : ALL_PLACES,
  }
}

const urlFor = (query: ProjectQuery, place: string) => {
  const url = projectsUrl(query)
  if (place === ALL_PLACES) return url
  return `${url}${url.includes('?') ? '&' : '?'}local=${place}`
}

const TYPE_ICON: Record<TypeFilter, typeof Home> = {
  todos: LayoutGrid,
  residencial: Home,
  comercial: Building2,
  interiores: Sofa,
}

// Mesmas cores das etiquetas de situação nos cards
const statusDot = (s: Status) =>
  s === 'andamento' ? 'bg-olive' : s === 'projeto' ? 'border border-olive' : 'bg-sand'

const DISABLED = 'disabled:opacity-30 disabled:pointer-events-none'

function ProjectCard({ project, interiors }: { project: Project; interiors: boolean }) {
  // Em "Interiores", o card mostra um ambiente interno e leva direto para essa parte da página
  const interior = interiors ? interiorsOf(project)[0] : undefined
  return (
    <a
      href={interior ? `${projectUrl(project)}#${INTERIORS_ID}` : projectUrl(project)}
      className="group block"
    >
      <div className="relative overflow-hidden aspect-[16/9] bg-sand-light">
        <img
          src={interior?.src ?? project.image}
          alt={interior ? `${project.title} — interiores` : project.title}
          loading="lazy"
          style={!interior && project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
          className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="px-6 sm:px-8 pt-8 pb-14">
        <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-[0.08em] text-olive">
          {project.title}
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] tracking-[0.25em] uppercase text-primary-500">
          <span
            className={`px-2.5 py-1 ${
              project.status === 'andamento'
                ? 'bg-olive text-sand-light'
                : project.status === 'projeto'
                  ? 'border border-olive/40 text-olive'
                  : 'bg-sand text-olive'
            }`}
          >
            {STATUS_LABEL[project.status]}
          </span>
          <span>{interior ? 'Interiores' : project.category}</span>
          <span className="hidden sm:inline text-olive/30">|</span>
          <span>{cityOf(project)}</span>
          {project.year && (
            <>
              <span className="hidden sm:inline text-olive/30">|</span>
              <span>{project.year}</span>
            </>
          )}
        </div>
      </div>
    </a>
  )
}

export default function ProjectsPage() {
  const [{ query, place }, setFilters] = useState(filtersFromUrl)

  // Mantém os filtros no endereço (dá para compartilhar o link) e acompanha o botão "voltar"
  useEffect(() => {
    const onPop = () => setFilters(filtersFromUrl())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const select = (next: { query?: Partial<ProjectQuery>; place?: string }) => {
    const value = { query: { ...query, ...next.query }, place: next.place ?? place }
    setFilters(value)
    window.history.pushState(null, '', urlFor(value.query, value.place))
  }

  const inPlace = (p: Project, at = place) => at === ALL_PLACES || slugify(cityOf(p)) === at
  const count = (q: ProjectQuery, at = place) => projects.filter((p) => isMatch(p, q) && inPlace(p, at)).length
  const visible = projects.filter((p) => isMatch(p, query) && inPlace(p))

  return (
    <main className="relative w-full overflow-x-clip bg-white">
      <section className="px-6 sm:px-10 lg:px-20 pt-44 lg:pt-52 pb-16 lg:pb-20">
        <FadeIn className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] tracking-[0.35em] uppercase text-olive">Portfólio</p>
          <h1 className="mt-6 font-serif text-5xl sm:text-6xl lg:text-7xl text-olive">
            Todos os <em className="text-olive-light">projetos</em>
          </h1>
          <p className="mt-10 text-lg leading-relaxed text-primary-700">
            Residências, espaços comerciais e interiores desenvolvidos pelo estúdio em Tubarão e
            região — das obras entregues aos projetos que estão saindo do papel. Escolha os filtros e
            descubra cada um.
          </p>
        </FadeIn>

      </section>

      {/* Barra de filtros: fica presa no topo enquanto rola a lista */}
      <div className="sm:sticky top-20 z-30 bg-white/90 backdrop-blur-md border-y border-olive/10">
        <div className="px-6 sm:px-8 py-4 flex flex-wrap items-center gap-x-8 gap-y-4">
          {/* Tipo */}
          <div role="group" aria-label="Tipo de projeto" className="w-full sm:w-auto grid grid-cols-4 gap-1 sm:flex">
            {TYPE_FILTERS.map((f) => {
              const Icon = TYPE_ICON[f.id]
              const active = query.tipo === f.id
              return (
                <button
                  key={f.id}
                  aria-pressed={active}
                  onClick={() => select({ query: { tipo: f.id } })}
                  disabled={!active && count({ ...query, tipo: f.id }) === 0}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 px-1 sm:px-3.5 py-2.5 text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-colors ${DISABLED} ${
                    active ? 'bg-olive text-sand-light' : 'text-primary-600 hover:bg-sand-light hover:text-olive'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                  {f.label}
                </button>
              )
            })}
          </div>

          {/* Situação: clicar de novo desmarca */}
          <div role="group" aria-label="Situação" className="w-full sm:w-auto flex gap-2 overflow-x-auto -mx-6 px-6 sm:m-0 sm:p-0">
            {STATUS_FILTERS.filter((f) => f.id !== 'todos').map((f) => {
              const id = f.id as Status
              const active = query.situacao === id
              return (
                <button
                  key={id}
                  aria-pressed={active}
                  onClick={() => select({ query: { situacao: active ? 'todos' : id } })}
                  disabled={!active && count({ ...query, situacao: id }) === 0}
                  className={`shrink-0 whitespace-nowrap flex items-center gap-2 rounded-full border px-3.5 py-2 text-[10px] tracking-[0.2em] uppercase transition-colors ${DISABLED} ${
                    active ? 'border-olive text-olive bg-sand-light' : 'border-olive/15 text-primary-600 hover:border-olive/50'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${statusDot(id)}`} />
                  {f.label}
                </button>
              )
            })}
          </div>

          {/* Local + resultado */}
          <div className="flex items-center gap-6 sm:ml-auto">
            <label className="relative flex items-center gap-2 text-olive">
              <MapPin className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              <span className="sr-only">Local</span>
              <select
                value={place}
                onChange={(e) => select({ place: e.target.value })}
                className="appearance-none bg-transparent pr-6 py-2 text-[10px] tracking-[0.2em] uppercase text-olive cursor-pointer focus:outline-none"
              >
                <option value={ALL_PLACES}>Todas as cidades</option>
                {places.map((p) => (
                  <option key={p.id} value={p.id} disabled={count(query, p.id) === 0}>
                    {p.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-0 w-3.5 h-3.5 pointer-events-none" strokeWidth={1.5} />
            </label>

            <span className="text-[10px] tracking-[0.2em] uppercase text-primary-500 whitespace-nowrap">
              {visible.length} {visible.length === 1 ? 'projeto' : 'projetos'}
            </span>
            {(query.tipo !== 'todos' || query.situacao !== 'todos' || place !== ALL_PLACES) && (
              <button
                onClick={() => select({ query: { tipo: 'todos', situacao: 'todos' }, place: ALL_PLACES })}
                aria-label="Limpar filtros"
                title="Limpar filtros"
                className="w-8 h-8 -ml-3 flex items-center justify-center text-primary-500 hover:text-olive transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={`${query.tipo}-${query.situacao}-${place}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="pb-24"
        >
          {visible.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((p) => (
                <ProjectCard key={p.title} project={p} interiors={query.tipo === 'interiores'} />
              ))}
            </div>
          ) : (
            <div className="px-6 py-20 text-center">
              <BrickLoader className="mx-auto mb-10" />
              <p className="font-serif text-2xl sm:text-3xl text-olive">Novos projetos em breve.</p>
              <p className="mt-4 text-primary-600">
                Quer começar o seu?{' '}
                <a href="#contact" className="link-underline">
                  Fale com o estúdio
                </a>
                .
              </p>
            </div>
          )}
        </motion.section>
      </AnimatePresence>

      <Footer />
    </main>
  )
}
