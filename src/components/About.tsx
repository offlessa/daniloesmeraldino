import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import SectionHeader from './SectionHeader'
import ParallaxRect from './ParallaxRect'
import FadeIn from './FadeIn'

const REVEAL_RADIUS = 140

/** Casa pronta; com o mouse por cima, um círculo revela a mesma vista durante a obra. */
function ObraReveal() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const radius = useMotionValue(0)
  const smoothX = useSpring(x, { stiffness: 300, damping: 30 })
  const smoothY = useSpring(y, { stiffness: 300, damping: 30 })
  const smoothR = useSpring(radius, { stiffness: 200, damping: 25 })
  const clipPath = useMotionTemplate`circle(${smoothR}px at ${smoothX}px ${smoothY}px)`

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - rect.left)
    y.set(e.clientY - rect.top)
  }

  const enter = (e: React.PointerEvent<HTMLDivElement>) => {
    // Começa no ponto de entrada, sem "viajar" do canto da foto
    const rect = e.currentTarget.getBoundingClientRect()
    smoothX.jump(e.clientX - rect.left)
    smoothY.jump(e.clientY - rect.top)
    move(e)
    radius.set(REVEAL_RADIUS)
  }

  return (
    <div
      className="group relative overflow-hidden aspect-[4/5] bg-sand-light cursor-crosshair"
      onPointerEnter={enter}
      onPointerMove={move}
      onPointerLeave={() => radius.set(0)}
    >
      <img
        src="/images/web/casa-esmeralda-varanda.jpg"
        alt="Casa Esmeralda — Estúdio Danilo Esmeraldino"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <motion.img
        src="/images/web/casa-esmeralda-obra.jpg"
        alt="Casa Esmeralda durante a obra"
        loading="lazy"
        style={{ clipPath }}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <p className="absolute bottom-0 left-0 bg-white px-5 py-3 text-[10px] tracking-[0.3em] uppercase text-olive transition-opacity duration-500 group-hover:opacity-0">
        Passe o mouse · veja a obra
      </p>
    </div>
  )
}

const services = [
  'Projetos Residenciais',
  'Projetos Comerciais',
  'Projetos de Interiores',
  'Projetos de Engenharia',
  'Gerenciamento de Obras',
  'Reformas',
]

export default function About() {
  return (
    <section id="about" className="relative py-32 lg:py-44 px-6 sm:px-10 lg:px-20">
      <ParallaxRect className="right-0 top-24 w-1/3 lg:w-1/5 h-2" speed={30} grow="right" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-16 lg:gap-8 items-center">
        <FadeIn className="lg:col-span-6 order-2 lg:order-1 relative">
          <div aria-hidden className="absolute -right-4 sm:-right-8 -top-8 w-1/3 h-1/2 bg-olive" />
          <ObraReveal />
        </FadeIn>

        <div className="lg:col-span-5 lg:col-start-8 order-1 lg:order-2">
          <SectionHeader label="Sobre" title={<>Projeto e obra<br /><em className="text-olive-light">sob um só olhar</em></>} />

          <FadeIn className="mt-12 space-y-6 text-lg leading-relaxed text-primary-700">
            <p>
              Há mais de 12 anos, o escritório consolida sua reputação pela excelência em projetos e
              gestão de obras. Cada trabalho carrega a identidade do Danilo: a imponência das
              fachadas, os detalhes de luxo e a preocupação constante com a funcionalidade dos
              espaços.
            </p>
            <p>
              Nossa equipe acompanha o cliente em todas as etapas — consultoria, projeto, execução e
              entrega — para transformar ideias em casas e espaços que fazem sentido para quem vive
              neles.
            </p>
          </FadeIn>

          <FadeIn className="mt-12 border-t border-olive/20" delay={0.1}>
            <ul>
              {services.map((s) => (
                <li
                  key={s}
                  className="border-b border-olive/20 py-4 text-[12px] tracking-[0.25em] uppercase text-olive"
                >
                  {s}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
