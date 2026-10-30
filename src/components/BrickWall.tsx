import { useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, type MotionValue } from 'framer-motion'

// Desenho em coordenadas do viewBox (1200 × 220)
const WALL = { left: 40, right: 1160 }
const GROUND_Y = 204
const BRICK = { w: 56, h: 20, gap: 4 }
const ROWS = 6
const ROW_STEP = BRICK.h + BRICK.gap
const TOP_Y = GROUND_Y - BRICK.gap - ROWS * ROW_STEP + BRICK.gap // topo da última fiada

// Vãos deixados na alvenaria: porta e janela, perto do centro para caberem inteiros
// no recorte estreito do celular
const OPENINGS = [
  { x1: 380, x2: 460, fromRow: 0, toRow: 3 },
  { x1: 640, x2: 820, fromRow: 2, toRow: 4 },
]

// Etapas da obra ao longo do progresso (0 → 1)
const FOUNDATION_AT = 0.04
const BRICKS_FROM = 0.1
const BRICKS_TO = 0.82
const ROOF_AT = 0.88
const FINISH_AT = 0.95

type Brick = { x: number; y: number; w: number }

const rowY = (r: number) => GROUND_Y - BRICK.gap - BRICK.h - r * ROW_STEP

/** Pedaços de [a, b] que não caem dentro de um vão nesta fiada */
const cutOpenings = (a: number, b: number, row: number): [number, number][] =>
  OPENINGS.filter((o) => row >= o.fromRow && row <= o.toRow).reduce<[number, number][]>(
    (parts, o) =>
      parts.flatMap(([s, e]) => {
        if (e <= o.x1 || s >= o.x2) return [[s, e]]
        const out: [number, number][] = []
        if (s < o.x1) out.push([s, o.x1 - BRICK.gap / 2])
        if (e > o.x2) out.push([o.x2 + BRICK.gap / 2, e])
        return out
      }),
    [[a, b]]
  )

// Assentamento em amarração: cada fiada desloca meio tijolo; ordem = de baixo para cima, da esquerda para a direita
const BRICKS: Brick[] = Array.from({ length: ROWS }, (_, r) => {
  const step = BRICK.w + BRICK.gap
  const start = WALL.left - (r % 2 ? step / 2 : 0)
  const row: Brick[] = []
  for (let x = start; x < WALL.right; x += step) {
    const a = Math.max(x, WALL.left)
    const b = Math.min(x + BRICK.w, WALL.right)
    for (const [s, e] of cutOpenings(a, b, r)) if (e - s >= 10) row.push({ x: s, y: rowY(r), w: e - s })
  }
  return row
}).flat()

/** Quantos tijolos já estão assentados nesse ponto da rolagem */
const builtAt = (p: number) =>
  Math.round(Math.min(1, Math.max(0, (p - BRICKS_FROM) / (BRICKS_TO - BRICKS_FROM))) * BRICKS.length)

/**
 * Parede que sobe fiada por fiada conforme a rolagem: fundação, alvenaria com os vãos
 * de porta e janela, e por fim a laje que fecha a casa.
 */
export default function BrickWall({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion()
  const [p, setP] = useState(() => (reduce ? 1 : progress.get()))
  useMotionValueEvent(progress, 'change', (v) => {
    if (!reduce) setP(v)
  })

  const built = builtAt(p)
  const drop = { initial: { opacity: 0, y: -14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } }

  return (
    <svg
      viewBox="0 0 1200 220"
      preserveAspectRatio="xMidYMax slice"
      className="w-full h-32 sm:h-40 lg:h-48"
      role="img"
      aria-label="Parede de tijolos sendo construída"
    >
      {/* Fundação */}
      {p >= FOUNDATION_AT && (
        <motion.rect
          x={WALL.left - 14}
          y={GROUND_Y}
          width={WALL.right - WALL.left + 28}
          height={10}
          className="fill-olive"
          style={{ originX: 0 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6 }}
        />
      )}

      {/* Alvenaria */}
      {BRICKS.slice(0, built).map((b) => (
        <motion.rect
          key={`${b.x}-${b.y}`}
          x={b.x}
          y={b.y}
          width={b.w}
          height={BRICK.h}
          className="fill-sand stroke-olive/50"
          strokeWidth={1}
          {...drop}
        />
      ))}

      {/* Laje: fecha a casa */}
      {p >= ROOF_AT && (
        <motion.rect
          x={WALL.left - 40}
          y={TOP_Y - 16}
          width={WALL.right - WALL.left + 80}
          height={12}
          className="fill-olive"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Esquadrias nos vãos, com a casa pronta */}
      {p >= FINISH_AT &&
        OPENINGS.map((o) => (
          <motion.rect
            key={o.x1}
            x={o.x1 + 6}
            y={rowY(o.toRow) + 4}
            width={o.x2 - o.x1 - 12}
            height={rowY(o.fromRow) + BRICK.h - rowY(o.toRow) - (o.fromRow === 0 ? 4 : 8)}
            className="fill-none stroke-olive"
            strokeWidth={1.5}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        ))}
    </svg>
  )
}
