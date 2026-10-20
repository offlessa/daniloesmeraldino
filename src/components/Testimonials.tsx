import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeader from './SectionHeader'
import ParallaxRect from './ParallaxRect'

const testimonials = [
  {
    name: 'Mayara Machado',
    company: '',
    text: 'O Danilo é um ótimo profissional! Pensa nos detalhes de tudo pra que a casa fique linda e funcional. Os projetos tem a identidade dele, a imponência das fachadas e detalhes de luxo e beleza. O projeto da nossa casa ficou lindo demais!',
  },
  {
    name: 'Gisele Margotti',
    company: 'Casa Pietra',
    text: 'Só elogios... atendimento top e de muita qualidade. Parabéns pelo trabalho! Projetos lindos e diferenciados! Um escritório que dá vida à nossos sonhos!',
  },
  {
    name: 'Didiane Almeida',
    company: '',
    text: 'Simplesmente o melhor, arrasa nas suas edificações, sabe transformar as ideias dos seus clientes em realidade',
  },
  {
    name: 'Mirely Fernandes',
    company: '',
    text: 'Super atenciosos e cuidadosos em todos detalhes, ótimos profissionais ❤️',
  },
]

const INTERVAL = 8000

export default function Testimonials() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setCurrent((c) => (c + 1) % testimonials.length), INTERVAL)
    return () => clearTimeout(t)
  }, [current])

  const go = (dir: number) =>
    setCurrent((c) => (c + dir + testimonials.length) % testimonials.length)

  const t = testimonials[current]

  return (
    <section
      id="testimonials"
      className="relative z-10 py-32 lg:py-40 px-6 sm:px-10 lg:px-20 border-t border-sand"
    >
      {/* Bloco que desce e se funde ao rodapé oliva */}
      <ParallaxRect
        className="left-[12%] -bottom-24 w-14 sm:w-20 h-48 sm:h-64"
        speed={50}
        grow="bottom"
      />

      <div className="relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-8">
        <div className="lg:col-span-4">
          <SectionHeader label="Depoimentos" title={<>Quem vive<br /><em className="text-olive-light">os projetos</em></>} />

          <div className="mt-12 flex items-center gap-6">
            <button
              onClick={() => go(-1)}
              aria-label="Depoimento anterior"
              className="w-12 h-12 border border-olive/30 text-olive hover:bg-olive hover:text-sand-light transition-colors"
            >
              ←
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Próximo depoimento"
              className="w-12 h-12 border border-olive/30 text-olive hover:bg-olive hover:text-sand-light transition-colors"
            >
              →
            </button>
            <span className="font-serif text-lg text-olive">
              {String(current + 1).padStart(2, '0')}
              <span className="text-olive-light/60"> / {String(testimonials.length).padStart(2, '0')}</span>
            </span>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6 relative min-h-[22rem] sm:min-h-[20rem] pt-16">
          <span className="absolute -top-4 -left-2 font-serif text-[9rem] leading-none text-sand select-none" aria-hidden>
            “
          </span>

          <AnimatePresence mode="wait">
            <motion.figure
              key={current}
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <blockquote className="font-serif italic text-2xl sm:text-3xl leading-[1.55] text-primary-700">
                {t.text}
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-4 text-[11px] tracking-[0.3em] uppercase text-olive">
                <span className="w-10 h-px bg-olive/50" />
                {t.name}
                {t.company && <span className="text-olive-light">· {t.company}</span>}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
