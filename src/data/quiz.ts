// Teste "Descubra sua casa": estilo de casa (sem mostrar casas de clientes) e, para quem
// ainda não tem terreno, um guia do terreno ideal.

export type StyleId = 'tropical' | 'minimal' | 'montanha' | 'classica' | 'urbana'

export interface HouseStyle {
  id: StyleId
  name: string
  tagline: string
  description: string
  elements: string[]
  palette: { name: string; color: string }[]
}

export const STYLES: Record<StyleId, HouseStyle> = {
  tropical: {
    id: 'tropical',
    name: 'Contemporânea Tropical',
    tagline: 'Madeira, pedra e muito verde',
    description:
      'Uma casa aberta para o jardim e para a piscina, com grandes beirais que fazem sombra e varandas que viram sala. A madeira aquece, a pedra dá peso e o paisagismo exuberante deixa clima de férias o ano inteiro.',
    elements: ['Madeira ripada e pedra natural', 'Beirais largos e varandas integradas', 'Piscina e jardim como extensão da sala'],
    palette: [
      { name: 'Madeira', color: '#a0714a' },
      { name: 'Pedra', color: '#b7a58c' },
      { name: 'Folha', color: '#5d6b45' },
      { name: 'Areia', color: '#e8dfd3' },
    ],
  },
  minimal: {
    id: 'minimal',
    name: 'Minimalista Clara',
    tagline: 'Luz, vidro e linhas puras',
    description:
      'Volumes brancos, poucos materiais e nenhum excesso. A luz natural é a protagonista: grandes panos de vidro, ambientes integrados e um jardim enxuto que deixa a arquitetura falar.',
    elements: ['Volumes brancos e linhas retas', 'Grandes panos de vidro', 'Ambientes integrados, sem excessos'],
    palette: [
      { name: 'Branco', color: '#f4f2ee' },
      { name: 'Areia', color: '#e2dbd1' },
      { name: 'Cinza', color: '#c9c6c0' },
      { name: 'Madeira clara', color: '#c9a77c' },
    ],
  },
  montanha: {
    id: 'montanha',
    name: 'Refúgio de Montanha',
    tagline: 'Aconchego com vista',
    description:
      'Para quem sonha com lareira acesa, vista para o verde e uma casa que abraça. Estrutura aparente, madeira e pedra em abundância, coberturas marcantes e janelas que enquadram a paisagem.',
    elements: ['Estrutura aparente em madeira', 'Lareira e pedra natural', 'Janelas que emolduram a paisagem'],
    palette: [
      { name: 'Madeira escura', color: '#6b4a33' },
      { name: 'Pedra', color: '#8f8577' },
      { name: 'Mata', color: '#3f4a35' },
      { name: 'Linho', color: '#ddd3c4' },
    ],
  },
  classica: {
    id: 'classica',
    name: 'Clássica Contemporânea',
    tagline: 'Elegância que não sai de moda',
    description:
      'Simetria, proporção e detalhes atemporais, reinterpretados com o conforto de hoje. Arcos, colunas e esquadrias finas sobre uma base clara, com um jardim desenhado na medida.',
    elements: ['Arcos e colunas', 'Fachada simétrica em tons claros', 'Jardim desenhado e detalhes em ferro'],
    palette: [
      { name: 'Off-white', color: '#f3eee6' },
      { name: 'Pedra clara', color: '#d8cbb8' },
      { name: 'Oliva', color: '#6b6852' },
      { name: 'Preto', color: '#2b2a27' },
    ],
  },
  urbana: {
    id: 'urbana',
    name: 'Urbana Escura',
    tagline: 'Contraste e personalidade',
    description:
      'Tons escuros, texturas marcantes e jogos de luz e sombra. Cobogós e brises filtram a luz e garantem privacidade, enquanto a madeira e o verde quebram a sobriedade do conjunto.',
    elements: ['Fachada em tons escuros', 'Cobogó e brises que filtram a luz', 'Madeira e verde para contrastar'],
    palette: [
      { name: 'Grafite', color: '#3a3a38' },
      { name: 'Preto', color: '#1f1f1e' },
      { name: 'Madeira', color: '#9a6b45' },
      { name: 'Verde', color: '#55603f' },
    ],
  },
}

