import { Img } from '@/components/media/Img'
import { SectionLabel } from '@/components/ui/SectionLabel'
import type { Media } from '@/payload-types'

type Cover = { id?: string | null; image: Media | string | number }

export function MagazineCovers({ heading, covers }: { heading?: string | null; covers: Cover[] }) {
  if (covers.length === 0) return null

  return (
    <section className="overflow-hidden border-b border-line">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:py-28">
        {heading && (
          <div data-reveal="up">
            <SectionLabel>{heading}</SectionLabel>
          </div>
        )}
        <div className="mt-14 flex flex-col items-center gap-16 lg:gap-24">
          {covers.map((cover, i) => (
            <div
              key={cover.id ?? i}
              data-reveal={i % 2 === 0 ? 'left-throw' : 'right-throw'}
              className="w-full max-w-sm sm:w-[33vw] sm:max-w-[520px]"
            >
              <Img
                media={cover.image}
                sizes="(min-width: 640px) 33vw, 90vw"
                className="w-full shadow-2xl"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
