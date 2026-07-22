import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { ArticleCard } from '@/components/article/ArticleCard'
import { JsonLd } from '@/components/seo/JsonLd'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { Img } from '@/components/media/Img'
import { getArticles, getArticlesPage, getCategories, getSettings } from '@/lib/api'
import { absoluteUrl, ogLocale, pageAlternates, categoryPath } from '@/lib/seo'

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
  const [{ docs: articles }, { docs: categories }, settings, articlesPage] = await Promise.all([
    getArticles(locale),
    getCategories(locale),
    getSettings(locale),
    getArticlesPage(locale),
  ])
  const banner =
    articlesPage.banner && typeof articlesPage.banner === 'object' ? articlesPage.banner : null

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
          <div className="anim-settle relative h-[300px] w-full overflow-hidden rounded-lg sm:h-[380px]">
            <div className="absolute inset-0" data-parallax>
              <Img
                media={banner}
                sizes="(min-width: 1400px) 1400px, 100vw"
                loading="eager"
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
      <header className="border-b border-line">
        <div
          className={`mx-auto max-w-3xl px-4 pb-20 text-center sm:px-6 ${banner ? 'pt-16' : 'pt-40'}`}
        >
          <h1 className="anim-rise text-[clamp(3rem,8vw,5.5rem)] font-medium leading-none tracking-tight text-ink">
            {articlesPage.heading || t('nav.blog')}
          </h1>
          <p
            className="anim-rise mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted"
            style={{ '--anim-delay': '0.15s' } as React.CSSProperties}
          >
            {settings.siteDescription}
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:py-20">
        <div data-reveal="up">
          <SectionLabel>{t('common.allArticles')}</SectionLabel>
        </div>

        {categories.length > 0 && (
          <nav
            className="mt-8 flex flex-wrap gap-3"
            aria-label={t('common.category')}
            data-reveal="up"
            style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}
          >
            {categories.map((c) => (
              <Link
                key={c.id}
                href={categoryPath(c.slug ?? '')}
                className="rounded-md border border-line bg-paper px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
              >
                {c.name}
              </Link>
            ))}
          </nav>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <ArticleCard key={article.id} article={article} locale={locale} index={i} reveal />
          ))}
        </div>
      </section>
    </main>
  )
}
