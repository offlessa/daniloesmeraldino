import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeader from './SectionHeader'
import FadeIn from './FadeIn'
import { EASE_OUT } from '../constants/motion'

type Status = 'concluido' | 'andamento'
type ProjectType = 'residencial' | 'comercial' | 'interiores'

const STATUS_LABEL: Record<Status, string> = {
  concluido: 'Concluído',
  andamento: 'Em andamento',
}

interface Project {
  title: string
  category: string
  type: ProjectType
  year: string
  status: Status
  image: string
  /** Enquadramento da foto no recorte do carrossel (CSS object-position) */
  imagePosition?: string
  link: string
}

const projects: Project[] = [
  {
    title: 'Casa Lago',
    category: 'Residência',
    type: 'residencial',
    year: '2024',
    status: 'concluido',
    image: '/images/web/portfolio-casa-lago.jpg',
    link: 'https://www.youtube.com/watch?v=JxztO6DDQp4',
  },
  {
    title: 'Casa JE',
    category: 'Residência',
    type: 'residencial',
    year: '2023',
    status: 'concluido',
    image: '/images/web/portfolio-casa-je.jpg',
    link: '',
  },
  {
    title: 'Casa Arcos',
    category: 'Projeto Residencial',
    type: 'residencial',
    year: '2025',
    status: 'andamento',
    image: '/images/web/portfolio-casa-arcos.jpg',
    link: 'https://sites.google.com/view/casaarcos/in%C3%ADcio',
  },
  {
    title: 'Casa Esmeralda',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'concluido',
    image: '/images/web/casa-esmeralda-frontal.jpg',
    imagePosition: '50% 42%',
    link: '',
  },
  {
    title: 'Casa Iron',
    category: 'Reforma Residencial',
    type: 'residencial',
    year: '2024',
    status: 'andamento',
    image: '/images/web/portfolio-casa-iron.jpg',
    link: 'https://sites.google.com/d/1uER1att9__cOF6pUQSH5LuHYPZg4vfIY/p/1efpMy9csMp5LZynq8GNbQb0vsNBZwY6X/edit',
  },
  {
    title: 'Bar Fácil',
    category: 'Projeto Comercial',
    type: 'comercial',
    year: '2024',
    status: 'andamento',
    image: '/images/web/portfolio-bar-facil.jpg',
    link: '',
  },
]

export type ProjectFilter = 'todos' | Status | ProjectType

const FILTER_LABEL: Record<ProjectFilter, string> = {
  todos: 'Todos',
  concluido: 'Concluídos',
  andamento: 'Em andamento',
  residencial: 'Residenciais',
  comercial: 'Comerciais',
  interiores: 'Interiores',
}

/** Evento disparado pelo menu para mostrar só um grupo de projetos no carrossel */
export const FILTER_EVENT = 'portfolio:filter'

const matches = (p: Project, filter: ProjectFilter) =>
  filter === 'todos' || p.status === filter || p.type === filter

const INTERVAL = 6000
const SWIPE = 60

