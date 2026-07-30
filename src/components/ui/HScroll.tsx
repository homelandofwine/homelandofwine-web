'use client'

import { useEffect, useRef, useState } from 'react'

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

  return (
    <div className={`relative ${className}`}>
      <div ref={ref} className="scrollbar-none overflow-x-auto">
        {children}
      </div>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-paper to-transparent transition-opacity duration-300 ${
          edges.left ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-paper to-transparent transition-opacity duration-300 ${
          edges.right ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
