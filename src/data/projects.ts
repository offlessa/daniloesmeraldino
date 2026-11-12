/** andamento = obra em andamento · projeto = ainda no papel · concluido = obra entregue */
export type Status = 'andamento' | 'projeto' | 'concluido'
export type ProjectType = 'residencial' | 'comercial' | 'interiores'

export const STATUS_LABEL: Record<Status, string> = {
  andamento: 'Em andamento',
  projeto: 'Em projeto',
  concluido: 'Concluído',
}

export interface Project {
  /** Identificação no banco (só existe quando os dados vieram do painel) */
  id?: string
  /** Endereço fixo da página (vem do painel); sem ele, sai do título */
  slug?: string
  /** false = oculta (só o administrador vê) */
  published?: boolean
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
    area: '275,78 m²',
    description:
      'Implantada no declive do terreno, a Casa Lago se organiza em três níveis que se abrem para o verde e para o pôr do sol. Madeira, pedra e concreto conversam com o paisagismo tropical, e a escada de degraus flutuantes que sobe pelo jardim continua dentro de casa, apoiada na parede de pedra.',
  },
  {
    title: 'Casa JE',
    category: 'Residência',
    type: 'residencial',
    year: '2023',
    status: 'concluido',
    image: '/images/web/portfolio-casa-je.jpg',
    description:
      'Térrea e horizontal, a Casa JE combina volumes brancos, grandes panos de vidro e beirais forrados de madeira que sombreiam as fachadas. O jardim de folhagens tropicais acompanha o caminho até a entrada, e por dentro a cozinha clara, com detalhes dourados, mantém a mesma leveza.',
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
    description:
      'Uma casa térrea pensada para o horizonte aberto do campo. Volumes brancos recebem painéis de madeira ripada, a entrada se abre em vidro do piso ao teto e um espelho d\'água com grandes potes azuis marca a chegada.',
  },
  {
    title: 'Casa Arcos',
    category: 'Projeto Residencial',
    type: 'residencial',
    year: '2025',
    status: 'andamento',
    image: '/images/web/portfolio-casa-arcos.jpg',
    description:
      'Os arcos que dão nome à casa aparecem nas grandes janelas, emoldurados por volumes claros e revestimento em pedra. O paisagismo com gramíneas suaviza a fachada, e a área de lazer reúne piscina e varandas integradas à casa.',
  },
  {
    title: 'Casa Esmeralda',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'concluido',
    image: '/images/web/casa-esmeralda-frontal.jpg',
    imagePosition: '50% 42%',
    description:
      'Um sobrado urbano de linhas retas, em que o volume verde da fachada, a pedra e os grandes vidros criam uma composição equilibrada. O beiral em madeira aquece o conjunto e protege as aberturas do sol.',
  },
  {
    title: 'Casa Araucária',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'concluido',
    image: '/images/web/portfolio-casa-araucaria.jpg',
    description:
      'Uma casa de montanha que se debruça sobre o vale, cercada pelas araucárias. A grande cobertura com estrutura aparente, a lareira em pedra e os panos de vidro de ponta a ponta trazem a paisagem para dentro de todos os ambientes — até o banho, com a banheira voltada para a mata.',
  },
  {
    title: 'Casa Aguiar',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'concluido',
    image: '/images/web/portfolio-casa-aguiar.jpg',
    location: 'Biguaçu, SC',
    description:
      'Um sobrado vertical que aproveita cada metro do lote: garagem no nível da rua, moradia nos pavimentos de cima e um volume emoldurado que organiza a fachada. Floreiras, vidro e madeira dão leveza ao conjunto, e o deck com spa abre a casa para o jardim.',
  },
  {
    title: 'Casa Azeviche',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'concluido',
    image: '/images/web/portfolio-casa-azeviche.jpg',
    description:
      'Térrea e de linhas retas, a Casa Azeviche tem a fachada marcada pelos tons escuros que dão nome ao projeto. O jardim de agapantos envolve a casa e acompanha a área de lazer coberta, integrada às salas.',
  },
  {
    title: 'Casa Pérola',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'concluido',
    image: '/images/web/portfolio-casa-perola.jpg',
    description:
      'Uma casa térrea clara e serena, em que a pedra natural e o vidro de pé-direito alto marcam a entrada. O paisagismo tropical na frente do lote faz a transição entre a rua e a casa.',
  },
  {
    title: 'Casa Azambuja',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'concluido',
    image: '/images/web/portfolio-casa-azambuja.jpg',
    description:
      'Térrea e horizontal, aos pés do morro, a Casa Azambuja combina madeira, pedra clara e grandes panos de vidro. Ao entardecer, a luz embutida nos beirais e no jardim transforma a casa em uma lanterna na paisagem.',
  },
  {
    title: 'Casa de Pedra',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'concluido',
    image: '/images/web/portfolio-casa-de-pedra.jpg',
    description:
      'Uma casa de campo em meio às montanhas, com telhado escuro de duas águas, chaminé marcante e grandes vidros voltados para a paisagem. O lote cercado de verde completa o clima de refúgio.',
  },
  {
    title: 'Casa Buena',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'concluido',
    image: '/images/web/portfolio-casa-buena.jpg',
    description:
      'Um sobrado contemporâneo de volumes recortados, em que o painel em tom terracota marca a fachada entre o vidro e os volumes claros.',
  },
  {
    title: 'Casa ES',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'concluido',
    image: '/images/web/portfolio-casa-es.jpg',
    description:
      'Uma fachada de linhas retas em que a pedra clara de recorte irregular, o painel de madeira e o vidro de pé-direito alto marcam a entrada. O beiral em balanço, forrado de madeira, sombreia o acesso pelo jardim.',
  },
  {
    title: 'Casa Sobrado',
    category: 'Interiores',
    type: 'interiores',
    year: '',
    status: 'concluido',
    image: '/images/web/portfolio-casa-sobrado.jpg',
    description:
      'Interiores em tons claros e acabamentos delicados: suíte com cabeceira estofada e luz suave, banho e penteadeira com espelhos iluminados e detalhes dourados, e um quarto infantil em azul com marcenaria sob medida.',
  },
  {
    title: 'Casa Aconchego',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-aconchego.jpg',
    description:
      'Horizontal e assentada no terreno em desnível, a Casa Aconchego combina pedra, madeira e grandes beirais que protegem as varandas. Por dentro, o nome se explica: forro e painéis de madeira, luz indireta e ambientes integrados entre sala, jantar e cozinha, com o mesmo cuidado nos quartos, closets e banhos.',
  },
  {
    title: 'Casa Amazonita',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-amazonita.jpg',
    description:
      'Volumes brancos e puros, atravessados por pilares revestidos em pedra verde e por floreiras que descem pela fachada. Nos fundos, a piscina acompanha a casa de ponta a ponta e se integra às salas.',
  },
  {
    title: 'Casa Araçá',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-araca.jpg',
    description:
      'Um sobrado com fachada viva: a treliça de madeira filtra a luz, o jardim vertical sobe pela parede e a escada chega à entrada por entre as plantas. Nos fundos, a área gourmet se abre para a piscina e para as árvores frutíferas.',
  },
  {
    title: 'Casa Blanc',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-blanc.jpg',
    description:
      'Branca, como o nome diz, e de linhas horizontais, a Casa Blanc contrasta a pedra natural com as plantas que caem pela fachada. Na esquina, o muro gradeado deixa a casa à mostra sem abrir mão da privacidade.',
  },
  {
    title: 'Casa Bonsai',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-bonsai.jpg',
    description:
      'Inspirada nos jardins orientais, a Casa Bonsai tem bordos vermelhos, lavandas e uma coleção de bonsais no deck da área de lazer. A torre de pedra, os beirais largos e a varanda do andar de cima completam a fachada.',
  },
  {
    title: 'Casa Bossa Nova',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-bossa-nova.jpg',
    description:
      'Térrea, branca e de traço leve, a Casa Bossa Nova mistura pedra e madeira ripada na fachada. Por dentro, os ambientes se voltam para um pátio com piscina, onde jardim e varanda se encontram.',
  },
  {
    title: 'Casa Granada',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-granada.jpg',
    description:
      'Uma caixa escura emoldura as janelas do andar de cima, sobre uma base revestida em madeira ripada. As floreiras correm por toda a fachada e suavizam o volume.',
  },
  {
    title: 'Casa Jasmin',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-jasmin.jpg',
    description:
      'Térrea, de tons neutros e linhas simples, com a madeira marcando a entrada. A área gourmet se integra ao jardim, e a garagem coberta segue o mesmo desenho da fachada.',
  },
  {
    title: 'Casa Levita',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-levita.jpg',
    description:
      'No terreno em aclive, a Casa Levita se ergue sobre a base de pedra que abriga a garagem. Acima, os volumes brancos e o guarda-corpo de vidro abrem a varanda para a vista.',
  },
  {
    title: 'Casa My',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-my.jpg',
    description:
      'A grande cobertura com forro de madeira recebe quem chega e abriga a garagem. Painéis ripados e pedra completam a fachada, e nos fundos a piscina com deck se abre para as salas por grandes portas de vidro.',
  },
  {
    title: 'Casa Orion',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-orion.jpg',
    description:
      'Tons de terra, pedra e madeira compõem uma fachada de volumes sobrepostos. O caminho de pisantes pelo jardim leva até a entrada, ao lado do grande portão de madeira da garagem.',
  },
  {
    title: 'Casa R',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-r.jpg',
    description:
      'Térrea, com uma grande cobertura que abriga a garagem e marca a entrada em madeira e pedra. Nos fundos, a piscina com cascata ocupa o centro da casa e se integra a todos os ambientes.',
  },
  {
    title: 'Casa Rocha',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-rocha.jpg',
    description:
      'Grandes rochas no jardim inspiram o nome e o caráter da casa: volumes em cinza escuro, panos de vidro altos e palmeiras compõem a fachada. Na área de lazer, piscina e deck gourmet se cercam de jardim tropical.',
  },
  {
    title: 'Casa Solarium',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-solarium.jpg',
    description:
      'Pensada para receber sol e gente, a Casa Solarium se estende ao longo da piscina, com varandas e floreiras nos dois pavimentos. Por dentro, salas amplas e integradas, de pé-direito alto, se abrem para a área externa.',
  },
  {
    title: 'Casa Turquesa',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-turquesa.jpg',
    description:
      'O cobogó escuro do andar de cima filtra a luz e garante privacidade, sobre a base em madeira ripada. Nos fundos, a piscina com cascata ganha destaque em um pátio cercado de jardim.',
  },
  {
    title: 'Casa Ônix',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'andamento',
    image: '/images/web/portfolio-casa-onix.jpg',
    description:
      'Uma releitura contemporânea do clássico: fachada branca com colunas, esquadrias pretas e portão em ferro trabalhado. As palmeiras na entrada reforçam a simetria do conjunto.',
  },
  {
    title: 'Casa Pietra',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'projeto',
    image: '/images/web/portfolio-casa-pietra.jpg',
    description:
      'Uma moldura escura envolve o volume superior e define a fachada, com pedra, madeira e floreiras. Por dentro, marcenaria em madeira, luz indireta e tons neutros desenham cada ambiente — da cozinha e do escritório às suítes e closets.',
  },
  {
    title: 'Casa Brisa',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'projeto',
    image: '/images/web/portfolio-casa-brisa.jpg',
    description:
      'Térrea e de linhas horizontais, a Casa Brisa combina volumes claros, madeira e paisagismo tropical. Nos fundos, a piscina com deck se abre para a área gourmet.',
  },
  {
    title: 'Casa Flora',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'projeto',
    image: '/images/web/portfolio-casa-flora.jpg',
    description:
      'Um sobrado em tons terrosos e verde, com brises de madeira, floreiras e garagem no nível da rua. Nos fundos, a piscina e o lounge com fogo se cercam de um jardim exuberante.',
  },
  {
    title: 'Casa Bravea',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'projeto',
    image: '/images/web/portfolio-casa-bravea.jpg',
    description:
      'A fachada em pedra clara, de recorte irregular, contrasta com o painel de madeira da entrada e com as palmeiras do jardim. Nos fundos, a piscina se integra à área social por grandes portas de vidro.',
  },
  {
    title: 'Casa DG',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'projeto',
    image: '/images/web/portfolio-casa-dg.jpg',
    description:
      'Térrea, com um volume branco que abriga a garagem e uma entrada marcada por madeira e caixilhos escuros. Nos fundos, a piscina estreita acompanha o jardim e um pátio de convívio.',
  },
  {
    title: 'Casa LA',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'projeto',
    image: '/images/web/portfolio-casa-la.jpg',
    description:
      'Volumes brancos sobrepostos, beirais em madeira e uma torre revestida em pedra. Na entrada, o caminho pelo jardim leva até a porta de pé-direito duplo.',
  },
  {
    title: 'Casa Vétria',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'projeto',
    image: '/images/web/portfolio-casa-vetria.jpg',
    description:
      'Volumes em tons de areia e grafite, beirais finos e painéis escuros que filtram a luz. A garagem coberta e o jardim com palmeiras recebem quem chega.',
  },
  {
    title: 'Chalé da Montanha',
    category: 'Residência',
    type: 'residencial',
    year: '',
    status: 'projeto',
    image: '/images/web/portfolio-chale-da-montanha.jpg',
    description:
      'Um chalé na encosta, com telhado de duas águas, estrutura de madeira aparente, torre de pedra e varandas que se debruçam sobre a vista. A piscina completa o refúgio.',
  },
  {
    title: 'Casa Iron',
    category: 'Reforma Residencial',
    type: 'residencial',
    year: '2024',
    status: 'andamento',
    image: '/images/web/portfolio-casa-iron.jpg',
    description:
      'Uma reforma que deu nova cara à casa: volumes brancos, painéis em tom ferrugem e grandes vidros que se abrem para a piscina. As floreiras da fachada e o jardim em volta levam o verde a todos os níveis.',
  },
  {
    title: 'Bar Fácil',
    category: 'Projeto Comercial',
    type: 'comercial',
    year: '2024',
    status: 'andamento',
    image: '/images/web/portfolio-bar-facil.jpg',
    description:
      'Edifício comercial de esquina com fachada curva em ripado e vidro, praça ajardinada com espelho d\'água e terraço verde no alto. Por dentro, o escritório da Bar Fácil ganha estações de trabalho, salas de reunião e áreas de convivência com a identidade da marca.',
  },
  {
    title: 'WR Caminhões',
    category: 'Projeto Comercial',
    type: 'comercial',
    year: '',
    status: 'projeto',
    image: '/images/web/portfolio-wr-caminhoes.jpg',
    description:
      'Sede de uma concessionária de caminhões, com grandes galpões, pátio de exposição e as letras da marca em destaque na fachada. O projeto organiza oficinas, docas e estacionamento em um conjunto amplo e ajardinado.',
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

/** Identificação do projeto no endereço e nas galerias: 'casa-lago' */
export const projectSlug = (p: Project) => p.slug ?? slugify(p.title)

/** Endereço da página de um projeto */
export const projectUrl = (p: Project) => `/projetos/${projectSlug(p)}`

/** Âncora da seção de interiores na página do projeto */
export const INTERIORS_ID = 'interiores'
