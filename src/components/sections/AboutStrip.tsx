import { getTranslations } from 'next-intl/server'

import { SectionLabel } from '@/components/ui/SectionLabel'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import type { AboutPage, SiteSetting } from '@/payload-types'

export async function AboutStrip({
  locale,
  settings,
  about,
  heading,
}: {
  locale: Locale
  settings: SiteSetting
  about: AboutPage
  heading?: string | null
}) {
  const t = await getTranslations({ locale })

  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:py-28">
        <div data-reveal="up">
          <SectionLabel>{t('nav.about')}</SectionLabel>
        </div>
        <h2
          className="mt-8 max-w-3xl text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[1.05] tracking-tight text-ink"
          data-reveal="up"
          style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}
        >
          {heading || t('home.aboutHeading')}
        </h2>
        <div
          className="mt-12 flex flex-col justify-between gap-10 md:flex-row md:items-end"
          data-reveal="up"
          style={{ '--reveal-delay': '0.2s' } as React.CSSProperties}
        >
          <div className="grid max-w-2xl gap-8 sm:grid-cols-2">
            <p className="text-base leading-relaxed text-muted">{settings.siteDescription}</p>
            {about.intro && <p className="text-base leading-relaxed text-muted">{about.intro}</p>}
          </div>
          <Link
            href="/about"
            className="shrink-0 rounded-md bg-ink px-5 py-3 text-sm font-semibold text-page transition-colors hover:bg-ink-soft"
          >
            {t('home.aboutButton')}
          </Link>
        </div>
      </div>
    </section>
  )
}
