import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { ArticleBody } from '@/components/article/ArticleBody'
import { ArticleCard } from '@/components/article/ArticleCard'
import { ShareButtons } from '@/components/article/ShareButtons'
import { SetAlternates } from '@/components/layout/AlternateLinks'
import { DraftBanner } from '@/components/layout/DraftBanner'
import { Img } from '@/components/media/Img'
import { NewsletterForm } from '@/components/newsletter/NewsletterForm'
import { JsonLd } from '@/components/seo/JsonLd'
import { Link } from '@/i18n/navigation'
import { type Locale } from '@/i18n/routing'
import {
  getAllArticleSlugs,
  getArticleBySlug,
  getArticles,
  getDraftArticleBySlug,
  getSettings,
} from '@/lib/api'
import { formatDate } from '@/lib/format'
import { absoluteUrl, localePath, ogLocale, pageAlternates, SITE_URL } from '@/lib/seo'
import type { Category, Media, User } from '@/payload-types'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale: l, slug } = await params
  const locale = l as Locale
  const result = await getArticleBySlug(locale, slug)
  if (!result) return {}

  const { article, alternateSlug, otherLocale } = result
  const cover = article.coverImage as Media | null
  const ogImage =
    (typeof cover === 'object' && (cover?.sizes?.og?.url ?? cover?.url)) || undefined

  const paths: { ka?: string; en?: string } = { [locale]: `/blog/${slug}` }
  if (alternateSlug) paths[otherLocale] = `/blog/${alternateSlug}`

  const alternates = result.native
    ? pageAlternates(locale, `/blog/${slug}`, paths)
    : { canonical: absoluteUrl(otherLocale, `/blog/${alternateSlug ?? slug}`) }

  const title = article.seo?.metaTitle || article.title
  const description = article.seo?.metaDescription || article.excerpt

  return {
    title,
    description,
    alternates,
    openGraph: {
      type: 'article',
      title,
      description,
      url: absoluteUrl(locale, `/blog/${slug}`),
      locale: ogLocale(locale),
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
  }
}

export const dynamicParams = true

