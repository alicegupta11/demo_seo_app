/**
 * After `vite build`, SSR-renders each public route into a distinct HTML file
 * so crawlers see unique title/description/body without waiting for JS.
 *
 * Runs automatically as `postbuild`, or on demand: npm run seo:prerender
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

import { publicRoutes } from '../src/seo/routes.js'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(projectRoot, 'dist')
const templatePath = join(distDir, 'index.html')

/** Minimal localStorage stub so AuthProvider can render signed-out public pages. */
globalThis.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

const HEAD_TAG_RE =
  /<(?:title\b[^>]*>[\s\S]*?<\/title|meta\b[^>]*\/?|link\b[^>]*rel=["']canonical["'][^>]*\/?|script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script)>/gi

function extractHeadTags(markup) {
  const headTags = []
  const body = markup.replace(HEAD_TAG_RE, (tag) => {
    headTags.push(tag)
    return ''
  })
  return { headTags, body }
}

function findTag(tags, test) {
  return tags.find((tag) => test(tag)) ?? null
}

function replaceOrInsertMeta(html, attribute, tag) {
  if (!tag) return html
  const pattern = new RegExp(`<meta\\b[^>]*${attribute}[^>]*>`, 'i')
  if (pattern.test(html)) {
    return html.replace(pattern, tag)
  }
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

function stripPreviouslyInjected(html) {
  return html
    .replace(/\s*<link\b[^>]*rel=["']canonical["'][^>]*>/gi, '')
    .replace(/\s*<meta\b[^>]*property=["']og:[^"']+["'][^>]*>/gi, '')
    .replace(/\s*<meta\b[^>]*name=["']twitter:[^"']+["'][^>]*>/gi, '')
    .replace(/\s*<script type=["']application\/ld\+json["']>\{[^\n<]*\}<\/script>/g, '')
}

function injectIntoTemplate(template, headTags, bodyHtml) {
  const title = findTag(headTags, (tag) => /^<title\b/i.test(tag))
  const description = findTag(headTags, (tag) => /\bname=["']description["']/i.test(tag))
  const robots = findTag(headTags, (tag) => /\bname=["']robots["']/i.test(tag))
  const extras = headTags.filter(
    (tag) => tag !== title && tag !== description && tag !== robots,
  )

  let html = stripPreviouslyInjected(template)

  if (title) {
    html = html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, title)
  }
  html = replaceOrInsertMeta(html, 'name=["\']description["\']', description)
  html = replaceOrInsertMeta(html, 'name=["\']robots["\']', robots)

  if (extras.length > 0) {
    html = html.replace(/\s*<\/head>/i, `\n    ${extras.join('\n    ')}\n  </head>`)
  }

  if (!/<div id="root">/.test(html)) {
    throw new Error('dist/index.html is missing <div id="root">')
  }

  return html.replace(
    /<div id="root">[\s\S]*<\/div>(\s*<\/body>)/,
    `<div id="root">${bodyHtml}</div>$1`,
  )
}

function outputPathFor(routePath) {
  if (routePath === '/') {
    return join(distDir, 'index.html')
  }
  return join(distDir, routePath.replace(/^\//, ''), 'index.html')
}

const template = await readFile(templatePath, 'utf8')

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'silent',
})

const { default: App } = await server.ssrLoadModule('/src/App.jsx')
const { AuthProvider } = await server.ssrLoadModule('/src/auth/AuthContext.jsx')

let StaticRouter
try {
  ;({ StaticRouter } = await import('react-router-dom/server'))
} catch {
  ;({ StaticRouter } = await import('react-router'))
}

for (const route of publicRoutes) {
  const markup = renderToStaticMarkup(
    h(StaticRouter, { location: route.path }, h(AuthProvider, null, h(App))),
  )
  const { headTags, body } = extractHeadTags(markup)
  const html = injectIntoTemplate(template, headTags, body)
  const outPath = outputPathFor(route.path)

  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, html, 'utf8')
  console.log(`[seo] prerendered ${route.path} -> ${outPath.slice(projectRoot.length + 1)}`)
}

await server.close()
