import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion } from 'framer-motion'
import logo from '../assets/danilo-esmeraldino-logo.png'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
    setIsOpen(false)
  }

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg'
          : 'bg-transparent'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <img src={logo} alt="Danilo Esmeraldino Logo" className="h-16 w-auto" />
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {[
              { label: 'Início', id: 'hero' },
              { label: 'Diferencial', id: 'authority' },
              { label: 'Portfólio', id: 'portfolio' },
              { label: 'Processo', id: 'process' },
              { label: 'Sobre', id: 'about' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`font-medium transition-colors ${isScrolled ? 'text-primary-700 hover:text-accent-600' : 'text-white hover:text-accent-400'}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <motion.a
            href="https://wa.me/554832345678?text=Olá! Gostaria de solicitar um orçamento"
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden md:flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${isScrolled ? 'bg-accent-600 text-white hover:bg-accent-700' : 'bg-white text-accent-600 hover:bg-primary-100'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Orçamento</span>
          </motion.a>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden ${isScrolled ? 'text-primary-900' : 'text-white'}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            className="md:hidden bg-white border-t border-primary-200"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="px-4 py-4 space-y-3">
              {[
                { label: 'Início', id: 'hero' },
                { label: 'Diferencial', id: 'authority' },
                { label: 'Portfólio', id: 'portfolio' },
                { label: 'Processo', id: 'process' },
                { label: 'Sobre', id: 'about' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left text-primary-700 hover:text-accent-600 font-medium py-2"
                >
                  {item.label}
                </button>
              ))}
              <a
                href="https://wa.me/554832345678?text=Olá! Gostaria de solicitar um orçamento"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-accent-600 text-white px-4 py-3 rounded-lg font-semibold text-center hover:bg-accent-700 mt-4"
              >
                Solicitar Orçamento
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
