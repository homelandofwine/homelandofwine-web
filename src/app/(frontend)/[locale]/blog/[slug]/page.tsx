import { notFound, permanentRedirect } from 'next/navigation'

import { type Locale } from '@/i18n/routing'
import { getArticleBySlug } from '@/lib/api'
import { articlePath, localePath } from '@/lib/seo'

const SLUG_SHAPE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export default async function LegacyArticleRedirect({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: l, slug } = await params
  const locale = l as Locale
  if (!SLUG_SHAPE.test(slug)) notFound()
  const result = await getArticleBySlug(locale, slug)
  if (!result) notFound()
  const target = articlePath({ ...result.article, slug })
  if (target === `/blog/${slug}`) notFound()
  permanentRedirect(localePath(locale, target))
}
