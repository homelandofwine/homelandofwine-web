'use client'

import { useTranslations } from 'next-intl'
import { useSyncExternalStore } from 'react'

import { Link } from '@/i18n/navigation'

const CHANGE_EVENT = 'cookie-consent-change'

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

function getSnapshot() {
  try {
    return localStorage.getItem('cookie-consent')
  } catch {
    return 'declined'
  }
}

export function CookieConsent() {
  const t = useTranslations('cookies')
  const consent = useSyncExternalStore(subscribe, getSnapshot, () => 'ssr')

  const choose = (value: 'accepted' | 'declined') => {
    try {
      localStorage.setItem('cookie-consent', value)
    } catch {}
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }

  if (consent !== null) return null

  return (
    <div className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-xl rounded-lg bg-shell p-5 text-shell-fg shadow-2xl sm:inset-x-auto sm:left-6 sm:max-w-md">
      <p className="text-sm leading-relaxed text-shell-dim">
        {t('message')}{' '}
        <Link href="/privacy" className="text-shell-fg underline underline-offset-2">
          {t('policy')}
        </Link>
      </p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => choose('accepted')}
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-shell-fg transition-colors hover:bg-accent-soft"
        >
          {t('accept')}
        </button>
        <button
          type="button"
          onClick={() => choose('declined')}
          className="rounded-md border border-shell-line px-5 py-2.5 text-sm font-semibold text-shell-dim transition-colors hover:text-shell-fg"
        >
          {t('decline')}
        </button>
      </div>
    </div>
  )
}
