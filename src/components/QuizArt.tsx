import {
  BedDouble,
  BookOpen,
  Building,
  Car,
  Check,
  Flame,
  Flower2,
  Lock,
  MapPin,
  Mountain,
  Palmtree,
  Sprout,
  Sun,
  TreeDeciduous,
  TreePine,
  Trees,
  UtensilsCrossed,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import type { OptionArt } from '../data/quiz'

const ICONS: Record<string, LucideIcon> = {
  bed: BedDouble,
  book: BookOpen,
  car: Car,
  check: Check,
  city: Building,
  compare: MapPin,
  dinner: UtensilsCrossed,
  fire: Flame,
  flower: Flower2,
  garden: Trees,
  lock: Lock,
  map: MapPin,
  mountain: Mountain,
  palm: Palmtree,
  pine: TreePine,
  pool: Waves,
  sprout: Sprout,
  sun: Sun,
  tree: TreeDeciduous,
}

// Desenhos em traço (viewBox 120 × 80), no mesmo espírito da parede de tijolos do site
const LINE = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinejoin: 'round' as const }
const SOLID = { fill: 'currentColor' }

const DRAWINGS: Record<string, React.ReactNode> = {
  'facade-tropical': (
    <>
      <rect x={6} y={20} width={108} height={5} {...SOLID} />
      <rect x={16} y={25} width={88} height={43} {...LINE} />
      {[22, 26, 30, 34, 38, 42, 46].map((x) => (
        <line key={x} x1={x} y1={29} x2={x} y2={64} {...LINE} strokeWidth={1} />
      ))}
      <rect x={58} y={32} width={38} height={36} {...LINE} />
      <path d="M100 68 V44 M100 44 q-10 -2 -14 6 M100 44 q10 -2 14 6 M100 44 q-6 -8 -14 -6 M100 44 q6 -8 14 -6" {...LINE} />
    </>
  ),
  'facade-minimal': (
    <>
      <rect x={18} y={34} width={58} height={34} {...LINE} />
      <rect x={46} y={14} width={56} height={30} {...LINE} />
      <rect x={52} y={20} width={44} height={18} {...LINE} strokeWidth={1} />
      <line x1={74} y1={20} x2={74} y2={38} {...LINE} strokeWidth={1} />
      <rect x={24} y={46} width={18} height={22} {...LINE} strokeWidth={1} />
    </>
  ),
  'facade-montanha': (
    <>
      <path d="M8 38 L60 10 L112 38" {...LINE} strokeWidth={3} />
      <rect x={22} y={36} width={76} height={32} {...LINE} />
      <path d="M60 16 L40 36 M60 16 L80 36 M60 16 V36" {...LINE} strokeWidth={1} />
      <rect x={46} y={42} width={28} height={26} {...LINE} strokeWidth={1} />
      <line x1={60} y1={42} x2={60} y2={68} {...LINE} strokeWidth={1} />
      <path d="M22 58 h24 M22 63 h24 M74 58 h24 M74 63 h24 M30 58 v5 M38 63 v5 M86 58 v5 M94 63 v5" {...LINE} strokeWidth={0.8} />
    </>
  ),
  'facade-classica': (
    <>
      <rect x={18} y={24} width={84} height={44} {...LINE} />
      <rect x={14} y={20} width={92} height={4} {...SOLID} />
      <path d="M52 68 V48 a8 8 0 0 1 16 0 V68" {...LINE} />
      <path d="M28 58 V40 a6 6 0 0 1 12 0 V58 Z M80 58 V40 a6 6 0 0 1 12 0 V58 Z" {...LINE} strokeWidth={1} />
      <path d="M46 68 V30 M74 68 V30" {...LINE} strokeWidth={2.5} />
    </>
  ),
  'facade-urbana': (
    <>
      <rect x={20} y={14} width={80} height={54} {...SOLID} opacity={0.85} />
      {[0, 1, 2, 3].flatMap((r) =>
        [0, 1, 2, 3, 4, 5, 6].map((c) => (
          <rect key={`${r}-${c}`} x={28 + c * 9.5} y={20 + r * 6} width={6} height={4} fill="white" opacity={0.55} />
        ))
      )}
      <rect x={28} y={48} width={30} height={20} fill="#9a6b45" />
      <rect x={66} y={48} width={26} height={20} fill="white" opacity={0.35} />
    </>
  ),
  'house-terrea': (
    <>
      <rect x={8} y={26} width={104} height={4} {...SOLID} />
      <rect x={14} y={30} width={92} height={38} {...LINE} />
      <rect x={26} y={42} width={30} height={26} {...LINE} strokeWidth={1} />
      <rect x={68} y={40} width={28} height={16} {...LINE} strokeWidth={1} />
    </>
  ),
  'house-sobrado': (
    <>
      <rect x={30} y={8} width={64} height={4} {...SOLID} />
      <rect x={36} y={12} width={52} height={56} {...LINE} />
      <line x1={36} y1={40} x2={88} y2={40} {...LINE} />
      <rect x={44} y={18} width={36} height={14} {...LINE} strokeWidth={1} />
      <rect x={44} y={48} width={16} height={20} {...LINE} strokeWidth={1} />
      <rect x={66} y={48} width={14} height={12} {...LINE} strokeWidth={1} />
    </>
  ),
  'house-both': (
    <>
      <rect x={10} y={36} width={46} height={32} {...LINE} />
      <rect x={6} y={32} width={54} height={4} {...SOLID} />
      <rect x={68} y={16} width={40} height={52} {...LINE} />
      <rect x={64} y={12} width={48} height={4} {...SOLID} />
      <line x1={68} y1={42} x2={108} y2={42} {...LINE} />
    </>
  ),
  'win-glass': (
    <>
      <rect x={14} y={10} width={92} height={58} {...LINE} strokeWidth={2.5} />
      <path d="M45 10 V68 M75 10 V68" {...LINE} strokeWidth={1} />
      <path d="M22 18 l12 12 M52 18 l8 8 M82 18 l14 14" {...LINE} strokeWidth={0.8} opacity={0.6} />
    </>
  ),
  'win-arch': (
    <>
      <path d="M38 70 V34 a22 22 0 0 1 44 0 V70 Z" {...LINE} strokeWidth={2.5} />
      <path d="M60 12 V70 M38 42 H82" {...LINE} strokeWidth={1} />
    </>
  ),
  'win-cobogo': (
    <>
      <rect x={20} y={8} width={80} height={64} {...LINE} strokeWidth={2} />
      {[0, 1, 2, 3, 4].flatMap((r) =>
        [0, 1, 2, 3, 4, 5].map((c) => (
          <path
            key={`${r}-${c}`}
            d={`M${33 + c * 11} ${14 + r * 12} l5 5 l-5 5 l-5 -5 Z`}
            {...LINE}
            strokeWidth={1}
          />
        ))
      )}
    </>
  ),
  'win-landscape': (
    <>
      <rect x={14} y={10} width={92} height={58} {...LINE} strokeWidth={4} />
      <path d="M18 58 L42 34 L56 46 L74 26 L102 54" {...LINE} />
      <circle cx={86} cy={22} r={5} {...LINE} strokeWidth={1} />
    </>
  ),
}

