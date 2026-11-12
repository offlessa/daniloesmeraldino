import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FadeIn from './FadeIn'
import { CITIES, DEFAULT_LOCATION, parseLocation } from '../data/locations'
import { projectSlug, projectUrl, type Project } from '../data/projects'
import { useSiteData } from '../data/store'
import { srcSet } from '../lib/images'

type MapData = {
  w: number
  h: number
  west: number
  north: number
  k: number
  cos: number
  states: string[]
  cities: Record<string, { name: string; d: string; c: [number, number] }>
}

// Cidades de referência com nome no mapa (as outras aparecem só pelo contorno)
const LANDMARKS = [
  'itajai-sc',
  'blumenau-sc',
  'florianopolis-sc',
  'lages-sc',
  'garopaba-sc',
  'tubarao-sc',
  'criciuma-sc',
  'torres-rs',
  'caxias-do-sul-rs',
  'gramado-rs',
  'osorio-rs',
  'porto-alegre-rs',
]

// O recorte não tem borda dura: o mapa some aos poucos para o oeste, o norte e o sul
const FADE: React.CSSProperties = {
  maskImage:
    'linear-gradient(to right, transparent, #000 22%), linear-gradient(to bottom, transparent, #000 9%, #000 91%, transparent)',
  maskComposite: 'intersect',
  WebkitMaskImage:
    'linear-gradient(to right, transparent, #000 22%), linear-gradient(to bottom, transparent, #000 9%, #000 91%, transparent)',
  WebkitMaskComposite: 'source-in',
}

// O desenho só é baixado quando alguém abre uma obra
let cache: Promise<MapData> | null = null
const loadMap = () => (cache ??= import('../data/regionMap.json').then((m) => m.default as unknown as MapData))

// Quantas obras o cartão mostra antes do "ver outras"
const PREVIEW = 3

function HouseRow({ p, here }: { p: Project; here?: boolean }) {
  return (
    <li>
      <a
        href={projectUrl(p)}
        aria-current={here ? 'page' : undefined}
        className="group flex items-center gap-3 px-4 py-1.5 hover:bg-sand-light transition-colors"
      >
        <img
          src={p.image}
          srcSet={srcSet(p.image)}
          sizes="80px"
          alt=""
          loading="lazy"
          className="w-14 h-10 object-cover shrink-0"
          style={p.imagePosition ? { objectPosition: p.imagePosition } : undefined}
        />
        <span className="min-w-0">
          <span className="block font-serif text-lg leading-tight text-olive group-hover:text-olive-dark">{p.title}</span>
          {here && <span className="block text-[9px] tracking-[0.25em] uppercase text-olive-light">Você está aqui</span>}
        </span>
      </a>
    </li>
  )
}

/**
 * Cartão que abre sobre uma cidade com casas: miniaturas que levam para cada obra.
 * Na cidade do pin aparece só a casa atual; nas outras, as primeiras. O resto abre em "ver outras".
 */
function CityCard({
  name,
  houses,
  here,
  x,
  y,
  onEnter,
  onLeave,
}: {
  name: string
  houses: Project[]
  here?: Project
  x: number
  y: number
  onEnter: () => void
  onLeave: () => void
}) {
  const [open, setOpen] = useState(false)
  const preview = here ? 0 : PREVIEW
  const shown = open ? houses : houses.slice(0, preview)
  const hidden = houses.length - shown.length
  const total = houses.length + (here ? 1 : 0)

  // Abre para baixo perto do topo e se ajusta nas laterais para não sair do mapa
  const below = y < 38
  const shiftX = x > 65 ? '-88%' : x < 35 ? '-12%' : '-50%'
  return (
    <motion.div
      className="absolute z-20 w-60 sm:w-64 bg-white shadow-xl border border-olive/10"
      style={{ left: `${x}%`, top: `${y}%`, x: shiftX, y: below ? 18 : 'calc(-100% - 18px)' }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.18 }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <p className="px-4 pt-3.5 pb-2 text-[10px] tracking-[0.3em] uppercase text-olive-light">
        {name} · {total} {total === 1 ? 'obra' : 'obras'}
      </p>
      <ul className="max-h-60 overflow-y-auto pb-1.5">
        {here && <HouseRow p={here} here />}
        {shown.map((p) => (
          <HouseRow key={projectSlug(p)} p={p} />
        ))}
      </ul>
      {hidden > 0 && (
        <button
          onClick={() => setOpen(true)}
          className="group flex w-full items-center gap-3 border-t border-olive/10 px-4 py-3 text-[10px] tracking-[0.3em] uppercase text-olive hover:bg-sand-light transition-colors"
        >
          Ver {here ? 'outras' : 'mais'} {hidden}
          <span className="block w-6 h-px bg-olive group-hover:w-10 transition-all duration-300" />
        </button>
      )}
    </motion.div>
  )
}

