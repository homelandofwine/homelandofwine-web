'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Link, usePathname } from '@/i18n/navigation'

import { SubscribeButton } from '@/components/newsletter/SubscribeButton'

import { LocaleSwitcher } from './LocaleSwitcher'
import { ThemeToggle } from './ThemeToggle'

const NAV = [
  { href: '/', key: 'home' },
  { href: '/blog', key: 'blog' },
  { href: '/ambassador', key: 'ambassador' },
  { href: '/n-line-print', key: 'nlineprint' },
  { href: '/about', key: 'about' },
  { href: '/contact', key: 'contact' },
] as const

export function Header() {
  const t = useTranslations()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1400px] items-start justify-between gap-4 px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="flex items-center rounded-lg bg-shell px-2.5 py-2.5 shadow-lg">
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center px-3 py-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-red.png"
              alt="Homeland of Wine Magazine"
              className="h-11 w-auto xl:h-[3.25rem]"
            />
          </Link>

          <nav className="hidden items-center lg:flex" aria-label="Main">
            {NAV.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`px-4 py-2 text-base transition-colors hover:text-shell-fg xl:px-5 xl:text-lg ${
                  isActive(item.href) ? 'text-shell-fg' : 'text-shell-fg/70'
                }`}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
            <span className="ml-2 flex items-center gap-1.5 border-l border-shell-line pl-4 pr-2">
              <LocaleSwitcher />
              <ThemeToggle />
            </span>
          </nav>

          <button
            type="button"
            className="ml-1 flex h-11 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-expanded={open}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`h-px w-5 bg-page transition-transform ${open ? 'translate-y-[3px] rotate-45' : ''}`}
            />
            <span
              className={`h-px w-5 bg-page transition-transform ${open ? '-translate-y-[3px] -rotate-45' : ''}`}
            />
          </button>
        </div>

        <SubscribeButton className="hidden rounded-md bg-accent px-6 py-3.5 text-base font-semibold text-shell-fg transition-colors hover:bg-accent-soft sm:block xl:px-7 xl:py-4 xl:text-lg">
          {t('newsletter.subscribe')}
        </SubscribeButton>
      </div>

      {open && (
        <div className="mx-4 mt-2 rounded-lg bg-shell p-6 shadow-lg lg:hidden">
          <nav className="flex flex-col gap-4" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-2xl font-medium text-shell-fg"
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
