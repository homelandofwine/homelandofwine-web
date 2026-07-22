import { getTranslations } from 'next-intl/server'

import { ArticleCard } from '@/components/article/ArticleCard'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import type { Article } from '@/payload-types'

export async function ArticlesGridSection({
  locale,
  articles,
  heading,
}: {
  locale: Locale
  articles: Article[]
  heading?: string | null
}) {
  const t = await getTranslations({ locale })
  if (articles.length === 0) return null

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:py-28">
      <div data-reveal="up">
        <SectionLabel>{t('nav.blog')}</SectionLabel>
      </div>
      <div
        className="mt-6 flex flex-wrap items-end justify-between gap-6"
        data-reveal="up"
        style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}
      >
        <h2 className="max-w-2xl text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[1.05] tracking-tight text-ink">
          {heading || t('home.articlesTitle')}
        </h2>
        <Link
          href="/blog"
          className="rounded-md bg-ink px-5 py-3 text-sm font-semibold text-page transition-colors hover:bg-ink-soft"
        >
          {t('common.allArticles')}
        </Link>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, i) => (
          <ArticleCard key={article.id} article={article} locale={locale} index={i} reveal />
        ))}
      </div>
    </section>
  )
}
