// Perguntas frequentes da página inicial. Estes são os textos originais; o administrador muda
// cada um pelo modo edição (chaves faq.q0/faq.a0…). Também alimentam o resumo que o Google lê
// (seo.ts), então ficam aqui e não dentro do componente.
//
// Marcação: *itálico* e [texto](endereço) para link.

export const FAQ_SLOTS = 8

export const FAQ: { q: string; a: string }[] = [
  {
    q: 'Quanto custa um projeto?',
    a: 'Depende do tamanho da obra, da complexidade e dos projetos de que você precisa — arquitetura, complementares, interiores. Depois de uma primeira conversa, enviamos um orçamento detalhado e sem compromisso.',
  },
  {
    q: 'Quanto tempo leva para o projeto ficar pronto?',
    a: 'O prazo varia conforme o tamanho da casa e as etapas contratadas. Já na primeira conversa apresentamos um cronograma, da consultoria à aprovação na prefeitura.',
  },
  {
    q: 'O que está incluído?',
    a: 'Podemos cuidar de tudo sob um mesmo acompanhamento: projeto arquitetônico, estrutural, hidrossanitário, elétrico, comunicação, interiores e paisagismo, além da aprovação na prefeitura e do acompanhamento de obra.',
  },
  {
    q: 'Vocês acompanham a obra?',
    a: 'Sim. A obra pode ser acompanhada pela mesma equipe que desenhou o projeto, com cronograma e controle de qualidade até a entrega.',
  },
  {
    q: 'Atendem fora de Tubarão?',
    a: 'Sim. Temos presença em Santa Catarina e no Rio Grande do Sul, com atendimento presencial na região e remoto para todo o Brasil.',
  },
  {
    q: 'Ainda não tenho terreno. Vocês ajudam?',
    a: 'Ajudamos. Na consultoria fazemos a leitura técnica do terreno antes da compra. Para começar, faça o nosso teste [Qual casa combina com você?](/descubra) — ele também indica que lote procurar.',
  },
  {
    q: 'Fazem só interiores ou reforma?',
    a: 'Sim. Além de casas e espaços comerciais completos, fazemos projetos só de interiores e reformas.',
  },
]

/** Tira a marcação para texto puro (usado no resumo para o Google) */
export const plain = (text: string) => text.replace(/\*([^*]+)\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
