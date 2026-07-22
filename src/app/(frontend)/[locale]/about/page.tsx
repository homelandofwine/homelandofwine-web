import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { ArticleBody } from '@/components/article/ArticleBody'
import { Img } from '@/components/media/Img'
import type { Locale } from '@/i18n/routing'
import { getAboutPage } from '@/lib/api'
import { absoluteUrl, ogLocale, pageAlternates } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: l } = await params
  const locale = l as Locale
  const about = await getAboutPage(locale)
  return {
    title: about.title,
    description: about.intro || undefined,
    alternates: pageAlternates(locale, '/about'),
    openGraph: {
      title: about.title,
      description: about.intro || undefined,
      url: absoluteUrl(locale, '/about'),
      locale: ogLocale(locale),
    },
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  const locale = l as Locale
  setRequestLocale(locale)

  const about = await getAboutPage(locale)

  return (
    <main>
      <header className="border-b border-line">
        <div className="mx-auto max-w-3xl px-4 pb-16 pt-40 text-center sm:px-6">
          <h1 className="anim-rise text-[clamp(3rem,8vw,5.5rem)] font-medium leading-none tracking-tight text-ink">
            {about.title}
          </h1>
          {about.intro && (
            <p
              className="anim-rise mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted"
              style={{ '--anim-delay': '0.15s' } as React.CSSProperties}
            >
              {about.intro}
            </p>
          )}
        </div>
        {about.heroImage && (
          <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
            <div className="anim-settle relative aspect-[2/1] w-full overflow-hidden rounded-lg">
              <div className="absolute inset-0" data-parallax>
                <Img
                  media={about.heroImage}
                  sizes="(min-width: 1024px) 960px, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        )}
      </header>
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20" data-reveal="up">
        <ArticleBody data={about.body as SerializedEditorState} />
      </div>
    </main>
  )
}
