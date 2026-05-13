/**
 * Constantes da aplicação - Informações da empresa
 */

export const COMPANY = {
  name: 'Danilo Esmeraldino',
  slogan: 'Construções de Alto Padrão',
  description:
    'Empresa especializada em construção residencial e comercial de alto padrão em Tubarão - SC',
  location: 'Tubarão - SC',
  address: 'Rua Principal, 1000',
  city: 'Tubarão',
  state: 'SC',
  zipCode: '88015-200',
  foundedYear: 2009,
}

export const CONTACT = {
  phone: '+5548988285002',
  phoneFormatted: '(48) 3234-5678',
  email: 'contato@metrica.com.br',
  whatsapp: '5548988285002', // Sem símbolos
}

export const SOCIAL_MEDIA = {
  facebook: 'https://facebook.com/metrica-construcoes',
  instagram: 'https://instagram.com/metrica_construcoes',
  linkedin: 'https://linkedin.com/company/metrica-construcoes',
  youtube: 'https://youtube.com/c/metrica-construcoes',
}

export const SERVICES = [
  {
    id: 'residential',
    title: 'Construção Residencial',
    description: 'Projetos de alto padrão com acabamento premium',
    icon: 'Building2',
  },
  {
    id: 'commercial',
    title: 'Construção Comercial',
    description: 'Soluções comerciais modernas e funcionalidade otimizada',
    icon: 'Briefcase',
  },
  {
    id: 'management',
    title: 'Gerenciamento de Obras',
    description: 'Controle total do projeto com prazos garantidos',
    icon: 'Wrench',
  },
  {
    id: 'reform',
    title: 'Reformas e Retrofit',
    description: 'Modernização e revitalização completa de espaços',
    icon: 'Hammer',
  },
  {
    id: 'turnkey',
    title: 'Projetos Turnkey',
    description: 'Soluções "chave na mão" - do projeto à entrega',
    icon: 'Palette',
  },
  {
    id: 'team',
    title: 'Equipe Especializada',
    description: 'Profissionais experientes e comprometidos',
    icon: 'Users',
  },
]

export const STATS = [
  { number: '15+', label: 'Anos de Experiência' },
  { number: '100+', label: 'Projetos Completos' },
  { number: '98%', label: 'Clientes Satisfeitos' },
  { number: '50+', label: 'Profissionais na Equipe' },
]

export const PROCESS_STEPS = [
  {
    step: 1,
    title: 'Consultoria e Projeto',
    description:
      'Entendemos suas necessidades e desenvolvemos um projeto personalizado',
    duration: '1-2 semanas',
  },
  {
    step: 2,
    title: 'Execução da Obra',
    description:
      'Equipe especializada executando com cronograma rigoroso e qualidade garantida',
    duration: '12+ semanas',
  },
  {
    step: 3,
    title: 'Inspeção Final',
    description: 'Verificação minuciosa de cada detalhe e ajustes finais',
    duration: '1-2 semanas',
  },
  {
    step: 4,
    title: 'Entrega e Suporte',
    description: 'Entrega formal e suporte pós-obra por até 12 meses',
    duration: 'Contínuo',
  },
]

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Carlos Silveira',
    company: 'CEO, Silveira Imóveis',
    text: 'Excelência em cada detalhe. A Danilo Esmeraldino superou todas as nossas expectativas.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Marina Costa',
    company: 'Diretora, Tech Solutions',
    text: 'Prédio comercial entregue no prazo com qualidade impecável.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Roberto Gomes',
    company: 'Proprietário, Gomes & Cia',
    text: 'Reforma completa resultou em espaço moderno e funcional.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Fernanda Luz',
    company: 'Gerente, Centro de Saúde',
    text: 'Projeto turnkey impecável. Profissionalismo de primeira qualidade.',
    rating: 5,
  },
]

export const PORTFOLIO_PROJECTS = [
  {
    id: 1,
    title: 'Residencial Vertentes',
    category: 'Residencial',
    description: 'Condomínio de 12 unidades com acabamento premium',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  },
  {
    id: 2,
    title: 'Shopping Mall Construções',
    category: 'Comercial',
    description: 'Centro comercial de 5.000 m²',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1486429082519-e21cc028cb29?w=800&q=80',
  },
  {
    id: 3,
    title: 'Edifício Corporate Tower',
    category: 'Comercial',
    description: 'Prédio de 20 andares para empresas de tecnologia',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
  },
  {
    id: 4,
    title: 'Reforma Hotel Costão',
    category: 'Reforma',
    description: 'Modernização completa e retrofit',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1551524164-0fcb2d5f9240?w=800&q=80',
  },
  {
    id: 5,
    title: 'Complexo Residencial Elite',
    category: 'Residencial',
    description: 'Loteamento com 30 casarões de alto padrão',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  },
  {
    id: 6,
    title: 'Centro Administrativo',
    category: 'Comercial',
    description: 'Prédio sustentável com tecnologia Green Building',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1486529313052-faf7ee9c7b04?w=800&q=80',
  },
]

export const COMPANY_VALUES = [
  { title: 'Excelência', description: 'Qualidade em cada detalhe' },
  { title: 'Confiança', description: 'Transparência e credibilidade' },
  { title: 'Inovação', description: 'Tecnologia e modernidade' },
  { title: 'Sustentabilidade', description: 'Construções responsáveis' },
]

export const NAVIGATION_LINKS = [
  { label: 'Início', id: 'hero' },
  { label: 'Diferencial', id: 'authority' },
  { label: 'Portfólio', id: 'portfolio' },
  { label: 'Processo', id: 'process' },
  { label: 'Sobre', id: 'about' },
]

export const CTA_MESSAGES = {
  whatsapp: 'Olá! Gostaria de solicitar um orçamento para meu projeto de construção.',
  email: 'Gostaria de mais informações sobre os serviços de Danilo Esmeraldino.',
  phone: '(48) 3234-5678',
}

export const COLORS = {
  primary: {
    900: '#0f0e0c',
    800: '#2a2824',
    700: '#505047',
    600: '#7a7470',
    500: '#a09a92',
    400: '#c1bfb7',
    300: '#ddddd4',
    200: '#e7e9e2',
    100: '#f3f4f0',
    50: '#f9faf8',
  },
  accent: {
    900: '#052726',
    800: '#0d473e',
    700: '#166857',
    600: '#1f8970',
    500: '#2daa96',
    400: '#50bcc4',
    300: '#7ccdd2',
    200: '#a8dfe0',
    100: '#d4f0ed',
    50: '#f0f9f7',
  },
}

export const ANIMATION_DURATION = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
  verySlow: 1.2,
}

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}
