import { motion } from 'framer-motion'
import { INTRO_DELAY, EASE_OUT } from '../constants/motion'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen grid lg:grid-cols-12 gap-12 lg:gap-8 items-center px-6 sm:px-10 lg:px-20 pt-36 pb-20 lg:pt-32 lg:pb-16"
    >
      {/* Texto */}
      <motion.div
        className="lg:col-span-5 relative z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: INTRO_DELAY, duration: 1, ease: EASE_OUT }}
      >
        <h1 className="font-serif text-[2.75rem] sm:text-6xl xl:text-7xl leading-[1.05] text-olive">
          Arquitetura que <em className="text-olive-light">traduz quem</em> você é.
        </h1>

        <p className="mt-10 max-w-md text-base sm:text-lg leading-relaxed text-primary-700">
          Projetos residenciais, comerciais e de interiores de alto padrão em Tubarão — SC, da
          concepção à entrega da obra.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-8">
          <a
            href="#portfolio"
            className="inline-flex items-center bg-olive text-sand-light px-8 py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-olive-dark transition-colors"
          >
            Ver projetos
          </a>
          <a href="#contact" className="link-underline text-[11px] tracking-[0.3em] uppercase">
            Fale conosco
          </a>
        </div>
      </motion.div>

      {/* Imagem */}
      <div className="lg:col-span-7 relative">
        <motion.div
          aria-hidden
          className="absolute -left-4 sm:-left-8 -bottom-8 w-1/3 h-1/2 bg-olive"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: INTRO_DELAY + 0.4, duration: 1 }}
        />
        <motion.div
          className="relative overflow-hidden aspect-[4/5] sm:aspect-[4/3] lg:aspect-auto lg:h-[76vh] bg-sand-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: INTRO_DELAY + 0.15, duration: 1.2 }}
        >
          <img
            src="/images/web/hero-background.jpg"
            alt="Casa Lago — Estúdio Danilo Esmeraldino"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <p className="absolute bottom-0 right-0 bg-white px-5 py-3 text-[10px] tracking-[0.3em] uppercase text-olive">
            Casa Lago · 2024
          </p>
        </motion.div>
      </div>
    </section>
  )
}
