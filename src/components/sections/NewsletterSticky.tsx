import { getTranslations } from 'next-intl/server'

import { NewsletterForm } from '@/components/newsletter/NewsletterForm'
import type { Locale } from '@/i18n/routing'

export async function NewsletterSticky({
  locale,
  titleLine1,
  titleLine2,
  helperTitle,
  description,
}: {
  locale: Locale
  titleLine1?: string | null
  titleLine2?: string | null
  helperTitle?: string | null
  description?: string | null
}) {
  const t = await getTranslations({ locale })

  return (
    <section id="newsletter" className="relative border-t border-line">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="sticky top-[20vh] flex items-start justify-between gap-10 pt-16">
          <h2 className="text-[clamp(3rem,9vw,7.5rem)] font-medium uppercase leading-[0.95] tracking-tight text-ink">
            {titleLine1 || t('newsletter.titleLine1')}
            <br />
            {titleLine2 || t('newsletter.titleLine2')}
          </h2>
          <div className="hidden max-w-xs pt-4 lg:block">
            <p className="text-base font-semibold text-ink">{helperTitle || t('newsletter.helperTitle')}</p>
            <p className="mt-3 text-base leading-relaxed text-muted">{description || t('newsletter.description')}</p>
          </div>
        </div>
        <div className="relative z-10 mx-auto max-w-xl pb-28 pt-[34vh]">
          <div className="rounded-lg bg-paper p-8 shadow-xl sm:p-12">
            <NewsletterForm variant="card" />
          </div>
        </div>
      </div>
    </section>
  )
}
