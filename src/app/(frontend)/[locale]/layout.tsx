import type { Metadata } from 'next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Cormorant_Garamond, EB_Garamond } from 'next/font/google'
import localFont from 'next/font/local'
import { notFound } from 'next/navigation'
import React from 'react'

import { AlternateLinksProvider } from '@/components/layout/AlternateLinks'
import { Analytics } from '@vercel/analytics/next'

import { CookieConsent } from '@/components/layout/CookieConsent'
import { NewsletterModal } from '@/components/newsletter/NewsletterModal'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { MotionProvider } from '@/components/motion/MotionProvider'
import { JsonLd } from '@/components/seo/JsonLd'
import { routing, type Locale } from '@/i18n/routing'
import { getSettings } from '@/lib/api'
import { absoluteUrl, ogLocale, pageAlternates, SITE_URL } from '@/lib/seo'

import '../globals.css'

const garamond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-garamond',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const georgianBody = localFont({
  src: '../../../fonts/BPGNinoRegular.ttf',
  variable: '--font-ka-body',
  display: 'swap',
})

const georgianDisplay = localFont({
  src: '../../../fonts/BPGNinoMedium.ttf',
  variable: '--font-ka-display',
  display: 'swap',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: l } = await params
  if (!hasLocale(routing.locales, l)) return {}
  const locale = l as Locale
  const settings = await getSettings(locale)

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: settings.metaTitle || settings.siteName,
      template: `%s — ${settings.siteName}`,
    },
    description: settings.siteDescription,
    alternates: {
      ...pageAlternates(locale, '/'),
      types: {
        'application/rss+xml': [
          { title: settings.siteName, url: absoluteUrl(locale, '/rss.xml') },
        ],
      },
    },
    openGraph: {
      type: 'website',
      siteName: settings.siteName,
      locale: ogLocale(locale),
      url: absoluteUrl(locale, '/'),
      images:
        settings.defaultOgImage &&
        typeof settings.defaultOgImage === 'object' &&
        settings.defaultOgImage.url
          ? [
              {
                url: `${SITE_URL}${settings.defaultOgImage.sizes?.og?.url ?? settings.defaultOgImage.url}`,
                width: 1200,
                height: 630,
              },
            ]
          : undefined,
    },
    twitter: {
      card: 'summary_large_image',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  }
}

export default async function FrontendLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const settings = await getSettings(locale as Locale)
  const socials = [
    settings.socialLinks?.twitter,
    settings.socialLinks?.instagram,
    settings.socialLinks?.pinterest,
  ].filter(Boolean)

  return (
    <html
      lang={locale}
      className={`${garamond.variable} ${cormorant.variable} ${georgianBody.variable} ${georgianDisplay.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-page font-sans text-ink antialiased">
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: settings.siteName,
            url: SITE_URL,
            logo: {
              '@type': 'ImageObject',
              url: `${SITE_URL}/brand/logo-ink.png`,
              width: 800,
              height: 496,
            },
            sameAs: socials,
          }}
        />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: settings.siteName,
            description: settings.siteDescription,
            url: absoluteUrl(locale as Locale, '/'),
            inLanguage: locale,
          }}
        />
        <MotionProvider />
        <NextIntlClientProvider>
          <AlternateLinksProvider>
            <Header />
            <div className="flex-1">{children}</div>
            <Footer locale={locale as Locale} settings={settings} />
            <CookieConsent />
            <NewsletterModal />
            <Analytics />
          </AlternateLinksProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
