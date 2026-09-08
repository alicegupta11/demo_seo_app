/**
 * Renders each route through react-dom/server and prints the resulting head
 * tags, so SEO regressions show up without opening a browser.
 *
 * Run with: npm run seo:verify
 */
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

/** Minimal localStorage stub so the auth context can report a signed-in user. */
let storedUser = null
globalThis.localStorage = {
  getItem: () => storedUser,
  setItem: () => {},
  removeItem: () => {},
}

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

function extract(markup, pattern) {
  const match = markup.match(pattern)
  return match ? match[1] : '(none)'
}

const checks = [
  { path: '/', signedIn: false },
  { path: '/about', signedIn: false },
  { path: '/login', signedIn: false },
  { path: '/dashboard', signedIn: true },
  { path: '/definitely-missing', signedIn: false },
]

for (const { path, signedIn } of checks) {
  storedUser = signedIn
    ? JSON.stringify({ email: 'demo@example.com', name: 'demo' })
    : null

  const markup = renderToStaticMarkup(
    h(StaticRouter, { location: path }, h(AuthProvider, null, h(App))),
  )

  console.log(`\n=== ${path}${signedIn ? ' (signed in)' : ''} ===`)
  console.log('title    :', extract(markup, /<title[^>]*>([^<]*)<\/title>/))
  console.log('robots   :', extract(markup, /<meta name="robots" content="([^"]*)"/))
  console.log('canonical:', extract(markup, /<link rel="canonical" href="([^"]*)"/))
  console.log('og:url   :', extract(markup, /<meta property="og:url" content="([^"]*)"/))
  console.log('og:image :', extract(markup, /<meta property="og:image" content="([^"]*)"/))
  console.log('ld+json  :', /application\/ld\+json/.test(markup) ? 'present' : 'none')
}

await server.close()
