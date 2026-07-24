import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import type { Locale } from '@/i18n/routing'
import config from '@/payload.config'

export const TAGS = {
  articles: 'articles',
  article: (id: string | number) => `article:${id}`,
  categories: 'categories',
  settings: 'settings',
  homepage: 'homepage',
  about: 'about-page',
  contact: 'contact-page',
} as const

async function payloadClient() {
  return getPayload({ config })
}

export const getSettings = (locale: Locale) =>
  unstable_cache(
    async () => {
      const payload = await payloadClient()
      return payload.findGlobal({ slug: 'site-settings', locale, depth: 1 })
    },
    ['settings', locale],
    { revalidate: 600, tags: [TAGS.settings] },
  )()

export const getHomepage = (locale: Locale) =>
  unstable_cache(
    async () => {
      const payload = await payloadClient()
      return payload.findGlobal({ slug: 'homepage', locale, depth: 1 })
    },
    ['homepage', locale],
    { revalidate: 600, tags: [TAGS.homepage] },
  )()

function globalGetter<S extends 'articles-page' | 'ambassador-page' | 'n-line-print-page' | 'privacy-page'>(
  slug: S,
) {
  return (locale: Locale) =>
    unstable_cache(
      async () => {
        const payload = await payloadClient()
        return payload.findGlobal({ slug, locale, depth: 1 })
      },
      [slug, locale],
      { revalidate: 600, tags: [slug] },
    )()
}

export const getArticlesPage = globalGetter('articles-page')
export const getAmbassadorPage = globalGetter('ambassador-page')
export const getNLinePrintPage = globalGetter('n-line-print-page')
export const getPrivacyPage = globalGetter('privacy-page')

export const getAboutPage = (locale: Locale) =>
  unstable_cache(
    async () => {
      const payload = await payloadClient()
      return payload.findGlobal({ slug: 'about-page', locale, depth: 1 })
    },
    ['about-page', locale],
    { revalidate: 600, tags: [TAGS.about] },
  )()

export const getContactPage = (locale: Locale) =>
  unstable_cache(
    async () => {
      const payload = await payloadClient()
      return payload.findGlobal({ slug: 'contact-page', locale, depth: 1 })
    },
    ['contact-page', locale],
    { revalidate: 600, tags: [TAGS.contact] },
  )()

export const getArticles = (
  locale: Locale,
  opts?: { limit?: number; categoryId?: string | number; nativeOnly?: boolean },
) =>
  unstable_cache(
    async () => {
      const payload = await payloadClient()
      const result = await payload.find({
        collection: 'articles',
        locale,
        depth: 1,
        limit: opts?.limit ?? 100,
        sort: '-publishedAt',
        ...(opts?.nativeOnly ? { fallbackLocale: false as const } : {}),
        where: {
          _status: { equals: 'published' },
          ...(opts?.categoryId ? { category: { equals: opts.categoryId } } : {}),
        },
      })
      result.docs = result.docs.filter((d) =>
        opts?.nativeOnly ? Boolean(d.slug && d.title && d.excerpt) : Boolean(d.slug),
      )
      return result
    },
    [
      'articles',
      locale,
      String(opts?.limit ?? 100),
      String(opts?.categoryId ?? 'all'),
      opts?.nativeOnly ? 'native' : 'any',
    ],
    { revalidate: 600, tags: [TAGS.articles] },
  )()

// Every query word must match the title, but each word also matches on its
// stem (progressively shortened prefixes, down to 4 characters) so that
// "Wines" finds "Wine", and Georgian case endings ("ღვინის") still find
// "ღვინო…" titles.
function titleWhere(query: string) {
  const words = query.split(/\s+/).filter(Boolean).slice(0, 6)
  return {
    and: words.map((word) => {
      const variants = [word]
      for (let len = word.length - 1; len >= Math.max(4, word.length - 3); len--) {
        variants.push(word.slice(0, len))
      }
      return { or: variants.map((v) => ({ title: { like: v } })) }
    }),
  }
}

