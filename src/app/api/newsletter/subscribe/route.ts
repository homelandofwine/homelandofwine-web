import { render } from '@react-email/components'
import { getPayload } from 'payload'
import React from 'react'
import { z } from 'zod'

import { WelcomeEmail } from '../../../../../emails/welcome'
import { EMAIL_FROM, mailer } from '@/lib/email'
import { SITE_URL } from '@/lib/seo'
import { unsubscribeUrl } from '@/lib/tokens'
import config from '@/payload.config'

const schema = z.object({
  email: z.string().email().max(254),
  locale: z.enum(['ka', 'en']).default('en'),
  company: z.string().optional().default(''),
  elapsed: z.number().optional(),
})

const ok = () => Response.json({ ok: true })

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) return Response.json({ ok: false }, { status: 400 })

  const { email: rawEmail, locale, company, elapsed } = parsed.data

  if (company !== '' || (typeof elapsed === 'number' && elapsed < 1500)) return ok()

  const email = rawEmail.toLowerCase().trim()
  const payload = await getPayload({ config })

  const { docs: existing } = await payload.find({
    collection: 'subscribers',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })

  if (existing[0]) {
    if (existing[0].status !== 'active') {
      await payload.update({
        collection: 'subscribers',
        id: existing[0].id,
        data: { status: 'active', subscribedAt: new Date().toISOString(), unsubscribedAt: null },
        overrideAccess: true,
      })
    }
    return ok()
  }

  await payload.create({
    collection: 'subscribers',
    data: {
      email,
      locale,
      status: 'active',
      subscribedAt: new Date().toISOString(),
    },
    overrideAccess: true,
  })

  try {
    const settings = await payload.findGlobal({ slug: 'site-settings', locale: 'en' })
    await mailer.send({
      from: EMAIL_FROM,
      to: [email],
      subject: `Welcome to ${settings.siteName}`,
      html: await render(
        React.createElement(WelcomeEmail, {
          siteName: settings.siteName,
          siteUrl: SITE_URL,
          unsubscribeUrl: unsubscribeUrl(SITE_URL, email, locale),
        }),
      ),
    })
  } catch (err) {
    payload.logger.error(`Welcome email failed for ${email}: ${err}`)
  }

  return ok()
}
