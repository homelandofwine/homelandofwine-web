import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound, permanentRedirect } from 'next/navigation'

import { ArticleCard } from '@/components/article/ArticleCard'
import { JsonLd } from '@/components/seo/JsonLd'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getArticles, getCategories, getCategoryBySlug, getSettings } from '@/lib/api'
import { absoluteUrl, categoryPath, localePath, ogLocale, pageAlternates } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale: l, slug } = await params
  const locale = l as Locale
  if (categoryPath(slug) !== `/blog/category/${slug}`) {
    permanentRedirect(localePath(locale, categoryPath(slug)))
  }
  const [category, settings] = await Promise.all([
    getCategoryBySlug(locale, slug),
    getSettings(locale),
  ])
  if (!category) return {}
  const path = `/blog/category/${slug}`
  const description = category.description || settings.siteDescription
  return {
    title: category.name,
    description,
    alternates: pageAlternates(locale, path),
    openGraph: {
      title: category.name,
      description,
      url: absoluteUrl(locale, path),
      locale: ogLocale(locale),
    },
  }
}

export const dynamicParams = true

export async function generateStaticParams() {
  const { docs } = await getCategories('en')
  return docs
    .filter((c) => c.slug && categoryPath(c.slug) === `/blog/category/${c.slug}`)
    .map((c) => ({ slug: c.slug as string }))
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: l, slug } = await params
  if (categoryPath(slug) !== `/blog/category/${slug}`) {
    permanentRedirect(localePath(l as Locale, categoryPath(slug)))
  }
  const locale = l as Locale
  setRequestLocale(locale)

  const category = await getCategoryBySlug(locale, slug)
  if (!category) notFound()

  const t = await getTranslations({ locale })
  const { docs: articles } = await getArticles(locale, { categoryId: category.id })

  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: category.name,
          description: category.description || undefined,
          url: absoluteUrl(locale, `/blog/category/${slug}`),
          inLanguage: locale,
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('nav.home'), item: absoluteUrl(locale, '/') },
            { '@type': 'ListItem', position: 2, name: t('nav.blog'), item: absoluteUrl(locale, '/blog') },
            {
              '@type': 'ListItem',
              position: 3,
              name: category.name,
              item: absoluteUrl(locale, `/blog/category/${slug}`),
            },
          ],
        }}
      />
      <header className="border-b border-line">
        <div className="mx-auto max-w-3xl px-4 pb-20 pt-40 text-center sm:px-6">
          <p className="anim-rise text-sm font-medium uppercase tracking-widest text-accent">
            {t('common.category')}
          </p>
          <h1
            className="anim-rise mt-4 text-[clamp(2.5rem,7vw,5rem)] font-medium leading-none tracking-tight text-ink"
            style={{ '--anim-delay': '0.12s' } as React.CSSProperties}
          >
            {category.name}
          </h1>
          {category.description && (
            <p
              className="anim-rise mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted"
              style={{ '--anim-delay': '0.24s' } as React.CSSProperties}
            >
              {category.description}
            </p>
          )}
        </div>
      </header>

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:py-20">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <SectionLabel>{category.name}</SectionLabel>
          <Link
            href="/blog"
            className="rounded-md bg-ink px-5 py-3 text-sm font-semibold text-page transition-colors hover:bg-ink-soft"
          >
            {t('common.allArticles')}
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <ArticleCard key={article.id} article={article} locale={locale} index={i} reveal />
          ))}
        </div>
      </section>
    </main>
  )
}
