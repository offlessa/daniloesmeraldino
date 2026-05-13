import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Mayara Machado',
      company: '',
      text: 'O Danilo é um ótimo profissional! Pensa nos detalhes de tudo pra que a casa fique linda e funcional. Os projetos tem a identidade dele, a imponência das fachadas e detalhes de luxo e beleza. O projeto da nossa casa ficou lindo demais!',
      rating: 5,
      image: 'src/assets/testimonial-mayara-machado.png',
    },
    {
      name: 'Mirely Fernandes',
      company: '',
      text: 'Super atenciosos e cuidadosos em todos detalhes, ótimos profissionais ❤️',
      rating: 5,
      image: 'src/assets/testimonial-mirely-fernandes.png',
    },
    {
      name: 'Didiane Almeida',
      company: '',
      text: 'Simplesmente o melhor, arrasa nas suas edificações, sabe transformar as ideias dos seus clientes em realidade',
      rating: 5,
      image: 'src/assets/testimonial-didiane-almeida.png',
    },
    {
      name: 'Gisele Margotti',
      company: 'Casa Pietra',
      text: 'Só elogios... atendimento top e de muita qualidade. Parabéns pelo trabalho! Projetos lindos e diferenciados! Um escritório que dá vida à nossos sonhos!',
      rating: 5,
      image: 'src/assets/testimonial-gisele-margotti.png',
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
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
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
            O Que Dizem Sobre Nós
          </h2>
          <p className="text-xl text-primary-600 max-w-2xl mx-auto">
            Depoimentos de clientes satisfeitos que confiam em nosso trabalho
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="group bg-gradient-to-br from-primary-50 to-accent-50 p-8 rounded-xl border border-primary-200 hover:border-accent-400 hover:shadow-xl transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              {/* Stars */}
              <div className="flex items-center space-x-2 mb-4">
                {Array(testimonial.rating)
                  .fill(0)
                  .map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <Star
                        size={20}
                        className="fill-amber-400 text-amber-400"
                      />
                    </motion.div>
                  ))}
              </div>

              {/* Text */}
              <p className="text-primary-700 leading-relaxed mb-6 text-lg italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <motion.img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full bg-primary-200"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                />
                <div>
                  <h4 className="font-bold text-primary-900">{testimonial.name}</h4>
                  <p className="text-sm text-primary-600">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-primary-200"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          {[
            { number: '100%', label: 'Clientes Satisfeitos' },
            { number: '5.0★', label: 'Avaliação Média' },
            { number: '200+', label: 'Projetos Entregues' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.h3
                className="text-4xl font-bold text-accent-600 mb-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {stat.number}
              </motion.h3>
              <p className="text-primary-600 text-lg font-semibold">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
