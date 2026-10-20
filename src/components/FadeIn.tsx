import { motion } from 'framer-motion'
import { EASE_OUT } from '../constants/motion'

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

/** Entrada padrão do site: leve subida com fade ao aparecer na tela. */
export default function FadeIn({ children, className = '', delay = 0 }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}
