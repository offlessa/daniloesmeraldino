import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/** Abertura: a logo original aparece e some suavemente. */
export default function Preloader() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => {
      setDone(true)
      document.body.style.overflow = ''
    }, 1600)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          <motion.img
            src="/images/danilo-esmeraldino-logo.png"
            alt="Estúdio Danilo Esmeraldino"
            className="h-16 sm:h-20 w-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
