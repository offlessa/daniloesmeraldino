import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const SWIPE = 60

interface LightboxProps {
  photos: { src: string }[]
  /** Foto aberta; null fecha o visualizador */
  index: number | null
  alt: string
  onChange: (index: number | null) => void
}

/** Foto em tela cheia com setas, teclado (← → Esc) e arrastar no celular. */
export default function Lightbox({ photos, index, alt, onChange }: LightboxProps) {
  const total = photos.length

  useEffect(() => {
    if (index === null) return
    const go = (dir: number) => onChange((index + dir + total) % total)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null)
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [index, total, onChange])

  // Já carrega a próxima foto para a troca ser imediata
  useEffect(() => {
    if (index === null) return
    new Image().src = photos[(index + 1) % total].src
  }, [index, photos, total])

  const go = (dir: number) => index !== null && onChange((index + dir + total) % total)

  const ARROW =
    'absolute top-1/2 -translate-y-1/2 z-10 w-12 h-12 hidden sm:flex items-center justify-center border border-sand/30 text-sand-light hover:bg-sand-light hover:text-olive transition-colors'

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Fotos — ${alt}`}
          className="fixed inset-0 z-[80] bg-olive-dark flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => onChange(null)}
        >
          <span className="absolute top-7 left-6 sm:left-10 font-serif text-lg text-sand-light">
            {String(index + 1).padStart(2, '0')}
            <span className="text-sand/50"> / {String(total).padStart(2, '0')}</span>
          </span>
          <button
            onClick={() => onChange(null)}
            aria-label="Fechar"
            className="absolute top-5 right-5 sm:right-10 z-10 w-12 h-12 border border-sand/30 text-sand-light flex items-center justify-center hover:border-sand-light transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.25} />
          </button>

          {total > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); go(-1) }}
                aria-label="Foto anterior"
                className={`${ARROW} left-4 sm:left-10`}
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={1.25} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); go(1) }}
                aria-label="Próxima foto"
                className={`${ARROW} right-4 sm:right-10`}
              >
                <ChevronRight className="w-5 h-5" strokeWidth={1.25} />
              </button>
            </>
          )}

          <AnimatePresence initial={false} mode="popLayout">
            <motion.img
              key={photos[index].src}
              src={photos[index].src}
              alt={alt}
              draggable={false}
              onClick={(e) => e.stopPropagation()}
              className="max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-12rem)] max-h-[calc(100vh-8rem)] object-contain select-none cursor-grab active:cursor-grabbing"
              drag={total > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -SWIPE) go(1)
                else if (info.offset.x > SWIPE) go(-1)
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
