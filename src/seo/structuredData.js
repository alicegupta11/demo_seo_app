import { canonicalUrl, siteConfig } from './siteConfig.js'

/** BreadcrumbList so search results can show the page's position in the site. */
export function breadcrumbSchema(trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: canonicalUrl(crumb.path),
    })),
  }
}

export function webPageSchema({ title, description, path }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: canonicalUrl(path),
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: `${siteConfig.url}/`,
    },
  }
}
