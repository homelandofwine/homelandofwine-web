'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { NewsletterForm } from './NewsletterForm'

const OPEN_EVENT = 'newsletter:open'
const STORAGE_KEY = 'newsletter-promo-shown'

export function openNewsletterModal() {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

export function NewsletterModal() {
  const t = useTranslations('newsletter')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener(OPEN_EVENT, show)
    let timer: number | undefined
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        timer = window.setTimeout(() => {
          try {
            localStorage.setItem(STORAGE_KEY, String(Date.now()))
          } catch {}
          setOpen(true)
        }, 10_000)
      }
    } catch {}
    return () => {
      window.removeEventListener(OPEN_EVENT, show)
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t('title')}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={() => setOpen(false)}
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md rounded-lg bg-shell p-8 text-shell-fg shadow-2xl sm:p-10">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full text-shell-dim transition-colors hover:text-shell-fg"
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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-soft">
          {t('title')}
        </p>
        <h2 className="mt-4 text-3xl leading-tight sm:text-4xl">
          {t('titleLine1')} {t('titleLine2')}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-shell-dim">{t('description')}</p>
        <div className="mt-6">
          <NewsletterForm compact />
        </div>
      </div>
    </div>
  )
}
