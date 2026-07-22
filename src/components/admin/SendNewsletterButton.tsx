'use client'

import { useDocumentInfo, useFormFields } from '@payloadcms/ui'
import { useState } from 'react'

export function SendNewsletterButton() {
  const { id } = useDocumentInfo()
  const sentAt = useFormFields(([fields]) => fields?.newsletterSentAt?.value as string | undefined)
  const status = useFormFields(([fields]) => fields?._status?.value as string | undefined)
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  if (!id) return null

  const send = async (force: boolean) => {
    if (
      !window.confirm(
        force
          ? 'This article was already emailed once. Send it AGAIN to every subscriber?'
          : 'Send this article to all newsletter subscribers now?',
      )
    ) {
      return
    }
    setState('sending')
    try {
      const res = await fetch('/api/newsletter/send-article', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: id, force }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Send failed')
      setState('done')
      setMessage(`Sent to ${data.sent} subscriber(s). Refresh to update the status field.`)
    } catch (err) {
      setState('error')
      setMessage(err instanceof Error ? err.message : 'Send failed')
    }
  }

  const alreadySent = Boolean(sentAt)
  const published = status === 'published'

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <button
        type="button"
        onClick={() => send(alreadySent)}
        disabled={state === 'sending' || !published}
        style={{
          width: '100%',
          padding: '0.7rem 1rem',
          background: alreadySent ? 'transparent' : '#993334',
          color: alreadySent ? '#993334' : '#fff',
          border: '1px solid #993334',
          borderRadius: 4,
          cursor: published ? 'pointer' : 'not-allowed',
          fontWeight: 600,
          opacity: state === 'sending' ? 0.6 : 1,
        }}
      >
        {state === 'sending'
          ? 'Sending…'
          : alreadySent
            ? 'Send newsletter again'
            : 'Send newsletter to subscribers'}
      </button>
      <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#888' }}>
        {!published
          ? 'Publish the article first.'
          : alreadySent
            ? `Already sent ${new Date(sentAt!).toLocaleString()}.`
            : 'Emails are only sent when you press this button.'}
      </p>
      {message && (
        <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: state === 'error' ? '#b00' : '#2a7' }}>
          {message}
        </p>
      )}
    </div>
  )
}
