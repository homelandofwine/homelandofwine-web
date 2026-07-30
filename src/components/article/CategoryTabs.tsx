import { Link } from '@/i18n/navigation'
import type { Category } from '@/payload-types'
import { categoryPath } from '@/lib/seo'

function tabClass(active: boolean) {
  return `caps -mb-px shrink-0 whitespace-nowrap border-b-2 py-4 text-[13px] font-semibold tracking-[0.14em] transition-colors ${
    active ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-ink'
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
  return (
    <nav className="border-b border-line" aria-label={allLabel}>
      <div className="scrollbar-none mx-auto flex max-w-[1400px] items-center gap-7 overflow-x-auto px-4 sm:gap-9 sm:px-6">
        <Link href="/blog" className={tabClass(active === 'all')}>
          {allLabel}
        </Link>
        {categories.map(
          (c) =>
            c.slug && (
              <Link key={c.id} href={categoryPath(c.slug)} className={tabClass(active === c.slug)}>
                {c.name}
              </Link>
            ),
        )}
      </div>
    </nav>
  )
}
