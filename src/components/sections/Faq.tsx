import { SectionLabel } from '@/components/ui/SectionLabel'

type FaqItem = { id?: string | null; question: string; answer: string }

export function Faq({ heading, items }: { heading: string; items: FaqItem[] }) {
  if (items.length === 0) return null

  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div data-reveal="up">
            <SectionLabel>{heading}</SectionLabel>
          </div>
          <div data-reveal="up" style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}>
            {items.map((item, i) => (
              <details key={item.id ?? i} className="group border-b border-line py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-xl tracking-tight text-ink sm:text-2xl [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    aria-hidden="true"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-accent/40 text-accent transition-transform duration-300 group-open:rotate-45"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
