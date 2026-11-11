import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2, X } from 'lucide-react'
import { sendTestimonial } from '../data/store'

const FIELD =
  'w-full border-b border-olive/25 bg-transparent py-3 text-base text-primary-800 placeholder:text-primary-400 focus:outline-none focus:border-olive transition-colors'
const LABEL = 'block text-[10px] tracking-[0.3em] uppercase text-olive-light'
const MAX_TEXT = 1200

/** Formulário para o cliente deixar um depoimento (fica pendente até o administrador aprovar). */
export default function TestimonialForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [text, setText] = useState('')
  // Campo escondido: pessoas não veem; robôs que preenchem tudo são ignorados
  const [trap, setTrap] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const valid = name.trim().length >= 2 && text.trim().length >= 5

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid || state === 'sending') return
    setState('sending')
    try {
      if (!trap) await sendTestimonial({ name: name.trim(), company: company.trim(), text: text.trim() })
      setState('sent')
      setName('')
      setCompany('')
      setText('')
    } catch {
      setState('error')
    }
  }

  const close = () => {
    onClose()
    if (state !== 'sending') setState('idle')
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 bg-olive-dark/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="testimonial-title"
            className="relative w-full max-w-xl max-h-full overflow-y-auto bg-white px-6 py-10 sm:px-12 sm:py-12"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              aria-label="Fechar"
              className="absolute top-4 right-4 w-10 h-10 border border-sand text-olive flex items-center justify-center hover:border-olive transition-colors"
            >
              <X className="w-4 h-4" strokeWidth={1.25} />
            </button>

            {state === 'sent' ? (
              <div className="py-6 text-center">
                <span className="mx-auto w-14 h-14 rounded-full bg-olive text-sand-light flex items-center justify-center">
                  <Check className="w-6 h-6" strokeWidth={1.5} />
                </span>
                <h2 id="testimonial-title" className="mt-8 font-serif text-3xl text-olive">
                  Obrigado pelo carinho!
                </h2>
                <p className="mt-4 text-primary-600 leading-relaxed">
                  Recebemos o seu depoimento. Ele aparece aqui no site assim que for aprovado pela equipe do estúdio.
                </p>
                <button
                  onClick={close}
                  className="mt-10 border border-olive px-8 py-4 text-[11px] tracking-[0.3em] uppercase text-olive hover:bg-olive hover:text-sand-light transition-colors"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <>
                <p className="text-[10px] tracking-[0.35em] uppercase text-olive-light">Depoimento</p>
                <h2 id="testimonial-title" className="mt-3 font-serif text-3xl sm:text-4xl text-olive">
                  Conte como foi o seu <em className="text-olive-light">projeto</em>
                </h2>

                <form onSubmit={submit} className="mt-10 space-y-8">
                  <label className="block">
                    <span className={LABEL}>Seu nome</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={80}
                      autoComplete="name"
                      placeholder="Como quer aparecer no site"
                      className={FIELD}
                      autoFocus
                    />
                  </label>
                  <label className="block">
                    <span className={LABEL}>Sua obra ou cidade (opcional)</span>
                    <input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      maxLength={80}
                      placeholder="Ex.: Casa Lago, ou Tubarão"
                      className={FIELD}
                    />
                  </label>
                  <label className="block">
                    <span className={LABEL}>Depoimento</span>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value.slice(0, MAX_TEXT))}
                      rows={5}
                      placeholder="Como foi trabalhar com o estúdio?"
                      className="mt-3 w-full resize-none border border-olive/25 bg-sand-light/50 p-4 text-base leading-relaxed text-primary-800 placeholder:text-primary-400 focus:outline-none focus:border-olive transition-colors"
                    />
                    <span className="mt-1 block text-right text-xs text-primary-400">
                      {text.length}/{MAX_TEXT}
                    </span>
                  </label>
                  <input
                    value={trap}
                    onChange={(e) => setTrap(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    className="hidden"
                    name="website"
                  />

                  {state === 'error' && (
                    <p className="text-sm text-red-700">Não foi possível enviar agora. Tente de novo em instantes.</p>
                  )}

                  <button
                    type="submit"
                    disabled={!valid || state === 'sending'}
                    className="w-full flex items-center justify-center gap-3 bg-olive py-4 text-[11px] tracking-[0.3em] uppercase text-sand-light hover:bg-olive-dark transition-colors disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {state === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar depoimento'}
                  </button>
                  <p className="text-center text-xs text-primary-500">
                    O depoimento aparece no site depois de aprovado pela equipe.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