// Ordem de desempate quando dois estilos somam o mesmo
const STYLE_ORDER: StyleId[] = ['tropical', 'minimal', 'urbana', 'montanha', 'classica']

/** Como cada opção é desenhada: ilustração em traço, amostra de material, paleta ou ícone */
export type OptionArt =
  | { kind: 'drawing'; id: string }
  | { kind: 'swatch'; id: 'wood' | 'stone' | 'plaster' | 'dark' }
  | { kind: 'palette'; colors: string[] }
  | { kind: 'icon'; id: string }

export interface QuizOption {
  id: string
  label: string
  hint?: string
  art?: OptionArt
  scores?: Partial<Record<StyleId, number>>
}

export interface QuizQuestion {
  id: string
  title: string
  subtitle?: string
  options: QuizOption[]
}

export const HAS_LAND: QuizQuestion = {
  id: 'terreno',
  title: 'Você já tem terreno?',
  subtitle: 'Se ainda não tiver, o teste também te ajuda a saber qual procurar.',
  options: [
    { id: 'sim', label: 'Sim, já tenho', art: { kind: 'icon', id: 'check' } },
    { id: 'nao', label: 'Ainda não', art: { kind: 'icon', id: 'map' } },
    { id: 'escolhendo', label: 'Estou escolhendo entre alguns', art: { kind: 'icon', id: 'compare' } },
  ],
}

export const FLOORS: QuizQuestion = {
  id: 'pavimentos',
  title: 'Térrea ou sobrado?',
  options: [
    { id: 'terrea', label: 'Térrea', hint: 'Tudo no mesmo nível', art: { kind: 'drawing', id: 'house-terrea' } },
    { id: 'sobrado', label: 'Sobrado', hint: 'Dois pavimentos', art: { kind: 'drawing', id: 'house-sobrado' } },
    { id: 'tanto-faz', label: 'Tanto faz', hint: 'O projeto decide', art: { kind: 'drawing', id: 'house-both' } },
  ],
}

export const LAND_QUESTIONS: QuizQuestion[] = [
  {
    id: 'quartos',
    title: 'Quantos quartos você precisa?',
    options: [
      { id: '2', label: '2 quartos', art: { kind: 'icon', id: 'bed' } },
      { id: '3', label: '3 quartos', art: { kind: 'icon', id: 'bed' } },
      { id: '4', label: '4 ou mais', art: { kind: 'icon', id: 'bed' } },
    ],
  },
  FLOORS,
  {
    id: 'carros',
    title: 'Quantos carros na garagem?',
    options: [
      { id: '1', label: '1 carro', art: { kind: 'icon', id: 'car' } },
      { id: '2', label: '2 carros', art: { kind: 'icon', id: 'car' } },
      { id: '3', label: '3 ou mais', art: { kind: 'icon', id: 'car' } },
    ],
  },
  {
    id: 'lazer',
    title: 'Como você imagina a área de lazer?',
    options: [
      { id: 'piscina', label: 'Piscina e área gourmet', art: { kind: 'icon', id: 'pool' } },
      { id: 'jardim', label: 'Quintal e jardim', art: { kind: 'icon', id: 'garden' } },
      { id: 'essencial', label: 'Só o essencial', art: { kind: 'icon', id: 'sprout' } },
    ],
  },
  {
    id: 'lugar',
    title: 'Onde você se imagina morando?',
    options: [
      { id: 'cidade', label: 'Perto de tudo', hint: 'Bairro na cidade', art: { kind: 'icon', id: 'city' } },
      { id: 'condominio', label: 'Condomínio fechado', hint: 'Segurança e lazer', art: { kind: 'icon', id: 'lock' } },
      { id: 'natureza', label: 'Mais afastado', hint: 'Perto da natureza', art: { kind: 'icon', id: 'mountain' } },
    ],
  },
  {
    id: 'vista',
    title: 'Vista ou privacidade?',
    options: [
      { id: 'vista', label: 'Quero vista', hint: 'Morro, mar ou campo', art: { kind: 'icon', id: 'sun' } },
      { id: 'privacidade', label: 'Prefiro privacidade', hint: 'Casa voltada para dentro', art: { kind: 'icon', id: 'lock' } },
      { id: 'tanto-faz', label: 'Tanto faz', art: { kind: 'icon', id: 'compare' } },
    ],
  },
]

