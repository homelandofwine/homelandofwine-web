'use client'

import { useEffect, useRef, useState } from 'react'

const REEL = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

export function DigitRoll({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          setOn(true)
        }
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const chars = value.split('')
  let seen = 0
  const digitOrdinals = chars.map((ch) => (/\d/.test(ch) ? seen++ : -1))

  return (
    <span ref={ref} className={className} aria-label={value}>
      {chars.map((ch, i) => {
        if (digitOrdinals[i] === -1) {
          return (
            <span key={i} aria-hidden="true">
              {ch}
            </span>
          )
        }
        const delay = digitOrdinals[i] * 90
        return (
          <span
            key={i}
            aria-hidden="true"
            className="inline-block overflow-hidden align-bottom"
            style={{ height: '1.1em' }}
          >
            <span
              className="flex flex-col motion-reduce:!transform-none"
              style={{
                transform: on ? 'translateY(0)' : 'translateY(-90.9091%)',
                transition: `transform 1.5s cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms`,
              }}
            >
              <span style={{ height: '1.1em', lineHeight: '1.1em' }}>{ch}</span>
              {REEL.map((d) => (
                <span key={d} style={{ height: '1.1em', lineHeight: '1.1em' }}>
                  {d}
                </span>
              ))}
            </span>
          </span>
        )
      })}
    </span>
  )
}
