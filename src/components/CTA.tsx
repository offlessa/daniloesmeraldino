import { motion } from 'framer-motion'
import { MessageCircle, CheckCircle2 } from 'lucide-react'

export default function CTA() {
  const features = [
    'Consulta totalmente gratuita',
    'Sem compromisso',
    'Resposta rápida',
    'Orçamento personalizado',
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-900 via-accent-800 to-primary-900 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180] }}
          transition={{ duration: 8, repeat: Infinity }}
        ></motion.div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Transforme Seu Projeto em Realidade
            </h2>

            <p className="text-lg text-primary-100 mb-8 leading-relaxed">
              Não espere mais. Solicite agora uma consulta gratuita com nossos especialistas e descubra como podemos elevar seu projeto a um novo patamar de qualidade e inovação.
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="w-6 h-6 bg-accent-400 rounded-full flex items-center justify-center flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                  >
                    <CheckCircle2 size={20} className="text-white" />
                  </motion.div>
                  <span className="text-lg text-white font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right CTA Card */}
          <motion.div
            className="bg-white rounded-xl p-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: '-100px' }}
            whileHover={{ boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)' }}
          >
            <div className="text-center">
              {/* Icon */}
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6"
                animate={{ scale: [1, 1.05, 1], rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MessageCircle size={40} className="text-white" />
              </motion.div>

              <h3 className="text-3xl font-bold text-primary-900 mb-4">
                Fale Conosco
              </h3>

              <p className="text-primary-600 text-lg mb-8 leading-relaxed">
                Clique no botão abaixo para iniciar uma conversa com nossos especialistas via WhatsApp. Responderemos em até 2 horas.
              </p>

              {/* WhatsApp Button */}
              <motion.a
                href="https://wa.me/5548988285002?text=Olá! Gostaria de solicitar um orçamento para meu projeto de construção. Poderia me enviar mais informações?"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-accent-500 to-accent-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-accent-600 hover:to-accent-700 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle size={24} />
                <span>Enviar Mensagem</span>
              </motion.a>

              {/* Phone Alternative */}
              <motion.div
                className="mt-6 pt-6 border-t border-primary-200"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <p className="text-primary-600 text-sm mb-3">Ou ligue direto:</p>
                <motion.a
                  href="tel:+5548988285002"
                  className="text-2xl font-bold text-accent-600 hover:text-accent-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  (48) 98828-5002
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div
          className="mt-16 pt-16 border-t border-white border-opacity-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-primary-200 text-lg mb-6">Confie em números:</p>
          <div className="grid grid-cols-3 gap-8 text-white">
            {[
              { number: '12+', text: 'Anos' },
              { number: '200+', text: 'Projetos' },
              { number: '100%', text: 'Satisfação' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-accent-400 mb-2">
                  {item.number}
                </div>
                <p className="text-primary-300">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
