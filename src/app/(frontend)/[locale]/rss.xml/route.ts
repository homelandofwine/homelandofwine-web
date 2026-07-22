import { Feed } from 'feed'

import { hasLocale } from 'next-intl'

import { routing, type Locale } from '@/i18n/routing'
import { getArticles, getSettings } from '@/lib/api'
import { absoluteUrl, SITE_URL } from '@/lib/seo'
import type { Media } from '@/payload-types'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale: l } = await params
  if (!hasLocale(routing.locales, l)) return new Response('Not found', { status: 404 })
  const locale = l as Locale

  const [settings, { docs: articles }] = await Promise.all([
    getSettings(locale),
    getArticles(locale, { limit: 20 }),
  ])

  const feed = new Feed({
    title: settings.siteName,
    description: settings.siteDescription,
    id: absoluteUrl(locale, '/'),
    link: absoluteUrl(locale, '/'),
    language: locale,
    copyright: `${new Date().getFullYear()} ${settings.siteName}`,
    feedLinks: {
      rss: absoluteUrl(locale, '/rss.xml'),
    },
  })

  for (const article of articles) {
    const cover = article.coverImage as Media | null
    feed.addItem({
      title: article.title,
      id: absoluteUrl(locale, `/blog/${article.slug}`),
      link: absoluteUrl(locale, `/blog/${article.slug}`),
      description: article.excerpt,
      date: new Date(article.publishedAt),
      image:
        typeof cover === 'object' && cover?.url
          ? `${SITE_URL}${cover.sizes?.card?.url ?? cover.url}`
          : undefined,
    })
  }

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
