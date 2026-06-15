import { motion } from 'framer-motion'
import { Users, FileText, Hammer, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    icon: FileText,
    title: 'Consultoria e Projeto',
    description:
      'Entendemos suas necessidades e desenvolvemos um projeto personalizado com apresentação 3D e orçamento detalhado',
    features: ['Visita técnica', 'Projeto executivo', 'Orçamento completo'],
    phase: 'Semana 1–2',
  },
  {
    icon: Hammer,
    title: 'Execução da Obra',
    description:
      'Equipe especializada executando o projeto com cronograma rigoroso, segurança e qualidade garantidas',
    features: ['Cronograma definido', 'Equipe especializada', 'Controle de qualidade'],
    phase: 'Semana 5–16',
  },
  {
    icon: CheckCircle2,
    title: 'Inspeção Final',
    description:
      'Verificação minuciosa de cada detalhe, testes de funcionamento e ajustes finais de acabamento',
    features: ['Inspeção completa', 'Testes funcionais', 'Ajustes finais'],
    phase: 'Semana 17–18',
  },
  {
    icon: Users,
    title: 'Entrega e Suporte',
    description:
      'Entrega formal da obra, treinamento de uso e suporte pós-obra por até 12 meses',
    features: ['Entrega formal', 'Manual da obra', 'Suporte técnico'],
    phase: 'Semana 19+',
  },
]

export default function Process() {
  return (
    <section id="process" className="py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="inline-block text-accent-600 text-xs font-bold tracking-widest uppercase mb-3">
            Como Trabalhamos
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-primary-900 max-w-xl leading-tight">
            Nosso Processo
          </h2>
          <p className="mt-4 text-primary-600 text-lg max-w-2xl">
            Metodologia comprovada que garante resultados excepcionais
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-accent-500 via-accent-300 to-transparent" />

          <div className="space-y-10">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={index}
                  className="relative flex gap-10"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, margin: '-60px' }}
                >
                  {/* Dot */}
                  <div className="relative flex-shrink-0 w-12 flex justify-center">
                    <div className="w-4 h-4 rounded-full border-2 border-accent-500 bg-white mt-8 z-10 ring-4 ring-accent-50" />
                  </div>

                  {/* Card */}
                  <motion.div
                    className="flex-1 mb-2 p-7 rounded-2xl border border-primary-200 bg-white hover:border-accent-300 hover:shadow-lg hover:shadow-accent-900/5 transition-all duration-300"
                    whileHover={{ y: -3 }}
                  >
                    <div className="flex flex-wrap items-start gap-4 mb-5">
                      <div className="w-12 h-12 bg-accent-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon size={22} className="text-white" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs bg-accent-50 text-accent-700 font-bold px-2.5 py-1 rounded-full border border-accent-200">
                            Etapa {index + 1}
                          </span>
                          <span className="text-xs text-primary-400 font-medium">{step.phase}</span>
                        </div>
                        <h3 className="font-serif text-xl font-bold text-primary-900">{step.title}</h3>
                      </div>
                    </div>

                    <p className="text-primary-600 text-sm leading-relaxed mb-5">
                      {step.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {step.features.map((f, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-accent-50 text-accent-700 text-xs font-medium rounded-full border border-accent-200"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
