export interface Testimonial {
  name: string
  company: string
  text: string
  /** Endereço da casa do cliente (ex.: 'casa-lago'): o depoimento também aparece na página dela */
  project?: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Mayara Machado',
    company: '',
    text: 'O Danilo é um ótimo profissional! Pensa nos detalhes de tudo pra que a casa fique linda e funcional. Os projetos tem a identidade dele, a imponência das fachadas e detalhes de luxo e beleza. O projeto da nossa casa ficou lindo demais!',
  },
  {
    name: 'Gisele Margotti',
    company: 'Casa Pietra',
    text: 'Só elogios... atendimento top e de muita qualidade. Parabéns pelo trabalho! Projetos lindos e diferenciados! Um escritório que dá vida à nossos sonhos!',
  },
  {
    name: 'Didiane Almeida',
    company: '',
    text: 'Simplesmente o melhor, arrasa nas suas edificações, sabe transformar as ideias dos seus clientes em realidade',
  },
  {
    name: 'Mirely Fernandes',
    company: '',
    text: 'Super atenciosos e cuidadosos em todos detalhes, ótimos profissionais ❤️',
  },
  {
    name: 'Francielle Bitencourt',
    company: '',
    text: 'Profissional e equipe excelente, sabe identificar o perfil de cada cliente.',
  },
  {
    name: 'Erick Nunes',
    company: '',
    text: 'Ótimo profissional com ideias únicas! E uma equipe incrível.',
  },
  {
    name: 'Yan Bittencourt',
    company: '',
    text: 'Excelentes profissionais, super competentes.',
  },
  {
    name: 'Vagner De Pieri',
    company: '',
    text: 'Nota 10!',
  },
]
