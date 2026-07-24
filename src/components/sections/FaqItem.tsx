'use client'

import { useRef, useState } from 'react'

const EASE = 'cubic-bezier(0.22, 0.61, 0.36, 1)'

export function FaqItem({ question, answer }: { question: string; answer: string }) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<Animation | null>(null)
  const [open, setOpen] = useState(false)

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault()
    const details = detailsRef.current
    const body = bodyRef.current
    if (!details || !body) return

    const next = !open
    setOpen(next)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      details.open = next
      return
    }

    animRef.current?.cancel()
    if (next) {
      details.open = true
      animRef.current = body.animate(
        [
          { height: '0px', opacity: 0 },
          { height: `${body.scrollHeight}px`, opacity: 1 },
        ],
        { duration: 450, easing: EASE },
      )
    } else {
      const anim = body.animate(
        [
          { height: `${body.offsetHeight}px`, opacity: 1 },
          { height: '0px', opacity: 0 },
        ],
        { duration: 400, easing: EASE },
      )
      anim.onfinish = () => {
        details.open = false
      }
      animRef.current = anim
    }
  }

  return (
    <details
      ref={detailsRef}
      onClick={toggle}
      className="cursor-pointer select-none border-b border-line py-6"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-xl tracking-tight text-ink sm:text-2xl [&::-webkit-details-marker]:hidden">
        {question}
        <span
          aria-hidden="true"
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-accent/40 text-accent transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </span>
      </summary>
      <div ref={bodyRef} className="overflow-hidden">
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{answer}</p>
      </div>
    </details>
  )
}
