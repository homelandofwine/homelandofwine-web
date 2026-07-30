import { Img } from '@/components/media/Img'
import { SectionLabel } from '@/components/ui/SectionLabel'
import type { Media } from '@/payload-types'

type Cover = { id?: string | null; image: Media | string | number }

export function MagazineCovers({ heading, covers }: { heading?: string | null; covers: Cover[] }) {
  if (covers.length === 0) return null

  return (
    <section className="border-b border-line bg-shell text-shell-fg">
      <div
        data-hscroll
        className="relative"
        style={{ height: `${(covers.length + 1) * 100}vh` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {heading && (
            <div className="absolute left-0 right-0 top-24 z-20 mx-auto w-full max-w-[1400px] px-4 sm:px-6">
              <SectionLabel dark>{heading}</SectionLabel>
            </div>
          )}

          <div data-hscroll-track className="flex h-full will-change-transform">
            {covers.map((cover, i) => (
              <div
                key={cover.id ?? i}
                className="flex h-full w-screen shrink-0 items-center justify-center px-4"
              >
                <div className="aspect-[210/297] max-h-[80vh] w-[85vw] max-w-[420px] rounded-sm bg-white p-2 shadow-2xl sm:h-[80vh] sm:w-auto sm:max-w-none sm:p-3">
                  <Img
                    media={cover.image}
                    sizes="(min-width: 640px) 60vh, 85vw"
                    className="h-full w-full object-cover object-right"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
