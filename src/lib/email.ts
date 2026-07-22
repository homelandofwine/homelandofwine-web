import { Resend } from 'resend'

export const EMAIL_FROM = process.env.EMAIL_FROM ?? 'Homeland of Wine <onboarding@resend.dev>'
const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO || undefined

export type OutgoingEmail = {
  from: string
  to: string[]
  subject: string
  html: string
  replyTo?: string
  headers?: Record<string, string>
}

export const mailer = {
  enabled: Boolean(process.env.RESEND_API_KEY),

  async send(email: OutgoingEmail): Promise<void> {
    if (!process.env.RESEND_API_KEY) {
      console.info(`[email:dev] to=${email.to.join(',')} subject="${email.subject}"`)
      return
    }
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({ replyTo: EMAIL_REPLY_TO, ...email })
    if (error) throw new Error(`Resend send failed: ${error.message}`)
  },

  async batch(emails: OutgoingEmail[]): Promise<void> {
    if (!process.env.RESEND_API_KEY) {
      for (const e of emails) {
        console.info(`[email:dev:batch] to=${e.to.join(',')} subject="${e.subject}"`)
      }
      return
    }
    const resend = new Resend(process.env.RESEND_API_KEY)
    const withReplyTo = emails.map((e) => ({ replyTo: EMAIL_REPLY_TO, ...e }))
    for (let i = 0; i < withReplyTo.length; i += 100) {
      const chunk = withReplyTo.slice(i, i + 100)
      const { error } = await resend.batch.send(chunk)
      if (error) throw new Error(`Resend batch failed at offset ${i}: ${error.message}`)
      if (i + 100 < emails.length) await new Promise((r) => setTimeout(r, 600))
    }
  },
}
