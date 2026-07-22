import { Img } from '@/components/media/Img'
import { SectionLabel } from '@/components/ui/SectionLabel'
import type { Media } from '@/payload-types'

type Card = {
  id?: string | null
  title: string
  text?: string | null
  image?: Media | string | number | null
}

export function InfoCards({ heading, cards }: { heading: string; cards: Card[] }) {
  if (cards.length === 0) return null

  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:py-28">
        <div data-reveal="up">
          <SectionLabel>{heading}</SectionLabel>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <div
              key={card.id ?? i}
              className="flex flex-col overflow-hidden rounded-lg bg-paper"
              data-reveal="up"
              style={{ '--reveal-delay': `${(i % 4) * 0.1}s` } as React.CSSProperties}
            >
              {card.image && typeof card.image === 'object' && (
                <Img
                  media={card.image}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="aspect-[4/3] w-full object-cover"
                />
              )}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl tracking-tight text-ink">{card.title}</h3>
                {card.text && (
                  <p className="mt-3 text-base leading-relaxed text-muted">{card.text}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
