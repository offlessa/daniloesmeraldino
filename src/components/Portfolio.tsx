import SectionHeader from './SectionHeader'
import ParallaxRect from './ParallaxRect'
import FadeIn from './FadeIn'

interface Project {
  title: string
  category: string
  year: string
  image: string
  /** Enquadramento da foto no recorte 16:10 (CSS object-position) */
  imagePosition?: string
  link: string
}

const projects: Project[] = [
  {
    title: 'Casa Lago',
    category: 'Residência',
    year: '2024',
    image: '/images/web/portfolio-casa-lago.jpg',
    link: 'https://www.youtube.com/watch?v=JxztO6DDQp4',
  },
  {
    title: 'Casa JE',
    category: 'Residência',
    year: '2023',
    image: '/images/web/portfolio-casa-je.jpg',
    link: '',
  },
  {
    title: 'Casa Arcos',
    category: 'Projeto Residencial',
    year: '2025',
    image: '/images/web/portfolio-casa-arcos.jpg',
    link: 'https://sites.google.com/view/casaarcos/in%C3%ADcio',
  },
  {
    title: 'Casa Esmeralda',
    category: 'Residência',
    year: '',
    image: '/images/web/casa-esmeralda-fachada.jpg',
    imagePosition: '50% 55%',
    link: '',
  },
  {
    title: 'Casa Iron',
    category: 'Reforma Residencial',
    year: '2024',
    image: '/images/web/portfolio-casa-iron.jpg',
    link: 'https://sites.google.com/d/1uER1att9__cOF6pUQSH5LuHYPZg4vfIY/p/1efpMy9csMp5LZynq8GNbQb0vsNBZwY6X/edit',
  },
  {
    title: 'Bar Fácil',
    category: 'Projeto Comercial',
    year: '2024',
    image: '/images/web/portfolio-bar-facil.jpg',
    link: '',
  },
]

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const imageRight = index % 2 === 0
  const Tag = project.link ? 'a' : 'div'
  const linkProps = project.link
    ? { href: project.link, target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <div className="grid lg:grid-cols-12 gap-8 lg:gap-8 items-end">
      <FadeIn className={`lg:col-span-8 ${imageRight ? 'lg:order-2' : ''}`}>
        <Tag {...linkProps} className="group block overflow-hidden aspect-[16/10] bg-sand-light">
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
          />
        </Tag>
      </FadeIn>

      <FadeIn
        className={`lg:col-span-4 ${imageRight ? 'lg:order-1 lg:pr-8' : 'lg:pl-8'}`}
        delay={0.15}
      >
        <p className="font-serif italic text-lg text-olive-light">
          {String(index + 1).padStart(2, '0')}
        </p>
        <h3 className="mt-2 font-serif text-4xl sm:text-5xl text-olive">{project.title}</h3>
        <p className="mt-4 text-[11px] tracking-[0.25em] uppercase text-primary-500">
          {project.category}
          {project.year && ` · ${project.year}`}
        </p>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-4 text-[11px] tracking-[0.3em] uppercase text-olive"
          >
            Ver projeto
            <span className="block w-8 h-px bg-olive group-hover:w-14 transition-all duration-500" />
          </a>
        )}
      </FadeIn>
    </div>
  )
}

export default function Portfolio() {
  return (
    <section id="portfolio" className="relative py-32 lg:py-40 px-6 sm:px-10 lg:px-20 border-t border-sand">
      <ParallaxRect className="hidden lg:block right-0 top-[30%] w-[6%] h-[22rem]" speed={110} />
      <ParallaxRect className="hidden lg:block left-0 top-[68%] w-[6%] h-[18rem]" speed={100} />

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-24 lg:mb-32">
          <SectionHeader label="Portfólio" title={<>Projetos em <em className="text-olive-light">destaque</em></>} />
          <FadeIn className="max-w-sm">
            <p className="text-primary-600 leading-relaxed">
              Uma seleção de residências e espaços comerciais desenvolvidos pelo estúdio — cada um
              com sua própria leitura de lugar, luz e materialidade.
            </p>
          </FadeIn>
        </div>

        <div className="space-y-32 lg:space-y-40">
          {projects.map((project, index) => (
            <ProjectRow key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
