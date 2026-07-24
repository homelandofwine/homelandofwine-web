import { Img } from '@/components/media/Img'
import { SectionLabel } from '@/components/ui/SectionLabel'
import type { Media } from '@/payload-types'

type Cover = { id?: string | null; image: Media | string | number }

const pad = (n: number) => String(n).padStart(2, '0')

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
                className="relative flex h-full w-screen shrink-0 items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0" aria-hidden="true">
                  <Img
                    media={cover.image}
                    sizes="60vw"
                    className="h-full w-full scale-110 object-cover opacity-20 blur-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-shell via-shell/40 to-shell/70" />
                </div>

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-2 top-1/2 z-0 -translate-y-1/2 text-[clamp(8rem,24vw,22rem)] font-medium leading-none text-shell-fg/10 sm:left-8"
                >
                  {pad(i + 1)}
                </span>

                <div className="relative z-10 flex flex-col items-center gap-7 px-4 pt-16">
                  <Img
                    media={cover.image}
                    sizes="(min-width: 1024px) 52vh, 80vw"
                    className="max-h-[64vh] w-auto max-w-[85vw] rounded-sm object-contain shadow-2xl"
                  />
                  <div className="flex items-center gap-5">
                    <span className="caps text-sm font-semibold tracking-widest text-shell-dim">
                      {pad(i + 1)} / {pad(covers.length)}
                    </span>
                    <span className="flex items-center gap-2" aria-hidden="true">
                      {covers.map((_, d) => (
                        <span
                          key={d}
                          className={`h-1.5 w-1.5 rounded-full ${
                            d === i ? 'bg-accent-soft' : 'bg-shell-fg/20'
                          }`}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
