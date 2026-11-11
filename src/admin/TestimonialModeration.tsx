import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, Loader2, MessageSquare, RotateCcw, X } from 'lucide-react'
import type { TestimonialRow } from '../lib/supabaseConfig'
import { useEdit } from './edit'

// Aprovação de depoimentos enviados pelo site (só no modo edição)

const dateBR = (iso: string) => new Date(iso).toLocaleDateString('pt-BR')

export default function TestimonialModeration() {
  const { editing, api, pending } = useEdit()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'pending' | 'rejected'>('pending')
  const [rows, setRows] = useState<TestimonialRow[] | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!api) return
    setRows(null)
    setRows(await api.listTestimonials(tab))
  }, [api, tab])

  useEffect(() => {
    if (open) load()
  }, [open, load])

  // Veio do aviso da barra (/#testimonials) com pendentes: já abre a lista
  useEffect(() => {
    if (pending > 0 && window.location.hash === '#testimonials') setOpen(true)
  }, [pending])

  if (!editing || !api) return null

  const decide = async (row: TestimonialRow, status: TestimonialRow['status']) => {
    setBusy(row.id)
    await api.setTestimonialStatus(row.id, status)
    setRows((r) => r?.filter((x) => x.id !== row.id) ?? null)
    setBusy(null)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-8 inline-flex items-center gap-2 bg-olive px-5 py-3 text-[10px] tracking-[0.25em] uppercase text-sand-light hover:bg-olive-dark transition-colors"
      >
        <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
        Aprovar depoimentos {pending > 0 && <span className="ml-1 rounded-full bg-sand-light text-olive px-2">{pending}</span>}
      </button>

      {open &&
        createPortal(
        <div className="fixed inset-0 z-[95] bg-olive-dark/60 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-3xl max-h-full overflow-y-auto bg-white p-6 sm:p-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-serif text-3xl text-olive">Depoimentos enviados</h2>
              <button onClick={() => setOpen(false)} aria-label="Fechar" className="w-10 h-10 flex items-center justify-center text-olive">
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="mt-6 flex gap-6 border-b border-olive/15">
              {(['pending', 'rejected'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`pb-3 -mb-px border-b-2 text-[10px] tracking-[0.25em] uppercase ${
                    tab === t ? 'border-olive text-olive' : 'border-transparent text-primary-500 hover:text-olive'
                  }`}
                >
                  {t === 'pending' ? 'Aguardando aprovação' : 'Recusados e removidos'}
                </button>
              ))}
            </div>

            {!rows ? (
              <Loader2 className="mt-10 w-6 h-6 animate-spin text-olive" />
            ) : rows.length === 0 ? (
              <p className="mt-10 text-primary-500">
                {tab === 'pending' ? 'Nenhum depoimento aguardando aprovação.' : 'Nenhum depoimento recusado.'}
              </p>
            ) : (
              <ul className="mt-6 divide-y divide-olive/10">
                {rows.map((r) => (
                  <li key={r.id} className={`py-6 ${busy === r.id ? 'opacity-50 pointer-events-none' : ''}`}>
                    <p className="font-serif italic text-xl leading-relaxed text-primary-700">“{r.text}”</p>
                    <p className="mt-3 text-[10px] tracking-[0.25em] uppercase text-olive">
                      {r.name}
                      {r.company && <span className="text-olive-light"> · {r.company}</span>}
                      <span className="text-primary-400"> · enviado em {dateBR(r.created_at)}</span>
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => decide(r, 'approved')}
                        className="inline-flex items-center gap-2 bg-olive px-5 py-2.5 text-[10px] tracking-[0.25em] uppercase text-sand-light hover:bg-olive-dark"
                      >
                        <Check className="w-4 h-4" strokeWidth={1.5} /> {tab === 'pending' ? 'Aprovar' : 'Publicar mesmo assim'}
                      </button>
                      {tab === 'pending' ? (
                        <button
                          onClick={() => decide(r, 'rejected')}
                          className="inline-flex items-center gap-2 border border-olive/30 px-5 py-2.5 text-[10px] tracking-[0.25em] uppercase text-olive hover:border-olive"
                        >
                          <X className="w-4 h-4" strokeWidth={1.5} /> Recusar
                        </button>
                      ) : (
                        <button
                          onClick={() => decide(r, 'pending')}
                          className="inline-flex items-center gap-2 border border-olive/30 px-5 py-2.5 text-[10px] tracking-[0.25em] uppercase text-olive hover:border-olive"
                        >
                          <RotateCcw className="w-4 h-4" strokeWidth={1.5} /> Voltar para pendentes
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
