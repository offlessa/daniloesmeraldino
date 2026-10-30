import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, RotateCcw, Share2 } from 'lucide-react'
import Footer from '../components/Footer'
import QuizArt from '../components/QuizArt'
import { EASE_OUT } from '../constants/motion'
import { whatsappUrl } from '../constants/social'
import { projectsUrl } from '../data/projects'
import {
  answersFromQuery,
  answersToQuery,
  landGuideFor,
  needsLandGuide,
  questionsFor,
  resultMessage,
  styleFor,
  type Answers,
  type QuizOption,
  type StyleId,
} from '../data/quiz'

// Tempo para a pessoa ver a opção marcada antes de passar para a próxima pergunta
const ADVANCE_DELAY = 280

const FACADE: Record<StyleId, string> = {
  tropical: 'facade-tropical',
  minimal: 'facade-minimal',
  montanha: 'facade-montanha',
  classica: 'facade-classica',
  urbana: 'facade-urbana',
}

type Stage = 'intro' | 'questions' | 'result'

const PRIMARY =
  'inline-flex items-center justify-center gap-4 bg-olive px-10 py-4 text-[11px] tracking-[0.3em] uppercase text-sand-light hover:bg-olive-dark transition-colors'
const SECONDARY =
  'inline-flex items-center justify-center gap-3 border border-olive/30 px-6 py-4 text-[11px] tracking-[0.3em] uppercase text-olive hover:border-olive transition-colors'

/** Progresso em tijolos: um por pergunta */
function BrickProgress({ total, done }: { total: number; done: number }) {
  return (
    <div className="flex gap-1" aria-label={`Pergunta ${done + 1} de ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-2.5 flex-1 max-w-[2.5rem] border transition-colors duration-300 ${
            i < done ? 'bg-olive border-olive' : i === done ? 'bg-sand border-olive/50' : 'border-olive/20'
          }`}
        />
      ))}
    </div>
  )
}

function OptionCard({ option, selected, onPick }: { option: QuizOption; selected: boolean; onPick: () => void }) {
  const fills = option.art?.kind === 'swatch' || option.art?.kind === 'palette'
  // Ícone sozinho não precisa de um quadro tão alto quanto um desenho
  const box = option.art?.kind === 'icon' ? 'h-24 sm:h-28' : 'aspect-[3/2]'
  return (
    <button
      onClick={onPick}
      aria-pressed={selected}
      className={`group text-left bg-white border transition-all duration-300 ${
        selected ? 'border-olive shadow-lg shadow-olive/10' : 'border-transparent hover:border-olive/30 hover:-translate-y-0.5'
      }`}
    >
      {option.art && (
        <span
          className={`flex ${box} items-center justify-center text-olive overflow-hidden ${
            fills ? '' : 'p-5 bg-sand-light/60'
          }`}
        >
          <QuizArt art={option.art} />
        </span>
      )}
      <span className="flex items-start justify-between gap-3 px-4 py-4">
        <span>
          <span className="block text-[11px] tracking-[0.2em] uppercase text-olive">{option.label}</span>
          {option.hint && <span className="mt-1 block text-sm text-primary-500">{option.hint}</span>}
        </span>
        <span
          className={`mt-0.5 shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
            selected ? 'bg-olive border-olive text-sand-light' : 'border-olive/30'
          }`}
        >
          {selected && <Check className="w-3 h-3" strokeWidth={2} />}
        </span>
      </span>
    </button>
  )
}

