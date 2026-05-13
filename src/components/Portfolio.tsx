import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

export default function Portfolio() {
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="portfolio" className="py-24 px-4 sm:px-6 lg:px-8 bg-primary-50">
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
            Nosso Portfólio
          </h2>
          <p className="text-xl text-primary-600 max-w-2xl mx-auto">
            Projetos realizados com excelência e atenção aos detalhes
          </p>
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {projects.map((project) => (
            <motion.a
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-primary-200">
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
                
                {/* Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-primary-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-between p-6 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                >
                  <div className="text-white">
                    <p className="text-sm font-semibold text-accent-400">{project.category}</p>
                    <p className="text-lg font-bold">{project.year}</p>
                  </div>
                  <div className="w-10 h-10 bg-accent-600 rounded-full flex items-center justify-center">
                    <ExternalLink size={20} className="text-white" />
                  </div>
                </motion.div>

                {/* Badge */}
                <div className="absolute top-4 right-4 bg-accent-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {project.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary-900 mb-2 group-hover:text-accent-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-primary-600 leading-relaxed mb-4">
                  {project.description}
                </p>
                <span className="inline-flex items-center space-x-2 text-accent-600 font-semibold group-hover:text-accent-700">
                  <span>Ver Detalhes</span>
                  <span>→</span>
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.a
            href="https://wa.me/5548988285002?text=Olá! Gostaria de conhecer mais sobre os projetos e solicitar um orçamento."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-accent-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Ver Todos os Projetos</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
