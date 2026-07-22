import { getTranslations } from 'next-intl/server'

import { ArrowLink } from '@/components/ui/ArrowLink'

export default async function NotFound() {
  const t = await getTranslations()

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-44 text-center sm:px-6">
      <p className="text-[7rem] font-medium leading-none tracking-tight text-accent">404</p>
      <h1 className="mt-4 text-3xl font-medium tracking-tight text-ink">{t('notFound.title')}</h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
        {t('notFound.description')}
      </p>
      <div className="mt-10 flex justify-center">
        <ArrowLink href="/">{t('notFound.backHome')}</ArrowLink>
      </div>
    </main>
  )
}
