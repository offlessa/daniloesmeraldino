import { motion, useReducedMotion } from 'framer-motion'

const BRICK = { w: 36, h: 14, gap: 3 }
const STEP = BRICK.w + BRICK.gap
const WIDTH = 3 * STEP - BRICK.gap
const ROWS = 3
const HEIGHT = ROWS * (BRICK.h + BRICK.gap) + 6

// Três fiadas em amarração (a do meio desloca meio tijolo), de baixo para cima
const BRICKS = Array.from({ length: ROWS }, (_, r) => {
  const y = HEIGHT - 6 - (r + 1) * (BRICK.h + BRICK.gap) + BRICK.gap
  if (r % 2 === 0) return [0, 1, 2].map((i) => ({ x: i * STEP, y, w: BRICK.w }))
  const half = (BRICK.w - BRICK.gap) / 2
  return [
    { x: 0, y, w: half },
    { x: half + BRICK.gap, y, w: BRICK.w },
    { x: half + BRICK.gap + STEP, y, w: BRICK.w },
    { x: WIDTH - half, y, w: half },
  ]
}).flat()

// Fração do ciclo usada para assentar todos os tijolos (o resto segura a parede pronta)
const BUILD = 0.6

/** Pequena parede que se monta tijolo por tijolo, segura um instante e recomeça. */
export default function BrickLoader({ duration = 3.2, className = '' }: { duration?: number; className?: string }) {
  const reduce = useReducedMotion()

  return (
    <svg
      viewBox={`-2 -2 ${WIDTH + 4} ${HEIGHT + 4}`}
      className={`w-28 h-auto ${className}`}
      role="img"
      aria-label="Parede de tijolos sendo construída"
    >
      <rect x={-2} y={HEIGHT - 4} width={WIDTH + 4} height={4} className="fill-olive" />
      {BRICKS.map((b, i) => {
        const at = (i / BRICKS.length) * BUILD
        return (
          <motion.rect
            key={i}
            x={b.x}
            y={b.y}
            width={b.w}
            height={BRICK.h}
            className="fill-sand stroke-olive/50"
            strokeWidth={1}
            initial={reduce ? false : { opacity: 0, y: -10 }}
            animate={reduce ? undefined : { opacity: [0, 0, 1, 1, 0], y: [-10, -10, 0, 0, 0] }}
            transition={{ duration, ease: 'easeOut', times: [0, at, at + 0.06, 0.9, 1], repeat: Infinity }}
          />
        )
      })}
    </svg>
  )
}
