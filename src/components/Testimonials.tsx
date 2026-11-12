import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EyeOff } from 'lucide-react'
import SectionHeader from './SectionHeader'
import ParallaxRect from './ParallaxRect'
import TestimonialForm from './TestimonialForm'
import GoogleReviews from './GoogleReviews'
import { useSiteData } from '../data/store'
import { Txt } from '../admin/SiteContent'
import { EditableText, useEdit } from '../admin/edit'
import TestimonialModeration from '../admin/TestimonialModeration'

const INTERVAL = 8000

export default function Testimonials() {
  const { testimonials } = useSiteData()
  const [index, setCurrent] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const closeForm = useCallback(() => setFormOpen(false), [])
  const { editing, api } = useEdit()

  const total = testimonials.length
  // A lista muda quando o administrador aprova ou remove um depoimento
  const current = total ? index % total : 0
  const t = testimonials[current]

  // Troca sozinho, menos no modo edição (o depoimento sumiria no meio da edição)
  useEffect(() => {
    if (editing || total < 2) return
    const timer = setTimeout(() => setCurrent((c) => (c + 1) % total), INTERVAL)
    return () => clearTimeout(timer)
  }, [current, editing, total])

  const go = (dir: number) => setCurrent((c) => (c + dir + total) % total)

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
          <SectionHeader
            label={<Txt k="testimonials.label" d="Depoimentos" />}
            title={<Txt k="testimonials.title" d={'Quem vive\n*os projetos*'} em="text-olive-light" />}
          />

          {total > 1 && (
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
                <span className="text-olive-light/60"> / {String(total).padStart(2, '0')}</span>
              </span>
            </div>
          )}

          {/* Chamada para o cliente deixar o seu (entra como pendente) */}
          <button
            onClick={() => setFormOpen(true)}
            className="group mt-10 inline-flex items-center gap-4 text-[11px] tracking-[0.3em] uppercase text-olive"
          >
            <Txt k="testimonials.cta" d="Deixe seu depoimento" />
            <span className="block w-8 h-px bg-olive group-hover:w-14 transition-all duration-500" />
          </button>
          <GoogleReviews />

          <div>
            <TestimonialModeration />
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6 relative min-h-[22rem] sm:min-h-[20rem] pt-16">
          <span className="absolute -top-4 -left-2 font-serif text-[9rem] leading-none text-sand select-none" aria-hidden>
            “
          </span>

          {t ? (
            <AnimatePresence mode="wait">
              <motion.figure
                key={t.id ?? current}
                className="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <blockquote className="font-serif italic text-2xl sm:text-3xl leading-[1.55] text-primary-700">
                  {editing && api ? (
                    <EditableText value={t.text} onSave={(text) => api.updateTestimonial(t, { text })} multiline />
                  ) : (
                    t.text
                  )}
                </blockquote>
                <figcaption className="mt-10 flex flex-wrap items-center gap-4 text-[11px] tracking-[0.3em] uppercase text-olive">
                  <span className="w-10 h-px bg-olive/50" />
                  {editing && api ? (
                    <>
                      <EditableText value={t.name} onSave={(name) => api.updateTestimonial(t, { name })} />
                      <span className="text-olive-light">
                        ·{' '}
                        <EditableText
                          value={t.company}
                          onSave={(company) => api.updateTestimonial(t, { company })}
                          placeholder="Obra ou cidade (opcional)"
                        />
                      </span>
                    </>
                  ) : (
                    <>
                      {t.name}
                      {t.company && <span className="text-olive-light">· {t.company}</span>}
                    </>
                  )}
                </figcaption>
                {editing && api && t.id && (
                  <button
                    onClick={() =>
                      window.confirm('Tirar este depoimento do site? Ele fica em "Recusados e removidos" e pode voltar depois.') &&
                      api.setTestimonialStatus(t.id!, 'rejected')
                    }
                    className="mt-8 inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-red-700 hover:underline"
                  >
                    <EyeOff className="w-4 h-4" strokeWidth={1.5} /> Tirar do site
                  </button>
                )}
              </motion.figure>
            </AnimatePresence>
          ) : (
            <p className="font-serif italic text-2xl text-primary-500">Seja o primeiro a contar como foi o seu projeto.</p>
          )}
        </div>
      </div>

      <TestimonialForm open={formOpen} onClose={closeForm} />
    </section>
  )
}
