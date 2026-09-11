# React Demo App - Public & Private Routes

A small React + Vite demo showing public pages alongside a route protected by a mock auth guard, with a full SEO setup layered on top.

## Routes

| Route        | Page      | Access                   | Indexing            | Canonical |
| ------------ | --------- | ------------------------ | ------------------- | --------- |
| `/`          | Home      | Public                   | `index, follow`     | Yes       |
| `/about`     | About     | Public                   | `index, follow`     | Yes       |
| `/login`     | Login     | Public                   | `noindex, nofollow` | No        |
| `/dashboard` | Dashboard | Private (login required) | `noindex, nofollow` | No        |
| `*`          | Not Found | Public                   | `noindex, follow`   | No        |

Visiting `/dashboard` while logged out redirects to `/login`, and after logging in you land back on the page you originally asked for.

## Getting started

```bash
npm install
cp .env.example .env   # then set VITE_SITE_URL to your real domain
npm run dev
```

Then open the URL printed in the terminal (default `http://localhost:5173`).

## Logging in

Auth is mocked, with no backend. Any email containing `@` and a password of at least 4 characters is accepted. The session is stored in `localStorage` under `demo-app-user`, so it survives a page refresh.

## SEO

### One source of truth

`src/seo/routes.js` holds the site name, tagline, description, and every route's title, description, privacy flag, and sitemap hints. The app reads it at runtime and the build scripts read it at build time, so `robots.txt` and `sitemap.xml` cannot drift from the real routes. **Add or change a route there and everything else follows.**

### Per-page metadata

`src/seo/Seo.jsx` renders the document metadata for each page. React 19 hoists `title`, `meta`, and `link` elements into `<head>` on its own, so there is no `react-helmet` dependency. Every page gets:

- `<title>` and `<meta name="description">`
- `<meta name="robots">` built from the `noindex` / `nofollow` props
- `<link rel="canonical">`, **only on indexable pages**
- Open Graph tags (`og:type`, `og:title`, `og:description`, `og:url`, `og:image` with dimensions and alt, `og:site_name`, `og:locale`)
- Twitter card tags (`summary_large_image`)

Usage:

```jsx
<Seo title="About" description="..." />                        {/* public  */}
<Seo title="Dashboard" description="..." noindex nofollow />   {/* private */}
```

### Canonical URLs

`canonicalUrl()` in `src/seo/siteConfig.js` strips query strings and hash fragments, removes trailing slashes (except on the root), and resolves against `VITE_SITE_URL`. That means `/about?ref=twitter#top` and `/about/` both canonicalise to `https://your-domain.com/about`, collapsing duplicate URLs into one indexable address.

Canonical tags are deliberately **omitted** on `noindex` pages. Telling a crawler both "don't index this" and "here is the preferred version of this" sends conflicting signals.

### Private pages

Three layers keep the private area out of search results:

1. `<meta name="robots" content="noindex, nofollow">` via the `Seo` component
2. `Disallow:` entries in `robots.txt`, generated from the routes marked `isPrivate`
3. `rel="nofollow"` on internal links pointing at `/dashboard` and `/login`

They are also excluded from `sitemap.xml`, since a sitemap should only list canonical, indexable URLs.

### Generated crawler files

Both files are written into `public/` by `npm run prebuild`, so they ship with every build:

- `public/robots.txt` allows everything except the private paths, and points at the sitemap. `/assets/` is left crawlable so Googlebot can fetch the JS/CSS the SPA needs.
- `public/sitemap.xml` lists public URLs only, with `lastmod`, `changefreq`, and `priority`

Regenerate them by hand with `npm run seo:generate`.

### Verifying the tags

`npm run seo:verify` server-renders every route and prints the resulting title, robots, canonical, and Open Graph values, so you can catch SEO regressions without opening a browser:

```
=== /about ===
title    : About | DemoApp
robots   : index, follow
canonical: https://demo-app.example.com/about

=== /dashboard (signed in) ===
title    : Dashboard | DemoApp
robots   : noindex, nofollow
canonical: (none)
```