export const STYLE_QUESTIONS: QuizQuestion[] = [
  {
    id: 'fachada',
    title: 'Qual fachada mais te atrai?',
    subtitle: 'Vá pela primeira impressão.',
    options: [
      { id: 'beirais', label: 'Beirais e madeira', art: { kind: 'drawing', id: 'facade-tropical' }, scores: { tropical: 3 } },
      { id: 'cubos', label: 'Volumes puros', art: { kind: 'drawing', id: 'facade-minimal' }, scores: { minimal: 3 } },
      { id: 'telhado', label: 'Telhado marcante', art: { kind: 'drawing', id: 'facade-montanha' }, scores: { montanha: 3 } },
      { id: 'arcos', label: 'Arcos e simetria', art: { kind: 'drawing', id: 'facade-classica' }, scores: { classica: 3 } },
      { id: 'escura', label: 'Caixa escura', art: { kind: 'drawing', id: 'facade-urbana' }, scores: { urbana: 3 } },
    ],
  },
  {
    id: 'material',
    title: 'Que material você mais quer ver na sua casa?',
    options: [
      { id: 'madeira', label: 'Madeira', art: { kind: 'swatch', id: 'wood' }, scores: { tropical: 2, montanha: 2 } },
      { id: 'pedra', label: 'Pedra natural', art: { kind: 'swatch', id: 'stone' }, scores: { montanha: 2, tropical: 1 } },
      { id: 'branco', label: 'Reboco claro', art: { kind: 'swatch', id: 'plaster' }, scores: { minimal: 2, classica: 1 } },
      { id: 'escuro', label: 'Concreto e metal', art: { kind: 'swatch', id: 'dark' }, scores: { urbana: 2 } },
    ],
  },
  {
    id: 'cores',
    title: 'Qual paleta tem mais a sua cara?',
    options: [
      { id: 'terrosos', label: 'Terrosos', art: { kind: 'palette', colors: ['#6b4a33', '#a0714a', '#b7a58c', '#5d6b45'] }, scores: { tropical: 2, montanha: 1 } },
      { id: 'claros', label: 'Branco e areia', art: { kind: 'palette', colors: ['#f4f2ee', '#e2dbd1', '#c9c6c0', '#c9a77c'] }, scores: { minimal: 2, classica: 1 } },
      { id: 'escuros', label: 'Preto e grafite', art: { kind: 'palette', colors: ['#1f1f1e', '#3a3a38', '#9a6b45', '#55603f'] }, scores: { urbana: 2 } },
      { id: 'contraste', label: 'Off-white e preto', art: { kind: 'palette', colors: ['#f3eee6', '#d8cbb8', '#6b6852', '#2b2a27'] }, scores: { classica: 2, minimal: 1 } },
    ],
  },
  {
    id: 'fim-de-semana',
    title: 'Como é o fim de semana perfeito em casa?',
    options: [
      { id: 'piscina', label: 'Piscina com os amigos', art: { kind: 'icon', id: 'pool' }, scores: { tropical: 2 } },
      { id: 'lareira', label: 'Lareira e um vinho', art: { kind: 'icon', id: 'fire' }, scores: { montanha: 2 } },
      { id: 'livro', label: 'Casa em ordem e um bom livro', art: { kind: 'icon', id: 'book' }, scores: { minimal: 2 } },
      { id: 'jantar', label: 'Receber para um jantar', art: { kind: 'icon', id: 'dinner' }, scores: { classica: 2 } },
      { id: 'terraco', label: 'Terraço e vida na cidade', art: { kind: 'icon', id: 'city' }, scores: { urbana: 2 } },
    ],
  },
  {
    id: 'janelas',
    title: 'Como você imagina as janelas?',
    options: [
      { id: 'vidro', label: 'Grandes panos de vidro', art: { kind: 'drawing', id: 'win-glass' }, scores: { minimal: 2, tropical: 1 } },
      { id: 'arco', label: 'Em arco', art: { kind: 'drawing', id: 'win-arch' }, scores: { classica: 2 } },
      { id: 'cobogo', label: 'Cobogó filtrando a luz', art: { kind: 'drawing', id: 'win-cobogo' }, scores: { urbana: 2, tropical: 1 } },
      { id: 'paisagem', label: 'Emoldurando a paisagem', art: { kind: 'drawing', id: 'win-landscape' }, scores: { montanha: 2 } },
    ],
  },
  {
    id: 'jardim',
    title: 'E o jardim?',
    options: [
      { id: 'tropical', label: 'Tropical, cheio de folhagens', art: { kind: 'icon', id: 'palm' }, scores: { tropical: 2 } },
      { id: 'mata', label: 'Mata nativa', art: { kind: 'icon', id: 'pine' }, scores: { montanha: 2 } },
      { id: 'gramado', label: 'Gramado e uma árvore', art: { kind: 'icon', id: 'tree' }, scores: { minimal: 2 } },
      { id: 'desenhado', label: 'Desenhado e simétrico', art: { kind: 'icon', id: 'flower' }, scores: { classica: 2 } },
      { id: 'vertical', label: 'Vasos e jardim vertical', art: { kind: 'icon', id: 'sprout' }, scores: { urbana: 2 } },
    ],
  },
]

