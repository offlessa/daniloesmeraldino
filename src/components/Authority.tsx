import { motion } from 'framer-motion'
import { Building2, Briefcase, Wrench, Hammer, Palette, Users } from 'lucide-react'

export default function Authority() {
  const differentials = [
    {
      icon: Building2,
      title: 'Projetos Residenciais',
      description: 'Projetos de alto padrão com acabamento premium e atenção aos detalhes',
    },
    {
      icon: Briefcase,
      title: 'Projetos Comerciais',
      description: 'Soluções comerciais modernas e funcionalidade otimizada',
    },
    {
      icon: Wrench,
      title: 'Gerenciamento de Obras',
      description: 'Controle total do projeto com prazos garantidos e qualidade assegurada',
    },
    {
      icon: Hammer,
      title: 'Reformas',
      description: 'Modernização e revitalização completa de espaços',
    },
    {
      icon: Palette,
      title: 'Projetos de Interiores',
      description: 'Soluções "chave na mão" - do projeto à entrega completa',
    },
    {
      icon: Users,
      title: 'Equipe Especializada',
      description: 'Profissionais experientes e comprometidos com excelência',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="authority" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
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
            Por Que Escolher o Danilo Esmeraldino?
          </h2>
          <p className="text-xl text-primary-600 max-w-2xl mx-auto">
            Somos especialistas em construção de alta qualidade com compromisso com prazos e excelência
          </p>
        </motion.div>

        {/* Differentials Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {differentials.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={index}
                className="group p-8 rounded-xl bg-primary-50 border border-primary-200 hover:border-accent-500 hover:shadow-xl transition-all duration-300 hover:bg-white cursor-default"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: 10 }}
                >
                  <Icon size={32} className="text-white" />
                </motion.div>
                
                <h3 className="text-xl font-bold text-primary-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-primary-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-20 pt-20 border-t border-primary-200"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          {[
            { number: '12+', label: 'Anos de Experiência' },
            { number: '200+', label: 'Projetos Completos' },
            { number: '100%', label: 'Clientes Satisfeitos' },
            { number: '10+', label: 'Profissionais na Equipe' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              <h3 className="text-4xl sm:text-5xl font-bold text-accent-600 mb-2">
                {stat.number}
              </h3>
              <p className="text-primary-600 text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
