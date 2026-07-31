import { getTranslations } from 'next-intl/server'

import { Img } from '@/components/media/Img'
import { PartnersRow } from '@/components/sections/PartnersRow'
import { SectionLabel } from '@/components/ui/SectionLabel'
import type { Locale } from '@/i18n/routing'
import type { Media } from '@/payload-types'

type Partner = {
  id?: string | null
  name: string
  logo: Media | string | number
  url?: string | null
}

export async function PartnersMarquee({
  locale,
  partners,
  heading,
}: {
  locale: Locale
  partners: Partner[]
  heading?: string | null
}) {
  const t = await getTranslations({ locale })
  if (partners.length === 0) return null
  const title = heading || t('home.partnersTitle')

  const repeats = Math.max(1, Math.ceil(18 / partners.length))
  const row = Array.from({ length: repeats }, () => partners).flat()

  return (
    <section className="border-b border-line">
      <div className="py-16" data-reveal="fade">
        <div className="px-4 text-center sm:px-6">
          <SectionLabel>{title}</SectionLabel>
        </div>
        <div className="mt-12 w-full" aria-label={title}>
          <PartnersRow>
            <div className="flex w-max items-center">
              {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-center gap-5 pr-5 sm:gap-12 sm:pr-12"
                aria-hidden={copy === 1 ? 'true' : undefined}
              >
                {row.map((p, i) => {
                  const logo = (
                    <span className="flex h-20 w-44 items-center justify-center sm:h-32 sm:w-80">
                      <Img
                        media={p.logo}
                        sizes="320px"
                        className="max-h-full max-w-full object-contain transition-transform hover:scale-105"
                      />
                    </span>
                  )
                  return p.url ? (
                    <a
                      key={`${copy}-${i}`}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={p.name}
                      tabIndex={copy === 1 ? -1 : undefined}
                    >
                      {logo}
                    </a>
                  ) : (
                    <span key={`${copy}-${i}`}>{logo}</span>
                  )
                })}
              </div>
              ))}
            </div>
          </PartnersRow>
        </div>
      </div>
    </section>
  )
}
