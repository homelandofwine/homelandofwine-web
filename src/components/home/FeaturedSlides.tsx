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
      style={{ height: `${(slides.length + 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {slides.map((slide, i) => {
          const article = slide.article
          const href =
            article && typeof article === 'object' && article.slug ? `/blog/${article.slug}` : null
          const heading = (
            <h3 className="max-w-3xl text-[clamp(1.9rem,4.5vw,3.5rem)] font-medium uppercase leading-[1.05] tracking-tight text-shell-fg">
              {slide.title}
            </h3>
          )
          return (
            <article
              key={slide.id ?? i}
              data-slide
              className={`absolute inset-0 ${i === 0 ? 'is-active' : ''}`}
            >
              <div className="absolute inset-0" data-parallax>
                <Img media={slide.image} sizes="100vw" className="h-full w-full object-cover opacity-70" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-shell via-shell/30 to-shell/40" />

              <span className="absolute left-4 top-24 text-lg font-semibold text-shell-fg sm:left-6">
                / {String(i + 1).padStart(2, '0')}
              </span>

              <div className="absolute bottom-10 left-4 right-4 flex flex-col gap-6 sm:left-6 sm:right-6 md:flex-row md:items-end md:justify-between">
                {href ? <Link href={href}>{heading}</Link> : heading}
                {slide.caption && (
                  <p className="max-w-sm text-base leading-relaxed text-shell-dim md:text-right">
                    {slide.caption}
                  </p>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
