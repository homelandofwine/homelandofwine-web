import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { ArticleBody } from '@/components/article/ArticleBody'
import type { Locale } from '@/i18n/routing'
import { getPrivacyPage } from '@/lib/api'
import { pageAlternates } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: l } = await params
  const locale = l as Locale
  const page = await getPrivacyPage(locale)
  return {
    title: page.title,
    alternates: pageAlternates(locale, '/privacy'),
    robots: { index: false, follow: true },
  }
}

export default async function PrivacyRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  const locale = l as Locale
  setRequestLocale(locale)
  const page = await getPrivacyPage(locale)

  return (
    <main>
      <header className="border-b border-line">
        <div className="mx-auto max-w-3xl px-4 pb-14 pt-40 sm:px-6">
          <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-tight tracking-tight text-ink">
            {page.title}
          </h1>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <ArticleBody data={page.body as SerializedEditorState} />
      </div>
    </main>
  )
}
