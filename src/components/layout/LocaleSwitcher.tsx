'use client'

import { useLocale } from 'next-intl'

import { routing, type Locale } from '@/i18n/routing'
import { usePathname, useRouter } from '@/i18n/navigation'

import { useAlternates } from './AlternateLinks'

export function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const alternates = useAlternates()

  const switchTo = (target: Locale) => {
    if (target === locale) return
    const alternate = alternates[target]
    if (alternate) {
      window.location.assign(alternate)
    } else {
      router.replace(pathname, { locale: target })
    }
  }

  return (
    <div className="flex items-baseline gap-1.5 text-sm font-semibold uppercase tracking-wider">
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-baseline gap-1.5">
          {i > 0 && <span className="select-none text-shell-fg/30">/</span>}
          <button
            type="button"
            onClick={() => switchTo(l)}
            aria-current={l === locale ? 'true' : undefined}
            style={
              l === 'ka'
                ? {
                    // Mtavruli caps run ~19% taller than EB Garamond at the same
                    // size; scale down so both labels share a cap height.
                    fontFamily: 'var(--font-ka-caps)',
                    fontSize: '0.735rem',
                    textTransform: 'none',
                  }
                : undefined
            }
            className={
              l === locale
                ? 'cursor-default text-shell-fg'
                : 'cursor-pointer text-shell-fg/50 transition-colors hover:text-accent-soft'
            }
          >
            {l === 'ka' ? 'ქარ' : 'ENG'}
          </button>
        </span>
      ))}
    </div>
  )
}
