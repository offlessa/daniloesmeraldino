import { motion } from 'framer-motion'
import { MessageCircle, CheckCircle2, Phone } from 'lucide-react'

const features = [
  'Consulta totalmente gratuita',
  'Sem compromisso',
  'Resposta rápida',
  'Orçamento personalizado',
]

export default function CTA() {
  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 bg-accent-900 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-accent-400 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-accent-500 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <span className="inline-block text-accent-300 text-xs font-bold tracking-widest uppercase mb-4">
              Vamos Começar?
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Transforme Seu Projeto em Realidade
            </h2>
            <p className="text-white/60 text-lg mb-10 leading-relaxed">
              Não espere mais. Solicite agora uma consulta gratuita com nossos especialistas e
              descubra como podemos elevar seu projeto a um novo patamar.
            </p>

            <div className="space-y-4">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <CheckCircle2 size={20} className="text-accent-400 flex-shrink-0" />
                  <span className="text-white/75 font-medium">{f}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right card */}
          <motion.div
            className="bg-white rounded-3xl p-10 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle size={28} className="text-accent-600" />
              </div>

              <h3 className="font-serif text-2xl font-bold text-primary-900 mb-3">
                Fale Conosco
              </h3>
              <p className="text-primary-600 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
                Clique no botão abaixo para iniciar uma conversa com nossos especialistas via
                WhatsApp. Respondemos em até 2 horas.
              </p>

              <motion.a
                href="https://wa.me/5548988285002?text=Olá! Gostaria de solicitar um orçamento para meu projeto de construção. Poderia me enviar mais informações?"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-accent-600 hover:bg-accent-700 text-white px-8 py-4 rounded-full font-bold text-base transition-colors shadow-lg shadow-accent-900/15"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <MessageCircle size={20} />
                Enviar Mensagem
              </motion.a>

              <div className="mt-8 pt-7 border-t border-primary-100 text-center">
                <p className="text-primary-400 text-xs mb-2">Ou ligue diretamente:</p>
                <motion.a
                  href="tel:+5548988285002"
                  className="inline-flex items-center gap-2 text-xl font-bold text-accent-600 hover:text-accent-700 transition-colors"
                  whileHover={{ scale: 1.03 }}
                >
                  <Phone size={18} />
                  (48) 98828-5002
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust numbers */}
        <motion.div
          className="mt-20 pt-10 border-t border-white/10 grid grid-cols-3 gap-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {[
            { number: '12+', text: 'Anos de Mercado' },
            { number: '200+', text: 'Projetos Entregues' },
            { number: '100%', text: 'Satisfação' },
          ].map((item, i) => (
            <div key={i}>
              <p className="text-3xl font-bold text-accent-400 mb-1">{item.number}</p>
              <p className="text-white/35 text-xs uppercase tracking-wider">{item.text}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
