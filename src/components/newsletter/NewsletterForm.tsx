'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error' | 'invalid'

export function NewsletterForm({
  compact = false,
  variant = 'dark',
}: {
  compact?: boolean
  variant?: 'dark' | 'card'
}) {
  const t = useTranslations('newsletter')
  const locale = useLocale()
  const [status, setStatus] = useState<Status>('idle')
  const renderedAt = useRef(0)
  useEffect(() => {
    renderedAt.current = Date.now()
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const email = String(data.get('email') ?? '').trim()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('invalid')
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          locale,
          company: String(data.get('company') ?? ''),
          elapsed: Date.now() - renderedAt.current,
        }),
      })
      if (!res.ok) throw new Error('subscribe failed')
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p
        role="status"
        className={`text-sm font-semibold ${variant === 'card' ? 'text-ink' : 'text-shell-fg'}`}
      >
        {t('success')}
      </p>
    )
  }

  const honeypot = (
    <input
      type="text"
      name="company"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute -left-[9999px] h-0 w-0 opacity-0"
    />
  )

  if (variant === 'card') {
    return (
      <form onSubmit={onSubmit} noValidate>
        <label
          htmlFor="newsletter-email-card"
          className="block text-sm font-semibold text-ink"
        >
          {t('emailPlaceholder')}
        </label>
        <input
          id="newsletter-email-card"
          type="email"
          name="email"
          required
          placeholder="mail@example.com"
          className="mt-2 w-full border-b border-line bg-transparent pb-3 text-base text-ink placeholder:text-muted focus:border-ink focus:outline-none"
        />
        {honeypot}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="mt-8 w-full rounded-md bg-accent px-6 py-4 text-sm font-semibold text-shell-fg transition-colors hover:bg-accent-soft disabled:opacity-60"
        >
          {status === 'loading' ? '…' : t('subscribe')}
        </button>
        {status === 'invalid' && (
          <p role="alert" className="mt-3 text-sm text-accent">
            {t('invalidEmail')}
          </p>
        )}
        {status === 'error' && (
          <p role="alert" className="mt-3 text-sm text-accent">
            {t('error')}
          </p>
        )}
      </form>
    )
  }

  return (
    <form onSubmit={onSubmit} className="w-full" noValidate>
      <div
        className={`flex w-full ${compact ? 'max-w-md' : 'max-w-xl'} rounded-lg bg-shell-fg/10 p-1.5 backdrop-blur focus-within:bg-shell-fg/15`}
      >
        <label className="sr-only" htmlFor={`newsletter-email-${compact}`}>
          {t('emailPlaceholder')}
        </label>
        <input
          id={`newsletter-email-${compact}`}
          type="email"
          name="email"
          required
          placeholder={t('emailPlaceholder')}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-shell-fg placeholder:text-shell-dim focus:outline-none"
        />
        {honeypot}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="shrink-0 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-shell-fg transition-colors hover:bg-accent-soft disabled:opacity-60"
        >
          {status === 'loading' ? '…' : t('subscribe')}
        </button>
      </div>
      {status === 'invalid' && (
        <p role="alert" className="mt-2 text-sm text-accent-soft">
          {t('invalidEmail')}
        </p>
      )}
      {status === 'error' && (
        <p role="alert" className="mt-2 text-sm text-accent-soft">
          {t('error')}
        </p>
      )}
    </form>
  )
}
