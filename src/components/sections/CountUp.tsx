'use client'

import { useEffect, useRef, useState } from 'react'

export function CountUp({ value, className }: { value: string; className?: string }) {
  const match = value.match(/^([^\d]*)([\d\s,._]*\d)(.*)$/)
  const prefix = match?.[1] ?? ''
  const numeric = match ? Number(match[2].replace(/[\s,._]/g, '')) : NaN
  const suffix = match?.[3] ?? ''

  const ref = useRef<HTMLParagraphElement>(null)
  const [display, setDisplay] = useState(Number.isFinite(numeric) ? 0 : null)

  useEffect(() => {
    if (!Number.isFinite(numeric)) return
    const el = ref.current
    if (!el) return

    let raf = 0
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setDisplay(numeric)
          return
        }
        const start = performance.now()
        const duration = 1400
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - p, 3)
          setDisplay(Math.round(numeric * eased))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [numeric])

  return (
    <p ref={ref} className={className}>
      {display === null ? value : `${prefix}${display}${suffix}`}
    </p>
  )
}
