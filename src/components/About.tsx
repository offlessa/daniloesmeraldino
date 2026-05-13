import { motion } from 'framer-motion'
import { MapPin, Users, Building, Award } from 'lucide-react'

export default function About() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-accent-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-700 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Quem Somos
            </h2>

            <p className="text-lg text-primary-200 mb-6 leading-relaxed">
              O Estúdio Danilo Esmeraldino é uma empresa especializada em projetos residenciais e comerciais de alto padrão em Tubarão - SC. Com mais de 12 anos de experiência, consolidamos nossa reputação através da excelência em projetos e gestão de obras.
            </p>

            <p className="text-lg text-primary-200 mb-8 leading-relaxed">
              Nossa equipe de profissionais altamente qualificados está comprometida em transformar visões em realidade, entregando projetos que combinam inovação, sustentabilidade e perfeição nos detalhes.
            </p>

            {/* Values */}
            <div className="space-y-4 mb-8">
              {[
                { title: 'Excelência', desc: 'Qualidade em cada detalhe' },
                { title: 'Confiança', desc: 'Transparência e credibilidade' },
                { title: 'Inovação', desc: 'Tecnologia e modernidade' },
                { title: 'Sustentabilidade', desc: 'Construções responsáveis' },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="w-8 h-8 bg-accent-500 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{value.title}</h4>
                    <p className="text-primary-300">{value.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="https://wa.me/5548988285002?text=Olá! Gostaria de conhecer mais sobre Danilo Esmeraldino."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-accent-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Fale Conosco</span>
            </motion.a>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            className="grid grid-cols-2 gap-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            {[
              {
                icon: MapPin,
                title: 'Localização',
                desc: 'Tubarão - SC',
              },
              {
                icon: Users,
                title: 'Equipe',
                desc: '10+ profissionais',
              },
              {
                icon: Building,
                title: 'Projetos',
                desc: '200+ completos',
              },
              {
                icon: Award,
                title: 'Experiência',
                desc: '12+ anos',
              },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl border border-white border-opacity-20 text-center"
                  whileHover={{ y: -5, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="w-12 h-12 bg-accent-600 rounded-lg flex items-center justify-center mx-auto mb-4"
                    whileHover={{ rotate: 10 }}
                  >
                    <Icon size={24} className="text-white" />
                  </motion.div>
                  <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                  <p className="text-primary-200">{item.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* CTA Banner */}
        <motion.div
          className="mt-20 pt-20 border-t border-white border-opacity-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="bg-gradient-to-r from-accent-600 to-accent-700 rounded-xl p-8 md:p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto para Começar?
            </h3>
            <p className="text-lg text-white mb-8 max-w-2xl mx-auto">
              Solicite uma consulta gratuita e descubra como podemos transformar seu projeto em realidade.
            </p>
            <motion.a
              href="https://wa.me/5548988285002?text=Olá! Gostaria de solicitar uma consulta gratuita."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-white text-accent-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Consulta Gratuita</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
