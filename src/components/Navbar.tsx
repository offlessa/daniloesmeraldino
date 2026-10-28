import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Facebook, Instagram, Linkedin, X } from 'lucide-react'
import { INTRO_DELAY } from '../constants/motion'
import { IS_HOME } from '../route'
import { social } from '../constants/social'
import { projectsUrl, type ProjectFilter } from '../data/projects'
import QuoteModal from './QuoteModal'

const navItems = [
  { label: 'Projetos', id: 'portfolio' },
  { label: 'Processo', id: 'process' },
  { label: 'Sobre', id: 'about' },
  { label: 'Depoimentos', id: 'testimonials' },
]

// Menu em tela cheia: projetos à esquerda, demais seções à direita
const projectLinks: { label: string; filter: ProjectFilter }[] = [
  { label: 'Residencial', filter: 'residencial' },
  { label: 'Comercial', filter: 'comercial' },
  { label: 'Interiores', filter: 'interiores' },
  { label: 'Concluídos', filter: 'concluido' },
  { label: 'Em andamento', filter: 'andamento' },
]

const menuItems = [
  { label: 'Escritório', id: 'about' },
  { label: 'Processo', id: 'process' },
  { label: 'Depoimentos', id: 'testimonials' },
  { label: 'Contato', id: 'contact' },
]

const SOCIAL_ICON = { Instagram, Facebook, LinkedIn: Linkedin }

const MENU_TITLE =
  'text-3xl sm:text-4xl lg:text-5xl font-medium tracking-[0.12em] uppercase text-sand-light hover:text-white transition-colors'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const closeQuote = useCallback(() => setQuoteOpen(false), [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    setIsOpen(false)
    const el = document.getElementById(id)
    // Fora da página inicial (ex.: /projetos), volta para ela já na seção
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    else window.location.href = id === 'hero' ? '/' : `/#${id}`
  }

  const showProjects = (filter: ProjectFilter) => {
    window.location.href = projectsUrl(filter)
  }

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
          isScrolled ? 'bg-white/85 backdrop-blur-md border-b border-sand' : 'bg-transparent'
        }`}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: IS_HOME ? INTRO_DELAY : 0, duration: 0.8 }}
      >
        <div
          className={`flex justify-between items-center px-6 sm:px-10 lg:px-20 transition-all duration-500 ${
            isScrolled ? 'h-20' : 'h-28'
          }`}
        >
          <button onClick={() => scrollToSection('hero')} aria-label="Início">
            <img
              src="/images/danilo-esmeraldino-logo.png"
              alt="Danilo Esmeraldino"
              className={`w-auto transition-all duration-500 ${
                isScrolled ? 'h-9 sm:h-10' : 'h-11 sm:h-14'
              }`}
            />
          </button>

          <div className="flex items-center gap-10">
            <nav className="hidden lg:flex items-center gap-9">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="group relative text-[11px] tracking-[0.3em] uppercase text-olive"
                >
                  {item.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-full bg-olive scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left transition-transform duration-500" />
                </button>
              ))}
            </nav>

            <button
              onClick={() => setQuoteOpen(true)}
              className="hidden md:inline-flex text-[11px] tracking-[0.3em] uppercase bg-olive text-sand-light px-6 py-3 hover:bg-olive-dark transition-colors"
            >
              Orçamento
            </button>

            {/* Botão do menu */}
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Abrir menu"
              className="w-12 h-12 border border-sand bg-white flex flex-col items-center justify-center gap-[7px]"
            >
              <span className="block h-px w-6 bg-olive" />
              <span className="block h-px w-4 self-end mr-3 bg-olive" />
              <span className="block h-px w-6 bg-olive" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Menu em tela cheia */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className="fixed inset-0 z-50 bg-olive text-sand overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Fechar menu"
              className="absolute top-6 right-6 sm:right-10 lg:right-20 w-12 h-12 border border-sand/50 text-sand-light flex items-center justify-center hover:border-sand-light transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={1.25} />
            </button>

            <div className="min-h-full flex flex-col px-6 sm:px-10 lg:px-20 pt-36 pb-12">
              <div className="flex-1 grid md:grid-cols-2 gap-16 md:gap-8 content-center text-center max-w-5xl w-full mx-auto">
                {/* Projetos e seus grupos */}
                <div>
                  <button onClick={() => showProjects('todos')} className={MENU_TITLE}>
                    Projetos
                  </button>
                  <ul className="mt-8 space-y-4">
                    {projectLinks.map((item) => (
                      <li key={item.filter}>
                        <button
                          onClick={() => showProjects(item.filter)}
                          className="text-xs sm:text-sm tracking-[0.3em] uppercase text-sand hover:text-white transition-colors"
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <ul className="space-y-7 md:space-y-9">
                  {menuItems.map((item) => (
                    <li key={item.id}>
                      <button onClick={() => scrollToSection(item.id)} className={MENU_TITLE}>
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-16 flex justify-center">
                <button
                  onClick={() => {
                    setIsOpen(false)
                    setQuoteOpen(true)
                  }}
                  className="border border-sand/50 px-8 py-4 text-[11px] tracking-[0.3em] uppercase text-sand-light hover:bg-sand-light hover:text-olive transition-colors"
                >
                  Solicitar orçamento
                </button>
              </div>

              <div className="mt-10 flex justify-center gap-5">
                {social.map((s) => {
                  const Icon = SOCIAL_ICON[s.label]
                  return (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="w-10 h-10 rounded-full bg-sand/20 text-sand-light flex items-center justify-center hover:bg-sand hover:text-olive transition-colors"
                    >
                      <Icon className="w-4 h-4" strokeWidth={1.75} />
                    </a>
                  )
                })}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <QuoteModal open={quoteOpen} onClose={closeQuote} />
    </>
  )
}
