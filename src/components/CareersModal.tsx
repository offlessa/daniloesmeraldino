import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Loader2, Paperclip, X } from 'lucide-react'
import { whatsappUrl } from '../constants/social'
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../lib/supabaseConfig'

const AREAS = ['Arquitetura', 'Interiores', 'Engenharia', 'Comercial', 'Marketing', 'Estágio']

// Currículo: PDF, Word ou foto, até 5 MB (o mesmo limite do armazenamento)
const ACCEPT = '.pdf,.doc,.docx,.jpg,.jpeg,.png'
const MAX_BYTES = 5 * 1024 * 1024

const FIELD =
  'w-full border-b border-olive/25 bg-transparent py-3 text-base text-primary-800 placeholder:text-primary-400 focus:outline-none focus:border-olive transition-colors'
const LABEL = 'block text-[10px] tracking-[0.3em] uppercase text-olive-light'
const CHIP = 'px-4 py-2.5 border text-[10px] tracking-[0.25em] uppercase transition-colors'
const chip = (active: boolean) =>
  `${CHIP} ${active ? 'bg-olive border-olive text-sand-light' : 'border-olive/25 text-olive hover:border-olive'}`

/**
 * Guarda o currículo na pasta pública "curriculos" (nome aleatório, só quem tem o link acha)
 * e devolve o endereço para ir na mensagem. Consulta direta, sem a biblioteca do Supabase.
 */
async function uploadResume(file: File) {
  const safe = file.name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9.]+/g, '-')
    .slice(-60)
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${safe}`
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/curriculos/${path}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': file.type || 'application/octet-stream',
    },
    body: file,
  })
  if (!res.ok) throw new Error(`envio recusado (${res.status})`)
  return `${SUPABASE_URL}/storage/v1/object/public/curriculos/${path}`
}

const buildMessage = (name: string, area: string, intro: string, resume?: string) =>
  [
    `Olá! Meu nome é ${name.trim()}, moro em Tubarão/SC e vim através do site, na área Trabalhe Conosco.`,
    `Tenho interesse em fazer parte da equipe na área de ${area.toLowerCase()}.`,
    intro.trim(),
    resume ? `Meu currículo: ${resume}` : 'Posso enviar meu currículo por aqui.',
  ]
    .filter(Boolean)
    .join('\n\n')

/** Trabalhe conosco: só para quem mora em Tubarão. Anexa o currículo e monta a mensagem para o WhatsApp. */
export default function CareersModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('')
  const [area, setArea] = useState('')
  const [local, setLocal] = useState<'sim' | 'nao' | null>(null)
  const [intro, setIntro] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')
  const [warning, setWarning] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  const filled = name.trim() && area && local === 'sim'

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

  const pick = (list: FileList | null) => {
    const f = list?.[0]
    if (!f) return
    if (f.size > MAX_BYTES) {
      setFileError('Arquivo muito grande: o limite é 5 MB.')
      return
    }
    setFileError('')
    setFile(f)
  }

  const generate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!filled || sending) return
    setSending(true)
    setWarning('')
    let link: string | undefined
    if (file) {
      try {
        link = await uploadResume(file)
      } catch {
        setWarning('Não conseguimos anexar o currículo agora. Envie o arquivo direto na conversa do WhatsApp.')
      }
    }
    setMessage(buildMessage(name, area, intro, link))
    setSending(false)
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
            aria-labelledby="careers-title"
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

            <p className="text-[10px] tracking-[0.35em] uppercase text-olive-light">Trabalhe conosco</p>
            <h2 id="careers-title" className="mt-3 font-serif text-3xl sm:text-4xl text-olive">
              Venha fazer parte da <em className="text-olive-light">equipe</em>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-primary-600">
              As vagas são presenciais no nosso escritório em Tubarão, SC.
            </p>

            <form onSubmit={generate} className="mt-10 space-y-8">
              <fieldset>
                <legend className={LABEL}>Você mora em Tubarão, SC?</legend>
                <div className="mt-4 flex gap-2">
                  <button type="button" aria-pressed={local === 'sim'} onClick={() => setLocal('sim')} className={chip(local === 'sim')}>
                    Sim
                  </button>
                  <button type="button" aria-pressed={local === 'nao'} onClick={() => setLocal('nao')} className={chip(local === 'nao')}>
                    Não
                  </button>
                </div>
                {local === 'nao' && (
                  <p className="mt-4 bg-sand-light px-4 py-3 text-sm leading-relaxed text-primary-700">
                    No momento, as vagas são só para quem mora em Tubarão, SC. Obrigado pelo interesse!
                  </p>
                )}
              </fieldset>

              {local === 'sim' && (
                <>
                  <label className="block">
                    <span className={LABEL}>Seu nome</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nome completo"
                      autoComplete="name"
                      className={FIELD}
                    />
                  </label>

                  <fieldset>
                    <legend className={LABEL}>Área de interesse</legend>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {AREAS.map((a) => (
                        <button key={a} type="button" aria-pressed={area === a} onClick={() => setArea(a)} className={chip(area === a)}>
                          {a}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <label className="block">
                    <span className={LABEL}>Fale um pouco sobre você (opcional)</span>
                    <textarea
                      value={intro}
                      onChange={(e) => setIntro(e.target.value)}
                      rows={3}
                      placeholder="Formação, experiência, o que você gosta de fazer…"
                      className="mt-3 w-full resize-none border border-olive/25 p-4 text-base leading-relaxed text-primary-800 placeholder:text-primary-400 focus:outline-none focus:border-olive transition-colors"
                    />
                  </label>

                  <div>
                    <span className={LABEL}>Currículo (PDF, Word ou foto · até 5 MB)</span>
                    <button
                      type="button"
                      onClick={() => fileInput.current?.click()}
                      className="mt-3 flex w-full items-center gap-3 border border-dashed border-olive/40 px-4 py-4 text-left text-sm text-olive hover:border-olive transition-colors"
                    >
                      {file ? <FileText className="w-5 h-5 shrink-0" strokeWidth={1.5} /> : <Paperclip className="w-5 h-5 shrink-0" strokeWidth={1.5} />}
                      <span className="truncate">{file ? file.name : 'Anexar currículo'}</span>
                      {file && <span className="ml-auto shrink-0 text-[10px] tracking-[0.2em] uppercase text-olive-light">Trocar</span>}
                    </button>
                    <input ref={fileInput} type="file" accept={ACCEPT} hidden onChange={(e) => pick(e.target.files)} />
                    {fileError && <p className="mt-2 text-sm text-red-700">{fileError}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={!filled || sending}
                    className="w-full flex items-center justify-center gap-3 border border-olive py-4 text-[11px] tracking-[0.3em] uppercase text-olive hover:bg-olive hover:text-sand-light transition-colors disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Anexando currículo…
                      </>
                    ) : message ? (
                      'Gerar mensagem novamente'
                    ) : (
                      'Gerar mensagem'
                    )}
                  </button>
                </>
              )}
            </form>

            {message && local === 'sim' && (
              <motion.div className="mt-10" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                {warning && <p className="mb-4 text-sm text-red-700">{warning}</p>}
                <label className="block">
                  <span className={LABEL}>Sua mensagem: fique à vontade para editar</span>
                  <textarea
                    ref={messageRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={7}
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
