import { Star } from 'lucide-react'
import { useSiteText } from '../admin/SiteContent'
import { EditableText, useEdit } from '../admin/edit'

// "Avalie no Google": link de avaliação do perfil do estúdio no Google e a nota atual.
// Os dois são textos do site que o administrador preenche no modo edição; sem link, não aparece.
const URL_KEY = 'google.reviewUrl'
const RATING_KEY = 'google.rating'

export default function GoogleReviews() {
  const url = useSiteText(URL_KEY, '').trim()
  const rating = useSiteText(RATING_KEY, '').trim()
  const { editing, api } = useEdit()

  if (editing && api)
    return (
      <div className="mt-8 border border-dashed border-olive/40 p-4 text-sm text-primary-600 space-y-3">
        <p className="text-[10px] tracking-[0.25em] uppercase text-olive">Avaliações do Google</p>
        <p>
          Link de avaliação:{' '}
          <EditableText
            value={url}
            onSave={(v) => api.saveText(URL_KEY, v)}
            placeholder="cole aqui o link (Perfil da Empresa → Pedir avaliações)"
          />
        </p>
        <p>
          Nota exibida:{' '}
          <EditableText value={rating} onSave={(v) => api.saveText(RATING_KEY, v)} placeholder="ex.: 5,0 · 32 avaliações" />
        </p>
      </div>
    )

  if (!/^https?:\/\//.test(url)) return null
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-5 flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-olive"
    >
      <Star className="w-4 h-4 fill-current" strokeWidth={1.5} />
      Avalie no Google
      {rating && <span className="normal-case tracking-normal text-sm text-primary-500">· {rating}</span>}
      <span className="block w-8 h-px bg-olive group-hover:w-14 transition-all duration-500" />
    </a>
  )
}
