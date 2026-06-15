import { motion } from 'framer-motion'
import { Building2, Briefcase, Wrench, Hammer, Palette, Users } from 'lucide-react'

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
    description: 'Soluções "chave na mão" — do projeto à entrega completa',
  },
  {
    icon: Users,
    title: 'Equipe Especializada',
    description: 'Profissionais experientes e comprometidos com excelência',
  },
]

const stats = [
  { number: '12+', label: 'Anos de Experiência' },
  { number: '200+', label: 'Projetos Completos' },
  { number: '100%', label: 'Clientes Satisfeitos' },
  { number: '10+', label: 'Profissionais' },
]

export default function Authority() {
  return (
    <section id="authority" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="inline-block text-accent-600 text-xs font-bold tracking-widest uppercase mb-3">
            Por que nos escolher
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-primary-900 max-w-xl leading-tight">
            Por Que Escolher o Danilo Esmeraldino?
          </h2>
          <p className="mt-4 text-primary-600 text-lg max-w-2xl">
            Especialistas em construção de alta qualidade com compromisso com prazos e excelência
          </p>
        </motion.div>

        {/* Differentials Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {differentials.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={index}
                className="group flex gap-5 p-7 rounded-2xl border border-primary-200 hover:border-accent-300 hover:shadow-lg hover:shadow-accent-900/5 bg-white transition-all duration-300"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                whileHover={{ y: -4 }}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-accent-50 group-hover:bg-accent-600 rounded-xl flex items-center justify-center transition-colors duration-300">
                  <Icon
                    size={22}
                    className="text-accent-600 group-hover:text-white transition-colors duration-300"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-primary-900 mb-1.5">{item.title}</h3>
                  <p className="text-primary-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Stats Band */}
        <motion.div
          className="mt-20 rounded-3xl bg-gradient-to-br from-accent-900 via-accent-800 to-accent-900 p-10 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-4xl sm:text-5xl font-bold text-accent-300 mb-1">{stat.number}</p>
              <p className="text-accent-200/60 text-xs uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
