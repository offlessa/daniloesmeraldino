import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { Plugin } from 'vite'
import { projects as staticProjects, projectSlug, projectUrl, type Project } from './src/data/projects'
import { DEFAULT_LOCATION } from './src/data/locations'
import { FAQ, FAQ_SLOTS, plain } from './src/data/faq'
import { SUPABASE_ANON_KEY, SUPABASE_URL, type ProjectRow } from './src/lib/supabaseConfig'

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
  // Capa enviada pelo painel já vem com o endereço completo (armazenamento do Supabase)
  const img = /^https?:\/\//.test(image) ? image : `${SITE}${image}`
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

function projectPage(p: Project): Page {
  const location = p.location ?? DEFAULT_LOCATION
  const og = `/images/og/${projectSlug(p)}.jpg`
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

/** Consulta o banco do painel na hora do build (sem a biblioteca do Supabase) */
async function fromDb<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    })
    return res.ok ? ((await res.json()) as T) : null
  } catch {
    return null
  }
}

/**
 * Obras publicadas: as do banco (com o que o administrador mudou e as obras novas criadas
 * pelo painel). Se o banco não responder, as que vêm no código.
 */
async function loadProjects(): Promise<Project[]> {
  const rows = await fromDb<ProjectRow[]>('projects?select=*&published=eq.true&order=sort_order')
  if (!rows?.length) {
    console.warn('[seo] banco indisponível: usando as obras do código')
    return staticProjects
  }
  return rows
    .filter((r) => r.cover_url)
    .map((r) => ({
      slug: r.slug,
      title: r.title,
      category: r.category,
      type: r.type,
      year: r.year,
      status: r.status,
      image: r.cover_url,
      location: r.location ?? undefined,
      description: r.description ?? undefined,
    }))
}

/** Perguntas frequentes como o Google entende (FAQPage), com os textos atuais do site */
async function faqJsonLd() {
  const rows = (await fromDb<{ key: string; value: string }[]>('site_content?select=key,value&key=like.faq.*')) ?? []
  const texts = Object.fromEntries(rows.map((r) => [r.key, r.value]))
  const items = Array.from({ length: FAQ_SLOTS }, (_, i) => ({
    q: texts[`faq.q${i}`] ?? FAQ[i]?.q ?? '',
    a: texts[`faq.a${i}`] ?? FAQ[i]?.a ?? '',
    hidden: texts[`faq.hide${i}`] === '1',
  })).filter((f) => !f.hidden && f.q.trim() && f.a.trim())
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: plain(f.q),
      acceptedAnswer: { '@type': 'Answer', text: plain(f.a) },
    })),
  }
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`
}

const fixedPages: Page[] = [
  {
    path: '/projetos',
    title: `Todos os projetos | ${BRAND}`,
    description:
      'Residências, espaços comerciais e interiores do Estúdio Danilo Esmeraldino em Tubarão e região — obras entregues e projetos em andamento.',
    image: '/images/og/site.jpg',
  },
  {
    path: '/descubra',
    title: `Qual casa combina com você? | ${BRAND}`,
    description:
      'Responda algumas perguntas e descubra o estilo de casa que tem a sua cara — e, se ainda não tiver terreno, qual lote procurar.',
    image: '/images/og/site.jpg',
  },
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
    async closeBundle() {
      const html = readFileSync(join(outDir, 'index.html'), 'utf8')
      if (!SEO_BLOCK.test(html)) throw new Error('index.html sem o bloco <!-- seo --> … <!-- /seo -->')

      const pages = [...fixedPages, ...(await loadProjects()).map(projectPage)]
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

      // Página inicial: perguntas frequentes no formato do Google (só nela, depois das cópias)
      writeFileSync(join(outDir, 'index.html'), html.replace('</head>', `    ${await faqJsonLd()}\n  </head>`))
    },
  }
}
