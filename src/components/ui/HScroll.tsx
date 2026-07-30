'use client'

import { useEffect, useRef, useState } from 'react'

function Chevron({ flip }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className={`h-4 w-4 ${flip ? 'rotate-180' : ''}`}
    >
      <path d="m9 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function HScroll({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ left: false, right: false })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () =>
      setEdges({
        left: el.scrollLeft > 8,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 8,
      })
    const raf = requestAnimationFrame(update)
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const nudge = (direction: 1 | -1) => {
    const el = ref.current
    el?.scrollBy({ left: direction * el.clientWidth * 0.6, behavior: 'smooth' })
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={ref} className="scrollbar-none overflow-x-auto">
        {children}
      </div>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-paper to-transparent transition-opacity duration-300 ${
          edges.left ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-paper to-transparent transition-opacity duration-300 ${
          edges.right ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <button
        type="button"
        aria-label="Scroll back"
        onClick={() => nudge(-1)}
        className={`absolute left-1 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-line bg-paper text-ink shadow-sm transition-all duration-300 hover:text-accent ${
          edges.left ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <Chevron flip />
      </button>
      <button
        type="button"
        aria-label="Scroll forward"
        onClick={() => nudge(1)}
        className={`absolute right-1 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-line bg-paper text-ink shadow-sm transition-all duration-300 hover:text-accent ${
          edges.right ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <Chevron />
      </button>
    </div>
  )
}
