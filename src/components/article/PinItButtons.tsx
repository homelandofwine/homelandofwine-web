'use client'

import { useEffect } from 'react'

const ICON =
  '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.6 19.3 9 9 0 0 1 0-2.7l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.9 1.5 1.9 1.9 0 3.3-2 3.3-4.8 0-2.5-1.8-4.3-4.4-4.3a4.5 4.5 0 0 0-4.7 4.5c0 .9.3 1.9.8 2.4a.3.3 0 0 1 .1.3l-.3 1.1c0 .2-.1.2-.3.1-1.2-.6-2-2.4-2-3.9 0-3.2 2.3-6.1 6.7-6.1 3.5 0 6.2 2.5 6.2 5.8 0 3.5-2.2 6.3-5.2 6.3-1 0-2-.5-2.3-1.1l-.6 2.4c-.2.9-.8 2-1.2 2.6A10 10 0 1 0 12 2Z"/></svg>'

export function PinItButtons() {
  useEffect(() => {
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('.article-body img'))
    for (const img of imgs) {
      const target = img.closest('picture') ?? img
      const parent = target.parentElement
      if (!parent || parent.classList.contains('pin-wrap')) continue
      const wrap = document.createElement('span')
      wrap.className = 'pin-wrap'
      parent.insertBefore(wrap, target)
      wrap.appendChild(target)
      const a = document.createElement('a')
      a.className = 'pin-btn'
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
      a.setAttribute('aria-label', 'Save to Pinterest')
      a.href = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(img.currentSrc || img.src)}&description=${encodeURIComponent(document.title)}`
      a.innerHTML = ICON
      wrap.appendChild(a)
    }
  }, [])
  return null
}
