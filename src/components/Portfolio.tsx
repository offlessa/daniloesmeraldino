import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

const projects = [
  {
    id: 1,
    title: 'Casa Iron',
    category: 'Reforma Residencial',
    description: 'Reforma para Casa de alto padrão em Tubarão SC',
    image: '/images/portfolio-casa-iron.jpg',
    year: '2024',
    link: 'https://sites.google.com/d/1uER1att9__cOF6pUQSH5LuHYPZg4vfIY/p/1efpMy9csMp5LZynq8GNbQb0vsNBZwY6X/edit',
  },
  {
    id: 2,
    title: 'Casa JE',
    category: 'Residência',
    description: 'Casa de alto padrão em Tubarão SC',
    image: '/images/portfolio-casa-je.jpg',
    year: '2023',
    link: '',
  },
  {
    id: 3,
    title: 'Casa Arcos',
    category: 'Projeto Residencial',
    description: 'Casa de alto padrão em Tubarão SC',
    image: '/images/portfolio-casa-arcos.jpg',
    year: '2025',
    link: 'https://sites.google.com/view/casaarcos/in%C3%ADcio',
  },
  {
    id: 4,
    title: 'Casa Lago',
    category: 'Residência',
    description: 'Casa de alto padrão em Tubarão SC',
    image: '/images/portfolio-casa-lago.jpg',
    year: '2024',
    link: 'https://www.youtube.com/watch?v=JxztO6DDQp4',
  },
  {
    id: 5,
    title: 'Casa Orion',
    category: 'Projeto Residencial',
    description: 'Casa de alto padrão em Tubarão SC',
    image: '/images/portfolio-casa-orion.jpg',
    year: '2024',
    link: 'https://sites.google.com/view/casaorion/in%C3%ADcio',
  },
  {
    id: 6,
    title: 'Bar Fácil',
    category: 'Projeto Comercial',
    description: 'Sede Empresarial de alto padrão em Tubarão SC',
    image: '/images/portfolio-bar-facil.jpg',
    year: '2024',
    link: '',
  },
]

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-28 bg-primary-50">
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
            Trabalhos Realizados
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-primary-900 max-w-xl leading-tight">
            Nosso Portfólio
          </h2>
          <p className="mt-4 text-primary-600 text-lg max-w-2xl">
            Projetos realizados com excelência e atenção aos detalhes
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {projects.map((project) => {
            const isLink = Boolean(project.link)
            const CardTag = isLink ? motion.a : motion.div
            const linkProps = isLink
              ? { href: project.link, target: '_blank', rel: 'noopener noreferrer' }
              : {}

            return (
              <CardTag
                key={project.id}
                {...(linkProps as any)}
                className="group block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
                whileHover={{ y: -6 }}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-primary-200">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.07 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    {project.year}
                  </div>

                  {isLink && (
                    <div className="absolute bottom-4 right-4 w-9 h-9 bg-accent-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                      <ExternalLink size={15} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <span className="inline-block text-accent-600 text-xs font-bold tracking-wider uppercase mb-2">
                    {project.category}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-primary-900 mb-1.5 group-hover:text-accent-700 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-primary-600 text-sm leading-relaxed">{project.description}</p>
                  {isLink && (
                    <span className="inline-flex items-center gap-1.5 mt-4 text-accent-600 text-sm font-semibold group-hover:gap-3 transition-all duration-200">
                      Ver Detalhes <span>→</span>
                    </span>
                  )}
                </div>
              </CardTag>
            )
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.a
            href="https://wa.me/5548988285002?text=Olá! Gostaria de conhecer mais sobre os projetos e solicitar um orçamento."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent-600 text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-accent-700 transition-colors shadow-lg shadow-accent-900/15"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Ver Todos os Projetos
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
