import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Mayara Machado',
    company: '',
    text: 'O Danilo é um ótimo profissional! Pensa nos detalhes de tudo pra que a casa fique linda e funcional. Os projetos tem a identidade dele, a imponência das fachadas e detalhes de luxo e beleza. O projeto da nossa casa ficou lindo demais!',
    rating: 5,
    image: '/images/testimonial-mayara-machado.png',
  },
  {
    name: 'Mirely Fernandes',
    company: '',
    text: 'Super atenciosos e cuidadosos em todos detalhes, ótimos profissionais ❤️',
    rating: 5,
    image: '/images/testimonial-mirely-fernandes.png',
  },
  {
    name: 'Didiane Almeida',
    company: '',
    text: 'Simplesmente o melhor, arrasa nas suas edificações, sabe transformar as ideias dos seus clientes em realidade',
    rating: 5,
    image: '/images/testimonial-didiane-almeida.png',
  },
  {
    name: 'Gisele Margotti',
    company: 'Casa Pietra',
    text: 'Só elogios... atendimento top e de muita qualidade. Parabéns pelo trabalho! Projetos lindos e diferenciados! Um escritório que dá vida à nossos sonhos!',
    rating: 5,
    image: '/images/testimonial-gisele-margotti.png',
  },
]

export default function Testimonials() {
  return (
    <section className="py-28 bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="inline-block text-accent-600 text-xs font-bold tracking-widest uppercase mb-3">
            Depoimentos
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-primary-900 mb-4">
            O Que Dizem Sobre Nós
          </h2>
          <p className="text-primary-600 text-lg max-w-2xl mx-auto">
            Depoimentos de clientes satisfeitos que confiam em nosso trabalho
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              className="group bg-white p-8 rounded-3xl border border-primary-200 hover:border-accent-300 hover:shadow-xl hover:shadow-accent-900/5 transition-all duration-300"
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              whileHover={{ y: -4 }}
            >
              {/* Quote icon */}
              <div className="w-10 h-10 bg-accent-50 rounded-xl flex items-center justify-center mb-6">
                <Quote size={18} className="text-accent-600" />
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-5">
                {Array(t.rating)
                  .fill(0)
                  .map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
              </div>

              {/* Text */}
              <p className="text-primary-700 leading-relaxed mb-7 text-base">"{t.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-primary-100">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover bg-primary-200 ring-2 ring-accent-100"
                />
                <div>
                  <h4 className="font-bold text-primary-900 text-sm">{t.name}</h4>
                  {t.company && <p className="text-xs text-primary-500">{t.company}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          {[
            { number: '100%', label: 'Clientes Satisfeitos' },
            { number: '5.0★', label: 'Avaliação Média' },
            { number: '200+', label: 'Projetos Entregues' },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center p-8 bg-white rounded-2xl border border-primary-200"
            >
              <p className="text-4xl font-bold text-accent-600 mb-1">{stat.number}</p>
              <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
