import SectionHeader from './SectionHeader'
import FadeIn from './FadeIn'

const steps = [
  {
    title: 'Consultoria',
    description: 'Escuta atenta, visita técnica e leitura do terreno para entender o que o projeto precisa ser.',
  },
  {
    title: 'Projeto',
    description: 'Estudo, apresentação 3D e projeto executivo com orçamento detalhado de cada etapa.',
  },
  {
    title: 'Execução',
    description: 'Obra conduzida pela mesma equipe que desenhou, com cronograma e controle de qualidade.',
  },
  {
    title: 'Entrega',
    description: 'Inspeção final, entrega formal e suporte pós-obra para que a casa siga como foi pensada.',
  },
]

export default function Process() {
  return (
    <section id="process" className="relative py-32 lg:py-40 px-6 sm:px-10 lg:px-20 bg-sand-light">
      <SectionHeader
        label="Processo"
        title={<>Do projeto <em className="text-olive-light">à obra</em></>}
        className="mb-20 lg:mb-24"
      />

      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        {steps.map((step, i) => (
          <FadeIn key={step.title} className="border-t border-olive/25 pt-8" delay={i * 0.1}>
            <p className="font-serif italic text-olive-light text-lg">0{i + 1}</p>
            <h3 className="mt-2 font-serif text-3xl text-olive">{step.title}</h3>
            <p className="mt-4 text-primary-600 leading-relaxed">{step.description}</p>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
