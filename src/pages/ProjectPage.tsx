import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import FadeIn from '../components/FadeIn'
import Footer from '../components/Footer'
import BrickLoader from '../components/BrickLoader'
import Lightbox from '../components/Lightbox'
import QuoteModal from '../components/QuoteModal'
import { EASE_OUT } from '../constants/motion'
import { galleries } from '../data/galleries'
import { DEFAULT_LOCATION, locate } from '../data/locations'
import { testimonials } from '../data/testimonials'
import {
  projects,
  INTERIORS_ID,
  STATUS_LABEL,
  projectUrl,
  projectsUrl,
  slugify,
  type Project,
} from '../data/projects'

type Photo = { src: string; w: number; h: number }

/**
 * Agrupa a galeria no ritmo da referência: uma foto horizontal em largura total,
 * seguida de um par lado a lado. Fotos verticais sempre entram em pares.
 */
function layoutGallery(photos: Photo[]) {
  const rows: Photo[][] = []
  const rest = [...photos]
  let nextFull = true
  while (rest.length) {
    const p = rest.shift()!
    const landscape = p.w > p.h
    if (!rest.length || (nextFull && landscape)) {
      rows.push([p])
      nextFull = false
      continue
    }
    // Foto em pé faz par com a próxima foto em pé (mesmo que venha mais adiante)
    const j = landscape ? 0 : Math.max(0, rest.findIndex((q) => q.h >= q.w))
    rows.push([p, rest.splice(j, 1)[0]])
    nextFull = true
  }
  return rows
}

function Fact({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="grid grid-cols-2 gap-6 py-3 border-b border-olive/15">
      <dt className="text-[11px] tracking-[0.25em] uppercase text-olive-light">{label}</dt>
      <dd className="text-primary-700">{value}</dd>
    </div>
  )
}

// Pin recortado de fdgs.png: a ponta fica a 55% da largura, na base da imagem
const PIN_TIP_X = 55

