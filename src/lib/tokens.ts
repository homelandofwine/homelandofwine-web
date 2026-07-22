import { createHmac, timingSafeEqual } from 'crypto'

function secret(): string {
  const s = process.env.NEWSLETTER_SECRET
  if (!s) throw new Error('NEWSLETTER_SECRET is not set')
  return s
}

export function unsubscribeToken(email: string): string {
  return createHmac('sha256', secret()).update(email.toLowerCase().trim()).digest('hex')
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = Buffer.from(unsubscribeToken(email), 'hex')
  let given: Buffer
  try {
    given = Buffer.from(token, 'hex')
  } catch {
    return false
  }
  return expected.length === given.length && timingSafeEqual(expected, given)
}

export function unsubscribeUrl(siteUrl: string, email: string, locale: string): string {
  const e = Buffer.from(email.toLowerCase().trim()).toString('base64url')
  return `${siteUrl}/api/newsletter/unsubscribe?e=${e}&t=${unsubscribeToken(email)}&l=${locale}`
}
