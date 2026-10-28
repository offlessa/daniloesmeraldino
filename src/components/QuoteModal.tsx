import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { whatsappUrl } from '../constants/social'

const PROJECT_TYPES = [
  { label: 'Residencial', phrase: 'projeto residencial' },
  { label: 'Comercial', phrase: 'projeto comercial' },
  { label: 'Interiores', phrase: 'projeto de interiores' },
  { label: 'Reforma', phrase: 'projeto de reforma' },
]

const buildMessage = (name: string, type: string, location: string, reference?: string) => {
  const phrase = PROJECT_TYPES.find((t) => t.label === type)?.phrase ?? 'projeto'
  const origin = reference
    ? `vi o projeto ${reference} no site e quero fazer meu ${phrase} em ${location.trim()} nesse estilo`
    : `vim através do site para fazer meu ${phrase} em ${location.trim()}`
  return `Olá, meu nome é ${name.trim()}, ${origin}. Gostaria de um orçamento!`
}

const FIELD =
  'w-full border-b border-olive/25 bg-transparent py-3 text-base text-primary-800 placeholder:text-primary-400 focus:outline-none focus:border-olive transition-colors'
const LABEL = 'block text-[10px] tracking-[0.3em] uppercase text-olive-light'

interface QuoteModalProps {
  open: boolean
  onClose: () => void
  /** Projeto que inspirou o pedido (aberto pela página de uma casa) */
  reference?: { title: string; type: string }
}

/** Formulário de orçamento: monta a mensagem e envia pelo WhatsApp do estúdio. */
export default function QuoteModal({ open, onClose, reference }: QuoteModalProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState(
    () => PROJECT_TYPES.find((t) => t.label.toLowerCase() === reference?.type)?.label ?? ''
  )
  const [location, setLocation] = useState('')
  const [message, setMessage] = useState('')
  const messageRef = useRef<HTMLTextAreaElement>(null)

  const filled = name.trim() && type && location.trim()

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

  const generate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!filled) return
    setMessage(buildMessage(name, type, location, reference?.title))
    // Leva o foco para a mensagem, que já pode ser editada
    setTimeout(() => messageRef.current?.focus(), 50)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 bg-olive-dark/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-title"
            className="relative w-full max-w-xl max-h-full overflow-y-auto bg-white px-6 py-10 sm:px-12 sm:py-12"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="absolute top-4 right-4 w-10 h-10 border border-sand text-olive flex items-center justify-center hover:border-olive transition-colors"
            >
              <X className="w-4 h-4" strokeWidth={1.25} />
            </button>

            <p className="text-[10px] tracking-[0.35em] uppercase text-olive-light">Orçamento</p>
            <h2 id="quote-title" className="mt-3 font-serif text-3xl sm:text-4xl text-olive">
              Vamos conversar sobre o seu <em className="text-olive-light">projeto</em>
            </h2>
            {reference && (
              <p className="mt-4 text-sm text-primary-600">
                Projeto de referência: <span className="text-olive">{reference.title}</span>
              </p>
            )}

            <form onSubmit={generate} className="mt-10 space-y-8">
              <label className="block">
                <span className={LABEL}>Seu nome</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como podemos te chamar?"
                  autoComplete="name"
                  className={FIELD}
                  autoFocus
                />
              </label>

              <fieldset>
                <legend className={LABEL}>Tipo de projeto</legend>
                <div className="mt-4 flex flex-wrap gap-2">
                  {PROJECT_TYPES.map((t) => {
                    const active = type === t.label
                    return (
                      <button
                        key={t.label}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setType(t.label)}
                        className={`px-4 py-2.5 border text-[10px] tracking-[0.25em] uppercase transition-colors ${
                          active
                            ? 'bg-olive border-olive text-sand-light'
                            : 'border-olive/25 text-olive hover:border-olive'
                        }`}
                      >
                        {t.label}
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              <label className="block">
                <span className={LABEL}>Localização da obra</span>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Cidade — ex.: Laguna"
                  autoComplete="address-level2"
                  className={FIELD}
                />
              </label>

              <button
                type="submit"
                disabled={!filled}
                className="w-full border border-olive py-4 text-[11px] tracking-[0.3em] uppercase text-olive hover:bg-olive hover:text-sand-light transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                {message ? 'Gerar mensagem novamente' : 'Gerar mensagem'}
              </button>
            </form>

            {message && (
              <motion.div
                className="mt-10"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <label className="block">
                  <span className={LABEL}>Sua mensagem — fique à vontade para editar</span>
                  <textarea
                    ref={messageRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="mt-3 w-full resize-none border border-olive/25 bg-sand-light/50 p-4 text-base leading-relaxed text-primary-800 focus:outline-none focus:border-olive transition-colors"
                  />
                </label>
                <a
                  href={whatsappUrl(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-4 flex items-center justify-center gap-3 bg-olive py-4 text-[11px] tracking-[0.3em] uppercase text-sand-light hover:bg-olive-dark transition-colors ${
                    message.trim() ? '' : 'opacity-40 pointer-events-none'
                  }`}
                >
                  Enviar pelo WhatsApp
                </a>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