export async function generateStaticParams({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const docs = await getAllArticleSlugs()
  return docs
    .map((d) => d.slug?.[locale as Locale] ?? (locale === 'ka' ? d.slug?.en : undefined))
    .filter((s): s is string => Boolean(s))
    .map((slug) => ({ slug }))
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: l, slug } = await params
  const locale = l as Locale
  setRequestLocale(locale)

  const { isEnabled: isDraft } = await draftMode()
  const result = isDraft
    ? await getDraftArticleBySlug(locale, slug)
    : await getArticleBySlug(locale, slug)
  if (!result) notFound()

  const t = await getTranslations({ locale })
  const { article, alternateSlug, otherLocale } = result
  const category = article.category as Category | null

  const alternates = {
    [locale]: localePath(locale, `/blog/${slug}`),
    [otherLocale]: alternateSlug
      ? localePath(otherLocale, `/blog/${alternateSlug}`)
      : localePath(otherLocale, '/blog'),
  }

  const settings = await getSettings(locale)
  const cover = article.coverImage as Media | null
  const author = article.author as User | null

  const categoryId = category && typeof category === 'object' ? category.id : undefined
  const related = categoryId
    ? (await getArticles(locale, { limit: 4, categoryId })).docs
        .filter((a) => a.id !== article.id)
        .slice(0, 3)
    : []

  const review = article.review
  const isReview = Boolean(review?.isReview && review?.rating != null && review?.wineName)
  const facts = (article.facts ?? []).filter((f) => f.label && f.value)
  const authorName = author && typeof author === 'object' ? author.name : null
  const authorBio = author && typeof author === 'object' ? author.bio : null

  return (
    <main>
      {isDraft && <DraftBanner exitPath={alternates[locale] ?? '/'} />}
      <SetAlternates alternates={alternates} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.excerpt,
          image:
            typeof cover === 'object' && cover?.url
              ? [`${SITE_URL}${cover.sizes?.og?.url ?? cover.url}`]
              : undefined,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          inLanguage: locale,
          author:
            author && typeof author === 'object' && author.name
              ? { '@type': 'Person', name: author.name }
              : { '@type': 'Organization', name: settings.siteName },
          publisher: {
            '@type': 'Organization',
            name: settings.siteName,
            logo: {
              '@type': 'ImageObject',
              url: `${SITE_URL}/brand/logo-ink.png`,
              width: 800,
              height: 496,
            },
          },
          mainEntityOfPage: absoluteUrl(locale, `/blog/${slug}`),
        }}
      />
      {isReview && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Review',
            itemReviewed: {
              '@type': 'Product',
              name: review!.wineName,
              image:
                typeof cover === 'object' && cover?.url
                  ? `${SITE_URL}${cover.sizes?.og?.url ?? cover.url}`
                  : undefined,
            },
            reviewRating: {
              '@type': 'Rating',
              ratingValue: review!.rating,
              bestRating: review!.bestRating ?? 100,
              worstRating: review!.worstRating ?? 50,
            },
            author: authorName
              ? { '@type': 'Person', name: authorName }
              : { '@type': 'Organization', name: settings.siteName },
            publisher: {
              '@type': 'Organization',
              name: settings.siteName,
              logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/brand/logo-ink.png`,
                width: 800,
                height: 496,
              },
            },
            datePublished: article.publishedAt,
            inLanguage: locale,
          }}
        />
      )}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('nav.home'), item: absoluteUrl(locale, '/') },
            { '@type': 'ListItem', position: 2, name: t('nav.blog'), item: absoluteUrl(locale, '/blog') },
            ...(category && typeof category === 'object'
              ? [
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: category.name,
                    item: absoluteUrl(locale, `/blog/category/${category.slug}`),
                  },
                ]
              : []),
            {
              '@type': 'ListItem',
              position: category && typeof category === 'object' ? 4 : 3,
              name: article.title,
              item: absoluteUrl(locale, `/blog/${slug}`),
            },
          ],
        }}
      />

      <article>
        <header>
          <div className="mx-auto max-w-4xl px-4 pb-14 pt-40 text-center sm:px-6">
            <div className="anim-rise flex items-center justify-center gap-4 text-sm">
              {category && typeof category === 'object' && (
                <Link
                  href={`/blog/category/${category.slug}`}
                  className="rounded bg-stone px-2.5 py-1 font-medium text-ink transition-colors hover:bg-ink hover:text-shell-fg"
                >
                  {category.name}
                </Link>
              )}
              <time dateTime={article.publishedAt} className="text-muted">
                {formatDate(article.publishedAt, locale)}
              </time>
              {authorName && <span className="text-muted">— {authorName}</span>}
              {isReview && (
                <span className="rounded bg-accent px-2.5 py-1 font-semibold text-shell-fg">
                  {review!.rating} / {review!.bestRating ?? 100}
                </span>
              )}
            </div>
            <h1
              className="anim-rise mt-8 text-[clamp(2.25rem,5.5vw,4.25rem)] font-medium leading-[1.05] tracking-tight text-ink"
              style={{ '--anim-delay': '0.12s' } as React.CSSProperties}
            >
              {article.title}
            </h1>
            <p
              className="anim-rise mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted"
              style={{ '--anim-delay': '0.24s' } as React.CSSProperties}
            >
              {article.excerpt}
            </p>
            <div
              className="anim-rise mt-8 flex justify-center"
              style={{ '--anim-delay': '0.3s' } as React.CSSProperties}
            >
              <ShareButtons url={absoluteUrl(locale, `/blog/${slug}`)} title={article.title} />
            </div>
          </div>
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <Img
              media={article.coverImage}
              sizes="(min-width: 1024px) 960px, 100vw"
              loading="eager"
              fetchPriority="high"
              className="anim-settle aspect-[2/1] w-full rounded-lg object-cover"
              style={{ '--anim-delay': '0.2s' } as React.CSSProperties}
            />
          </div>
        </header>

        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
          <div className="mx-auto w-full max-w-3xl py-14 lg:py-20" data-reveal="up">
            <ArticleBody data={article.body as SerializedEditorState} />
            {facts.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2.5 border-t border-line pt-8">
                {facts.map((f, i) => (
                  <span
                    key={f.id ?? i}
                    className="rounded-full border border-line bg-paper px-4 py-2 text-sm"
                  >
                    <span className="font-semibold text-ink">{f.label}: </span>
                    <span className="text-muted">{f.value}</span>
                  </span>
                ))}
              </div>
            )}
            {authorName && (
              <div className="mt-14 rounded-lg bg-paper p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                  {t('common.author')}
                </p>
                <p className="mt-2 text-xl tracking-tight text-ink">{authorName}</p>
                {authorBio && (
                  <p className="mt-3 text-sm leading-relaxed text-muted">{authorBio}</p>
                )}
              </div>
            )}
            <div className="mt-14 border-t border-line pt-8">
              <Link
                href="/blog"
                className="inline-block rounded-md bg-ink px-5 py-3 text-sm font-semibold text-page transition-colors hover:bg-ink-soft"
              >
                {t('common.backToBlog')}
              </Link>
            </div>
          </div>

          {related.length > 0 && (
            <aside className="hidden py-20 lg:block">
              <div className="sticky top-36 space-y-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                  {t('common.readMore')}
                </p>
                {related.map((a) => (
                  <Link
                    key={a.id}
                    href={`/blog/${a.slug}`}
                    className="group block border-b border-line pb-5"
                  >
                    <p className="text-base font-medium leading-snug text-ink transition-colors group-hover:text-accent">
                      {a.title}
                    </p>
                    {a.excerpt && (
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                        {a.excerpt}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:py-20">
            <h2 className="text-3xl tracking-tight text-ink">{t('common.readMore')}</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a, i) => (
                <ArticleCard key={a.id} article={a} locale={locale} index={i} reveal />
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="newsletter" className="bg-shell text-shell-fg">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-medium uppercase tracking-tight">
              {t('newsletter.title')}
            </h2>
            <p className="mt-3 text-sm text-shell-dim">{t('newsletter.description')}</p>
          </div>
          <NewsletterForm compact />
        </div>
      </section>
    </main>
  )
}
