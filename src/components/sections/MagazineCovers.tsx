import { Img } from '@/components/media/Img'
import { SectionLabel } from '@/components/ui/SectionLabel'
import type { Media } from '@/payload-types'

type Cover = { id?: string | null; image: Media | string | number }

export function MagazineCovers({ heading, covers }: { heading?: string | null; covers: Cover[] }) {
  if (covers.length === 0) return null

  return (
    <section className="border-b border-line bg-shell text-shell-fg">
      <div
        data-slides
        className="relative"
        style={{ height: `${(covers.length + 1) * 100}vh` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {heading && (
            <div className="absolute left-0 right-0 top-24 z-20 mx-auto w-full max-w-[1400px] px-4 sm:px-6">
              <SectionLabel dark>{heading}</SectionLabel>
            </div>
          )}

          {covers.map((cover, i) => (
            <div
              key={cover.id ?? i}
              data-slide
              className="mag-slide absolute inset-0 flex items-center justify-center px-4"
            >
              <div className="rounded-sm bg-white p-2 shadow-2xl sm:p-3">
                <Img
                  media={cover.image}
                  sizes="(min-width: 640px) 60vh, 85vw"
                  className="max-h-[70vh] w-auto max-w-[86vw] object-contain sm:max-h-[77vh]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
