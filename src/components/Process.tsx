import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import SectionHeader from './SectionHeader'
import FadeIn from './FadeIn'
import BrickWall from './BrickWall'

const steps = [
  {
    title: 'Consultoria',
    description: 'Escuta atenta, visita técnica e leitura do terreno para entender o que o projeto precisa ser.',
  },
  {
    title: 'Projeto',
    description: 'Arquitetura, projetos complementares e interiores desenvolvidos juntos, com apresentação 3D e aprovação na prefeitura.',
  },
  {
    title: 'Execução',
    description: 'Obra acompanhada pela mesma equipe que desenhou, com cronograma e controle de qualidade.',
  },
  {
    title: 'Entrega',
    description: 'Inspeção final, entrega formal e suporte pós-obra para que a casa siga como foi pensada.',
  },
]

// Tudo o que o estúdio entrega dentro de um mesmo acompanhamento
const deliverables = [
  {
    group: 'Projetos',
    items: [
      'Arquitetônico',
      'Estrutural',
      'Hidrossanitário',
      'Elétrico',
      'Comunicação',
      'Interiores',
      'Paisagismo',
    ],
  },
  {
    group: 'Acompanhamento',
    items: ['Aprovação na prefeitura', 'Curadoria', 'Acompanhamento de obra'],
  },
]

/** Linha da etapa que se preenche quando a obra chega nela */
function StepLine({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const share = 1 / steps.length
  const scaleX = useTransform(progress, [index * share, (index + 1) * share], [0, 1])
  return (
    <motion.span
      aria-hidden
      className="absolute -top-px left-0 h-px w-full bg-olive origin-left"
      style={{ scaleX }}
    />
  )
}

export default function Process() {
  const stepsRef = useRef<HTMLDivElement>(null)
  // 0 quando as etapas entram na tela, 1 quando a parede está inteira à vista
  const { scrollYProgress: progress } = useScroll({
    target: stepsRef,
    offset: ['start 75%', 'end 70%'],
  })

  return (
    <section id="process" className="relative py-32 lg:py-40 px-6 sm:px-10 lg:px-20 bg-sand-light">
      <SectionHeader
        label="Processo"
        title={<>Do projeto <em className="text-olive-light">à obra</em></>}
        className="mb-20 lg:mb-24"
      />

      {/* A obra acompanha a rolagem: cada etapa preenche sua linha e a parede sobe junto */}
      <div ref={stepsRef}>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {steps.map((step, i) => (
            <FadeIn key={step.title} className="relative border-t border-olive/25 pt-8" delay={i * 0.1}>
              <StepLine progress={progress} index={i} />
              <p className="font-serif italic text-olive-light text-lg">0{i + 1}</p>
              <h3 className="mt-2 font-serif text-3xl text-olive">{step.title}</h3>
              <p className="mt-4 text-primary-600 leading-relaxed">{step.description}</p>
            </FadeIn>
          ))}
        </div>

        <div className="mt-16 lg:mt-20">
          <BrickWall progress={progress} />
        </div>
      </div>

      <div className="mt-28 lg:mt-36 grid lg:grid-cols-12 gap-12 lg:gap-8">
        <FadeIn className="lg:col-span-4">
          <h3 className="font-serif text-3xl sm:text-4xl leading-tight text-olive">
            Todos os projetos <em className="text-olive-light">da sua obra</em>
          </h3>
          <p className="mt-6 max-w-sm text-primary-600 leading-relaxed">
            Um só escritório cuida de cada disciplina, já compatibilizadas entre si — menos
            fornecedores para coordenar e nenhuma surpresa no canteiro.
          </p>
        </FadeIn>

        <div className="lg:col-span-7 lg:col-start-6 grid sm:grid-cols-2 gap-12 sm:gap-10">
          {deliverables.map((d, gi) => (
            <FadeIn key={d.group} delay={0.1 + gi * 0.1}>
              <p className="text-[10px] tracking-[0.35em] uppercase text-olive-light">{d.group}</p>
              <ul className="mt-4 border-t border-olive/25">
                {d.items.map((item) => (
                  <li
                    key={item}
                    className="border-b border-olive/25 py-4 text-[11px] tracking-[0.3em] uppercase text-olive"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
