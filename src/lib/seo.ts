import type { Locale } from '@/i18n/routing'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
)

export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  if (locale === 'en') return clean
  return clean === '/' ? '/ka' : `/ka${clean}`
}

export function absoluteUrl(locale: Locale, path: string): string {
  return `${SITE_URL}${localePath(locale, path)}`
}

export function languageAlternates(paths: { ka?: string; en?: string }) {
  const languages: Record<string, string> = {}
  if (paths.en) {
    languages.en = absoluteUrl('en', paths.en)
    languages['x-default'] = languages.en
  }
  if (paths.ka) languages.ka = absoluteUrl('ka', paths.ka)
  return languages
}

export function pageAlternates(locale: Locale, path: string, paths?: { ka?: string; en?: string }) {
  const p = paths ?? { ka: path, en: path }
  return {
    canonical: absoluteUrl(locale, p[locale] ?? path),
    languages: languageAlternates(p),
  }
}

const SPECIAL_CATEGORY_PATHS: Record<string, string> = {
  ambassador: '/ambassador',
  'n-line-print': '/n-line-print',
}

export function categoryPath(slug: string): string {
  return SPECIAL_CATEGORY_PATHS[slug] ?? `/blog/category/${slug}`
}

export function ogLocale(locale: Locale): string {
  return locale === 'ka' ? 'ka_GE' : 'en_US'
}
