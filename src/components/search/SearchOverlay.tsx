'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

import { Link, useRouter } from '@/i18n/navigation'

type Suggestion = { id: number | string; title: string; slug: string }

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const [q, setQ] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = previousOverflow
    }
  }, [open, onClose])

  useEffect(() => {
    const query = q.trim()
    if (query.length < 2) return
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&locale=${locale}`, {
          signal: controller.signal,
        })
        if (res.ok) setSuggestions(await res.json())
      } catch {}
    }, 250)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [q, locale])

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const query = q.trim()
    if (!query) return
    onClose()
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('search.title')}
      inert={!open}
      className={`fixed inset-0 z-[70] ${
        open ? 'visible' : 'invisible [transition:visibility_0s_linear_400ms]'
      }`}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className={`absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm transition-opacity duration-[400ms] ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        onTransitionEnd={() => {
          if (!open) {
            setQ('')
            setSuggestions(null)
          }
        }}
        className={`absolute inset-x-0 top-0 bg-paper shadow-2xl transition-transform duration-[400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
          open ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          <form onSubmit={submit} role="search">
            <div className="flex items-center gap-4 border-b-2 border-line pb-4 transition-colors focus-within:border-accent">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
                className="h-6 w-6 shrink-0 text-muted"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                name="q"
                autoComplete="off"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                  if (e.target.value.trim().length < 2) setSuggestions(null)
                }}
                placeholder={t('search.placeholder')}
                aria-label={t('search.title')}
                className="w-full bg-transparent text-2xl tracking-tight text-ink placeholder:text-muted focus:outline-none sm:text-3xl"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted transition-colors hover:text-ink"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </form>

          {suggestions && q.trim().length >= 2 && (
            <div className="hidden pt-4 sm:block">
              {suggestions.length === 0 ? (
                <p className="py-3 text-base text-muted">{t('search.noResults')}</p>
              ) : (
                <>
                  <ul>
                    {suggestions.map((s) => (
                      <li key={s.id}>
                        <Link
                          href={`/blog/${s.slug}`}
                          onClick={onClose}
                          className="block rounded px-3 py-3 text-lg tracking-tight text-ink transition-colors hover:bg-accent hover:text-shell-fg"
                        >
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => submit()}
                    className="caps mt-3 px-3 text-sm font-semibold text-accent transition-colors hover:text-accent-soft"
                  >
                    {t('search.viewAll')}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
