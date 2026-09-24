import { Img } from '@/components/media/Img'
import { HScroll } from '@/components/ui/HScroll'
import { SectionLabel } from '@/components/ui/SectionLabel'
import type { Media } from '@/payload-types'

type PageItem = {
  id?: string | null
  image: Media | string | number
  name?: string | null
  url?: string | null
}

export function ProducerPages({
  heading,
  pages,
}: {
  heading?: string | null
  pages: PageItem[]
}) {
  if (pages.length === 0) return null

  return (
    <section className="border-b border-line">
      <div className="py-16 lg:py-24" data-reveal="fade">
        <div className="px-4 text-center sm:px-6">
          <SectionLabel>{heading || 'Producers'}</SectionLabel>
        </div>
        <div className="mt-12">
          <HScroll>
            <div className="mx-auto flex w-max items-stretch gap-5 px-4 sm:gap-8 sm:px-6">
              {pages.map((p, i) => {
                const card = (
                  <span className="block h-[420px] rounded-sm bg-white p-2 shadow-lg sm:h-[540px] sm:p-2.5">
                    <Img
                      media={p.image}
                      sizes="(min-width: 640px) 384px, 300px"
                      className="h-full w-auto rounded-[2px] object-contain"
                    />
                  </span>
                )
                return p.url ? (
                  <a
                    key={p.id ?? i}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={p.name || 'Producer page'}
                    className="shrink-0 transition-transform hover:-translate-y-1"
                  >
                    {card}
                  </a>
                ) : (
                  <span key={p.id ?? i} className="shrink-0">
                    {card}
                  </span>
                )
              })}
            </div>
          </HScroll>
        </div>
      </div>
    </section>
  )
}
