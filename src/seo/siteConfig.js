import {
  DEFAULT_OG_IMAGE,
  DEFAULT_SITE_URL,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TAGLINE,
  TWITTER_HANDLE,
} from './routes.js'

/** Set VITE_SITE_URL at build time so canonical and og:url point at the real domain. */
const rawSiteUrl = import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL

export const siteConfig = {
  name: SITE_NAME,
  url: rawSiteUrl.replace(/\/+$/, ''),
  defaultTitle: `${SITE_NAME} — ${SITE_TAGLINE}`,
  titleTemplate: (title) => `${title} | ${SITE_NAME}`,
  description: SITE_DESCRIPTION,
  locale: SITE_LOCALE,
  twitterHandle: TWITTER_HANDLE,
  ogImage: DEFAULT_OG_IMAGE,
}

/**
 * Builds the canonical URL for a path: strips query strings and hashes, drops
 * any trailing slash except on the root, and resolves against the site origin.
 */
export function canonicalUrl(pathname) {
  const [cleanPath] = pathname.split(/[?#]/)
  const normalized = cleanPath.replace(/\/+$/, '') || '/'
  return normalized === '/' ? `${siteConfig.url}/` : `${siteConfig.url}${normalized}`
}

export function absoluteUrl(pathOrUrl) {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl
  }
  return `${siteConfig.url}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`
}
