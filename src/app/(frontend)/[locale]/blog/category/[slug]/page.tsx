import { notFound, permanentRedirect } from 'next/navigation'

import { type Locale } from '@/i18n/routing'
import { categoryPath, localePath } from '@/lib/seo'

const SLUG_SHAPE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export default async function LegacyCategoryRedirect({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!SLUG_SHAPE.test(slug)) notFound()
  permanentRedirect(localePath(locale as Locale, categoryPath(slug)))
}
