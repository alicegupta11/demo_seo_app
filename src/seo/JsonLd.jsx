/**
 * Emits schema.org structured data. Crawlers read JSON-LD from anywhere in the
 * document, so this renders in place rather than being hoisted into `<head>`.
 */
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
