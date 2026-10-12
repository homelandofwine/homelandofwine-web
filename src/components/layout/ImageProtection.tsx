'use client'

import { useEffect } from 'react'

export function ImageProtection() {
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest('img, picture, video')) {
        e.preventDefault()
      }
    }
    const onDragStart = (e: DragEvent) => {
      if (e.target instanceof Element && e.target.closest('img, picture')) {
        e.preventDefault()
      }
    }
    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('dragstart', onDragStart)
    return () => {
      document.removeEventListener('contextmenu', onContextMenu)
      document.removeEventListener('dragstart', onDragStart)
    }
  }, [])
  return null
}