/** Desenho do estado com o pin caindo sobre a cidade da obra. */
function StateMap({ location }: { location: string }) {
  const place = locate(location)
  if (!place) return null
  const { city, state, x, y } = place

  return (
    <section className="px-6 sm:px-10 lg:px-20 pb-24 lg:pb-32">
      <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-12 items-center border-t border-olive/15 pt-20 lg:pt-28">
        <FadeIn className="lg:col-span-4">
          <p className="text-[11px] tracking-[0.35em] uppercase text-olive-light">Localização</p>
          <p className="mt-5 font-serif text-4xl sm:text-5xl text-olive">{city}</p>
          <p className="mt-3 text-[11px] tracking-[0.3em] uppercase text-primary-500">{state.name}</p>
        </FadeIn>

        <FadeIn className="lg:col-span-8" delay={0.1}>
          <div className="relative w-full" style={{ aspectRatio: state.ratio }}>
            <img
              src={state.image}
              alt={`Mapa de ${state.name}`}
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
            <div
              className="absolute w-[6%] min-w-[26px]"
              style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-${PIN_TIP_X}%, -100%)` }}
            >
              <motion.img
                src="/images/web/mapas/pin.png"
                alt={`Pin em ${city}`}
                className="block w-full h-auto drop-shadow-lg"
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 14 }}
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-white">
      <BrickLoader className="mb-10" />
      <p className="font-serif text-3xl text-olive">Projeto não encontrado.</p>
      <p className="mt-3 text-primary-600">Esta página ainda está em obra.</p>
      <a href={projectsUrl()} className="mt-6 link-underline text-[11px] tracking-[0.3em] uppercase">
        Ver todos os projetos
      </a>
    </main>
  )
}

/** Fecho da página: convida a pedir um orçamento a partir desta casa. */
function ProjectCta({ project }: { project: Project }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <section className="bg-sand-light px-6 sm:px-10 lg:px-20 py-24 lg:py-32 text-center">
      <FadeIn className="max-w-2xl mx-auto">
        <p className="text-[11px] tracking-[0.35em] uppercase text-olive-light">Seu projeto</p>
        <h2 className="mt-6 font-serif text-4xl sm:text-5xl text-olive">
          Gostou {project.title.startsWith('Casa') ? 'da' : 'do'}{' '}
          <em className="text-olive-light">{project.title}</em>?
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-primary-700">
          Conte para nós onde e como você imagina a sua — a gente desenha o projeto completo, do
          primeiro traço à obra entregue.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="group mt-10 inline-flex items-center gap-5 bg-olive px-10 py-4 text-[11px] tracking-[0.3em] uppercase text-sand-light hover:bg-olive-dark transition-colors"
        >
          Quero um projeto assim
          <span className="block w-8 h-px bg-current group-hover:w-12 transition-all duration-500" />
        </button>
      </FadeIn>
      <QuoteModal
        open={open}
        onClose={close}
        reference={{ title: project.title, type: project.type }}
      />
    </section>
  )
}

/** Depoimento do dono da casa, quando houver um ligado a ela. */
function ClientWords({ slug }: { slug: string }) {
  const t = testimonials.find((t) => t.project === slug)
  if (!t) return null
  return (
    <section className="px-6 sm:px-10 lg:px-20 pb-24 lg:pb-32">
      <FadeIn className="relative max-w-3xl mx-auto pt-16 text-center">
        <span
          className="absolute top-0 left-1/2 -translate-x-1/2 font-serif text-[8rem] leading-none text-sand select-none"
          aria-hidden
        >
          “
        </span>
        <blockquote className="relative font-serif italic text-2xl sm:text-3xl leading-[1.55] text-primary-700">
          {t.text}
        </blockquote>
        <p className="mt-8 text-[11px] tracking-[0.3em] uppercase text-olive">
          {t.name} <span className="text-olive-light">· Cliente</span>
        </p>
      </FadeIn>
    </section>
  )
}

/** Linhas da galeria, sem cortar nenhuma foto. */
function GalleryRows({ rows, alt, onOpen }: { rows: Photo[][]; alt: string; onOpen: (p: Photo) => void }) {
  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {rows.map((row) =>
        row.length === 1 ? (
          <FadeIn key={row[0].src} className={row[0].h > row[0].w ? 'max-w-xl mx-auto' : undefined}>
            <button onClick={() => onOpen(row[0])} aria-label="Ampliar foto" className="block w-full cursor-zoom-in">
              <img
                src={row[0].src}
                alt={alt}
                loading="lazy"
                width={row[0].w}
                height={row[0].h}
                className="w-full h-auto"
              />
            </button>
          </FadeIn>
        ) : (
          // Larguras proporcionais ao formato de cada foto: mesma altura e nenhuma cortada
          <div key={row[0].src} className="space-y-6 sm:space-y-0 sm:flex sm:gap-8 sm:items-start">
            {row.map((photo, i) => (
              <FadeIn key={photo.src} delay={i * 0.1} style={{ flex: `${photo.w / photo.h} 1 0%` }}>
                <button
                  onClick={() => onOpen(photo)}
                  aria-label="Ampliar foto"
                  className="block w-full overflow-hidden bg-sand-light cursor-zoom-in"
                >
                  <img
                    src={photo.src}
                    alt={alt}
                    loading="lazy"
                    width={photo.w}
                    height={photo.h}
                    className="w-full h-auto transition-transform duration-[1.2s] ease-out hover:scale-[1.03]"
                  />
                </button>
              </FadeIn>
            ))}
          </div>
        )
      )}
    </div>
  )
}

export default function ProjectPage({ slug }: { slug: string }) {
  const [photoIndex, setPhotoIndex] = useState<number | null>(null)

  // Veio de "Interiores" (…#interiores): desce direto para essa parte
  useEffect(() => {
    if (window.location.hash !== `#${INTERIORS_ID}`) return
    const t = setTimeout(() => document.getElementById(INTERIORS_ID)?.scrollIntoView({ behavior: 'smooth' }), 400)
    return () => clearTimeout(t)
  }, [slug])

  const index = projects.findIndex((p) => slugify(p.title) === slug)
  if (index < 0) return <NotFound />

  const project = projects[index]
  const next: Project = projects[(index + 1) % projects.length]
  const photos = galleries[slug] ?? []
  const outside = layoutGallery(photos.filter((p) => !p.interior))
  const inside = layoutGallery(photos.filter((p) => p.interior))
  // Ordem em que aparecem na página (a tela cheia segue a mesma)
  const ordered = [...outside.flat(), ...inside.flat()]
  const year = project.year || undefined
  const location = project.location ?? DEFAULT_LOCATION

  return (
    <main className="relative w-full overflow-hidden bg-white">
      {/* Capa */}
      <section className="relative h-[78vh] sm:h-screen">
        <motion.img
          src={project.image}
          alt={project.title}
          style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: EASE_OUT }}
        />
      </section>

      {/* Título + ficha técnica */}
      <section className="px-6 sm:px-10 lg:px-20 pt-16 lg:pt-20 pb-20 lg:pb-28">
        <FadeIn>
          <a
            href={projectsUrl()}
            className="text-[10px] tracking-[0.35em] uppercase text-olive-light hover:text-olive transition-colors"
          >
            ← Todos os projetos
          </a>
          <h1 className="mt-6 font-serif text-4xl sm:text-5xl lg:text-6xl uppercase tracking-[0.06em] text-olive">
            {project.title}
          </h1>
        </FadeIn>

        <div className="mt-14 grid gap-12 lg:gap-16 lg:grid-cols-12">
          <FadeIn className="lg:col-span-6" delay={0.1}>
            <h2 className="text-[11px] tracking-[0.35em] uppercase text-olive">Ficha técnica</h2>
            <dl className="mt-4 border-t border-olive/15">
              <Fact label="Tipo" value={project.category} />
              <Fact label="Situação" value={STATUS_LABEL[project.status]} />
              <Fact label="Localização" value={location} />
              <Fact label="Área construída" value={project.area} />
              <Fact label={project.status === 'concluido' ? 'Conclusão' : 'Ano'} value={year} />
              <Fact label="Projeto" value="Estúdio Danilo Esmeraldino" />
            </dl>
            {inside.length > 0 && outside.length > 0 && (
              <a
                href={`#${INTERIORS_ID}`}
                className="mt-8 inline-block link-underline text-[11px] tracking-[0.3em] uppercase text-olive"
              >
                Ver interiores ↓
              </a>
            )}
          </FadeIn>
        </div>

        {project.description && (
          <FadeIn className="mt-20 lg:mt-28 max-w-3xl mx-auto space-y-6 font-serif text-xl sm:text-2xl leading-[1.7] text-primary-700">
            {project.description.split(/\n\s*\n/).map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </FadeIn>
        )}
      </section>

      {/* Galeria: fotos da obra e, depois, os interiores */}
      {ordered.length > 0 && (
        <section className="px-6 sm:px-10 lg:px-20 pb-24 lg:pb-32">
          {outside.length > 0 && (
            <GalleryRows rows={outside} alt={project.title} onOpen={(p) => setPhotoIndex(ordered.indexOf(p))} />
          )}
          {inside.length > 0 && (
            <div id={INTERIORS_ID} className={`scroll-mt-28 ${outside.length > 0 ? 'pt-24 lg:pt-32' : ''}`}>
              <FadeIn className="max-w-6xl mx-auto mb-12 lg:mb-16 border-t border-olive/15 pt-16 lg:pt-20">
                <p className="text-[11px] tracking-[0.35em] uppercase text-olive-light">{project.title}</p>
                <h2 className="mt-4 font-serif text-4xl sm:text-5xl text-olive">Interiores</h2>
              </FadeIn>
              <GalleryRows
                rows={inside}
                alt={`${project.title} — interiores`}
                onOpen={(p) => setPhotoIndex(ordered.indexOf(p))}
              />
            </div>
          )}
          <Lightbox photos={ordered} index={photoIndex} alt={project.title} onChange={setPhotoIndex} />
        </section>
      )}

      <ClientWords slug={slug} />

      <StateMap location={location} />

      <ProjectCta project={project} />

      {/* Próximo projeto */}
      <a href={projectUrl(next)} className="group relative block h-[70vh] sm:h-[85vh] overflow-hidden">
        <img
          src={next.image}
          alt={next.title}
          loading="lazy"
          style={next.imagePosition ? { objectPosition: next.imagePosition } : undefined}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-transparent" />
        <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 text-center text-white">
          <p className="text-[11px] tracking-[0.35em] uppercase">Próximo projeto</p>
          <span className="block mx-auto mt-4 h-px w-full bg-white/80 scale-x-50 group-hover:scale-x-100 transition-transform duration-700" />
          <p className="mt-4 font-serif text-3xl sm:text-5xl uppercase tracking-[0.06em] whitespace-nowrap">
            {next.title}
          </p>
        </div>
      </a>

      <Footer />
    </main>
  )
}
