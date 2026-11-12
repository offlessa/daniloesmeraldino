import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import SectionHeader from './SectionHeader'
import ParallaxRect from './ParallaxRect'
import FadeIn from './FadeIn'
import { ImageSwap, Txt, useSiteImage, useSiteList } from '../admin/SiteContent'
import { useEdit } from '../admin/edit'
import { SIZES, srcSet } from '../lib/images'

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
  const done = useSiteImage('about.image', '/images/web/casa-esmeralda-varanda.jpg')
  const building = useSiteImage('about.image.obra', '/images/web/casa-esmeralda-obra.jpg')

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
        src={done}
        srcSet={srcSet(done)}
        sizes={SIZES.wide}
        alt="Casa Esmeralda — Estúdio Danilo Esmeraldino"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <motion.img
        src={building}
        srcSet={srcSet(building)}
        sizes={SIZES.wide}
        alt="Casa Esmeralda durante a obra"
        loading="lazy"
        style={{ clipPath }}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <p className="absolute bottom-0 left-0 bg-white px-5 py-3 text-[10px] tracking-[0.3em] uppercase text-olive transition-opacity duration-500 group-hover:opacity-0">
        <Txt k="about.image.caption" d="Passe o mouse · veja a obra" />
      </p>
      <ImageSwap k="about.image" label="Trocar foto pronta" />
      <ImageSwap k="about.image.obra" label="Trocar foto da obra" className="top-16 left-3" />
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
  const { editing } = useEdit()
  const serviceList = useSiteList('about.services', services)
  return (
    <section id="about" className="relative py-32 lg:py-44 px-6 sm:px-10 lg:px-20">
      <ParallaxRect className="right-0 top-24 w-1/3 lg:w-1/5 h-2" speed={30} grow="right" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-16 lg:gap-8 items-center">
        <FadeIn className="lg:col-span-6 order-2 lg:order-1 relative">
          <div aria-hidden className="absolute -right-4 sm:-right-8 -top-8 w-1/3 h-1/2 bg-olive" />
          <ObraReveal />
        </FadeIn>

        <div className="lg:col-span-5 lg:col-start-8 order-1 lg:order-2">
          <SectionHeader
            label={<Txt k="about.label" d="Sobre" />}
            title={<Txt k="about.title" d={'Projeto e obra\n*sob um só olhar*'} em="text-olive-light" />}
          />

          <FadeIn className="mt-12 space-y-6 text-lg leading-relaxed text-primary-700">
            <p>
              <Txt
                k="about.text1"
                d="Há mais de 12 anos, o escritório consolida sua reputação pela excelência em projetos e gestão de obras. Cada trabalho carrega a identidade do Danilo: a imponência das fachadas, os detalhes de luxo e a preocupação constante com a funcionalidade dos espaços."
                multiline
              />
            </p>
            <p>
              <Txt
                k="about.text2"
                d="Nossa equipe acompanha o cliente em todas as etapas — consultoria, projeto, execução e entrega — para transformar ideias em casas e espaços que fazem sentido para quem vive neles."
                multiline
              />
            </p>
          </FadeIn>

          <FadeIn className="mt-12 border-t border-olive/20" delay={0.1}>
            {editing ? (
              // Um serviço por linha
              <div className="border-b border-olive/20 py-4 text-[12px] tracking-[0.25em] uppercase text-olive leading-[2.6]">
                <Txt k="about.services" d={services.join('\n')} multiline />
              </div>
            ) : (
              <ul>
                {serviceList.map((s) => (
                  <li
                    key={s}
                    className="border-b border-olive/20 py-4 text-[12px] tracking-[0.25em] uppercase text-olive"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
