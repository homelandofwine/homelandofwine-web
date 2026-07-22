import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { verifyUnsubscribeToken } from '@/lib/tokens'

async function unsubscribe(req: Request): Promise<{ locale: string } | null> {
  const url = new URL(req.url)
  const e = url.searchParams.get('e')
  const t = url.searchParams.get('t')
  const locale = url.searchParams.get('l') === 'en' ? 'en' : 'ka'
  if (!e || !t) return null

  let email: string
  try {
    email = Buffer.from(e, 'base64url').toString('utf8')
  } catch {
    return null
  }
  if (!verifyUnsubscribeToken(email, t)) return null

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'subscribers',
    where: { email: { equals: email.toLowerCase().trim() } },
    limit: 1,
    overrideAccess: true,
  })

  if (docs[0] && docs[0].status === 'active') {
    await payload.update({
      collection: 'subscribers',
      id: docs[0].id,
      data: { status: 'unsubscribed', unsubscribedAt: new Date().toISOString() },
      overrideAccess: true,
    })
  }

  return { locale }
}

export async function GET(req: Request) {
  const result = await unsubscribe(req)
  if (!result) return new Response('Invalid unsubscribe link.', { status: 400 })
  redirect(result.locale === 'ka' ? '/ka/unsubscribed' : '/unsubscribed')
}

export async function POST(req: Request) {
  const result = await unsubscribe(req)
  if (!result) return new Response('Invalid unsubscribe link.', { status: 400 })
  return new Response('Unsubscribed.', { status: 200 })
}
