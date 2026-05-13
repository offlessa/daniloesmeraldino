/**
 * Tipos e interfaces TypeScript para a aplicação
 */

export interface Project {
  id: number
  title: string
  category: 'Residencial' | 'Comercial' | 'Reforma'
  description: string
  image: string
  year: string
}

export interface Testimonial {
  id: number
  name: string
  company: string
  text: string
  rating: number
  image?: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
}

export interface ProcessStep {
  step: number
  title: string
  description: string
  duration: string
}

export interface Stat {
  number: string
  label: string
}

export interface NavLink {
  label: string
  id: string
}

export interface CompanyValue {
  title: string
  description: string
}

export interface ContactInfo {
  phone: string
  phoneFormatted: string
  email: string
  whatsapp: string
}

export interface CompanyInfo {
  name: string
  slogan: string
  description: string
  location: string
  address: string
  city: string
  state: string
  zipCode: string
  foundedYear: number
}

export interface SocialMedia {
  facebook: string
  instagram: string
  linkedin: string
  youtube: string
}

export interface Color {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
}

export interface Colors {
  primary: Color
  accent: Color
}

export interface AnimationDuration {
  fast: number
  normal: number
  slow: number
  verySlow: number
}

export interface Breakpoints {
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
}

export type DeviceType = 'mobile' | 'tablet' | 'desktop'
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl'

export interface FormData {
  name: string
  email: string
  phone: string
  message: string
}

export interface PortfolioFilter {
  category?: string
  year?: string
  search?: string
}

export interface AnimationVariants {
  hidden: Record<string, unknown>
  visible: Record<string, unknown>
}

export interface ScrollPosition {
  x: number
  y: number
}

export interface ViewportIntersection {
  isInView: boolean
  ref: React.RefObject<HTMLElement>
}
