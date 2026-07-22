import { getRecentArticlesForNews, getSettings } from '@/lib/api'
import { absoluteUrl } from '@/lib/seo'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function GET() {
  const [articles, settings] = await Promise.all([getRecentArticlesForNews(), getSettings('en')])
  const publicationName = escapeXml(settings.siteName)

  const entries: string[] = []
  for (const article of articles) {
    for (const locale of ['ka', 'en'] as const) {
      const slug = article.slug?.[locale]
      const title = article.title?.[locale]
      if (!slug || !title) continue
      entries.push(
        `  <url>
    <loc>${escapeXml(absoluteUrl(locale, `/blog/${slug}`))}</loc>
    <news:news>
      <news:publication>
        <news:name>${publicationName}</news:name>
        <news:language>${locale}</news:language>
      </news:publication>
      <news:publication_date>${article.publishedAt}</news:publication_date>
      <news:title>${escapeXml(title)}</news:title>
    </news:news>
  </url>`,
      )
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries.join('\n')}
</urlset>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=1800, stale-while-revalidate',
    },
  })
}