export default function Portfolio() {
  const [filter, setFilter] = useState<ProjectFilter>('todos')
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const onFilter = (e: Event) => {
      setFilter((e as CustomEvent<ProjectFilter>).detail)
      setCurrent(0)
    }
    window.addEventListener(FILTER_EVENT, onFilter)
    return () => window.removeEventListener(FILTER_EVENT, onFilter)
  }, [])

  const visible = projects.filter((p) => matches(p, filter))

  const total = visible.length
  const project = total > 0 ? visible[current % total] : null

  const go = (dir: number) => setCurrent((c) => (c + dir + total) % total)

  useEffect(() => {
    if (paused || total < 2) return
    const t = setTimeout(() => setCurrent((c) => (c + 1) % total), INTERVAL)
    return () => clearTimeout(t)
  }, [current, paused, total])

  const clearFilter = () => {
    setFilter('todos')
    setCurrent(0)
  }

  return (
    <section id="portfolio" className="relative py-32 lg:py-40 px-6 sm:px-10 lg:px-20 border-t border-sand">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 lg:mb-20">
        <SectionHeader
          label="Portfólio"
          title={<>Projetos em <em className="text-olive-light">destaque</em></>}
        />
        {filter !== 'todos' && (
          <button
            onClick={clearFilter}
            className="self-start lg:self-end inline-flex items-center gap-3 border border-olive/25 px-4 py-2 text-[10px] tracking-[0.25em] uppercase text-olive hover:border-olive transition-colors"
          >
            {FILTER_LABEL[filter]}
            <span aria-hidden className="text-base leading-none">×</span>
            <span className="sr-only">— mostrar todos os projetos</span>
          </button>
        )}
      </div>

      {project ? (
        <FadeIn>
          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-roledescription="carrossel"
          >
            {/* Foto */}
            <div className="relative lg:ml-[14%]">
              <motion.div
                className="relative overflow-hidden aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[74vh] bg-sand-light cursor-grab active:cursor-grabbing"
                drag={total > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -SWIPE) go(1)
                  else if (info.offset.x > SWIPE) go(-1)
                }}
              >
                <AnimatePresence initial={false}>
                  <motion.img
                    key={project.image}
                    src={project.image}
                    alt={project.title}
                    draggable={false}
                    style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
                    className="absolute inset-0 w-full h-full object-cover select-none"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.1, ease: EASE_OUT }}
                  />
                </AnimatePresence>
                <span className="absolute top-0 left-0 bg-white/95 px-4 py-2.5 text-[10px] tracking-[0.3em] uppercase text-olive">
                  {STATUS_LABEL[project.status]}
                </span>
              </motion.div>

              {/* Recorte branco no canto inferior esquerdo, como um degrau */}
              <span aria-hidden className="hidden lg:block absolute left-0 bottom-0 w-[28%] h-6 bg-white" />
            </div>

            {/* Marcador oliva na borda direita */}
            <span
              aria-hidden
              className="absolute top-1/2 -translate-y-1/2 -right-6 sm:-right-10 lg:-right-20 w-2 h-16 bg-olive"
            />

            {/* Legenda + navegação */}
            <div className="mt-8 lg:mt-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-8">
              <div className="min-h-[6rem] sm:min-h-[9rem] max-w-md">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={project.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE_OUT }}
                  >
                    <h3 className="font-serif text-3xl sm:text-4xl uppercase tracking-[0.08em] text-olive">
                      {project.title}
                    </h3>
                    <p className="mt-3 text-[11px] tracking-[0.25em] uppercase text-primary-500">
                      {project.category}
                      {project.year && ` · ${project.year}`}
                    </p>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group mt-6 inline-flex items-center gap-4 text-[11px] tracking-[0.3em] uppercase text-olive"
                      >
                        Ver projeto
                        <span className="block w-8 h-px bg-olive group-hover:w-14 transition-all duration-500" />
                      </a>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {total > 1 && (
                <div className="flex items-center gap-8 sm:pt-3">
                  <span className="font-serif text-lg text-olive">
                    {String((current % total) + 1).padStart(2, '0')}
                    <span className="text-olive-light/60"> / {String(total).padStart(2, '0')}</span>
                  </span>
                  <div className="flex items-center gap-1" role="tablist" aria-label="Escolher projeto">
                    {visible.map((p, i) => {
                      const active = i === current % total
                      return (
                        <button
                          key={p.title}
                          role="tab"
                          aria-selected={active}
                          aria-label={p.title}
                          onClick={() => setCurrent(i)}
                          className="p-2.5"
                        >
                          <span
                            className={`block rounded-full transition-all duration-500 ${
                              active ? 'w-3 h-3 bg-olive' : 'w-1.5 h-1.5 bg-olive/25 hover:bg-olive/60'
                            }`}
                          />
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      ) : (
        <div className="py-20 text-center">
          <p className="font-serif text-2xl sm:text-3xl text-olive">Novos projetos em breve.</p>
          <p className="mt-4 text-primary-600">
            Quer acompanhar uma obra conosco?{' '}
            <a href="#contact" className="link-underline">
              Fale com o estúdio
            </a>
            .
          </p>
        </div>
      )}
    </section>
  )
}
