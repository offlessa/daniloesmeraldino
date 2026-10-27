import SectionHeader from './SectionHeader'
import ParallaxRect from './ParallaxRect'
import FadeIn from './FadeIn'

const stats = [
  { value: '12+', label: 'Anos de atuação' },
  { value: '200+', label: 'Projetos entregues' },
  { value: '100%', label: 'Clientes satisfeitos' },
]

export default function Manifesto() {
  return (
    <section id="manifesto" className="relative py-32 lg:py-44 px-6 sm:px-10 lg:px-20">
      <ParallaxRect className="hidden lg:block left-0 bottom-16 w-[9%] h-72" speed={90} />

      <div className="relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-8">
        <div className="lg:col-span-4">
          <SectionHeader label="O estúdio" title={<>O olhar<br />do estúdio</>} />
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <FadeIn>
            <p className="font-serif text-2xl sm:text-[1.7rem] leading-[1.75] text-primary-700">
              Escritório de arquitetura e engenharia especializado em projetos residenciais e
              comerciais sob medida. Integramos projeto arquitetônico, projetos complementares e
              design de interiores sob um mesmo acompanhamento, do primeiro traço à obra entregue.
              Presença em{' '}
              <a href="#contact" className="link-underline">
                Santa Catarina e Rio Grande do Sul
              </a>
              , com atendimento presencial na região e remoto para todo o Brasil.
            </p>
          </FadeIn>

          <FadeIn className="mt-20 grid grid-cols-3 border-t border-olive/20" delay={0.1}>
            {stats.map((s, i) => (
              <div key={s.label} className={`pt-8 ${i > 0 ? 'pl-5 sm:pl-8 border-l border-olive/20' : ''}`}>
                <p className="font-serif text-4xl sm:text-6xl text-olive leading-none">{s.value}</p>
                <p className="mt-3 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-primary-500">
                  {s.label}
                </p>
              </div>
            ))}
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
