'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

import { Link, usePathname } from '@/i18n/navigation'

import { SubscribeButton } from '@/components/newsletter/SubscribeButton'

import { LocaleSwitcher } from './LocaleSwitcher'
import { ThemeToggle } from './ThemeToggle'

const CATEGORY_MENU = [
  ['main-feature', 'MAIN FEATURE'],
  ['grape-varieties', 'GRAPE VARIETIES'],
  ['wine-regions', 'WINE REGIONS'],
  ['producers', 'PRODUCERS'],
  ['georgian-wine-in-foreign-market', 'GEORGIAN WINE IN FOREIGN MARKET'],
  ['food-and-wine', 'FOOD AND WINE'],
  ['food-and-travel', 'FOOD AND TRAVEL'],
] as const

const NAV = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/blog', key: 'magazine', dropdown: true },
  { href: '/n-line-print', key: 'nlineprint' },
  { href: '/ambassador', key: 'ambassador' },
  { href: '/contact', key: 'contact' },
] as const

function Chevron({ open }: { open?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Header() {
  const t = useTranslations()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [mobileCats, setMobileCats] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const goingDown = y > lastY.current
      if (y < 120) setHidden(false)
      else if (goingDown && y - lastY.current > 4) setHidden(true)
      else if (!goingDown && lastY.current - y > 4) setHidden(false)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-300 ${
        hidden && !open ? '-translate-y-[130%]' : 'translate-y-0'
      }`}
    >
      <div className="mx-auto flex max-w-[1760px] items-stretch justify-between gap-2 px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="flex items-center rounded-lg bg-accent px-2.5 py-2.5 shadow-lg">
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center px-2 py-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-cream.png"
              alt="Homeland of Wine Magazine"
              className="h-9 w-auto 2xl:h-[3.25rem]"
            />
          </Link>

          <nav className="hidden items-center lg:flex" aria-label="Main">
            {NAV.map((item) =>
              'dropdown' in item && item.dropdown ? (
                <div key={item.key} className="group relative">
                  <Link
                    href={item.href}
                    className={`caps inline-flex items-center gap-1 whitespace-nowrap px-2 py-2 text-sm font-medium transition-colors hover:text-shell-fg 2xl:px-4 2xl:text-base ${
                      isActive(item.href) ? 'text-shell-fg' : 'text-shell-fg/80'
                    }`}
                  >
                    {t(`nav.${item.key}`)}
                    <Chevron />
                  </Link>
                  <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <div className="min-w-64 rounded-lg bg-shell p-2 shadow-2xl">
                      {CATEGORY_MENU.map(([slug, label]) => (
                        <Link
                          key={slug}
                          href={`/blog/category/${slug}`}
                          className="caps block rounded px-4 py-2.5 text-sm text-shell-fg/80 transition-colors hover:bg-accent hover:text-shell-fg"
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`caps whitespace-nowrap px-2 py-2 text-sm font-medium transition-colors hover:text-shell-fg 2xl:px-4 2xl:text-base ${
                    isActive(item.href) ? 'text-shell-fg' : 'text-shell-fg/80'
                  }`}
                >
                  {t(`nav.${item.key}`)}
                </Link>
              ),
            )}
            <span className="ml-1 flex items-center gap-1 border-l border-shell-fg/25 pl-2 pr-1">
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
              className={`h-px w-5 bg-shell-fg transition-transform ${open ? 'translate-y-[3px] rotate-45' : ''}`}
            />
            <span
              className={`h-px w-5 bg-shell-fg transition-transform ${open ? '-translate-y-[3px] -rotate-45' : ''}`}
            />
          </button>
        </div>

        <SubscribeButton className="caps hidden items-center rounded-lg bg-accent px-5 text-sm font-semibold text-shell-fg shadow-lg transition-colors hover:bg-accent-soft sm:flex 2xl:px-7 2xl:text-base">
          {t('newsletter.subscribe')}
        </SubscribeButton>
      </div>

      {open && (
        <div className="mx-4 mt-2 rounded-lg bg-shell p-6 shadow-lg lg:hidden">
          <nav className="flex flex-col gap-4" aria-label="Mobile">
            {NAV.map((item) =>
              'dropdown' in item && item.dropdown ? (
                <div key={item.key}>
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="caps text-xl font-medium text-shell-fg"
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                    <button
                      type="button"
                      aria-label="Categories"
                      aria-expanded={mobileCats}
                      onClick={() => setMobileCats((v) => !v)}
                      className="grid h-9 w-9 place-items-center rounded-full border border-shell-line text-shell-fg"
                    >
                      <Chevron open={mobileCats} />
                    </button>
                  </div>
                  {mobileCats && (
                    <div className="mt-3 flex flex-col gap-2 border-l border-shell-line pl-4">
                      {CATEGORY_MENU.map(([slug, label]) => (
                        <Link
                          key={slug}
                          href={`/blog/category/${slug}`}
                          onClick={() => setOpen(false)}
                          className="caps py-1 text-sm text-shell-dim transition-colors hover:text-shell-fg"
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="caps text-xl font-medium text-shell-fg"
                >
                  {t(`nav.${item.key}`)}
                </Link>
              ),
            )}
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
