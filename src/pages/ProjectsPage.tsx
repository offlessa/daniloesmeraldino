import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FadeIn from '../components/FadeIn'
import Footer from '../components/Footer'
import {
  projects,
  FILTERS,
  STATUS_LABEL,
  isProjectFilter,
  matches,
  projectUrl,
  slugify,
  type Project,
  type ProjectFilter,
} from '../data/projects'
import { DEFAULT_LOCATION } from '../data/locations'

const ALL_PLACES = 'todas'

const cityOf = (p: Project) => (p.location ?? DEFAULT_LOCATION).split(',')[0].trim()

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
  const f = params.get('filtro')
  const local = params.get('local')
  return {
    filter: isProjectFilter(f) ? f : ('todos' as ProjectFilter),
    place: places.some((p) => p.id === local) ? local! : ALL_PLACES,
  }
}

const urlFor = (filter: ProjectFilter, place: string) => {
  const params = new URLSearchParams()
  if (filter !== 'todos') params.set('filtro', filter)
  if (place !== ALL_PLACES) params.set('local', place)
  const qs = params.toString()
  return qs ? `/projetos?${qs}` : '/projetos'
}

const chipClass = (active: boolean) =>
  `px-5 py-3 border text-[11px] tracking-[0.25em] uppercase transition-colors ${
    active
      ? 'border-olive text-olive'
      : 'border-transparent bg-sand-light text-primary-600 hover:text-olive'
  }`

function ProjectCard({ project }: { project: Project }) {
  return (
    <a href={projectUrl(project)} className="group block">
      <div className="relative overflow-hidden aspect-[16/9] bg-sand-light">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
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
              project.status === 'andamento' ? 'bg-olive text-sand-light' : 'bg-sand text-olive'
            }`}
          >
            {STATUS_LABEL[project.status]}
          </span>
          <span>{project.category}</span>
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
  const [{ filter, place }, setFilters] = useState(filtersFromUrl)

  // Mantém os filtros no endereço (dá para compartilhar o link) e acompanha o botão "voltar"
  useEffect(() => {
    const onPop = () => setFilters(filtersFromUrl())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const select = (next: { filter?: ProjectFilter; place?: string }) => {
    const value = { filter: next.filter ?? filter, place: next.place ?? place }
    setFilters(value)
    window.history.pushState(null, '', urlFor(value.filter, value.place))
  }

  const visible = projects.filter(
    (p) => matches(p, filter) && (place === ALL_PLACES || slugify(cityOf(p)) === place)
  )

  return (
    <main className="relative w-full overflow-hidden bg-white">
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

        <FadeIn className="mt-16 lg:mt-20">
          <div
            role="group"
            aria-label="Filtrar projetos"
            className="flex flex-wrap justify-center gap-3 sm:gap-4"
          >
            {FILTERS.map((f) => (
              <button
                key={f.id}
                aria-pressed={filter === f.id}
                onClick={() => select({ filter: f.id })}
                className={chipClass(filter === f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div
            role="group"
            aria-label="Filtrar por localização"
            className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            <span className="w-full sm:w-auto text-center text-[10px] tracking-[0.35em] uppercase text-olive-light sm:mr-2">
              Localização
            </span>
            {[{ id: ALL_PLACES, label: 'Todas' }, ...places].map((p) => (
              <button
                key={p.id}
                aria-pressed={place === p.id}
                onClick={() => select({ place: p.id })}
                className={chipClass(place === p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </FadeIn>
      </section>

      <AnimatePresence mode="wait">
        <motion.section
          key={`${filter}-${place}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="pb-24"
        >
          {visible.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((p) => (
                <ProjectCard key={p.title} project={p} />
              ))}
            </div>
          ) : (
            <div className="px-6 py-20 text-center">
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
