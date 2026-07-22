import { SectionLabel } from '@/components/ui/SectionLabel'

type Stat = { id?: string | null; value: string; label: string }

export function StatsTiles({ heading, items }: { heading?: string | null; items: Stat[] }) {
  if (items.length === 0) return null

  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:py-28">
        {heading && (
          <div className="text-center" data-reveal="up">
            <SectionLabel>{heading}</SectionLabel>
          </div>
        )}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {items.map((stat, i) => (
            <div
              key={stat.id ?? i}
              className="rounded-lg bg-stone px-6 py-10 text-center"
              data-reveal="up"
              style={{ '--reveal-delay': `${(i % 3) * 0.1}s` } as React.CSSProperties}
            >
              <p className="text-4xl font-semibold tracking-tight text-accent sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-3 text-base text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
