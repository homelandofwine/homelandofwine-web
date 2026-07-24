import { Img } from '@/components/media/Img'
import { SectionLabel } from '@/components/ui/SectionLabel'
import type { Media } from '@/payload-types'

type Cover = { id?: string | null; image: Media | string | number }

const pad = (n: number) => String(n).padStart(2, '0')

export function MagazineCovers({ heading, covers }: { heading?: string | null; covers: Cover[] }) {
  if (covers.length === 0) return null

  return (
    <section className="border-b border-line">
      <div
        data-slides
        className="relative"
        style={{ height: `${(covers.length + 1) * 100}vh` }}
      >
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
          {heading && (
            <div className="mx-auto w-full max-w-[1400px] px-4 pt-28 sm:px-6">
              <SectionLabel>{heading}</SectionLabel>
            </div>
          )}
          <div className="relative flex-1">
            {covers.map((cover, i) => (
              <div
                key={cover.id ?? i}
                data-slide
                className={`cover-slide absolute inset-0 flex flex-col items-center justify-center gap-8 px-4 pb-10 ${
                  i === 0 ? 'is-active' : ''
                }`}
              >
                <Img
                  media={cover.image}
                  sizes="(min-width: 1024px) 55vh, 88vw"
                  className="max-h-[66vh] w-auto max-w-[88vw] rounded-sm object-contain shadow-2xl"
                />
                <div className="flex items-center gap-5">
                  <span className="caps text-sm font-semibold tracking-widest text-muted">
                    {pad(i + 1)} / {pad(covers.length)}
                  </span>
                  <span className="flex items-center gap-2" aria-hidden="true">
                    {covers.map((_, d) => (
                      <span
                        key={d}
                        className={`h-1.5 w-1.5 rounded-full ${d === i ? 'bg-accent' : 'bg-line'}`}
                      />
                    ))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
