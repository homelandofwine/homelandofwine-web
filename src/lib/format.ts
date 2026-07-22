import type { Locale } from '@/i18n/routing'

export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'ka' ? 'ka-GE' : 'en-US', {
    dateStyle: 'long',
  }).format(new Date(iso))
}
