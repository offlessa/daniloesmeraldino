import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { label: 'Início', id: 'hero' },
  { label: 'Diferencial', id: 'authority' },
  { label: 'Portfólio', id: 'portfolio' },
  { label: 'Processo', id: 'process' },
  { label: 'Sobre', id: 'about' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setIsOpen(false)
  }

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-primary-100'
          : 'bg-transparent'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.button onClick={() => scrollToSection('hero')} whileHover={{ scale: 1.02 }}>
            <img
              src="/images/danilo-esmeraldino-logo.png"
              alt="Danilo Esmeraldino"
              className="h-14 w-auto"
            />
          </motion.button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative text-sm font-medium tracking-wide transition-colors group ${
                  isScrolled
                    ? 'text-primary-700 hover:text-accent-600'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {item.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent-500 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <motion.a
              href="https://wa.me/5548988285002?text=Olá! Gostaria de solicitar um orçamento"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden md:flex items-center px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                isScrolled
                  ? 'bg-accent-600 text-white hover:bg-accent-700'
                  : 'bg-white/15 backdrop-blur-sm text-white border border-white/30 hover:bg-white/25'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Orçamento Gratuito
            </motion.a>

            <button
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isScrolled
                  ? 'text-primary-900 hover:bg-primary-100'
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden bg-white border-t border-primary-100 rounded-b-2xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="px-4 py-5 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left px-4 py-3 rounded-xl text-primary-700 hover:bg-accent-50 hover:text-accent-700 font-medium transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <a
                  href="https://wa.me/5548988285002?text=Olá! Gostaria de solicitar um orçamento"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center mt-3 bg-accent-600 text-white px-4 py-3 rounded-full font-semibold text-sm hover:bg-accent-700 transition-colors"
                >
                  Orçamento Gratuito
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
