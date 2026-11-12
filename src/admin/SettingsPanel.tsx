import { useEffect, useState } from 'react'
import { Loader2, RefreshCw, Send } from 'lucide-react'
import { readSettings, rebuildSite, saveSettings, testEmail, type SettingKey } from './settings'
import { supabase } from '../lib/supabase'
import { NOTIFY_KEY, setSiteText } from '../data/store'
import { CONTACT } from '../constants/config'

const FIELD =
  'w-full border-b border-olive/25 bg-transparent py-2.5 text-base text-primary-800 placeholder:text-primary-400 focus:outline-none focus:border-olive transition-colors'
const LABEL = 'block text-[10px] tracking-[0.3em] uppercase text-olive-light'
const BTN =
  'inline-flex items-center gap-2 border border-olive/30 px-5 py-3 text-[11px] tracking-[0.25em] uppercase text-olive hover:border-olive transition-colors disabled:opacity-40'

/** Configurações do painel: aviso de depoimento por e-mail e atualização do Google */
export default function SettingsPanel() {
  const [values, setValues] = useState<Partial<Record<SettingKey, string>> | null>(null)
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null)
  const [busy, setBusy] = useState(false)
  const [notify, setNotify] = useState('')

  useEffect(() => {
    readSettings()
      .then(setValues)
      .catch(() => setValues({}))
    supabase
      .from('site_content')
      .select('value')
      .eq('key', NOTIFY_KEY)
      .maybeSingle()
      .then(({ data }) => setNotify(data?.value ?? CONTACT.email))
  }, [])

  if (!values) return <Loader2 className="w-6 h-6 animate-spin text-olive" />

  const set = (key: SettingKey) => (e: React.ChangeEvent<HTMLInputElement>) => setValues({ ...values, [key]: e.target.value })
  const act = async (fn: () => Promise<string>) => {
    setBusy(true)
    setMessage(null)
    try {
      setMessage({ text: await fn() })
    } catch {
      setMessage({ text: 'Não deu certo. Confira se os arquivos supabase/settings.sql e supabase/aviso-email.sql foram rodados no Supabase.', error: true })
    }
    setBusy(false)
  }

  return (
    <section className="space-y-14">
      <div>
        <h1 className="font-serif text-4xl text-olive">Configurações</h1>
        {message && (
          <p className={`mt-4 text-sm ${message.error ? 'text-red-700' : 'text-olive'}`} role="status">
            {message.text}
          </p>
        )}
      </div>

      {/* Aviso de depoimento novo */}
      <div className="bg-white p-6 sm:p-10 space-y-7">
        <div>
          <h2 className="font-serif text-2xl text-olive">Aviso de depoimento por e-mail</h2>
          <p className="mt-2 text-sm text-primary-600 leading-relaxed">
            Quando alguém deixar um depoimento no site, chega um e-mail de <strong>avisos@daniloesmeraldino.com.br</strong>{' '}
            com o nome e o texto. O envio é pelo Resend (domínio do site já verificado): cole abaixo a chave criada em
            resend.com → API Keys.
          </p>
        </div>
        <label className="block">
          <span className={LABEL}>E-mail que recebe os avisos</span>
          <input type="email" value={notify} onChange={(e) => setNotify(e.target.value)} placeholder="contato@escritorio.com.br" className={FIELD} />
        </label>
        <label className="block">
          <span className={LABEL}>Chave do Resend (API Key)</span>
          <input value={values.resend_apikey ?? ''} onChange={set('resend_apikey')} placeholder="re_…" className={FIELD} />
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            disabled={busy}
            onClick={() =>
              act(async () => {
                const value = notify.trim()
                const { error } = value
                  ? await supabase.from('site_content').upsert({ key: NOTIFY_KEY, value, updated_at: new Date().toISOString() })
                  : await supabase.from('site_content').delete().eq('key', NOTIFY_KEY)
                if (error) throw error
                setSiteText(NOTIFY_KEY, value || null)
                await saveSettings({ resend_apikey: values.resend_apikey })
                return 'Salvo! Agora clique em “Enviar teste”.'
              })
            }
            className="inline-flex items-center gap-2 bg-olive px-6 py-3 text-[11px] tracking-[0.25em] uppercase text-sand-light hover:bg-olive-dark disabled:opacity-40"
          >
            Salvar
          </button>
          <button
            disabled={busy || !values.resend_apikey}
            onClick={() =>
              act(async () =>
                (await testEmail())
                  ? 'E-mail de teste enviado! Deve chegar em menos de 1 minuto (olhe também o spam).'
                  : 'Salve a chave do Resend antes de testar.'
              )
            }
            className={BTN}
          >
            <Send className="w-4 h-4" strokeWidth={1.5} /> Enviar teste
          </button>
        </div>
      </div>

      {/* Atualizar Google e WhatsApp */}
      <div className="bg-white p-6 sm:p-10 space-y-7">
        <div>
          <h2 className="font-serif text-2xl text-olive">Atualizar Google e prévias de link</h2>
          <p className="mt-2 text-sm text-primary-600 leading-relaxed">
            O título, a descrição e a foto que aparecem no Google e nas prévias do WhatsApp são gerados quando o site é
            publicado. Depois de criar ou mudar obras, use o botão “Atualizar Google” (aqui ou na barra do modo edição).
            Leva uns 2 minutos. Para funcionar, cole abaixo o link de atualização da Vercel
            (Vercel → projeto → Settings → Git → Deploy Hooks → Create Hook).
          </p>
        </div>
        <label className="block">
          <span className={LABEL}>Link de atualização (Deploy Hook da Vercel)</span>
          <input
            value={values.deploy_hook ?? ''}
            onChange={set('deploy_hook')}
            placeholder="https://api.vercel.com/v1/integrations/deploy/…"
            className={FIELD}
          />
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            disabled={busy}
            onClick={() =>
              act(async () => {
                await saveSettings({ deploy_hook: values.deploy_hook })
                return 'Link salvo.'
              })
            }
            className="inline-flex items-center gap-2 bg-olive px-6 py-3 text-[11px] tracking-[0.25em] uppercase text-sand-light hover:bg-olive-dark disabled:opacity-40"
          >
            Salvar
          </button>
          <button
            disabled={busy || !values.deploy_hook}
            onClick={() =>
              act(async () =>
                (await rebuildSite()) === 'ok'
                  ? 'Atualização iniciada! Em uns 2 minutos o Google e as prévias passam a ver as obras atuais.'
                  : 'Salve primeiro um link de atualização válido da Vercel.'
              )
            }
            className={BTN}
          >
            <RefreshCw className="w-4 h-4" strokeWidth={1.5} /> Atualizar Google agora
          </button>
        </div>
      </div>
    </section>
  )
}
