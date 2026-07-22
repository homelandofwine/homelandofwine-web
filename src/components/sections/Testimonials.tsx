'use client'

import { useState } from 'react'

type Quote = { id?: string | null; quote: string; author: string; role?: string | null }

function Arrow({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`h-4 w-4 stroke-current ${direction === 'left' ? 'rotate-180' : ''}`}
      strokeWidth="1.5"
    >
      <path d="M2 8h11M9 3l5 5-5 5" strokeLinecap="square" />
    </svg>
  )
}

export function Testimonials({ heading, quotes }: { heading?: string | null; quotes: Quote[] }) {
  const [index, setIndex] = useState(0)
  if (quotes.length === 0) return null
  const active = quotes[index]

  return (
    <section className="bg-shell text-shell-fg">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:py-28" data-reveal="fade">
        {heading && (
          <p className="text-sm font-semibold uppercase tracking-widest text-shell-dim">
            {heading}
          </p>
        )}
        <blockquote className="mt-10 min-h-40">
          <p className="max-w-4xl text-2xl leading-snug tracking-tight sm:text-3xl lg:text-4xl">
            “{active.quote}”
          </p>
        </blockquote>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-base font-semibold">{active.author}</p>
            {active.role && <p className="mt-1 text-sm text-shell-dim">{active.role}</p>}
          </div>
          {quotes.length > 1 && (
            <div className="flex items-center gap-3">
              <span className="mr-2 text-sm text-shell-dim">
                {index + 1} / {quotes.length}
              </span>
              <button
                type="button"
                aria-label="Previous quote"
                onClick={() => setIndex((index - 1 + quotes.length) % quotes.length)}
                className="grid h-11 w-11 place-items-center rounded-full border border-shell-line text-shell-fg transition-colors hover:border-shell-fg"
              >
                <Arrow direction="left" />
              </button>
              <button
                type="button"
                aria-label="Next quote"
                onClick={() => setIndex((index + 1) % quotes.length)}
                className="grid h-11 w-11 place-items-center rounded-full border border-shell-line text-shell-fg transition-colors hover:border-shell-fg"
              >
                <Arrow direction="right" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
