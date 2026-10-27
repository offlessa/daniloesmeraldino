export const social = [
  { label: 'Instagram', url: 'https://instagram.com/daniloesmeraldino' },
  { label: 'Facebook', url: 'https://facebook.com/notivuss/' },
  {
    label: 'LinkedIn',
    url: 'https://linkedin.com/in/danilo-de-pieri-esmeraldino-647876118',
  },
] as const

export const WHATSAPP_NUMBER = '5548988285002'

/** Link do WhatsApp do estúdio com a mensagem já escrita */
export const whatsappUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
