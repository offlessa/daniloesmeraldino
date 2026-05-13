import { motion } from 'framer-motion'
import { Users, FileText, Hammer, CheckCircle2 } from "lucide-react"

export default function Process() {
  const steps = [
    {
      icon: FileText,
      title: 'Consultoria e Projeto',
      description: 'Entendemos suas necessidades e desenvolvemos um projeto personalizado com apresentação 3D e orçamento detalhado',
      features: ['Visita técnica', 'Projeto executivo', 'Orçamento completo'],
    },
    {
      icon: Hammer,
      title: 'Execução da Obra',
      description: 'Equipe especializada executando o projeto com cronograma rigoroso, segurança e qualidade garantidas',
      features: ['Cronograma definido', 'Equipe especializada', 'Controle de qualidade'],
    },
    {
      icon: CheckCircle2,
      title: 'Inspeção Final',
      description: 'Verificação minuciosa de cada detalhe, testes de funcionamento e ajustes finais de acabamento',
      features: ['Inspeção completa', 'Testes funcionais', 'Ajustes finais'],
    },
    {
      icon: Users,
      title: 'Entrega e Suporte',
      description: 'Entrega formal da obra, treinamento de uso e suporte pós-obra por até 12 meses',
      features: ['Entrega formal', 'Manual da obra', 'Suporte técnico'],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="process" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-primary-900 mb-4">
            Nosso Processo
          </h2>
          <p className="text-xl text-primary-600 max-w-2xl mx-auto">
            Metodologia comprovada que garante resultados excepcionais
          </p>
        </motion.div>

        {/* Process Steps */}
        <motion.div
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {steps.map((step, index) => {
            const Icon = step.icon
            const isEven = index % 2 === 0

            return (
              <motion.div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                variants={itemVariants}
              >
                {/* Left Content (alternates) */}
                <div className={isEven ? 'order-1 md:order-1' : 'order-1 md:order-2'}>
                  <motion.div
                    className="bg-gradient-to-br from-accent-50 to-primary-50 p-8 rounded-xl border border-accent-200"
                    whileHover={{ boxShadow: '0 20px 40px rgba(45, 170, 150, 0.15)' }}
                  >
                    <div className="flex items-center space-x-4 mb-6">
                      <motion.div
                        className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                      >
                        <Icon size={32} className="text-white" />
                      </motion.div>
                      <div>
                        <div className="inline-block bg-accent-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-2">
                          Etapa {index + 1}
                        </div>
                        <h3 className="text-2xl font-bold text-primary-900">
                          {step.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-primary-600 text-lg mb-6 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-3">
                      {step.features.map((feature, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center space-x-3"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                          <span className="text-primary-700 font-medium">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Right Visual (alternates) */}
                <div className={isEven ? 'order-2 md:order-2' : 'order-2 md:order-1'}>
                  <motion.div
                    className="relative h-80 bg-gradient-to-br from-accent-100 to-primary-100 rounded-xl overflow-hidden"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, margin: '-100px' }}
                  >
                    {/* Decorative Elements */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="absolute w-32 h-32 bg-accent-500 rounded-full opacity-10"
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      ></motion.div>
                      <motion.div
                        className="absolute w-20 h-20 bg-accent-600 rounded-lg opacity-20"
                        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      ></motion.div>
                    </div>

                    {/* Step Number */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="text-center">
                        <motion.div
                          className="text-7xl font-bold text-accent-600 opacity-30"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </motion.div>
                        <p className="text-primary-600 font-semibold mt-4">Próxima Etapa →</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="md:col-span-2 h-1 bg-gradient-to-r from-transparent via-accent-400 to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                  ></motion.div>
                )}
              </motion.div>
            )
          })}
        </motion.div>

        {/* Timeline Visualization */}
        <motion.div
          className="mt-20 pt-20 border-t border-primary-200"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <h3 className="text-2xl font-bold text-primary-900 mb-8 text-center">
            Cronograma Típico
          </h3>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
            {[
              { label: 'Semana 1-2', desc: 'Projeto e Orçamento' },
              { label: 'Semana 3-4', desc: 'Aprovação e Financiamento' },
              { label: 'Semana 5-16', desc: 'Execução da Obra' },
              { label: 'Semana 17-18', desc: 'Inspeção e Ajustes' },
              { label: 'Semana 19', desc: 'Entrega' },
            ].map((phase, index) => (
              <motion.div
                key={index}
                className="flex-1 text-center md:px-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="inline-block bg-accent-600 text-white px-4 py-2 rounded-full font-semibold mb-2">
                  {phase.label}
                </div>
                <p className="text-primary-600 font-medium">{phase.desc}</p>
                {index < 4 && <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-accent-400 text-2xl">→</div>}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