/**
 * Mapa da região Sul (Porto Alegre a Itajaí), dividido por cidades, com o pin na cidade da obra.
 * Passando o mouse: cidades sem casas crescem um pouco; as com casas mostram as obras de lá.
 */
export default function RegionMap({ location, current }: { location: string; current?: string }) {
  const [map, setMap] = useState<MapData | null>(null)
  const [hover, setHover] = useState<string | null>(null)
  const leaveTimer = useRef<number>()
  const { projects } = useSiteData()
  const here = projects.find((p) => projectSlug(p) === current)

  useEffect(() => {
    loadMap().then(setMap)
    return () => window.clearTimeout(leaveTimer.current)
  }, [])

  // Outras obras publicadas, agrupadas pela cidade
  const housesByCity = useMemo(() => {
    const groups: Record<string, Project[]> = {}
    for (const p of projects) {
      if (p.published === false || projectSlug(p) === current) continue
      const key = parseLocation(p.location ?? DEFAULT_LOCATION)?.key
      if (key) (groups[key] ??= []).push(p)
    }
    return groups
  }, [projects, current])

  const place = parseLocation(location)
  if (!place) return null
  const area = map?.cities[place.key]
  if (map && !area) return null // cidade fora da região do mapa

  // Ponto na tela: sede da cidade quando conhecida; senão, o meio do município
  const point = (key: string): [number, number] | undefined => {
    if (!map) return
    const seat = CITIES[key]
    if (seat) return [(seat[1] - map.west) * map.cos * map.k, (map.north - seat[0]) * map.k]
    return map.cities[key]?.c
  }
  const pin = point(place.key)

  const enter = (key: string) => {
    window.clearTimeout(leaveTimer.current)
    setHover(key)
  }
  // Pequena folga para dar tempo de levar o mouse da cidade até o cartão
  const leave = () => {
    window.clearTimeout(leaveTimer.current)
    leaveTimer.current = window.setTimeout(() => setHover(null), 220)
  }

  const hovered = hover && map?.cities[hover]
  const hoveredHouses = hover ? housesByCity[hover] : undefined
  const cardAt = hover && hoveredHouses ? point(hover) : undefined

  return (
    <section className="px-6 sm:px-10 lg:px-20 pb-24 lg:pb-32">
      <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-12 items-center border-t border-olive/15 pt-20 lg:pt-28">
        <FadeIn className="lg:col-span-5">
          <p className="text-[11px] tracking-[0.35em] uppercase text-olive-light">Localização</p>
          <p className="mt-5 font-serif text-4xl sm:text-5xl text-olive">{place.city}</p>
          <p className="mt-3 text-[11px] tracking-[0.3em] uppercase text-primary-500">{place.state}</p>
          {Object.keys(housesByCity).length > 0 && (
            <p className="mt-8 flex items-center gap-3 text-[10px] tracking-[0.25em] uppercase text-olive-light">
              <span className="w-3 h-3 bg-olive/25 border border-olive/40" />
              Cidades com outras obras: passe o mouse ou toque
            </p>
          )}
        </FadeIn>

        <FadeIn className="lg:col-span-7" delay={0.1}>
          <div
            className="relative mx-auto w-full max-w-[34rem]"
            style={{ aspectRatio: map ? `${map.w} / ${map.h}` : '1000 / 1220' }}
          >
            {map && pin && (
              <>
                <svg
                  viewBox={`0 0 ${map.w} ${map.h}`}
                  className="absolute inset-0 w-full h-full"
                  style={FADE}
                  role="img"
                  aria-label={`Mapa da região Sul com ${place.city} marcada`}
                  onClick={(e) => e.target === e.currentTarget && setHover(null)}
                >
                  <g className="fill-sand/60 stroke-white" strokeWidth={1.6} strokeLinejoin="round">
                    {Object.entries(map.cities).map(([key, c]) => {
                      const houses = housesByCity[key]
                      return (
                        <path
                          key={key}
                          d={c.d}
                          data-city={key}
                          className={
                            key === place.key
                              ? `fill-olive/30 stroke-olive ${houses ? 'cursor-pointer' : ''}`
                              : houses
                                ? 'fill-olive/25 cursor-pointer'
                                : undefined
                          }
                          onMouseEnter={() => enter(key)}
                          onMouseLeave={leave}
                          // No celular não existe "passar o mouse": o toque abre o cartão
                          onClick={() => houses && setHover(key)}
                        />
                      )
                    })}
                  </g>
                  {/* Divisa RS / SC e contorno da costa */}
                  <g className="fill-none stroke-olive/35 pointer-events-none" strokeWidth={1.6} strokeLinejoin="round">
                    {map.states.map((d, i) => (
                      <path key={i} d={d} />
                    ))}
                  </g>

                  {/* Cidade sob o mouse, redesenhada por cima um pouco maior */}
                  <AnimatePresence>
                    {hovered && hover !== place.key && (
                      <motion.path
                        key={hover}
                        d={hovered.d}
                        className={`pointer-events-none stroke-white ${hoveredHouses ? 'fill-olive' : 'fill-sand'}`}
                        strokeWidth={2}
                        strokeLinejoin="round"
                        style={{ filter: 'drop-shadow(0 4px 6px rgb(47 46 35 / 0.25))' }}
                        initial={{ scale: 1, opacity: 0.6 }}
                        animate={{ scale: hoveredHouses ? 1.18 : 1.1, opacity: 1 }}
                        exit={{ scale: 1, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                      />
                    )}
                  </AnimatePresence>

                  <g className="font-sans uppercase pointer-events-none" style={{ letterSpacing: '0.18em' }}>
                    {LANDMARKS.filter((key) => key !== place.key).map((key) => {
                      const p = point(key)
                      if (!p) return null
                      // O pin sobe a partir da cidade: nomes vizinhos ali embaixo ficariam encobertos
                      const dx = p[0] - pin[0]
                      const dy = p[1] - pin[1]
                      if (Math.abs(dx) < 170 && dy > -150 && dy < 40) return null
                      const left = p[0] > 760
                      return (
                        <g key={key}>
                          <circle cx={p[0]} cy={p[1]} r={4} className="fill-olive-light" />
                          <text
                            x={p[0] + (left ? -10 : 10)}
                            y={p[1] + 5}
                            textAnchor={left ? 'end' : 'start'}
                            className="fill-olive-light"
                            fontSize={15}
                          >
                            {map.cities[key]?.name}
                          </text>
                        </g>
                      )
                    })}
                  </g>

                  <g className="font-serif italic fill-olive/50 pointer-events-none" fontSize={22}>
                    <text x={map.w - 40} y={map.h - 140} textAnchor="end">
                      Oceano Atlântico
                    </text>
                  </g>
                  <g className="font-sans fill-olive/30 pointer-events-none" fontSize={28} style={{ letterSpacing: '0.4em' }}>
                    <text x={260} y={330}>SC</text>
                    <text x={400} y={780}>RS</text>
                  </g>
                </svg>

                {/* Pin desenhado à parte (fora do esmaecimento das bordas), na mesma escala do mapa */}
                <svg viewBox={`0 0 ${map.w} ${map.h}`} className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" aria-hidden>
                  <g transform={`translate(${pin[0]} ${pin[1]})`}>
                    {/* Ondas saindo do ponto da obra */}
                    {[0, 1.2].map((begin) => (
                      <circle key={begin} r={6} className="fill-none stroke-olive" strokeWidth={2}>
                        <animate attributeName="r" from="6" to="60" dur="2.4s" begin={`${begin}s`} repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.6" to="0" dur="2.4s" begin={`${begin}s`} repeatCount="indefinite" />
                      </circle>
                    ))}
                    <ellipse rx={18} ry={5} className="fill-olive-dark/30" />

                    <motion.g
                      initial={{ opacity: 0, y: -60 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 15 }}
                    >
                      {/* Gota fina com a ponta exatamente sobre a cidade */}
                      <path
                        d="M0 0C-8 -24 -36 -50 -36 -86A36 36 0 1 1 36 -86C36 -50 8 -24 0 0Z"
                        className="fill-olive-dark stroke-white"
                        strokeWidth={4}
                        strokeLinejoin="round"
                      />
                      <circle cy={-86} r={13} className="fill-sand-light" />

                      {/* Nome da cidade ao lado da cabeça do pin, com contorno branco para ler sobre o mapa */}
                      <text
                        x={pin[0] > map.w * 0.7 ? -50 : 50}
                        y={-76}
                        textAnchor={pin[0] > map.w * 0.7 ? 'end' : 'start'}
                        className="font-serif italic fill-olive-dark stroke-white"
                        fontSize={36}
                        strokeWidth={8}
                        style={{ paintOrder: 'stroke' }}
                      >
                        {place.city}
                      </text>
                    </motion.g>
                  </g>
                </svg>

                {/* Nome da cidade sob o mouse (as sem casas) */}
                <AnimatePresence>
                  {hovered && !hoveredHouses && hover !== place.key && (
                    <motion.p
                      key={hover}
                      className="absolute z-10 -translate-x-1/2 pointer-events-none whitespace-nowrap bg-white/90 px-2.5 py-1 text-[10px] tracking-[0.25em] uppercase text-olive shadow-sm"
                      style={{ left: `${(hovered.c[0] / map.w) * 100}%`, top: `${(hovered.c[1] / map.h) * 100}%`, marginTop: -34 }}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {hovered.name}
                    </motion.p>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {hovered && hoveredHouses && cardAt && (
                    <CityCard
                      key={hover}
                      name={hovered.name}
                      houses={hoveredHouses}
                      here={hover === place.key ? here : undefined}
                      x={(cardAt[0] / map.w) * 100}
                      y={(cardAt[1] / map.h) * 100}
                      onEnter={() => enter(hover!)}
                      onLeave={leave}
                    />
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
