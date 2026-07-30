import { Link } from '@/i18n/navigation'
import { HScroll } from '@/components/ui/HScroll'
import type { Category } from '@/payload-types'
import { categoryPath } from '@/lib/seo'

function tabClass(active: boolean) {
  return `caps relative shrink-0 whitespace-nowrap py-4 text-[13px] font-semibold tracking-[0.14em] transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-center after:bg-accent after:transition-transform after:duration-300 ${
    active
      ? 'text-accent after:scale-x-100'
      : 'text-muted after:scale-x-0 hover:text-accent hover:after:scale-x-100'
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
      <div className="mx-auto max-w-[1400px]">
        <HScroll>
          <div className="flex items-center gap-7 px-4 sm:gap-9 sm:px-6">
            <Link href="/blog" className={tabClass(active === 'all')}>
              {allLabel}
            </Link>
            {categories.map(
              (c) =>
                c.slug && (
                  <Link
                    key={c.id}
                    href={categoryPath(c.slug)}
                    className={tabClass(active === c.slug)}
                  >
                    {c.name}
                  </Link>
                ),
            )}
          </div>
        </HScroll>
      </div>
    </nav>
  )
}
