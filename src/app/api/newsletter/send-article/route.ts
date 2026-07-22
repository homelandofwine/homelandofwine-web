import { getPayload } from 'payload'
import { z } from 'zod'

import config from '@/payload.config'
import { sendArticleNewsletter } from '@/lib/send-newsletter'

const schema = z.object({
  articleId: z.union([z.number(), z.string()]),
  force: z.boolean().optional().default(false),
})

export async function POST(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: new Headers(req.headers) })
  if (!user) {
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 403 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ ok: false, error: 'Invalid body' }, { status: 400 })
  }
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ ok: false, error: 'Invalid body' }, { status: 400 })
  }

  const { articleId, force } = parsed.data

  let article
  try {
    article = await payload.findByID({ collection: 'articles', id: articleId, depth: 0 })
  } catch {
    return Response.json({ ok: false, error: 'Article not found.' }, { status: 404 })
  }
  if (article._status !== 'published') {
    return Response.json({ ok: false, error: 'Article is not published.' }, { status: 400 })
  }
  if (article.newsletterSentAt && !force) {
    return Response.json(
      { ok: false, error: 'Already sent. Pass force to send again.', sentAt: article.newsletterSentAt },
      { status: 409 },
    )
  }

  try {
    const { sent } = await sendArticleNewsletter(payload, articleId)
    return Response.json({ ok: true, sent })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Send failed.'
    return Response.json({ ok: false, error: message }, { status: 422 })
  }
}

export const maxDuration = 60
