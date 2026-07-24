import { DigitRoll } from '@/components/sections/DigitRoll'
import { WordReveal } from '@/components/sections/WordReveal'
import { SectionLabel } from '@/components/ui/SectionLabel'

type Stat = { id?: string | null; value: string; label: string }

export function StatsTiles({
  heading,
  statement,
  items,
}: {
  heading?: string | null
  statement?: string | null
  items: Stat[]
}) {
  if (items.length === 0) return null

  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:py-28">
        {heading && (
          <div className="text-center" data-reveal="up">
            <SectionLabel>{heading}</SectionLabel>
          </div>
        )}
        {statement && (
          <WordReveal
            text={statement}
            className="ka-heading mx-auto mt-10 max-w-4xl text-center text-[clamp(1.5rem,3.2vw,2.5rem)] font-medium leading-snug tracking-tight"
          />
        )}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {items.map((stat, i) => (
            <div
              key={stat.id ?? i}
              className="rounded-lg bg-stone px-6 py-10 text-center"
              data-reveal="up"
              style={{ '--reveal-delay': `${(i % 3) * 0.1}s` } as React.CSSProperties}
            >
              <DigitRoll
                value={stat.value}
                className="text-4xl font-semibold tracking-tight text-accent sm:text-5xl"
              />
              <p className="mt-3 text-base text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
