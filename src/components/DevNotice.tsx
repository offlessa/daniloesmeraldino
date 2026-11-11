import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import BrickLoader from './BrickLoader'
import { EASE_OUT, INTRO_DELAY } from '../constants/motion'
import { IS_HOME } from '../route'

const STORAGE_KEY = 'aviso-site-em-desenvolvimento'

const wasDismissed = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

/** Aviso temporário de que o site ainda está em desenvolvimento (some ao fechar, até a próxima visita). */
export default function DevNotice() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (wasDismissed()) return
    // Na página inicial, espera a abertura com a logo terminar
    const t = setTimeout(() => setOpen(true), (IS_HOME ? INTRO_DELAY + 0.8 : 1) * 1000)
    return () => clearTimeout(t)
  }, [])

  const close = () => {
    setOpen(false)
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* navegação privada: o aviso só volta ao recarregar */
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          role="status"
          // À esquerda, deixando o canto direito livre para o botão do WhatsApp
          className="fixed z-[46] bottom-5 left-4 right-24 sm:right-auto sm:left-8 sm:bottom-8 sm:max-w-sm bg-white border border-sand shadow-xl shadow-olive-dark/10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          <div className="flex items-start gap-4 p-5 pr-12">
            <BrickLoader className="w-10 shrink-0 mt-1" />
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-olive">Site em desenvolvimento</p>
              <p className="mt-2 text-sm leading-relaxed text-primary-600">
                Estamos finalizando algumas páginas — alguns projetos ainda podem estar sem todas as fotos e
                informações.
              </p>
            </div>
          </div>
          <button
            onClick={close}
            aria-label="Fechar aviso"
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-primary-500 hover:text-olive transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