### Structured data

- A site-wide `WebSite` JSON-LD block sits in `index.html`
- Home renders a `WebPage` schema and About renders a `BreadcrumbList` (builders live in `src/seo/structuredData.js`)

### Social share image

`npm run seo:og` renders `public/og-image.png` at 1200x630 from an SVG template using `sharp`. Social crawlers do not render SVG, so the og:image has to be a raster file; generating it keeps the artwork in sync with the site name and tagline. This also runs as part of `prebuild`.

### Also included

A web app manifest, an SVG favicon, `theme-color`, `color-scheme`, and `lang="en"` on `<html>`.

### Prerendered public routes

`npm run build` finishes with `scripts/prerender.mjs`, which server-renders each public route into its own HTML file (`dist/index.html` for `/`, `dist/about/index.html` for `/about`). Crawlers and social scrapers therefore get the correct title, description, canonical, Open Graph tags, JSON-LD, and page body in the first response, without waiting for JavaScript.

The client still mounts with `createRoot` (not `hydrateRoot`) so auth/`localStorage` cannot cause hydration mismatches. Users get the SPA; crawlers get unique first-byte HTML. Private routes (`/login`, `/dashboard`) and unknown paths stay on the SPA fallback rewrite.

Relatedly, `noindex` and `robots.txt` are instructions for well-behaved crawlers, not access control. The route guard here is client-side and the auth is mocked, so treat the private page as a UI demo. Real private data needs enforcement on the server.

## Project structure

```
public/
  robots.txt                  generated - do not edit by hand
  sitemap.xml                 generated - do not edit by hand
  og-image.png                generated - do not edit by hand
  favicon.svg
  manifest.webmanifest
scripts/
  generate-seo-files.mjs      writes robots.txt + sitemap.xml
  generate-og-image.mjs       writes og-image.png
  prerender.mjs               writes unique HTML for each public route into dist/
  verify-seo.mjs              prints head tags for every route
src/
  App.jsx                     route definitions
  main.jsx                    entry point, wraps app in BrowserRouter + AuthProvider
  index.css                   all styling
  auth/AuthContext.jsx        auth state, login/logout, localStorage persistence
  components/Navbar.jsx       navigation + login/logout controls
  components/ProtectedRoute.jsx  redirects unauthenticated users to /login
  seo/routes.js               source of truth for site + route metadata
  seo/siteConfig.js           resolved site config, canonical URL helpers
  seo/Seo.jsx                 per-page title/description/robots/canonical/OG/Twitter
  seo/JsonLd.jsx              structured data renderer
  seo/structuredData.js       schema.org builders
  pages/                      Home, About, Dashboard, Login, NotFound
```

## Scripts

- `npm run dev` starts the dev server
- `npm run build` regenerates the SEO files, builds into `dist/`, then prerenders public routes
- `npm run preview` serves the production build locally
- `npm run seo:generate` rewrites `robots.txt` and `sitemap.xml`
- `npm run seo:og` rerenders `og-image.png`
- `npm run seo:prerender` rewrites unique HTML for `/` and `/about` in `dist/` (also runs as `postbuild`)
- `npm run seo:verify` prints the head tags rendered for each route

## Deploy checklist

1. Set `VITE_SITE_URL` to the production origin before building. Canonical tags, `og:url`, and the sitemap all derive from it.
2. Configure your host to rewrite unknown paths to `/index.html` (SPA fallback) so deep links work, while still serving `/robots.txt`, `/sitemap.xml`, and prerendered public pages (`/about`) as real files. Vercel serves filesystem matches before rewrites.
3. Return a real HTTP 404 status for missing pages where possible; the React 404 page is cosmetic.
4. Submit `https://your-domain.com/sitemap.xml` in Google Search Console, then request indexing for `/about`. `site:` results can lag days after the HTML actually differs.
