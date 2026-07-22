import { Img } from '@/components/media/Img'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { formatDate } from '@/lib/format'
import type { Article, Category } from '@/payload-types'

export async function ArticleCard({
  article,
  locale,
  index,
  showImage = true,
  reveal = false,
}: {
  article: Article
  locale: Locale
  index?: number
  showImage?: boolean
  reveal?: boolean
}) {
  const category = article.category as Category | null
  const href = `/blog/${article.slug}`

  return (
    <article
      className="group relative flex flex-col overflow-hidden bg-paper shadow-sm transition-shadow hover:shadow-md"
      {...(reveal
        ? {
            'data-reveal': 'up',
            style: {
              '--reveal-delay': `${((index ?? 0) % 3) * 0.12}s`,
            } as React.CSSProperties,
          }
        : {})}
    >
      {showImage && (
        <div className="overflow-hidden">
          <Img
            media={article.coverImage}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {category && typeof category === 'object' && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {category.name}
          </p>
        )}
        <h3 className="mt-3 text-xl font-medium leading-snug text-ink sm:text-[1.4rem]">
          <Link href={href} className="after:absolute after:inset-0 group-hover:underline decoration-1 underline-offset-4">
            {article.title}
          </Link>
        </h3>
        <div className="mt-auto border-t border-line pt-3">
          <time dateTime={article.publishedAt} className="mt-4 block pt-1 text-sm text-muted">
            {formatDate(article.publishedAt, locale)}
          </time>
        </div>
      </div>
    </article>
  )
}
