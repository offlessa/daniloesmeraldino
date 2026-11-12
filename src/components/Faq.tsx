import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Plus } from 'lucide-react'
import SectionHeader from './SectionHeader'
import FadeIn from './FadeIn'
import { EASE_OUT } from '../constants/motion'
import { whatsappUrl } from '../constants/social'
import { FAQ, FAQ_SLOTS } from '../data/faq'
import { useSiteData } from '../data/store'
import { Txt, rich } from '../admin/SiteContent'
import { useEdit } from '../admin/edit'

/** Uma pergunta: o texto atual (do banco ou o original) e se foi ocultada pelo administrador */
function useFaqItem(i: number) {
  const { texts } = useSiteData()
  return {
    q: texts[`faq.q${i}`] ?? FAQ[i]?.q ?? '',
    a: texts[`faq.a${i}`] ?? FAQ[i]?.a ?? '',
    hidden: texts[`faq.hide${i}`] === '1',
  }
}

function FaqItem({ i, open, onToggle }: { i: number; open: boolean; onToggle: () => void }) {
  const { q, a, hidden } = useFaqItem(i)
  const { editing, api } = useEdit()

  // Modo edição: pergunta e resposta abertas e editáveis, com a opção de ocultar
  if (editing && api)
    return (
      <li className={`border-b border-olive/20 py-6 ${hidden ? 'opacity-50' : ''}`}>
        <p className="font-serif text-2xl text-olive">
          <Txt k={`faq.q${i}`} d={FAQ[i]?.q ?? ''} />
        </p>
        <div className="mt-3 text-primary-600 leading-relaxed">
          <Txt k={`faq.a${i}`} d={FAQ[i]?.a ?? ''} multiline />
        </div>
        <button
          onClick={() => api.saveText(`faq.hide${i}`, hidden ? '' : '1')}
          className="mt-3 inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-primary-500 hover:text-olive"
        >
          {hidden ? <Eye className="w-4 h-4" strokeWidth={1.5} /> : <EyeOff className="w-4 h-4" strokeWidth={1.5} />}
          {hidden ? 'Mostrar no site' : 'Ocultar do site'}
        </button>
      </li>
    )

  if (hidden || !q.trim() || !a.trim()) return null
  return (
    <li className="border-b border-olive/20">
      <button onClick={onToggle} aria-expanded={open} className="w-full flex items-center justify-between gap-6 py-6 text-left">
        <span className="font-serif text-xl sm:text-2xl text-olive">{q}</span>
        <Plus
          className={`w-5 h-5 shrink-0 text-olive transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
          strokeWidth={1.25}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-10 text-primary-600 leading-relaxed">{rich(a)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

/** Perguntas frequentes: respondem antes do contato as dúvidas mais comuns. */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  // Espaços sem pergunta só aparecem no modo edição (para escrever uma nova)
  const slots = Array.from({ length: FAQ_SLOTS }, (_, i) => i)

  return (
    <section id="faq" className="relative py-32 lg:py-40 px-6 sm:px-10 lg:px-20 border-t border-sand">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">
        <div className="lg:col-span-4">
          <SectionHeader
            label={<Txt k="faq.label" d="Dúvidas" />}
            title={<Txt k="faq.title" d="Perguntas *frequentes*" em="text-olive-light" />}
          />
          <FadeIn className="mt-10 max-w-xs text-primary-600 leading-relaxed">
            <Txt k="faq.text" d="Não encontrou a sua dúvida? Fale com a gente." />
            <a
              href={whatsappUrl('Olá! Tenho uma dúvida sobre um projeto.')}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 flex items-center gap-4 text-[11px] tracking-[0.3em] uppercase text-olive"
            >
              <Txt k="faq.button" d="Perguntar pelo WhatsApp" />
              <span className="block w-8 h-px bg-olive group-hover:w-14 transition-all duration-500" />
            </a>
          </FadeIn>
        </div>

        <FadeIn className="lg:col-span-7 lg:col-start-6" delay={0.1}>
          <ul className="border-t border-olive/20">
            {slots.map((i) => (
              <FaqItem key={i} i={i} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  )
}
