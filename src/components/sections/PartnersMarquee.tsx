import { getTranslations } from 'next-intl/server'

import { Img } from '@/components/media/Img'
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
  const duration = `${row.length * 7}s`

  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6" data-reveal="fade">
        <h2 className="text-center text-3xl tracking-tight text-ink sm:text-4xl">{title}</h2>
        <div className="marquee mt-12" aria-label={title}>
          <div
            className="marquee-track"
            style={{ '--marquee-duration': duration } as React.CSSProperties}
          >
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-center gap-24 pr-24"
                aria-hidden={copy === 1 ? 'true' : undefined}
              >
                {row.map((p, i) => {
                  const logo = (
                    <Img
                      media={p.logo}
                      sizes="160px"
                      className="h-20 w-auto max-w-none object-contain transition-transform hover:scale-105"
                    />
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
        </div>
      </div>
    </section>
  )
}
