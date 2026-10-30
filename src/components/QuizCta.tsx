import FadeIn from './FadeIn'
import QuizArt from './QuizArt'
import { QUIZ_PATH } from '../route'

const PREVIEW = ['facade-tropical', 'facade-montanha', 'facade-classica']

/** Chamada para o teste "Descubra sua casa", para quem ainda não sabe por onde começar. */
export default function QuizCta() {
  return (
    <section className="relative bg-olive text-sand px-6 sm:px-10 lg:px-20 py-24 lg:py-32">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-8 items-center">
        <FadeIn className="lg:col-span-5">
          <p className="text-[11px] tracking-[0.35em] uppercase text-sand/70">Ainda não sabe por onde começar?</p>
          <h2 className="mt-6 font-serif text-4xl sm:text-5xl leading-[1.1] text-sand-light">
            Descubra qual casa <em className="text-sand">combina com você</em>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-sand/85">
            Um teste rápido revela o seu estilo de casa — e, se você ainda não tem terreno, qual lote procurar.
          </p>
          <a
            href={QUIZ_PATH}
            className="group mt-10 inline-flex items-center gap-5 bg-sand-light px-10 py-4 text-[11px] tracking-[0.3em] uppercase text-olive hover:bg-white transition-colors"
          >
            Fazer o teste
            <span className="block w-8 h-px bg-current group-hover:w-12 transition-all duration-500" />
          </a>
        </FadeIn>

        <FadeIn className="lg:col-span-6 lg:col-start-7" delay={0.15}>
          <a href={QUIZ_PATH} className="grid grid-cols-3 gap-3 sm:gap-4" aria-hidden tabIndex={-1}>
            {PREVIEW.map((id, i) => (
              <span
                key={id}
                className={`bg-sand-light text-olive p-4 sm:p-6 aspect-[3/4] flex items-center transition-transform duration-500 hover:-translate-y-1 ${
                  i === 1 ? 'lg:-translate-y-6' : ''
                }`}
              >
                <QuizArt art={{ kind: 'drawing', id }} />
              </span>
            ))}
          </a>
        </FadeIn>
      </div>
    </section>
  )
}
