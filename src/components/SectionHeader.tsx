import FadeIn from './FadeIn'

interface SectionHeaderProps {
  label: string
  title: React.ReactNode
  light?: boolean
  className?: string
}

/** Cabeçalho de seção: rótulo discreto e título em serifa. */
export default function SectionHeader({ label, title, light = false, className = '' }: SectionHeaderProps) {
  return (
    <FadeIn className={className}>
      <div className="flex items-center gap-4 mb-6">
        <span className={`h-px w-10 ${light ? 'bg-sand/50' : 'bg-olive/40'}`} />
        <span className={`text-[11px] tracking-[0.35em] uppercase ${light ? 'text-sand' : 'text-olive'}`}>
          {label}
        </span>
      </div>
      <h2
        className={`font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.08] ${
          light ? 'text-sand-light' : 'text-olive'
        }`}
      >
        {title}
      </h2>
    </FadeIn>
  )
}
