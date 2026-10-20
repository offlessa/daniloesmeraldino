import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ParallaxRectProps {
  /** Posição e tamanho (classes Tailwind) — o pai precisa ser `relative` */
  className: string
  /** Deslocamento vertical em px ao longo da rolagem (positivo = sobe mais rápido) */
  speed?: number
  /** Apenas contorno, em vez de bloco sólido */
  outline?: boolean
  /** Direção em que o retângulo "cresce" ao entrar na tela */
  grow?: 'top' | 'bottom' | 'left' | 'right'
}

export default function ParallaxRect({
  className,
  speed = 80,
  outline = false,
  grow = 'top',
}: ParallaxRectProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed])
  const reveal = useTransform(scrollYProgress, [0.05, 0.4], [0, 1])
  const vertical = grow === 'top' || grow === 'bottom'

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute ${
        outline ? 'border border-olive/50' : 'bg-olive'
      } ${className}`}
      style={{
        y,
        [vertical ? 'scaleY' : 'scaleX']: reveal,
        transformOrigin: grow,
      }}
    />
  )
}
