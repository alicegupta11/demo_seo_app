/**
 * Renders public/og-image.png (1200x630) from an inline SVG template.
 *
 * Social crawlers (Facebook, LinkedIn, Slack, X) do not render SVG, so the
 * og:image has to be a raster file. Generating it keeps the asset in sync with
 * the site name and tagline in src/seo/routes.js.
 *
 * Runs automatically before `npm run build`, or on demand: npm run seo:og
 */
import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

import { SITE_NAME, SITE_TAGLINE } from '../src/seo/routes.js'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const outputPath = join(projectRoot, 'public', 'og-image.png')

const WIDTH = 1200
const HEIGHT = 630

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b1020" />
      <stop offset="100%" stop-color="#161d38" />
    </linearGradient>
    <radialGradient id="glow" cx="18%" cy="0%" r="70%">
      <stop offset="0%" stop-color="#6d8cff" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#6d8cff" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)" />

  <g transform="translate(88, 96)">
    <rect width="64" height="64" rx="16" fill="#4f6ef7" />
    <text x="32" y="44" font-family="Segoe UI, Arial, sans-serif" font-size="36"
          font-weight="700" fill="#ffffff" text-anchor="middle">D</text>
  </g>

  <text x="172" y="140" font-family="Segoe UI, Arial, sans-serif" font-size="34"
        font-weight="700" fill="#e8ecf8">${escapeXml(SITE_NAME)}</text>

  <text x="88" y="310" font-family="Segoe UI, Arial, sans-serif" font-size="72"
        font-weight="700" fill="#e8ecf8">Public and private</text>
  <text x="88" y="396" font-family="Segoe UI, Arial, sans-serif" font-size="72"
        font-weight="700" fill="#6d8cff">routes in React</text>

  <text x="88" y="470" font-family="Segoe UI, Arial, sans-serif" font-size="30"
        fill="#9aa6c9">${escapeXml(SITE_TAGLINE)}</text>

  <g transform="translate(88, 516)">
    <rect width="188" height="46" rx="23" fill="#6d8cff" fill-opacity="0.16" />
    <text x="94" y="30" font-family="Segoe UI, Arial, sans-serif" font-size="20"
          font-weight="600" fill="#6d8cff" text-anchor="middle">React + Vite</text>
  </g>

  <rect x="0" y="${HEIGHT - 10}" width="${WIDTH}" height="10" fill="#4f6ef7" />
</svg>`

await mkdir(dirname(outputPath), { recursive: true })
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outputPath)

console.log(`[seo] og-image.png written (${WIDTH}x${HEIGHT})`)
