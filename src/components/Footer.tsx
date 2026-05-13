import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, ArrowUp } from 'lucide-react'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentYear = new Date().getFullYear()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <footer className="bg-primary-900 text-white pt-20 pb-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-600 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Brand */}
          <motion.div variants={itemVariants}>
            <div className="mb-4">
              <img src="/images/danilo-esmeraldino-logo.png" alt="Danilo Esmeraldino Logo" className="h-20 w-auto" />
            </div>
            <p className="text-primary-300 leading-relaxed mb-4">
              Especializando-me em soluções que transformam visões em realidade.
            </p>
            <div className="flex items-center space-x-4">
              {[
                { icon: Facebook, url: 'https://facebook.com/notivuss/' },
                { icon: Instagram, url: 'https://instagram.com/daniloesmeraldino' },
                { icon: Linkedin, url: 'https://linkedin.com/in/danilo-de-pieri-esmeraldino-647876118?original_referer=https%3A%2F%2Fwww.google.com%2F' },
              ].map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-accent-600 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={18} />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-6">Links Rápidos</h4>
            <nav className="space-y-3">
              {[
                { label: 'Início', href: '#hero' },
                { label: 'Diferenciais', href: '#authority' },
                { label: 'Portfólio', href: '#portfolio' },
                { label: 'Processo', href: '#process' },
                { label: 'Sobre', href: '#about' },
              ].map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  className="text-primary-300 hover:text-accent-400 transition-colors flex items-center space-x-2"
                  whileHover={{ x: 5 }}
                >
                  <span>→</span>
                  <span>{link.label}</span>
                </motion.a>
              ))}
            </nav>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-6">Serviços</h4>
            <nav className="space-y-3">
              {[
                'Projetos Residenciais',
                'Projetos Comerciais',
                'Gerenciamento de Obras',
                'Reformas',
                'Projetos de Interiores',
              ].map((service, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="text-primary-300 hover:text-accent-400 transition-colors flex items-center space-x-2"
                  whileHover={{ x: 5 }}
                >
                  <span>→</span>
                  <span>{service}</span>
                </motion.a>
              ))}
            </nav>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-6">Contato</h4>
            <div className="space-y-4">
              <motion.a
                href="tel:+5548988285002"
                className="flex items-start space-x-3 text-primary-300 hover:text-accent-400 transition-colors"
                whileHover={{ x: 5 }}
              >
                <Phone size={20} className="flex-shrink-0 mt-1" />
                <span>(48) 98828-5002</span>
              </motion.a>

              <motion.a
                href="mailto:danilo.esmeraldino@gmail.com.br"
                className="flex items-start space-x-3 text-primary-300 hover:text-accent-400 transition-colors"
                whileHover={{ x: 5 }}
              >
                <Mail size={20} className="flex-shrink-0 mt-1" />
                <span>danilo.esmeraldino@gmail.com.br</span>
              </motion.a>

              <motion.a
                href="#"
                className="flex items-start space-x-3 text-primary-300 hover:text-accent-400 transition-colors"
                whileHover={{ x: 5 }}
              >
                <MapPin size={20} className="flex-shrink-0 mt-1" />
                <div>
                  <p>R. Padre Geraldo Spettmann, 326 - sala B - Humaitá</p>
                  <p>Tubarão - SC 88704-410</p>
                </div>
              </motion.a>
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="border-t border-white border-opacity-10 my-12"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        ></motion.div>

        {/* Bottom Section */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="text-primary-300">
              © {currentYear} Danilo Esmeraldino. Todos os direitos reservados.
            </p>
            <p className="text-sm text-primary-400">
              Desenvolvido com dedicação para sua confiança.
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex items-center space-x-6 text-sm text-primary-400">
            <a href="#" className="hover:text-accent-400 transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="hover:text-accent-400 transition-colors">
              Termos de Serviço
            </a>
          </div>

          {/* Scroll to Top */}
          <motion.button
            onClick={scrollToTop}
            className="w-12 h-12 bg-accent-600 rounded-full flex items-center justify-center hover:bg-accent-700 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            <ArrowUp size={24} />
          </motion.button>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute bottom-0 right-0 w-40 h-40 bg-accent-600 rounded-full opacity-5 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.1, 1], y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      ></motion.div>
    </footer>
  )
}
