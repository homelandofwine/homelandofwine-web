'use client'

import { useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}

function getSnapshot() {
  return document.documentElement.classList.contains('dark')
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, () => false)

  const toggle = () => {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {}
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
        dark ? 'bg-shell-soft' : 'bg-shell-fg/25'
      }`}
    >
      <span
        className={`absolute grid h-5 w-5 place-items-center rounded-full bg-shell-fg shadow transition-transform duration-200 ${
          dark ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      >
        {dark ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="#141110" strokeWidth="2" className="h-3 w-3">
            <path d="M20.4 14.2A8.4 8.4 0 0 1 9.8 3.6a8.4 8.4 0 1 0 10.6 10.6Z" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="#141110" strokeWidth="2" className="h-3 w-3">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" strokeLinecap="round" />
          </svg>
        )}
      </span>
    </button>
  )
}
