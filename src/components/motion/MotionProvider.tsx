'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function MotionProvider() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('motion-ready')

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-revealed)')

    if (reduceMotion) {
      targets.forEach((el) => el.classList.add('is-revealed'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0 },
    )
    targets.forEach((el) => io.observe(el))

    const slideSections = Array.from(document.querySelectorAll<HTMLElement>('[data-slides]'))
    const parallaxItems = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))
    let raf = 0
    const applyParallax = () => {
      for (const el of parallaxItems) {
        const rect = el.getBoundingClientRect()
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue
        const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2
        el.style.transform = `translateY(${(-centerOffset * 0.08).toFixed(1)}px) scale(1.08)`
      }
    }
    const applySlides = () => {
      raf = 0
      applyParallax()
      for (const section of slideSections) {
        const slides = section.querySelectorAll<HTMLElement>('[data-slide]')
        if (slides.length === 0) continue
        const rect = section.getBoundingClientRect()
        const scrollable = rect.height - window.innerHeight
        const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0
        const active = Math.min(slides.length - 1, Math.floor(progress * slides.length))
        slides.forEach((slide, i) => slide.classList.toggle('is-active', i === active))
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(applySlides)
    }
    if (slideSections.length > 0 || parallaxItems.length > 0) {
      window.addEventListener('scroll', onScroll, { passive: true })
      applySlides()
    }

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [pathname])

  return null
}
