import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import type { Locale } from '@/i18n/routing'
import config from '@/payload.config'
import { localePath } from '@/lib/seo'

export async function GET(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: new Headers(req.headers) })

  if (!user) {
    return new Response('Unauthorized — log in to /admin first.', { status: 403 })
  }

  const url = new URL(req.url)
  const slug = url.searchParams.get('slug')
  const locale = (url.searchParams.get('locale') === 'ka' ? 'ka' : 'en') as Locale

  const draft = await draftMode()
  draft.enable()

  redirect(localePath(locale, slug ? `/blog/${slug}` : '/'))
}