function Result({ answers, onRestart }: { answers: Answers; onRestart: () => void }) {
  const style = styleFor(answers)
  const guide = needsLandGuide(answers) ? landGuideFor(answers) : null
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: `Meu estilo: ${style.name}`, url })
      else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      }
    } catch {
      /* compartilhamento cancelado */
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE_OUT }}>
      {/* Estilo */}
      <section className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
        <div className="lg:col-span-6">
          <p className="text-[11px] tracking-[0.35em] uppercase text-olive-light">Seu estilo</p>
          <h1 className="mt-5 font-serif text-5xl sm:text-6xl text-olive leading-[1.05]">{style.name}</h1>
          <p className="mt-4 font-serif italic text-2xl text-olive-light">{style.tagline}</p>
          <p className="mt-8 text-lg leading-relaxed text-primary-700">{style.description}</p>
          <ul className="mt-8 space-y-3">
            {style.elements.map((e) => (
              <li key={e} className="flex items-center gap-3 text-primary-700">
                <span className="w-1.5 h-1.5 bg-olive" />
                {e}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6">
          <div className="bg-white p-8 sm:p-12 text-olive">
            <div className="aspect-[3/2]">
              <QuizArt art={{ kind: 'drawing', id: FACADE[style.id] }} />
            </div>
          </div>
          <div className="grid grid-cols-4">
            {style.palette.map((c) => (
              <div key={c.name}>
                <span className="block h-16 sm:h-20" style={{ background: c.color }} />
                <span className="block pt-3 text-[10px] tracking-[0.2em] uppercase text-primary-500">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Terreno */}
      {guide ? (
        <section className="mt-24 lg:mt-32 border-t border-olive/20 pt-16">
          <p className="text-[11px] tracking-[0.35em] uppercase text-olive-light">O terreno ideal para você</p>
          <div className="mt-6 flex flex-wrap items-end gap-x-10 gap-y-4">
            <p className="font-serif text-5xl sm:text-6xl text-olive leading-none">
              a partir de {guide.lot.area} m²
            </p>
            <p className="text-primary-600 pb-1">
              por exemplo, {guide.lot.size} · para uma casa de cerca de {guide.houseArea} m²
            </p>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[guide.terrain, guide.place, { title: 'Sol', text: guide.sun }].map((b) => (
              <div key={b.title} className="border-t border-olive/20 pt-6">
                <h3 className="font-serif text-2xl text-olive">{b.title}</h3>
                <p className="mt-3 text-primary-600 leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 bg-white p-8 sm:p-10">
            <h3 className="text-[11px] tracking-[0.35em] uppercase text-olive">Antes de comprar, confira</h3>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {guide.checklist.map((item) => (
                <li key={item} className="flex gap-3 text-primary-700">
                  <Check className="w-4 h-4 mt-1 shrink-0 text-olive" strokeWidth={1.75} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-6 text-sm text-primary-500 max-w-3xl">
            É uma estimativa para orientar a busca — o tamanho certo depende do plano diretor de cada cidade.
            Na consultoria, o estúdio faz a leitura técnica do terreno antes da compra.
          </p>
        </section>
      ) : (
        <section className="mt-24 lg:mt-32 border-t border-olive/20 pt-16 max-w-3xl">
          <p className="text-[11px] tracking-[0.35em] uppercase text-olive-light">Seu terreno</p>
          <p className="mt-6 font-serif text-3xl sm:text-4xl text-olive leading-snug">
            O primeiro passo é conhecer o lote de perto.
          </p>
          <p className="mt-6 text-lg text-primary-700 leading-relaxed">
            Na visita técnica o estúdio avalia topografia, insolação, recuos e o que a prefeitura permite
            construir — e já começa a desenhar a casa no seu estilo.
          </p>
        </section>
      )}

      {/* Próximo passo */}
      <section className="mt-20 flex flex-wrap items-center gap-4">
        <a href={whatsappUrl(resultMessage(answers))} target="_blank" rel="noopener noreferrer" className={PRIMARY}>
          {answers.terreno === 'sim' ? 'Agendar visita ao terreno' : 'Quero conversar sobre isso'}
          <span className="block w-8 h-px bg-current" />
        </a>
        <button onClick={share} className={SECONDARY}>
          <Share2 className="w-4 h-4" strokeWidth={1.5} />
          {copied ? 'Link copiado!' : 'Compartilhar'}
        </button>
        <button onClick={onRestart} className={SECONDARY}>
          <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
          Refazer
        </button>
      </section>
      <a href={projectsUrl()} className="mt-10 inline-block link-underline text-[11px] tracking-[0.3em] uppercase text-olive">
        Ver projetos do estúdio
      </a>
    </motion.div>
  )
}

/** Teste "Descubra sua casa": estilo de casa e, se precisar, o terreno ideal. */
export default function QuizPage() {
  const [shared] = useState(() => answersFromQuery(window.location.search))
  const [stage, setStage] = useState<Stage>(shared ? 'result' : 'intro')
  const [answers, setAnswers] = useState<Answers>(shared ?? {})
  const [index, setIndex] = useState(0)
  const [busy, setBusy] = useState(false)

  const questions = questionsFor(answers)
  const question = questions[index]

  const top = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const pick = (optionId: string) => {
    if (busy) return
    const next = { ...answers, [question.id]: optionId }
    setAnswers(next)
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      if (index + 1 < questionsFor(next).length) {
        setIndex(index + 1)
      } else {
        // O resultado fica no endereço: dá para compartilhar e voltar a ele
        window.history.replaceState(null, '', `/descubra?${answersToQuery(next)}`)
        setStage('result')
      }
      top()
    }, ADVANCE_DELAY)
  }

  const back = () => (index > 0 ? setIndex(index - 1) : setStage('intro'))

  const restart = () => {
    window.history.replaceState(null, '', '/descubra')
    setAnswers({})
    setIndex(0)
    setStage('questions')
    top()
  }

  return (
    <main className="relative w-full overflow-x-clip bg-sand-light">
      <section className="min-h-screen px-6 sm:px-10 lg:px-20 pt-36 lg:pt-44 pb-24">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {stage === 'intro' && (
              <motion.div
                key="intro"
                className="max-w-2xl"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
              >
                <p className="text-[11px] tracking-[0.35em] uppercase text-olive-light">Descubra</p>
                <h1 className="mt-6 font-serif text-5xl sm:text-6xl lg:text-7xl text-olive leading-[1.05]">
                  Qual casa combina <em className="text-olive-light">com você?</em>
                </h1>
                <p className="mt-8 text-lg leading-relaxed text-primary-700">
                  Responda algumas perguntas rápidas e descubra o estilo de casa que tem a sua cara. Se
                  ainda não tiver terreno, você também recebe um guia do lote ideal para procurar.
                </p>
                <button onClick={() => setStage('questions')} className={`mt-12 ${PRIMARY}`}>
                  Começar
                  <span className="block w-8 h-px bg-current" />
                </button>
                <p className="mt-5 text-sm text-primary-500">Leva uns 2 minutos.</p>
              </motion.div>
            )}

            {stage === 'questions' && question && (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
              >
                <div className="flex items-center gap-6">
                  <button
                    onClick={back}
                    className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-olive-light hover:text-olive transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                    Voltar
                  </button>
                  <div className="flex-1">
                    <BrickProgress total={questions.length} done={index} />
                  </div>
                  <span className="font-serif italic text-olive-light">
                    {String(index + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}
                  </span>
                </div>

                <h2 className="mt-12 font-serif text-4xl sm:text-5xl text-olive leading-tight">{question.title}</h2>
                {question.subtitle && <p className="mt-4 text-lg text-primary-600">{question.subtitle}</p>}

                <div
                  className={`mt-10 grid gap-4 sm:gap-5 grid-cols-2 ${
                    question.options.length === 5
                      ? 'sm:grid-cols-3 lg:grid-cols-5'
                      : question.options.length === 4
                        ? 'lg:grid-cols-4'
                        : 'sm:grid-cols-3'
                  }`}
                >
                  {question.options.map((o) => (
                    <OptionCard
                      key={o.id}
                      option={o}
                      selected={answers[question.id] === o.id}
                      onPick={() => pick(o.id)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {stage === 'result' && (
              <motion.div key="result" exit={{ opacity: 0 }}>
                <Result answers={answers} onRestart={restart} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      <Footer />
    </main>
  )
}
