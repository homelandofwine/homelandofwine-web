import { Link } from '@/i18n/navigation'
import { HScroll } from '@/components/ui/HScroll'
import type { Category } from '@/payload-types'
import { categoryPath } from '@/lib/seo'

const TAB_ORDER = [
  'main-feature',
  'wine-regions',
  'grape-varieties',
  'producers',
  'wines',
  'food-and-wine',
  'food-and-travel',
  'georgian-wine-in-foreign-market',
]

function tabClass(active: boolean) {
  return `caps shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold tracking-[0.1em] transition-colors ${
    active ? 'bg-accent text-shell-fg' : 'bg-shell text-shell-fg hover:bg-accent'
  }`
}

export function CategoryTabs({
  categories,
  active,
  allLabel,
}: {
  categories: Category[]
  active: 'all' | string
  allLabel: string
}) {
  const ordered = TAB_ORDER.map((slug) => categories.find((c) => c.slug === slug)).filter(
    (c): c is Category => Boolean(c),
  )
  return (
    <nav className="border-b border-line" aria-label={allLabel}>
      <div className="mx-auto max-w-[1400px]">
        <HScroll>
          <div className="flex items-center gap-2.5 px-4 py-4 sm:gap-3 sm:px-6">
            <Link href="/blog" className={tabClass(active === 'all')}>
              {allLabel}
            </Link>
            {ordered.map((c) => (
              <Link
                key={c.id}
                href={categoryPath(c.slug as string)}
                className={tabClass(active === c.slug)}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </HScroll>
      </div>
    </nav>
  )
}
