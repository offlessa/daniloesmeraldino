import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, ArrowUp } from 'lucide-react'

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary-900 text-white relative overflow-hidden">
      {/* Top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-accent-800 via-accent-500 to-accent-800" />

      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-800 rounded-full blur-3xl opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10">
        {/* Main grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          {/* Brand */}
          <div>
            <img
              src="/images/danilo-esmeraldino-logo.png"
              alt="Danilo Esmeraldino"
              className="h-16 w-auto mb-5"
            />
            <p className="text-primary-400 text-sm leading-relaxed mb-6">
              Especializados em soluções que transformam visões em realidade.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, url: 'https://facebook.com/notivuss/' },
                { icon: Instagram, url: 'https://instagram.com/daniloesmeraldino' },
                {
                  icon: Linkedin,
                  url: 'https://linkedin.com/in/danilo-de-pieri-esmeraldino-647876118?original_referer=https%3A%2F%2Fwww.google.com%2F',
                },
              ].map((s, i) => {
                const Icon = s.icon
                return (
                  <motion.a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-accent-600 hover:border-accent-600 transition-all"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Icon size={16} />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-5">
              Navegação
            </h4>
            <nav className="space-y-3">
              {[
                { label: 'Início', href: '#hero' },
                { label: 'Diferenciais', href: '#authority' },
                { label: 'Portfólio', href: '#portfolio' },
                { label: 'Processo', href: '#process' },
                { label: 'Sobre', href: '#about' },
              ].map((link, i) => (
                <motion.a
                  key={i}
                  href={link.href}
                  className="block text-primary-400 hover:text-accent-400 text-sm transition-colors"
                  whileHover={{ x: 4 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-5">
              Serviços
            </h4>
            <div className="space-y-3">
              {[
                'Projetos Residenciais',
                'Projetos Comerciais',
                'Gerenciamento de Obras',
                'Reformas',
                'Projetos de Interiores',
              ].map((service, i) => (
                <p key={i} className="text-primary-400 text-sm">
                  {service}
                </p>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-5">
              Contato
            </h4>
            <div className="space-y-4">
              <motion.a
                href="tel:+5548988285002"
                className="flex items-center gap-3 text-primary-400 hover:text-accent-400 transition-colors text-sm"
                whileHover={{ x: 4 }}
              >
                <Phone size={15} className="flex-shrink-0 text-accent-600" />
                (48) 98828-5002
              </motion.a>
              <motion.a
                href="mailto:danilo.esmeraldino@gmail.com.br"
                className="flex items-center gap-3 text-primary-400 hover:text-accent-400 transition-colors text-sm"
                whileHover={{ x: 4 }}
              >
                <Mail size={15} className="flex-shrink-0 text-accent-600" />
                danilo.esmeraldino@gmail.com.br
              </motion.a>
              <div className="flex items-start gap-3 text-primary-400 text-sm">
                <MapPin size={15} className="flex-shrink-0 text-accent-600 mt-0.5" />
                <span>
                  R. Padre Geraldo Spettmann, 326 - sala B - Humaitá, Tubarão - SC 88704-410
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-white/5 mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-500 text-xs">
            © {currentYear} Danilo Esmeraldino. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6 text-xs text-primary-500">
            <a href="#" className="hover:text-accent-400 transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="hover:text-accent-400 transition-colors">
              Termos de Serviço
            </a>
          </div>
          <motion.button
            onClick={scrollToTop}
            className="w-10 h-10 bg-accent-600 rounded-xl flex items-center justify-center hover:bg-accent-500 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp size={18} />
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
