import type { MetadataRoute } from 'next'

import { getAllArticleSlugs, getCategories } from '@/lib/api'
import { absoluteUrl, languageAlternates } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, { docs: categories }] = await Promise.all([
    getAllArticleSlugs(),
    getCategories('en'),
  ])

  const staticPaths = ['/', '/blog', '/about', '/contact', '/ambassador', '/n-line-print']

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: absoluteUrl('en', path),
    changeFrequency: path === '/' || path === '/blog' ? 'daily' : 'monthly',
    priority: path === '/' ? 1 : 0.7,
    alternates: { languages: languageAlternates({ ka: path, en: path }) },
  }))

  const categoryEntries: MetadataRoute.Sitemap = categories
    .filter((c) => c.slug)
    .map((c) => {
      const path = `/blog/category/${c.slug}`
      return {
        url: absoluteUrl('en', path),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
        alternates: { languages: languageAlternates({ ka: path, en: path }) },
      }
    })

  const articleEntries: MetadataRoute.Sitemap = articles
    .filter((a) => a.slug?.ka || a.slug?.en)
    .map((a) => {
      const en = a.slug?.en ? `/blog/${a.slug.en}` : undefined
      const ka = a.slug?.ka ? `/blog/${a.slug.ka}` : undefined
      return {
        url: en ? absoluteUrl('en', en) : absoluteUrl('ka', ka ?? '/'),
        lastModified: new Date(a.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
        alternates: { languages: languageAlternates({ ka, en }) },
      }
    })

  return [...staticEntries, ...categoryEntries, ...articleEntries]
}
