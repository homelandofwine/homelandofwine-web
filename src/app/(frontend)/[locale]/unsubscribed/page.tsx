import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { ArrowLink } from '@/components/ui/ArrowLink'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function UnsubscribedPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale })

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-44 text-center sm:px-6">
      <h1 className="text-4xl font-medium tracking-tight text-ink">{t('unsubscribed.title')}</h1>
      <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted">
        {t('unsubscribed.description')}
      </p>
      <div className="mt-10 flex justify-center">
        <ArrowLink href="/">{t('notFound.backHome')}</ArrowLink>
      </div>
    </main>
  )
}
