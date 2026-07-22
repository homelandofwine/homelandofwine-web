import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Img } from '@/components/media/Img'
import { DEFAULT_SECTIONS, SectionRenderer } from '@/components/sections/SectionRenderer'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getAboutPage, getArticles, getHomepage, getSettings } from '@/lib/api'
import { formatDate } from '@/lib/format'
import type { Category } from '@/payload-types'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  const locale = l as Locale
  setRequestLocale(locale)

  const t = await getTranslations({ locale })
  const [{ docs: articles }, settings, about, homepage] = await Promise.all([
    getArticles(locale, { limit: 13 }),
    getSettings(locale),
    getAboutPage(locale),
    getHomepage(locale),
  ])

  const [latest, ...rest] = articles
  const latestCategory = latest?.category as Category | null
  const sections =
    homepage.sections && homepage.sections.length > 0 ? homepage.sections : DEFAULT_SECTIONS

  const heroVideo =
    homepage.heroVideo && typeof homepage.heroVideo === 'object' ? homepage.heroVideo : null
  const heroPoster =
    homepage.heroPoster && typeof homepage.heroPoster === 'object' ? homepage.heroPoster : null

  return (
    <main id="top">
      {latest && (
        <section className="sticky top-0 flex min-h-screen flex-col justify-end overflow-hidden bg-shell text-shell-fg">
          <div className="absolute inset-0" data-parallax>
            {heroVideo?.url ? (
              <>
                <link rel="preload" as="video" href={heroVideo.url} type={heroVideo.mimeType ?? 'video/mp4'} />
                {(heroPoster?.sizes?.hero?.url ?? heroPoster?.url) && (
                  <link
                    rel="preload"
                    as="image"
                    href={heroPoster?.sizes?.hero?.url ?? heroPoster?.url ?? undefined}
                    fetchPriority="high"
                  />
                )}
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster={heroPoster?.sizes?.hero?.url ?? heroPoster?.url ?? undefined}
                  className="anim-settle h-full w-full object-cover"
                  style={{ '--anim-opacity': '0.75' } as React.CSSProperties}
                >
                  <source src={heroVideo.url} type={heroVideo.mimeType ?? 'video/mp4'} />
                </video>
              </>
            ) : (
              <Img
                media={latest.coverImage}
                sizes="100vw"
                loading="eager"
                fetchPriority="high"
                className="anim-settle h-full w-full object-cover"
                style={{ '--anim-opacity': '0.75' } as React.CSSProperties}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-shell via-shell/40 to-shell/20" />
          </div>

          <div className="relative mx-auto w-full max-w-[1400px] px-4 pb-10 pt-40 sm:px-6">
            <div
              className="anim-rise flex items-center gap-3 text-sm text-shell-dim"
              style={{ '--anim-delay': '0.15s' } as React.CSSProperties}
            >
              {latestCategory && typeof latestCategory === 'object' && (
                <span className="rounded bg-shell-fg/10 px-2.5 py-1 font-medium text-shell-fg backdrop-blur">
                  {latestCategory.name}
                </span>
              )}
              <span>{t('common.latest')}</span>
            </div>
            <h1
              className="anim-rise mt-6 max-w-5xl text-[clamp(2.5rem,7vw,5.5rem)] font-medium uppercase leading-[1.02] tracking-tight"
              style={{ '--anim-delay': '0.3s' } as React.CSSProperties}
            >
              <Link href={`/blog/${latest.slug}`}>{latest.title}</Link>
            </h1>

            <div
              className="anim-rise mt-10 flex flex-col justify-between gap-8 border-t border-shell-line pt-8 md:flex-row md:items-end"
              style={{ '--anim-delay': '0.5s' } as React.CSSProperties}
            >
              <p className="hidden text-sm text-shell-dim md:block">[ {t('home.heroKicker')} ]</p>
              <div className="max-w-md">
                <p className="text-base leading-relaxed text-shell-dim">{latest.excerpt}</p>
                <div className="mt-6 flex items-center gap-5">
                  <Link
                    href={`/blog/${latest.slug}`}
                    className="rounded-md bg-shell-fg px-5 py-3 text-sm font-semibold text-shell transition-colors hover:opacity-90"
                  >
                    {t('common.readArticle')}
                  </Link>
                  <time dateTime={latest.publishedAt} className="text-sm text-shell-dim">
                    {formatDate(latest.publishedAt, locale)}
                  </time>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="relative z-10 bg-page">
        <SectionRenderer
          sections={sections}
          locale={locale}
          articles={rest}
          settings={settings}
          about={about}
        />
      </div>
    </main>
  )
}
