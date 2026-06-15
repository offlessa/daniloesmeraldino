import { motion } from 'framer-motion'
import { MapPin, Users, Building, Award } from 'lucide-react'

const values = [
  { title: 'Excelência', desc: 'Qualidade em cada detalhe' },
  { title: 'Confiança', desc: 'Transparência e credibilidade' },
  { title: 'Inovação', desc: 'Tecnologia e modernidade' },
  { title: 'Sustentabilidade', desc: 'Construções responsáveis' },
]

const cards = [
  { icon: MapPin, title: 'Localização', desc: 'Tubarão — SC' },
  { icon: Users, title: 'Equipe', desc: '10+ profissionais' },
  { icon: Building, title: 'Projetos', desc: '200+ completos' },
  { icon: Award, title: 'Experiência', desc: '12+ anos' },
]

export default function About() {
  return (
    <section
      id="about"
      className="py-28 bg-primary-900 text-white relative overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-80 h-80 bg-accent-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-700 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <span className="inline-block text-accent-400 text-xs font-bold tracking-widest uppercase mb-4">
              Sobre Nós
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Quem Somos
            </h2>

            <p className="text-white/70 text-lg mb-5 leading-relaxed">
              O Estúdio Danilo Esmeraldino é uma empresa especializada em projetos residenciais e
              comerciais de alto padrão em Tubarão — SC. Com mais de 12 anos de experiência,
              consolidamos nossa reputação através da excelência em projetos e gestão de obras.
            </p>

            <p className="text-white/70 text-lg mb-10 leading-relaxed">
              Nossa equipe de profissionais altamente qualificados está comprometida em transformar
              visões em realidade, entregando projetos que combinam inovação, sustentabilidade e
              perfeição nos detalhes.
            </p>

            {/* Values */}
            <div className="flex flex-wrap gap-3 mb-10">
              {values.map((v, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-accent-500/50 transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  viewport={{ once: true }}
                >
                  <div className="w-2 h-2 rounded-full bg-accent-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">{v.title}</p>
                    <p className="text-xs text-white/50">{v.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="https://wa.me/5548988285002?text=Olá! Gostaria de conhecer mais sobre Danilo Esmeraldino."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent-600 hover:bg-accent-500 text-white px-8 py-4 rounded-full font-semibold text-base transition-colors"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Fale Conosco
            </motion.a>
          </motion.div>

          {/* Right - Info cards */}
          <motion.div
            className="grid grid-cols-2 gap-5"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            {cards.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={i}
                  className="bg-white/5 backdrop-blur-sm p-7 rounded-2xl border border-white/10 hover:border-accent-500/40 hover:bg-white/8 text-center transition-all"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-accent-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon size={22} className="text-white" />
                  </div>
                  <h4 className="font-bold text-base mb-1">{item.title}</h4>
                  <p className="text-white/50 text-sm">{item.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* CTA Banner */}
        <motion.div
          className="mt-24 rounded-3xl bg-gradient-to-r from-accent-700 to-accent-600 p-10 md:p-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <h3 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Pronto para Começar?
          </h3>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Solicite uma consulta gratuita e descubra como podemos transformar seu projeto em
            realidade.
          </p>
          <motion.a
            href="https://wa.me/5548988285002?text=Olá! Gostaria de solicitar uma consulta gratuita."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-accent-700 px-8 py-4 rounded-full font-bold text-base hover:bg-primary-100 transition-colors shadow-lg"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Consulta Gratuita
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