/** Amostras de material desenhadas (sem fotos de clientes) */
function Swatch({ id }: { id: 'wood' | 'stone' | 'plaster' | 'dark' }) {
  if (id === 'wood')
    return (
      <svg viewBox="0 0 120 80" className="w-full h-full" preserveAspectRatio="none">
        <rect width={120} height={80} fill="#a0714a" />
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={i * 10} y={0} width={7} height={80} fill={i % 3 ? '#b08156' : '#94673f'} />
        ))}
      </svg>
    )
  if (id === 'stone')
    return (
      <svg viewBox="0 0 120 80" className="w-full h-full" preserveAspectRatio="none">
        <rect width={120} height={80} fill="#8f8577" />
        {[
          'M2 2 H40 V24 H2 Z', 'M44 2 H82 L78 20 H44 Z', 'M86 2 H118 V28 H82 Z', 'M2 28 H28 V52 H2 Z',
          'M32 28 H62 L66 50 H32 Z', 'M70 32 H118 V54 H68 Z', 'M2 56 H44 V78 H2 Z', 'M48 54 H80 V78 H48 Z',
          'M84 58 H118 V78 H84 Z',
        ].map((d, i) => (
          <path key={d} d={d} fill={['#b7a58c', '#c9b9a1', '#a89780'][i % 3]} />
        ))}
      </svg>
    )
  if (id === 'plaster')
    return (
      <svg viewBox="0 0 120 80" className="w-full h-full" preserveAspectRatio="none">
        <rect width={120} height={80} fill="#f4f2ee" />
        <rect x={0} y={52} width={120} height={1} fill="#e2dbd1" />
        <rect x={70} y={0} width={1} height={52} fill="#e2dbd1" />
      </svg>
    )
  return (
    <svg viewBox="0 0 120 80" className="w-full h-full" preserveAspectRatio="none">
      <rect width={120} height={80} fill="#3a3a38" />
      {[16, 32, 48, 64].map((y) => (
        <rect key={y} x={0} y={y} width={120} height={1} fill="#4a4a47" />
      ))}
      <rect x={84} y={0} width={4} height={80} fill="#1f1f1e" />
    </svg>
  )
}

/** Imagem de uma opção do teste */
export default function QuizArt({ art }: { art: OptionArt }) {
  if (art.kind === 'swatch') return <Swatch id={art.id} />
  if (art.kind === 'palette')
    return (
      <div className="w-full h-full flex">
        {art.colors.map((c) => (
          <span key={c} className="flex-1" style={{ background: c }} />
        ))}
      </div>
    )
  if (art.kind === 'icon') {
    const Icon = ICONS[art.id] ?? MapPin
    return <Icon className="w-8 h-8" strokeWidth={1.25} />
  }
  return (
    <svg viewBox="0 0 120 80" className="w-full h-full" aria-hidden>
      {DRAWINGS[art.id]}
    </svg>
  )
}
