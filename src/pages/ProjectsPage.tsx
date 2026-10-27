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
  projectsUrl,
  type Project,
  type ProjectFilter,
} from '../data/projects'

const filterFromUrl = (): ProjectFilter => {
  const f = new URLSearchParams(window.location.search).get('filtro')
  return isProjectFilter(f) ? f : 'todos'
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group">
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
          {project.year && (
            <>
              <span className="hidden sm:inline text-olive/30">|</span>
              <span>{project.year}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  const [filter, setFilter] = useState<ProjectFilter>(filterFromUrl)

  // Mantém o filtro no endereço (dá para compartilhar o link) e acompanha o botão "voltar"
  useEffect(() => {
    const onPop = () => setFilter(filterFromUrl())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const select = (id: ProjectFilter) => {
    setFilter(id)
    window.history.pushState(null, '', projectsUrl(id))
  }

  const visible = projects.filter((p) => matches(p, filter))

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
            {FILTERS.map((f) => {
              const active = filter === f.id
              return (
                <button
                  key={f.id}
                  aria-pressed={active}
                  onClick={() => select(f.id)}
                  className={`px-5 py-3 border text-[11px] tracking-[0.25em] uppercase transition-colors ${
                    active
                      ? 'border-olive text-olive'
                      : 'border-transparent bg-sand-light text-primary-600 hover:text-olive'
                  }`}
                >
                  {f.label}
                </button>
              )
            })}
          </div>
        </FadeIn>
      </section>

      <AnimatePresence mode="wait">
        <motion.section
          key={filter}
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
