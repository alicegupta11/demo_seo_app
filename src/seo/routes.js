/**
 * Single source of truth for SEO metadata, shared by the app at runtime and by
 * scripts/generate-seo-files.mjs at build time. Keep it free of Vite-only
 * syntax (`import.meta.env`) so plain Node can import it too.
 */

export const DEFAULT_SITE_URL = 'https://demo-seo-app-jet.vercel.app'

export const SITE_NAME = 'DemoApp'
export const SITE_TAGLINE = 'React demo with public and private routes'
export const SITE_DESCRIPTION =
  'A small React and Vite demo app showing public pages alongside a private dashboard protected by a route guard.'
export const SITE_LOCALE = 'en_US'
export const TWITTER_HANDLE = '@demoapp'
export const DEFAULT_OG_IMAGE = '/og-image.png'

export const seoRoutes = [
  {
    path: '/',
    title: 'Home',
    description: SITE_DESCRIPTION,
    isPrivate: false,
    changefreq: 'weekly',
    priority: 1.0,
  },
  {
    path: '/about',
    title: 'About',
    description:
      'How this demo wires up React Router, an auth context, and a protected route guard to separate public pages from private ones.',
    isPrivate: false,
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    path: '/login',
    title: 'Log in',
    description: 'Sign in to reach the private dashboard.',
    isPrivate: true,
  },
  {
    path: '/dashboard',
    title: 'Dashboard',
    description: 'Your private dashboard.',
    isPrivate: true,
  },
]

export const publicRoutes = seoRoutes.filter((route) => !route.isPrivate)
export const privateRoutes = seoRoutes.filter((route) => route.isPrivate)
