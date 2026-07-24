'use client'

import { useEffect, useRef, useState } from 'react'

export function WordReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [lit, setLit] = useState(0)
  const words = text.split(/\s+/).filter(Boolean)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const total = text.split(/\s+/).filter(Boolean).length
    let raf = 0
    const update = () => {
      raf = 0
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setLit(total)
        return
      }
      const r = el.getBoundingClientRect()
      const start = window.innerHeight * 0.85
      const end = window.innerHeight * 0.35
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end)))
      setLit(Math.round(p * total))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [text])

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="transition-colors duration-300"
          style={{ color: i < lit ? 'var(--color-ink)' : 'var(--color-muted)' }}
        >
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}
