import { getTranslations } from 'next-intl/server'

import { Img } from '@/components/media/Img'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { formatDate } from '@/lib/format'
import type { Article, Category } from '@/payload-types'

export async function LeadArticleCard({ article, locale }: { article: Article; locale: Locale }) {
  const t = await getTranslations({ locale })
  const category = article.category as Category | null

  return (
    <article className="group relative flex h-full flex-col overflow-hidden bg-paper shadow-sm transition-shadow hover:shadow-md">
      <div className="overflow-hidden">
        <Img
          media={article.coverImage}
          sizes="(min-width: 1024px) 66vw, 100vw"
          loading="eager"
          className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        {category && typeof category === 'object' && (
          <p className="caps text-xs font-semibold tracking-[0.18em] text-accent">
            {category.name}
          </p>
        )}
        <h2 className="mt-3 text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-[1.15] tracking-tight text-ink">
          <Link
            href={`/blog/${article.slug}`}
            className="after:absolute after:inset-0 group-hover:underline decoration-1 underline-offset-4"
          >
            {article.title}
          </Link>
        </h2>
        {article.excerpt && (
          <p className="mt-4 line-clamp-2 max-w-2xl text-base leading-relaxed text-muted">
            {article.excerpt}
          </p>
        )}
      </div>
      <div className="mt-auto flex items-center gap-5 bg-stone px-6 py-4 sm:px-8">
        <span className="caps text-sm font-semibold text-accent">{t('common.readArticle')}</span>
        <time dateTime={article.publishedAt} className="text-sm text-ink">
          {formatDate(article.publishedAt, locale)}
        </time>
      </div>
    </article>
  )
}
