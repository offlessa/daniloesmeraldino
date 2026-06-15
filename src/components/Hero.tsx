import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const stats = [
  { number: '12+', label: 'Anos de Experiência' },
  { number: '200+', label: 'Projetos Concluídos' },
  { number: '100%', label: 'Satisfação' },
  { number: '10+', label: 'Profissionais' },
]

export default function Hero() {
  const scrollToNext = () => {
    document.getElementById('authority')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="relative w-full h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-background.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/85" />

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-accent-400/40 bg-accent-900/30 backdrop-blur-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
          <span className="text-accent-300 text-sm font-medium tracking-widest uppercase">
            Arquitetura · Construção · Inovação
          </span>
        </motion.div>

        <motion.h1
          className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-6 leading-none tracking-tight"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Projetos de{' '}
          <span className="block text-accent-400">Alto Padrão</span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-white/65 mb-10 font-light max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Projetos residenciais, comerciais e de interiores com excelência e comprometimento em Tubarão&nbsp;—&nbsp;SC
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.a
            href="https://wa.me/5548988285002?text=Olá! Gostaria de solicitar um orçamento para meu projeto de construção."
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-accent-600 hover:bg-accent-500 text-white rounded-full font-semibold text-base transition-all shadow-lg shadow-accent-900/30"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Solicitar Orçamento
          </motion.a>
          <motion.button
            onClick={scrollToNext}
            className="px-8 py-4 border border-white/30 text-white rounded-full font-semibold text-base hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Saiba Mais
          </motion.button>
        </motion.div>

        <motion.button
          onClick={scrollToNext}
          className="mt-14 text-white/30 hover:text-accent-400 transition-colors"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={28} />
        </motion.button>
      </div>

      {/* Stats Bar */}
      <motion.div
        className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <div className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          {stats.map((stat, i) => (
            <div key={i} className="text-center px-4">
              <p className="text-2xl font-bold text-accent-400">{stat.number}</p>
              <p className="text-xs text-white/40 mt-0.5 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
