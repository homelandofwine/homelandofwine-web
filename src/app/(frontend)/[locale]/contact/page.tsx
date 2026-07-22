import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { getContactPage } from '@/lib/api'
import { absoluteUrl, ogLocale, pageAlternates } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: l } = await params
  const locale = l as Locale
  const contact = await getContactPage(locale)
  return {
    title: contact.heading,
    description: contact.intro || undefined,
    alternates: pageAlternates(locale, '/contact'),
    openGraph: {
      title: contact.heading,
      description: contact.intro || undefined,
      url: absoluteUrl(locale, '/contact'),
      locale: ogLocale(locale),
    },
  }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  const locale = l as Locale
  setRequestLocale(locale)

  const [contact, t] = await Promise.all([getContactPage(locale), getTranslations({ locale })])

  const instagramUrl = contact.instagram
    ? contact.instagram.startsWith('http')
      ? contact.instagram
      : `https://instagram.com/${contact.instagram.replace(/^@/, '')}`
    : null

  const icons = {
    mail: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    phone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
        <path
          d="M5 4h4l1.5 4.5-2.2 1.6a13 13 0 0 0 5.6 5.6l1.6-2.2L20 15v4a1.5 1.5 0 0 1-1.6 1.5C10.7 20 4 13.3 3.5 5.6A1.5 1.5 0 0 1 5 4Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="3.8" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    ),
  }

  const phoneDisplay = contact.phone
    ? contact.phone.includes('+995')
      ? contact.phone
      : `(+995) ${contact.phone}`
    : null
  const phoneHref = phoneDisplay ? `tel:${phoneDisplay.replace(/[^\d+]/g, '')}` : null

  const rows: Array<[string, React.ReactNode, React.ReactNode]> = []
  if (contact.email) {
    rows.push([
      'email',
      icons.mail,
      <a key="e" href={`mailto:${contact.email}`} className="text-accent hover:underline">
        {contact.email}
      </a>,
    ])
  }
  if (phoneDisplay && phoneHref) {
    rows.push([
      'phone',
      icons.phone,
      <a key="m" href={phoneHref} className="hover:underline">
        {phoneDisplay}
      </a>,
    ])
  }
  if (instagramUrl) {
    rows.push([
      'instagram',
      icons.instagram,
      <a
        key="ig"
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent hover:underline"
      >
        {contact.instagram!.replace(/^https?:\/\/(www\.)?instagram\.com\//, '@').replace(/^@?/, '@')}
      </a>,
    ])
  }

  return (
    <main>
      <header>
        <div className="mx-auto max-w-3xl px-4 pb-14 pt-40 text-center sm:px-6">
          <h1 className="anim-rise text-[clamp(3rem,8vw,5.5rem)] font-medium leading-none tracking-tight text-ink">
            {contact.heading}
          </h1>
          {contact.intro && (
            <p
              className="anim-rise mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted"
              style={{ '--anim-delay': '0.15s' } as React.CSSProperties}
            >
              {contact.intro}
            </p>
          )}
        </div>
      </header>
      <div className="mx-auto max-w-xl px-4 pb-28 sm:px-6">
        <div
          className="anim-rise rounded-lg bg-paper p-8 shadow-sm sm:p-12"
          style={{ '--anim-delay': '0.25s' } as React.CSSProperties}
        >
          {contact.company && (
            <p className="text-lg font-medium text-ink">{contact.company}</p>
          )}
          <dl className="mt-6 space-y-4">
            {rows.map(([key, icon, value]) => (
              <div key={key} className="flex items-center gap-4 border-b border-line pb-4">
                <dt className="shrink-0 text-accent" aria-label={key}>
                  {icon}
                </dt>
                <dd className="text-base text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </main>
  )
}