export type Answers = Record<string, string>

export const needsLandGuide = (a: Answers) => a.terreno !== undefined && a.terreno !== 'sim'

/** Perguntas na ordem em que aparecem, conforme as respostas até aqui */
export const questionsFor = (a: Answers): QuizQuestion[] => [
  HAS_LAND,
  ...(needsLandGuide(a) ? LAND_QUESTIONS : []),
  ...STYLE_QUESTIONS,
  // Quem não passou pelo guia do terreno responde só no final
  ...(needsLandGuide(a) ? [] : [FLOORS]),
]

export const isComplete = (a: Answers) => questionsFor(a).every((q) => a[q.id] !== undefined)

export function styleFor(a: Answers): HouseStyle {
  const total: Record<StyleId, number> = { tropical: 0, minimal: 0, montanha: 0, classica: 0, urbana: 0 }
  for (const q of STYLE_QUESTIONS) {
    const scores = q.options.find((o) => o.id === a[q.id])?.scores ?? {}
    for (const [s, n] of Object.entries(scores)) total[s as StyleId] += n
  }
  const best = STYLE_ORDER.reduce((b, s) => (total[s] > total[b] ? s : b), STYLE_ORDER[0])
  return STYLES[best]
}

// Lotes comuns na região, do menor para o maior
const LOTS = [
  { area: 300, size: '12 × 25 m' },
  { area: 360, size: '12 × 30 m' },
  { area: 450, size: '15 × 30 m' },
  { area: 600, size: '20 × 30 m' },
  { area: 800, size: '20 × 40 m' },
  { area: 1000, size: '25 × 40 m' },
]

export interface LandGuide {
  houseArea: number
  lot: { area: number; size: string }
  terrain: { title: string; text: string }
  place: { title: string; text: string }
  sun: string
  checklist: string[]
}

/**
 * Estimativa para orientar a busca: área da casa pelo programa, projeção no lote conforme
 * os pavimentos, ocupação de ~60% e espaço livre para o lazer.
 */
