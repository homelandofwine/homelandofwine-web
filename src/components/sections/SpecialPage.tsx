import { getTranslations } from 'next-intl/server'

import { ArticleCard } from '@/components/article/ArticleCard'
import { EventsGallery } from '@/components/gallery/EventsGallery'
import { Img } from '@/components/media/Img'
import type { Locale } from '@/i18n/routing'
import { getArticles, getCategoryBySlug } from '@/lib/api'
import type { AmbassadorPage } from '@/payload-types'

export async function SpecialPage({
  locale,
  page,
  categorySlug,
}: {
  locale: Locale
  page: AmbassadorPage
  categorySlug: string
}) {
  const t = await getTranslations({ locale })
  const category = await getCategoryBySlug(locale, categorySlug)
  const articles = category
    ? (await getArticles(locale, { categoryId: category.id })).docs
    : []

  const photos = (page.gallery ?? [])
    .filter((img): img is Exclude<typeof img, string | number> =>
      Boolean(img && typeof img === 'object' && img.url),
    )
    .map((img) => ({
      src: `${img.sizes?.hero?.url ?? img.url}`,
      width: img.sizes?.hero?.width ?? img.width ?? undefined,
      height: img.sizes?.hero?.height ?? img.height ?? undefined,
      alt: img.alt || '',
      thumb: `${img.sizes?.card?.url ?? img.url}`,
    }))

  return (
    <main>
      <header className="border-b border-line">
        <div className="mx-auto max-w-3xl px-4 pb-16 pt-40 text-center sm:px-6">
          {page.logo && typeof page.logo === 'object' && (
            <Img
              media={page.logo}
              sizes="480px"
              className="anim-settle mx-auto h-32 w-auto object-contain sm:h-40"
            />
          )}
          <h1
            className={
              page.logo && typeof page.logo === 'object'
                ? 'sr-only'
                : 'anim-rise text-[clamp(2.5rem,7vw,5rem)] font-medium leading-none tracking-tight text-ink'
            }
          >
            {page.title}
          </h1>
          {page.intro && (
            <p
              className="anim-rise mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted"
              style={{ '--anim-delay': '0.15s' } as React.CSSProperties}
            >
              {page.intro}
            </p>
          )}
        </div>
      </header>

      {articles.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:py-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <ArticleCard key={article.id} article={article} locale={locale} index={i} reveal />
            ))}
          </div>
        </section>
      )}

      <EventsGallery photos={photos} heading={t('common.gallery')} />
    </main>
  )
}
