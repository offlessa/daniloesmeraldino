// Versões leves das fotos (WebP com 800 e 1400 px de largura) para o navegador escolher a
// menor que serve para a tela: o celular não baixa a foto de 2000 px.
//
// Existem para todas as fotos em /images/web (geradas junto com o site) e para as enviadas
// pelo painel com o final "-r.jpg" (o painel gera as versões na hora do envio).

const STATIC = /^\/images\/web\/.+\.jpg$/
const UPLOADED = /\/storage\/v1\/object\/public\/fotos\/.+-r\.jpg$/

export const VARIANT_WIDTHS = [800, 1400] as const

/** Lista de tamanhos para o atributo srcSet (undefined se a foto não tem versões leves) */
export function srcSet(src: string | undefined) {
  if (!src || !(STATIC.test(src) || UPLOADED.test(src))) return undefined
  const base = src.replace(/\.jpg$/, '')
  return [...VARIANT_WIDTHS.map((w) => `${base}.${w}.webp ${w}w`), `${src} 2000w`].join(', ')
}

/** Largura que a foto ocupa na tela, para o navegador escolher a versão (atributo sizes) */
export const SIZES = {
  full: '100vw',
  /** Cards de "Todos os projetos" (3, 2 ou 1 por linha) */
  card: '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  /** Galeria da obra: largura máxima do conteúdo */
  gallery: '(min-width: 1280px) 1152px, 100vw',
  /** Foto em par na galeria */
  half: '(min-width: 1280px) 576px, (min-width: 640px) 50vw, 100vw',
  /** Fotos de meia tela da página inicial */
  wide: '(min-width: 1024px) 60vw, 100vw',
} as const
