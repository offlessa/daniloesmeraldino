/** andamento = obra em andamento · projeto = ainda no papel · concluido = obra entregue */
export type Status = 'andamento' | 'projeto' | 'concluido'
export type ProjectType = 'residencial' | 'comercial' | 'interiores'

export const STATUS_LABEL: Record<Status, string> = {
  andamento: 'Em andamento',
  projeto: 'Em projeto',
  concluido: 'Concluído',
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
  /** Cidade e estado, ex.: 'Tubarão, SC' — também posiciona o mapa */
  location?: string
  /** Área construída, ex.: '320 m²' */
  area?: string
  /** Texto de apresentação da página do projeto (parágrafos separados por linha em branco) */
  description?: string
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
    image: '/images/web/portfolio-casa-cocal-entrada.jpg',
    imagePosition: '50% 45%',
    location: 'Cocal do Sul, SC',
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
    location: 'Biguaçu, SC',
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
    title: 'Casa Araçá',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-araca.jpg',
  },
  {
    title: 'Casa Blanc',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-blanc.jpg',
  },
  {
    title: 'Casa Bonsai',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-bonsai.jpg',
  },
  {
    title: 'Casa Bossa Nova',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-bossa-nova.jpg',
  },
  {
    title: 'Casa Granada',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-granada.jpg',
  },
  {
    title: 'Casa Jasmin',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-jasmin.jpg',
  },
  {
    title: 'Casa Levita',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-levita.jpg',
  },
  {
    title: 'Casa My',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-my.jpg',
  },
  {
    title: 'Casa Orion',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-orion.jpg',
  },
  {
    title: 'Casa R',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-r.jpg',
  },
  {
    title: 'Casa Rocha',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-rocha.jpg',
  },
  {
    title: 'Casa Solarium',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-solarium.jpg',
  },
  {
    title: 'Casa Turquesa',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-turquesa.jpg',
  },
  {
    title: 'Casa Ônix',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-onix.jpg',
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

// Filtros da página de projetos: tipo × situação (ex.: comerciais concluídos)
export type TypeFilter = 'todos' | ProjectType
export type StatusFilter = 'todos' | Status
export interface ProjectQuery {
  tipo: TypeFilter
  situacao: StatusFilter
}

export const TYPE_FILTERS: { id: TypeFilter; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'residencial', label: 'Residencial' },
  { id: 'comercial', label: 'Comercial' },
  { id: 'interiores', label: 'Interiores' },
]

export const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'andamento', label: 'Em andamento' },
  { id: 'projeto', label: 'Projetos' },
  { id: 'concluido', label: 'Concluídos' },
]

export const isTypeFilter = (v: string | null): v is TypeFilter =>
  TYPE_FILTERS.some((f) => f.id === v)

export const isStatusFilter = (v: string | null): v is StatusFilter =>
  STATUS_FILTERS.some((f) => f.id === v)

/**
 * Interiores não é o tipo da obra: entra toda casa ou loja que tem fotos de interiores
 * (além dos projetos só de interiores).
 */
export const matches = (p: Project, q: ProjectQuery, hasInteriors: boolean) =>
  (q.situacao === 'todos' || p.status === q.situacao) &&
  (q.tipo === 'todos' || (q.tipo === 'interiores' ? hasInteriors || p.type === 'interiores' : p.type === q.tipo))

/** Endereço da página de projetos, já filtrada quando necessário */
export const projectsUrl = (q: Partial<ProjectQuery> = {}) => {
  const params = new URLSearchParams()
  if (q.tipo && q.tipo !== 'todos') params.set('tipo', q.tipo)
  if (q.situacao && q.situacao !== 'todos') params.set('situacao', q.situacao)
  const qs = params.toString()
  return qs ? `/projetos?${qs}` : '/projetos'
}

/** 'Casa Araucária' → 'casa-araucaria' */
export const slugify = (title: string) =>
  title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/** Endereço da página de um projeto */
export const projectUrl = (p: Project) => `/projetos/${slugify(p.title)}`

/** Âncora da seção de interiores na página do projeto */
export const INTERIORS_ID = 'interiores'

export const findProject = (slug: string) => projects.find((p) => slugify(p.title) === slug)
