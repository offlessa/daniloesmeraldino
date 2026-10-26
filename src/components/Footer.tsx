import FadeIn from './FadeIn'
import { social } from '../constants/social'

const WHATSAPP =
  'https://wa.me/5548988285002?text=Olá! Gostaria de conversar sobre um projeto.'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer id="contact" className="relative bg-olive text-sand pt-32 lg:pt-44 pb-10 px-6 sm:px-10 lg:px-20">
      <FadeIn>
        <div className="flex items-center gap-4 mb-10">
          <span className="h-px w-10 bg-sand/50" />
          <span className="text-[11px] tracking-[0.35em] uppercase text-sand">Contato</span>
        </div>

        <h2 className="font-serif text-5xl sm:text-7xl lg:text-8xl leading-[1.02] text-sand-light max-w-5xl">
          Vamos projetar <em className="text-sand">o seu próximo</em> endereço?
        </h2>

        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-14 inline-flex items-center border border-sand/50 px-8 py-5 text-[11px] tracking-[0.3em] uppercase text-sand-light hover:bg-sand-light hover:text-olive transition-colors duration-500"
        >
          Conversar pelo WhatsApp
        </a>
      </FadeIn>

      <FadeIn className="mt-28 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 border-t border-sand/20 pt-12">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-sand/55 mb-3">Telefone</p>
          <a href="tel:+5548988285002" className="text-sm text-sand-light hover:text-white">
            (48) 98828-5002
          </a>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-sand/55 mb-3">E-mail</p>
          <a
            href="mailto:danilo.esmeraldino@gmail.com.br"
            className="text-sm text-sand-light hover:text-white break-all"
          >
            danilo.esmeraldino@gmail.com.br
          </a>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-sand/55 mb-3">Endereço</p>
          <p className="text-sm leading-relaxed text-sand-light">
            R. Padre Geraldo Spettmann, 326 — sala B
            <br />
            Humaitá, Tubarão — SC, 88704-410
          </p>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-sand/55 mb-3">Redes</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            {social.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="link-underline-light">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </FadeIn>

      <div className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] tracking-[0.25em] uppercase text-sand/45">
        <p>© {currentYear} Estúdio Danilo Esmeraldino</p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="hover:text-sand-light"
        >
          Voltar ao topo ↑
        </button>
      </div>
    </footer>
  )
}
