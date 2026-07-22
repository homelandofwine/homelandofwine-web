import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { SpecialPage } from '@/components/sections/SpecialPage'
import type { Locale } from '@/i18n/routing'
import { getNLinePrintPage } from '@/lib/api'
import { absoluteUrl, ogLocale, pageAlternates } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: l } = await params
  const locale = l as Locale
  const page = await getNLinePrintPage(locale)
  return {
    title: page.title,
    description: page.intro || undefined,
    alternates: pageAlternates(locale, '/n-line-print'),
    openGraph: {
      title: page.title,
      description: page.intro || undefined,
      url: absoluteUrl(locale, '/n-line-print'),
      locale: ogLocale(locale),
    },
  }
}

export default async function NLinePrintRoute({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: l } = await params
  const locale = l as Locale
  setRequestLocale(locale)
  const page = await getNLinePrintPage(locale)
  return <SpecialPage locale={locale} page={page} categorySlug="n-line-print" />
}
