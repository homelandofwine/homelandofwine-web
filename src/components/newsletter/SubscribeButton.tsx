'use client'

import { openNewsletterModal } from './NewsletterModal'

export function SubscribeButton({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <button type="button" className={className} onClick={openNewsletterModal}>
      {children}
    </button>
  )
}
