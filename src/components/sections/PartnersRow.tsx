'use client'

import { useEffect, useRef } from 'react'

function Arrow({ flip }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className={`h-5 w-5 ${flip ? 'rotate-180' : ''}`}
    >
      <path d="m9 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PartnersRow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const pauseUntil = useRef(0)
  const hovering = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let last = performance.now()
    let pos = el.scrollLeft
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100)
      last = now
      const half = el.scrollWidth / 2
      if (half > 0 && !hovering.current && now > pauseUntil.current) {
        if (Math.abs(el.scrollLeft - pos) > 1.5) pos = el.scrollLeft
        pos += dt * 0.04
        if (pos >= half) pos -= half
        el.scrollLeft = pos
      } else {
        pos = el.scrollLeft
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const over = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') hovering.current = true
    }
    const out = () => {
      hovering.current = false
    }
    const touchStart = () => {
      pauseUntil.current = Number.POSITIVE_INFINITY
    }
    const touchEnd = () => {
      pauseUntil.current = performance.now() + 2500
    }
    el.addEventListener('pointerenter', over)
    el.addEventListener('pointerleave', out)
    el.addEventListener('touchstart', touchStart, { passive: true })
    el.addEventListener('touchend', touchEnd, { passive: true })
    el.addEventListener('touchcancel', touchEnd, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerenter', over)
      el.removeEventListener('pointerleave', out)
      el.removeEventListener('touchstart', touchStart)
      el.removeEventListener('touchend', touchEnd)
      el.removeEventListener('touchcancel', touchEnd)
    }
  }, [])

  const nudge = (dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    pauseUntil.current = performance.now() + 1800
    const half = el.scrollWidth / 2
    const step = el.clientWidth * 0.7
    if (dir === -1 && el.scrollLeft - step < 0) el.scrollLeft += half
    if (dir === 1 && el.scrollLeft + step > el.scrollWidth - el.clientWidth) el.scrollLeft -= half
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div ref={ref} className="logo-rail scrollbar-none overflow-x-auto">
        {children}
      </div>
      <button
        type="button"
        aria-label="Previous logos"
        onClick={() => nudge(-1)}
        className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-paper text-ink shadow-sm transition-colors hover:text-accent sm:left-4"
      >
        <Arrow flip />
      </button>
      <button
        type="button"
        aria-label="Next logos"
        onClick={() => nudge(1)}
        className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-paper text-ink shadow-sm transition-colors hover:text-accent sm:right-4"
      >
        <Arrow />
      </button>
    </div>
  )
}
