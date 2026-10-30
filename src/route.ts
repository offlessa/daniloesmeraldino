/** Endereço do teste "Descubra sua casa" */
export const QUIZ_PATH = '/descubra'

/** Rota atual a partir do endereço (o site não usa roteador; cada página é um carregamento) */
const path = window.location.pathname.replace(/\/$/, '')
const projectMatch = path.match(/^\/projetos\/([^/]+)$/)

export const route = projectMatch
  ? ({ page: 'project', slug: decodeURIComponent(projectMatch[1]) } as const)
  : path === '/projetos'
    ? ({ page: 'projects' } as const)
    : path === QUIZ_PATH
      ? ({ page: 'quiz' } as const)
      : ({ page: 'home' } as const)

/** A abertura com a logo só aparece na página inicial */
export const IS_HOME = route.page === 'home'