// Uncached on purpose: the query space is unbounded, so caching would only
// pollute the data cache. Matches titles in BOTH locales so an English-only
// article is still found from the ka site (where it renders via fallback).
export async function searchArticles(locale: Locale, query: string, limit = 24) {
  const payload = await payloadClient()
  const other: Locale = locale === 'ka' ? 'en' : 'ka'
  const [native, foreign] = await Promise.all([
    payload.find({
      collection: 'articles',
      locale,
      depth: 1,
      limit,
      sort: '-publishedAt',
      where: { _status: { equals: 'published' }, ...titleWhere(query) },
    }),
    payload.find({
      collection: 'articles',
      locale: other,
      fallbackLocale: false,
      depth: 0,
      limit,
      select: { slug: true },
      where: { _status: { equals: 'published' }, ...titleWhere(query) },
    }),
  ])
  const seen = new Set(native.docs.map((d) => d.id))
  const extraIds = foreign.docs.map((d) => d.id).filter((id) => !seen.has(id))
  const extras = extraIds.length
    ? (
        await payload.find({
          collection: 'articles',
          locale,
          depth: 1,
          limit,
          where: { id: { in: extraIds }, _status: { equals: 'published' } },
        })
      ).docs
    : []
  return [...native.docs, ...extras]
    .filter((d) => Boolean(d.slug && d.title))
    .sort(
      (a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime(),
    )
    .slice(0, limit)
}

export const getArticleBySlug = (locale: Locale, slug: string) =>
  unstable_cache(
    async () => {
      const payload = await payloadClient()
      const otherLocale: Locale = locale === 'ka' ? 'en' : 'ka'
      // depth 2 so author.avatar (a relation on a relation) is populated
      const { docs } = await payload.find({
        collection: 'articles',
        locale,
        depth: 2,
        limit: 1,
        where: { slug: { equals: slug }, _status: { equals: 'published' } },
      })
      let article = docs[0] ?? null
      const native = Boolean(article)

      if (!article && locale === 'ka') {
        const { docs: byOtherSlug } = await payload.find({
          collection: 'articles',
          locale: otherLocale,
          depth: 0,
          limit: 1,
          select: { slug: true },
          where: { slug: { equals: slug }, _status: { equals: 'published' } },
        })
        if (byOtherSlug[0]) {
          const doc = await payload.findByID({
            collection: 'articles',
            id: byOtherSlug[0].id,
            locale,
            depth: 2,
          })
          if (doc?.title) article = doc
        }
      }
      if (!article) return null

      const other = await payload.findByID({
        collection: 'articles',
        id: article.id,
        locale: otherLocale,
        depth: 0,
        select: { slug: true },
        fallbackLocale: false,
      })

      return { article, alternateSlug: other?.slug ?? null, otherLocale, native }
    },
    ['article-by-slug', locale, slug],
    { revalidate: 600, tags: [TAGS.articles] },
  )()

export async function getDraftArticleBySlug(locale: Locale, slug: string) {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'articles',
    locale,
    depth: 1,
    limit: 1,
    draft: true,
    overrideAccess: true,
    where: { slug: { equals: slug } },
  })
  const article = docs[0]
  if (!article) return null

  const otherLocale: Locale = locale === 'ka' ? 'en' : 'ka'
  const other = await payload.findByID({
    collection: 'articles',
    id: article.id,
    locale: otherLocale,
    depth: 0,
    draft: true,
    overrideAccess: true,
    select: { slug: true },
    fallbackLocale: false,
  })

  return { article, alternateSlug: other?.slug ?? null, otherLocale, native: true }
}

export const getRecentArticlesForNews = () =>
  unstable_cache(
    async () => {
      const payload = await payloadClient()
      const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
      const { docs } = await payload.find({
        collection: 'articles',
        locale: 'all',
        depth: 0,
        limit: 100,
        sort: '-publishedAt',
        select: { slug: true, title: true, publishedAt: true },
        where: {
          _status: { equals: 'published' },
          publishedAt: { greater_than_equal: cutoff },
        },
      })
      return docs as Array<{
        id: string | number
        slug?: { ka?: string | null; en?: string | null } | null
        title?: { ka?: string | null; en?: string | null } | null
        publishedAt: string
      }>
    },
    ['news-articles'],
    { revalidate: 1800, tags: [TAGS.articles] },
  )()

export const getAllArticleSlugs = () =>
  unstable_cache(
    async () => {
      const payload = await payloadClient()
      const { docs } = await payload.find({
        collection: 'articles',
        locale: 'all',
        depth: 0,
        limit: 1000,
        select: { slug: true, updatedAt: true },
        where: { _status: { equals: 'published' } },
      })
      return docs as Array<{
        id: string | number
        slug?: { ka?: string | null; en?: string | null } | null
        updatedAt: string
      }>
    },
    ['article-slugs'],
    { revalidate: 600, tags: [TAGS.articles] },
  )()

export const getCategories = (locale: Locale) =>
  unstable_cache(
    async () => {
      const payload = await payloadClient()
      return payload.find({ collection: 'categories', locale, limit: 100, sort: 'slug' })
    },
    ['categories', locale],
    { revalidate: 600, tags: [TAGS.categories] },
  )()

export const getCategoryBySlug = (locale: Locale, slug: string) =>
  unstable_cache(
    async () => {
      const payload = await payloadClient()
      const { docs } = await payload.find({
        collection: 'categories',
        locale,
        limit: 1,
        where: { slug: { equals: slug } },
      })
      return docs[0] ?? null
    },
    ['category-by-slug', locale, slug],
    { revalidate: 600, tags: [TAGS.categories] },
  )()
