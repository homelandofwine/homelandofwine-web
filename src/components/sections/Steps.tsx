import { Img } from '@/components/media/Img'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Link } from '@/i18n/navigation'
import type { Article, Media } from '@/payload-types'

type StepItem = {
  id?: string | null
  image?: Media | string | number | null
  title: string
  text: string
  article?: Article | number | null
}

export function Steps({ heading, items }: { heading: string; items: StepItem[] }) {
  if (items.length === 0) return null

  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:py-28">
        <div data-reveal="up">
          <SectionLabel>{heading}</SectionLabel>
        </div>
        <div className="mt-12">
          {items.map((step, i) => {
            const article =
              step.article && typeof step.article === 'object' ? step.article : null
            const href = article?.slug ? `/blog/${article.slug}` : null
            const text = article?.excerpt || step.text

            const row = (
              <div className="grid gap-6 text-center md:grid-cols-[auto_1fr_1fr] md:items-center md:text-left">
                <div className="flex flex-col items-center gap-4 md:self-stretch">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded bg-accent text-sm font-semibold text-shell-fg">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span aria-hidden="true" className="hidden w-px grow bg-line md:block" />
                </div>
                <div>
                  <h3 className="caps text-2xl tracking-tight text-ink transition-colors group-hover:text-accent sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-muted md:mx-0">
                    {text}
                  </p>
                </div>
                {step.image && typeof step.image === 'object' && (
                  <Img
                    media={step.image}
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="aspect-[16/9] w-full rounded-lg object-cover"
                  />
                )}
              </div>
            )

            return (
              <div
                key={step.id ?? i}
                className="sticky border-t border-line bg-page py-10"
                style={{ top: `${96 + i * 56}px` }}
              >
                {href ? (
                  <Link href={href} className="group block" aria-label={step.title}>
                    {row}
                  </Link>
                ) : (
                  row
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
