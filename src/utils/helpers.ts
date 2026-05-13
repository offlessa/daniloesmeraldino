/**
 * Utilitários gerais para a aplicação
 */

/**
 * Classe para gerenciar classe CSS dinamicamente
 */
export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Scroll suave para um elemento
 */
export function scrollToElement(elementId: string, offset = 80) {
  const element = document.getElementById(elementId)
  if (element) {
    const top = element.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

/**
 * Formatar número para moeda brasileira
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formatar número de telefone
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

/**
 * Enviar mensagem via WhatsApp
 */
export function sendWhatsAppMessage(phoneNumber: string, message: string) {
  const encodedMessage = encodeURIComponent(message)
  const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
  window.open(url, '_blank')
}

/**
 * Copiar para clipboard
 */
export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/**
 * Gerar slug a partir de texto
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
    .replace(/[^\w-]/g, '') // Remove caracteres especiais
    .replace(/--+/g, '-') // Reduz múltiplos hífens
    .trim()
}

/**
 * Validar email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validar telefone brasileiro
 */
export function isValidBrazilianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 11 && cleaned[0] === '5' && cleaned[1] === '5'
}

/**
 * Delay assíncrono
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Obter cor para status/categoria
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
    default: 'bg-gray-500',
  }
  return colors[status] || colors.default
}

/**
 * Truncar texto
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Pluralizar palavra
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return singular
  return plural || singular + 's'
}

/**
 * Formatar data no padrão brasileiro
 */
export function formatDateBR(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(date)
}

/**
 * Calcular tempo desde uma data
 */
export function timeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'agora mesmo'
  if (diffMins < 60) return `${diffMins} minuto${diffMins > 1 ? 's' : ''} atrás`
  if (diffHours < 24) return `${diffHours} hora${diffHours > 1 ? 's' : ''} atrás`
  if (diffDays < 7) return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`

  return formatDateBR(date)
}

/**
 * Obter iniciais de um nome
 */
export function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .slice(0, 2)
    .map((name) => name[0].toUpperCase())
    .join('')
}

/**
 * Gerar cor a partir de string (para avatares)
 */
export function stringToColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  const hue = hash % 360
  return `hsl(${hue}, 70%, 60%)`
}

/**
 * Detectar navegador
 */
export function detectBrowser(): string {
  const ua = navigator.userAgent
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Safari')) return 'Safari'
  if (ua.includes('Edge')) return 'Edge'
  return 'Unknown'
}

/**
 * Detectar dispositivo
 */
export function detectDevice(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

/**
 * Verificar se está online
 */
export function isOnline(): boolean {
  return navigator.onLine
}

/**
 * Salvar no localStorage com expiração
 */
export function saveWithExpiry(key: string, value: string, expiryMs: number) {
  const item = {
    value,
    expiry: Date.now() + expiryMs,
  }
  localStorage.setItem(key, JSON.stringify(item))
}

/**
 * Recuperar do localStorage com verificação de expiração
 */
export function getWithExpiry(key: string): string | null {
  const itemStr = localStorage.getItem(key)
  if (!itemStr) return null

  const item = JSON.parse(itemStr)
  if (Date.now() > item.expiry) {
    localStorage.removeItem(key)
    return null
  }

  return item.value
}
