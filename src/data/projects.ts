export type Status = 'concluido' | 'andamento'
export type ProjectType = 'residencial' | 'comercial' | 'interiores'

export const STATUS_LABEL: Record<Status, string> = {
  concluido: 'Concluído',
  andamento: 'Em andamento',
}

export interface Project {
  title: string
  category: string
  type: ProjectType
  year: string
  status: Status
  image: string
  /** Enquadramento da foto no recorte (CSS object-position) */
  imagePosition?: string
}

export const projects: Project[] = [
  {
    title: 'Casa Lago',
    category: 'Residência',
    type: 'residencial',
    year: '2024',
    status: 'concluido',
    image: '/images/web/portfolio-casa-lago.jpg',
  },
  {
    title: 'Casa JE',
    category: 'Residência',
    type: 'residencial',
    year: '2023',
    status: 'concluido',
    image: '/images/web/portfolio-casa-je.jpg',
  },
  {
    title: 'Casa Cocal',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'concluido',
    image: '/images/web/portfolio-casa-cocal.jpg',
    imagePosition: '50% 45%',
  },
  {
    title: 'Casa Arcos',
    category: 'Projeto Residencial',
    type: 'residencial',
    year: '2025',
    status: 'andamento',
    image: '/images/web/portfolio-casa-arcos.jpg',
  },
  {
    title: 'Casa Esmeralda',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'concluido',
    image: '/images/web/casa-esmeralda-frontal.jpg',
    imagePosition: '50% 42%',
  },
  {
    title: 'Casa Araucária',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'concluido',
    image: '/images/web/portfolio-casa-araucaria.jpg',
  },
  {
    title: 'Casa Aguiar',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'concluido',
    image: '/images/web/portfolio-casa-aguiar.jpg',
  },
  {
    title: 'Casa Azeviche',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'concluido',
    image: '/images/web/portfolio-casa-azeviche.jpg',
  },
  {
    title: 'Casa Pérola',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'concluido',
    image: '/images/web/portfolio-casa-perola.jpg',
  },
  {
    title: 'Casa Aconchego',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-aconchego.jpg',
  },
  {
    title: 'Casa Amazonita',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-amazonita.jpg',
  },
  {
    title: 'Casa Iron',
    category: 'Reforma Residencial',
    type: 'residencial',
    year: '2024',
    status: 'andamento',
    image: '/images/web/portfolio-casa-iron.jpg',
  },
  {
    title: 'Bar Fácil',
    category: 'Projeto Comercial',
    type: 'comercial',
    year: '2024',
    status: 'andamento',
    image: '/images/web/portfolio-bar-facil.jpg',
  },
]

export type ProjectFilter = 'todos' | Status | ProjectType

export const FILTERS: { id: ProjectFilter; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'residencial', label: 'Residencial' },
  { id: 'comercial', label: 'Comercial' },
  { id: 'interiores', label: 'Interiores' },
  { id: 'concluido', label: 'Concluídos' },
  { id: 'andamento', label: 'Em andamento' },
]

export const isProjectFilter = (v: string | null): v is ProjectFilter =>
  FILTERS.some((f) => f.id === v)

export const matches = (p: Project, filter: ProjectFilter) =>
  filter === 'todos' || p.status === filter || p.type === filter

/** Endereço da página de projetos, já filtrada quando necessário */
export const projectsUrl = (filter: ProjectFilter = 'todos') =>
  filter === 'todos' ? '/projetos' : `/projetos?filtro=${filter}`
