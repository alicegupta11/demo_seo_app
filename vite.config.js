import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { DEFAULT_SITE_URL } from './src/seo/routes.js'

const siteUrl = (process.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '')

/**
 * The JSON-LD block in index.html is static HTML, so it cannot read siteConfig.
 * Substituting the placeholder here keeps src/seo/routes.js the single source of
 * truth for the origin, matching how scripts/generate-seo-files.mjs resolves it.
 */
function siteUrlPlaceholder() {
  return {
    name: 'site-url-placeholder',
    transformIndexHtml(html) {
      return html.replaceAll('__SITE_URL__', siteUrl)
    },
  }
}

export default defineConfig({
  plugins: [react(), siteUrlPlaceholder()],
})
