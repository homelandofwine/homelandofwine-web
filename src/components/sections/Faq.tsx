import { FaqItem } from '@/components/sections/FaqItem'
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
              <FaqItem key={item.id ?? i} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
