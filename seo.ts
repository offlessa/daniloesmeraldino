import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { Plugin } from 'vite'
import { projects, projectUrl, slugify } from './src/data/projects'
import { DEFAULT_LOCATION } from './src/data/locations'

export const SITE = 'https://www.daniloesmeraldino.com.br'
const BRAND = 'Danilo Esmeraldino'

interface Page {
  path: string
  title: string
  description: string
  image: string
}

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const clip = (s: string, max = 160) => {
  const flat = s.replace(/\s+/g, ' ').trim()
  return flat.length <= max ? flat : `${flat.slice(0, max - 1).replace(/\s+\S*$/, '')}…`
}

/** Bloco de título, descrição e prévia de link (WhatsApp, Facebook, Google) de uma página. */
export function seoTags({ path, title, description, image }: Page) {
  const url = `${SITE}${path}`
  const img = `${SITE}${image}`
  return [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:site_name" content="${BRAND}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join('\n    ')
}

function projectPage(p: (typeof projects)[number]): Page {
  const location = p.location ?? DEFAULT_LOCATION
  const og = `/images/og/${slugify(p.title)}.jpg`
  return {
    path: projectUrl(p),
    title: `${p.title} — ${location} | ${BRAND}`,
    description: clip(
      p.description ??
        `${p.title}, ${p.category.toLowerCase()} em ${location} — projeto do Estúdio Danilo Esmeraldino. ` +
          'Arquitetura, engenharia e interiores sob um mesmo acompanhamento, do primeiro traço à obra entregue.'
    ),
    image: existsSync(`public${og}`) ? og : p.image,
  }
}

const pages: Page[] = [
  {
    path: '/projetos',
    title: `Todos os projetos | ${BRAND}`,
    description:
      'Residências, espaços comerciais e interiores do Estúdio Danilo Esmeraldino em Tubarão e região — obras entregues e projetos em andamento.',
    image: '/images/og/site.jpg',
  },
  ...projects.map(projectPage),
]

const SEO_BLOCK = /<!-- seo -->[\s\S]*?<!-- \/seo -->/

/**
 * Depois do build, gera uma cópia do index.html para cada página (/projetos e /projetos/<casa>)
 * com título, descrição e foto próprios — é o que o Google e o WhatsApp leem —
 * e o sitemap.xml com todos os endereços.
 */
export function seo(): Plugin {
  let outDir = 'dist'
  return {
    name: 'seo-pages',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const html = readFileSync(join(outDir, 'index.html'), 'utf8')
      if (!SEO_BLOCK.test(html)) throw new Error('index.html sem o bloco <!-- seo --> … <!-- /seo -->')

      for (const page of pages) {
        const dir = join(outDir, page.path)
        mkdirSync(dir, { recursive: true })
        writeFileSync(
          join(dir, 'index.html'),
          html.replace(SEO_BLOCK, `<!-- seo -->\n    ${seoTags(page)}\n    <!-- /seo -->`)
        )
      }

      const today = new Date().toISOString().slice(0, 10)
      const urls = ['/', ...pages.map((p) => p.path)]
        .map((path) => `  <url><loc>${SITE}${path}</loc><lastmod>${today}</lastmod></url>`)
        .join('\n')
      writeFileSync(
        join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
      )
    },
  }
}
