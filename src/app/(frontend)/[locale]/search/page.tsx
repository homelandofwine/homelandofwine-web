import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { ArticleCard } from '@/components/article/ArticleCard'
import { SectionLabel } from '@/components/ui/SectionLabel'
import type { Locale } from '@/i18n/routing'
import { searchArticles } from '@/lib/api'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: l } = await params
  const t = await getTranslations({ locale: l as Locale })
  return {
    title: t('search.title'),
    robots: { index: false, follow: true },
  }
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string | string[] }>
}) {
  const [{ locale: l }, { q: qRaw }] = await Promise.all([params, searchParams])
  const locale = l as Locale
  setRequestLocale(locale)

  const q = (Array.isArray(qRaw) ? qRaw[0] : (qRaw ?? '')).trim()
  const t = await getTranslations({ locale })
  const articles = q ? await searchArticles(locale, q) : []

  return (
    <main>
      <header className="border-b border-line">
        <div className="mx-auto max-w-3xl px-4 pb-20 pt-40 text-center sm:px-6">
          <h1 className="anim-rise ka-heading text-[clamp(3rem,8vw,5.5rem)] font-medium leading-none tracking-tight text-ink">
            {t('search.title')}
          </h1>
          {q && (
            <p
              className="anim-rise mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted"
              style={{ '--anim-delay': '0.15s' } as React.CSSProperties}
            >
              {t('search.resultsFor')} “{q}”
            </p>
          )}
        </div>
      </header>

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:py-20">
        <div data-reveal="up">
          <SectionLabel>{t('search.title')}</SectionLabel>
        </div>

        {articles.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <ArticleCard key={article.id} article={article} locale={locale} index={i} reveal />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-lg text-muted">{t('search.noResults')}</p>
        )}
      </section>
    </main>
  )
}