export function landGuideFor(a: Answers): LandGuide {
  const rooms = { '2': 130, '3': 180, '4': 250 }[a.quartos] ?? 180
  const cars = Number(a.carros) || 2
  const houseArea = Math.round((rooms + cars * 15 + (a.lazer === 'piscina' ? 30 : 0)) / 10) * 10
  const footprint = houseArea * (a.pavimentos === 'sobrado' ? 0.6 : a.pavimentos === 'terrea' ? 1 : 0.8)
  const outdoor = { piscina: 80, jardim: 60, essencial: 20 }[a.lazer] ?? 40
  const needed = footprint / 0.6 + outdoor
  const lot = LOTS.find((l) => l.area >= needed) ?? LOTS[LOTS.length - 1]

  const terrain =
    a.vista === 'vista'
      ? {
          title: 'Aclive ou declive',
          text: 'Um terreno em desnível rende vista e pode até abrigar a garagem no nível da rua. Custa um pouco mais em fundação e contenção, mas o resultado compensa.',
        }
      : a.vista === 'privacidade'
        ? {
            title: 'Plano',
            text: 'É o mais simples e econômico de construir. A privacidade vem do projeto: pátios internos, muros verdes e aberturas voltadas para dentro do lote.',
          }
        : {
            title: 'Plano ou com leve desnível',
            text: 'Terrenos planos custam menos na obra; um leve desnível pode virar um diferencial no projeto, com níveis e vistas.',
          }

  const place =
    a.lugar === 'condominio'
      ? {
          title: 'Condomínio',
          text: 'Leia o regulamento de construção antes de comprar: ele define recuos, altura, muros e às vezes até materiais.',
        }
      : a.lugar === 'natureza'
        ? {
            title: 'Área mais afastada',
            text: 'Confira o acesso, a rede de energia e água e como será o esgoto. Lotes maiores permitem uma casa espalhada pelo jardim.',
          }
        : {
            title: 'Lote urbano',
            text: 'Confira o zoneamento e os recuos obrigatórios. Lote de esquina tem duas frentes e mais recuos, então costuma pedir mais área.',
          }

  return {
    houseArea,
    lot,
    terrain,
    place,
    sun: 'Prefira lotes em que o fundo — onde ficam as salas e o lazer — esteja voltado para o norte: aqui no Sul, é o lado que recebe sol o ano todo.',
    checklist: [
      'Matrícula e escritura em dia',
      'Consulta de viabilidade na prefeitura (zoneamento, recuos e taxa de ocupação)',
      'Água, energia e esgoto disponíveis',
      'Histórico de alagamento e tipo de solo',
      'Medidas reais conferidas por um levantamento topográfico',
    ],
  }
}

/** Mensagem para o WhatsApp com o resultado já escrito */
export function resultMessage(a: Answers): string {
  const style = styleFor(a)
  const floors = { terrea: 'casa térrea', sobrado: 'sobrado' }[a.pavimentos]
  const parts = [`Olá! Fiz o teste no site e meu estilo é ${style.name}`]
  if (floors) parts.push(`, ${floors}`)
  if (a.lazer === 'piscina') parts.push(', com piscina e área gourmet')
  parts.push('.')
  if (a.terreno === 'sim') {
    parts.push(' Já tenho terreno e gostaria de agendar uma visita técnica.')
  } else if (needsLandGuide(a)) {
    const g = landGuideFor(a)
    const situation = a.terreno === 'escolhendo' ? 'Estou escolhendo o terreno' : 'Ainda não tenho terreno'
    parts.push(
      ` ${situation} — o teste indicou a partir de ${g.lot.area} m² (${g.lot.size}), ${g.terrain.title.toLowerCase()}.` +
        ' Gostaria de ajuda para escolher.'
    )
  }
  return parts.join('')
}

/** Respostas ↔ endereço, para compartilhar o resultado */
export const answersToQuery = (a: Answers) => new URLSearchParams(a).toString()

export function answersFromQuery(search: string): Answers | null {
  const params = new URLSearchParams(search)
  const a: Answers = {}
  for (const q of [HAS_LAND, ...LAND_QUESTIONS, ...STYLE_QUESTIONS]) {
    const v = params.get(q.id)
    if (v && q.options.some((o) => o.id === v)) a[q.id] = v
  }
  return isComplete(a) ? a : null
}
