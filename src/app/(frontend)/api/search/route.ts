import { NextResponse, type NextRequest } from 'next/server'

import { routing, type Locale } from '@/i18n/routing'
import { searchArticles } from '@/lib/api'

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') ?? '').trim()
  const l = req.nextUrl.searchParams.get('locale') ?? routing.defaultLocale
  const locale = (routing.locales as readonly string[]).includes(l)
    ? (l as Locale)
    : routing.defaultLocale
  if (q.length < 2) return NextResponse.json([])

  const docs = await searchArticles(locale, q, 6)
  return NextResponse.json(
    docs.map((d) => ({ id: d.id, title: d.title, slug: d.slug })),
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } },
  )
}
