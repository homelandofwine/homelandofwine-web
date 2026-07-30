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
    <article className="group relative grid items-center gap-8 lg:grid-cols-[7fr_5fr] lg:gap-14">
      <div className="overflow-hidden rounded-sm">
        <Img
          media={article.coverImage}
          sizes="(min-width: 1024px) 58vw, 100vw"
          loading="eager"
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div>
        {category && typeof category === 'object' && (
          <p className="caps text-xs font-semibold tracking-[0.18em] text-accent">
            {category.name}
          </p>
        )}
        <h2 className="mt-4 text-[clamp(1.75rem,3.2vw,2.9rem)] font-medium leading-[1.1] tracking-tight text-ink">
          <Link
            href={`/blog/${article.slug}`}
            className="after:absolute after:inset-0 group-hover:underline decoration-1 underline-offset-4"
          >
            {article.title}
          </Link>
        </h2>
        {article.excerpt && (
          <p className="mt-5 line-clamp-3 max-w-xl text-base leading-relaxed text-muted">
            {article.excerpt}
          </p>
        )}
        <div className="mt-6 flex items-center gap-5">
          <span className="caps text-sm font-semibold text-accent">{t('common.readArticle')}</span>
          <time dateTime={article.publishedAt} className="text-sm text-muted">
            {formatDate(article.publishedAt, locale)}
          </time>
        </div>
      </div>
    </article>
  )
}
