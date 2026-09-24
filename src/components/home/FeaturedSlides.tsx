import { Img } from '@/components/media/Img'
import { Link } from '@/i18n/navigation'
import type { Article, Media } from '@/payload-types'

type Slide = {
  id?: string | null
  image: Media | string | number
  title: string
  caption?: string | null
  article?: Article | number | null
}

export function FeaturedSlides({ slides }: { slides: Slide[] }) {
  if (slides.length === 0) return null

  return (
    <section
      className="relative bg-shell"
      data-slides
      style={{ height: `${100 + slides.length * 50}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {slides.map((slide, i) => {
          const media = typeof slide.image === 'object' ? slide.image : null
          const portrait = Boolean(media?.width && media?.height && media.height >= media.width)
          const article = slide.article
          const href =
            article && typeof article === 'object' && article.slug ? `/blog/${article.slug}` : null
          const heading = (
            <h3 className="ka-heading max-w-3xl text-[clamp(1.9rem,4.5vw,3.5rem)] font-medium uppercase leading-[1.05] tracking-tight text-shell-fg">
              {slide.title}
            </h3>
          )
          return (
            <article
              key={slide.id ?? i}
              data-slide
              className={`absolute inset-0 ${i === 0 ? 'is-active' : ''}`}
            >
              <div className="absolute inset-0" aria-hidden="true" data-parallax>
                <Img
                  media={slide.image}
                  sizes="60vw"
                  className="h-full w-full scale-110 object-cover opacity-30 blur-2xl"
                />
              </div>
              {portrait ? (
                <div className="absolute inset-0 flex items-center justify-center px-4 pb-40 pt-24 sm:px-10 sm:pb-36">
                  <Img
                    media={slide.image}
                    sizes="100vw"
                    className="max-h-full max-w-full rounded-sm object-contain shadow-2xl"
                  />
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 hidden sm:block" data-parallax>
                    <Img media={slide.image} sizes="100vw" className="h-full w-full object-cover" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center px-4 pb-40 pt-24 sm:hidden">
                    <Img
                      media={slide.image}
                      sizes="100vw"
                      className="max-h-full max-w-full rounded-sm object-contain shadow-2xl"
                    />
                  </div>
                </>
              )}
              <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-shell to-transparent" />

              <span className="absolute left-4 top-28 text-[clamp(1.9rem,4.5vw,3.5rem)] font-medium leading-none text-shell-fg sm:left-6">
                /{String(i + 1).padStart(2, '0')}
              </span>

              <div className="absolute bottom-10 left-4 right-4 flex flex-col gap-6 sm:left-6 sm:right-6 md:flex-row md:items-end md:justify-between">
                {href ? <Link href={href}>{heading}</Link> : heading}
                {slide.caption && (
                  <div className="max-w-sm border-l-2 border-accent pl-4 md:border-l-0 md:border-r-2 md:pl-0 md:pr-4 md:text-right">
                    <p className="caps text-sm font-semibold tracking-widest text-accent-soft">
                      /{String(i + 1).padStart(2, '0')}
                    </p>
                    <p className="mt-2 text-lg leading-relaxed text-shell-fg/90">{slide.caption}</p>
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
