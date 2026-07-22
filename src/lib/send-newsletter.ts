import { render } from '@react-email/components'
import type { Payload } from 'payload'
import React from 'react'

import { NewArticleEmail } from '../../emails/new-article'
import { EMAIL_FROM, mailer } from '@/lib/email'
import { SITE_URL } from '@/lib/seo'
import { unsubscribeUrl } from '@/lib/tokens'
import type { Media } from '@/payload-types'

export async function sendArticleNewsletter(
  payload: Payload,
  articleId: number | string,
): Promise<{ sent: number }> {
  let locale: 'en' | 'ka' = 'en'
  let article = await payload.findByID({
    collection: 'articles',
    id: articleId,
    locale,
    depth: 1,
    fallbackLocale: false,
  })
  if (!article.title || !article.slug) {
    locale = 'ka'
    article = await payload.findByID({
      collection: 'articles',
      id: articleId,
      locale,
      depth: 1,
      fallbackLocale: false,
    })
    if (!article.title || !article.slug) {
      throw new Error('Article has no sendable locale (missing title or slug)')
    }
  }

  const { docs: subscribers } = await payload.find({
    collection: 'subscribers',
    where: { status: { equals: 'active' } },
    limit: 10000,
    overrideAccess: true,
  })

  if (subscribers.length === 0) {
    return { sent: 0 }
  }

  const settings = await payload.findGlobal({ slug: 'site-settings', locale })
  const cover = article.coverImage as Media | null
  const coverUrl =
    typeof cover === 'object' && cover?.url
      ? `${SITE_URL}${cover.sizes?.card?.url ?? cover.url}`
      : undefined
  const articleUrl =
    locale === 'en' ? `${SITE_URL}/blog/${article.slug}` : `${SITE_URL}/ka/blog/${article.slug}`

  const emails = await Promise.all(
    subscribers.map(async (sub) => {
      const unsub = unsubscribeUrl(SITE_URL, sub.email, sub.locale ?? 'en')
      return {
        from: EMAIL_FROM,
        to: [sub.email],
        subject: article.title,
        html: await render(
          React.createElement(NewArticleEmail, {
            siteName: settings.siteName,
            title: article.title,
            excerpt: article.excerpt,
            articleUrl,
            coverUrl,
            unsubscribeUrl: unsub,
          }),
        ),
        headers: {
          'List-Unsubscribe': `<${unsub}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      }
    }),
  )

  await mailer.batch(emails)

  await payload.update({
    collection: 'articles',
    id: articleId,
    locale,
    data: { newsletterSentAt: new Date().toISOString() },
    context: { skipNewsletter: true },
    draft: false,
  })

  return { sent: subscribers.length }
}
