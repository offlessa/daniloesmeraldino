import SectionHeader from './SectionHeader'
import ParallaxRect from './ParallaxRect'
import FadeIn from './FadeIn'

const services = [
  'Projetos Residenciais',
  'Projetos Comerciais',
  'Projetos de Interiores',
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
          <div className="relative overflow-hidden aspect-[4/5] bg-sand-light">
            <img
              src="/images/web/casa-esmeralda-varanda.jpg"
              alt="Casa Esmeralda — Estúdio Danilo Esmeraldino"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
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
