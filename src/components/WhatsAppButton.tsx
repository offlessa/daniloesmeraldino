import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { whatsappUrl } from '../constants/social'

const SHOW_AFTER = 400
const STORAGE_KEY = 'whatsapp-button-offset'
// Deslocamento mínimo para contar como arrasto (abaixo disso é clique)
const DRAG_THRESHOLD = 6
// Distância mínima das bordas da tela
const MARGIN = 12

type Offset = { x: number; y: number }

const loadOffset = (): Offset => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    if (typeof saved?.x === 'number' && typeof saved?.y === 'number') return saved
  } catch {
    /* sem acesso ao armazenamento: começa no canto */
  }
  return { x: 0, y: 0 }
}

/** Botão fixo do WhatsApp: aparece depois que a pessoa começa a rolar e pode ser arrastado. */
export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const offset = useRef<Offset>(loadOffset())
  const drag = useRef<{
    startX: number
    startY: number
    from: Offset
    moved: boolean
    // Velocidade do ponteiro (px/ms), para "jogar" o botão ao soltar
    vx: number
    vy: number
    lastX: number
    lastY: number
    lastT: number
  } | null>(null)
  const dragged = useRef(false)
  const glide = useRef(0)

  // Faixa de deslocamento em que o botão fica inteiro na tela (sem contar a barra de rolagem)
  const limits = () => {
    const r = box.current!.getBoundingClientRect()
    const { x, y } = offset.current
    const w = document.documentElement.clientWidth
    const h = document.documentElement.clientHeight
    return {
      minX: x + MARGIN - r.left,
      maxX: x + w - MARGIN - r.right,
      minY: y + MARGIN - r.top,
      maxY: y + h - MARGIN - r.bottom,
    }
  }

  const clamp = (o: Offset, l = limits()): Offset => ({
    x: Math.min(l.maxX, Math.max(l.minX, o.x)),
    y: Math.min(l.maxY, Math.max(l.minY, o.y)),
  })

  // Move direto pelo estilo, sem passar pelo React: acompanha o dedo/mouse sem atraso
  const place = (o: Offset) => {
    offset.current = o
    if (box.current) box.current.style.transform = `translate3d(${o.x}px, ${o.y}px, 0)`
  }

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(offset.current))
    } catch {
      /* navegação privada: só não lembra a posição */
    }
  }

  // Mantém o botão dentro da tela (posição salva de uma tela maior, rotação do celular…)
  const clampToScreen = () => {
    if (box.current) place(clamp(offset.current))
  }

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', clampToScreen)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', clampToScreen)
      cancelAnimationFrame(glide.current)
    }
  }, [])

  useEffect(() => {
    if (!visible) return
    place(offset.current)
    clampToScreen()
  }, [visible])

  const onPointerMove = (e: PointerEvent) => {
    const d = drag.current
    if (!d || !box.current) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (!d.moved) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return
      d.moved = true
      dragged.current = true
      // A partir daqui o botão "segura" o ponteiro: continua recebendo o movimento e o soltar
      // mesmo se o mouse sair da janela. (Antes disso não segura, para o clique chegar ao link.)
      try {
        box.current.setPointerCapture(e.pointerId)
      } catch {
        /* ponteiro já liberado */
      }
    }
    const now = performance.now()
    const dt = Math.max(1, now - d.lastT)
    // Média suave da velocidade dos últimos movimentos
    d.vx = d.vx * 0.6 + ((e.clientX - d.lastX) / dt) * 0.4
    d.vy = d.vy * 0.6 + ((e.clientY - d.lastY) / dt) * 0.4
    d.lastX = e.clientX
    d.lastY = e.clientY
    d.lastT = now
    place(clamp({ x: d.from.x + dx, y: d.from.y + dy }))
  }

  // Ao soltar com velocidade, o botão desliza nessa direção e para encostado na borda
  const throwButton = (vx: number, vy: number) => {
    let last = performance.now()
    const step = (now: number) => {
      if (!box.current) return save()
      const dt = Math.min(32, now - last)
      last = now
      const l = limits()
      const next = clamp({ x: offset.current.x + vx * dt, y: offset.current.y + vy * dt }, l)
      // Bateu na borda: para naquela direção
      if (next.x === l.minX || next.x === l.maxX) vx = 0
      if (next.y === l.minY || next.y === l.maxY) vy = 0
      place(next)
      const friction = Math.pow(0.94, dt / 16)
      vx *= friction
      vy *= friction
      if (Math.hypot(vx, vy) > 0.05) glide.current = requestAnimationFrame(step)
      else save()
    }
    glide.current = requestAnimationFrame(step)
  }

  const onPointerUp = () => {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
    const d = drag.current
    drag.current = null
    if (!d?.moved) return
    // Movimento parado há um tempo antes de soltar: não joga
    const still = performance.now() - d.lastT > 80
    if (!still && Math.hypot(d.vx, d.vy) > 0.4) throwButton(d.vx * 1.4, d.vy * 1.4)
    else save()
  }

  // Acompanha o ponteiro pela janela toda (e não só sobre o botão)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || !box.current) return
    cancelAnimationFrame(glide.current)
    dragged.current = false
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      from: offset.current,
      moved: false,
      vx: 0,
      vy: 0,
      lastX: e.clientX,
      lastY: e.clientY,
      lastT: performance.now(),
    }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
  }

  return (
    <AnimatePresence>
      {visible && (
        <div
          key="whatsapp"
          ref={box}
          className="fixed z-[45] bottom-5 right-5 sm:bottom-8 sm:right-8 touch-none select-none cursor-grab active:cursor-grabbing will-change-transform"
          onPointerDown={onPointerDown}
        >
          <motion.a
            href={whatsappUrl('Olá! Vim através do site e gostaria de falar com o estúdio.')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Conversar pelo WhatsApp (arraste para mudar de lugar)"
            draggable={false}
            className="group relative block cursor-[inherit]"
            onClick={(e) => {
              // Soltar depois de arrastar não abre o WhatsApp
              if (dragged.current) e.preventDefault()
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <span className="hidden sm:block absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap bg-white border border-sand px-4 py-2 text-[10px] tracking-[0.3em] uppercase text-olive opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
              Fale conosco
            </span>
            <span className="w-14 h-14 rounded-full bg-olive text-sand-light shadow-lg shadow-olive-dark/25 flex items-center justify-center group-hover:bg-olive-dark transition-colors">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </span>
          </motion.a>
        </div>
      )}
    </AnimatePresence>
  )
}
