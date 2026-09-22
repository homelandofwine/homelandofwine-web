import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { ArticleCard } from '@/components/article/ArticleCard'
import { CategoryTabs } from '@/components/article/CategoryTabs'
import { LeadArticleCard } from '@/components/article/LeadArticleCard'
import { JsonLd } from '@/components/seo/JsonLd'
import type { Locale } from '@/i18n/routing'
import { Img } from '@/components/media/Img'
import { getArticles, getArticlesPage, getCategories, getSettings } from '@/lib/api'
import { absoluteUrl, ogLocale, pageAlternates } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: l } = await params
  const locale = l as Locale
  const [t, settings] = await Promise.all([getTranslations({ locale }), getSettings(locale)])
  return {
    title: t('nav.blog'),
    description: settings.siteDescription,
    alternates: pageAlternates(locale, '/blog'),
    openGraph: {
      title: t('nav.blog'),
      description: settings.siteDescription,
      url: absoluteUrl(locale, '/blog'),
      locale: ogLocale(locale),
    },
  }
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  const locale = l as Locale
  setRequestLocale(locale)

  const t = await getTranslations({ locale })
  const [{ docs: articles }, { docs: categories }, articlesPage] = await Promise.all([
    getArticles(locale),
    getCategories(locale),
    getArticlesPage(locale),
  ])
  const banner =
    articlesPage.banner && typeof articlesPage.banner === 'object' ? articlesPage.banner : null
  const [lead, ...rest] = articles

  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: t('nav.blog'),
          url: absoluteUrl(locale, '/blog'),
          inLanguage: locale,
        }}
      />
      {banner && (
        <div className="mx-auto max-w-[1400px] px-4 pt-28 sm:px-6">
          <div className="anim-settle mx-auto max-w-[1100px] overflow-hidden rounded-lg">
            <Img
              media={banner}
              sizes="(min-width: 1100px) 1100px, 100vw"
              loading="eager"
              fetchPriority="high"
              className="h-auto w-full"
            />
          </div>
        </div>
      )}

      <header>
        <div className={`mx-auto max-w-[1400px] px-4 pb-10 sm:px-6 ${banner ? 'pt-12' : 'pt-36'}`}>
          <h1 className="anim-rise text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-none tracking-tight text-ink">
            {articlesPage.heading || t('nav.blog')}
          </h1>
        </div>
      </header>

      <CategoryTabs categories={categories} active="all" allLabel={t('common.allArticles')} />

      {lead && (
        <section className="mx-auto max-w-[1400px] px-4 pt-12 sm:px-6 lg:pt-14">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2" data-reveal="up">
              <LeadArticleCard article={lead} locale={locale} />
            </div>
            {rest[0] && <ArticleCard article={rest[0]} locale={locale} index={1} reveal />}
          </div>
        </section>
      )}

      {rest.length > 1 && (
        <section className="mx-auto max-w-[1400px] px-4 pb-20 pt-12 sm:px-6 lg:pb-24 lg:pt-14">
          <div className="grid gap-x-6 gap-y-12 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-3">
            {rest.slice(1).map((article, i) => (
              <ArticleCard key={article.id} article={article} locale={locale} index={i} reveal />
            ))}
          </div>
        </section>
      )}
      {rest.length <= 1 && <div className="pb-20" />}
    </main>
  )
}
