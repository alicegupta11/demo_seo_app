import { useLocation } from 'react-router-dom'
import { absoluteUrl, canonicalUrl, siteConfig } from './siteConfig.js'

/**
 * Per-page document metadata. React 19 hoists `title`, `meta`, and `link`
 * elements into `<head>`, so no helmet library is needed.
 *
 * Private pages pass `noindex` (and usually `nofollow`), which also suppresses
 * the canonical tag — pointing a canonical at a page you have asked search
 * engines not to index sends conflicting signals.
 */
export default function Seo({
  title,
  description = siteConfig.description,
  noindex = false,
  nofollow = false,
  image = siteConfig.ogImage,
  type = 'website',
}) {
  const { pathname } = useLocation()

  const resolvedTitle = title ? siteConfig.titleTemplate(title) : siteConfig.defaultTitle
  const canonical = canonicalUrl(pathname)
  const robots = `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`
  const imageUrl = absoluteUrl(image)

  return (
    <>
      <title>{resolvedTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      {noindex ? null : <link rel="canonical" href={canonical} />}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content={siteConfig.locale} />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={resolvedTitle} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={siteConfig.twitterHandle} />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </>
  )
}
