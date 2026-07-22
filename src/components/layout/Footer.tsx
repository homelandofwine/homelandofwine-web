import { getTranslations } from 'next-intl/server'

import { Img } from '@/components/media/Img'
import { SubscribeButton } from '@/components/newsletter/SubscribeButton'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import type { SiteSetting } from '@/payload-types'

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  'Twitter / X': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
      <path d="M17.8 3h3l-6.6 7.6L22 21h-6.1l-4.8-6.2L5.6 21h-3l7.1-8.1L2 3h6.3l4.3 5.7Zm-1.1 16.2h1.7L7.4 4.7H5.6Z" />
    </svg>
  ),
  Instagram: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-[18px] w-[18px]"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  ),
  Pinterest: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
      <path d="M12 2a10 10 0 0 0-3.6 19.3 9 9 0 0 1 0-2.7l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.9 1.5 1.9 1.9 0 3.3-2 3.3-4.8 0-2.5-1.8-4.3-4.4-4.3a4.5 4.5 0 0 0-4.7 4.5c0 .9.3 1.9.8 2.4a.3.3 0 0 1 .1.3l-.3 1.1c0 .2-.1.2-.3.1-1.2-.6-2-2.4-2-3.9 0-3.2 2.3-6.1 6.7-6.1 3.5 0 6.2 2.5 6.2 5.8 0 3.5-2.2 6.3-5.2 6.3-1 0-2-.5-2.3-1.1l-.6 2.4c-.2.9-.8 2-1.2 2.6A10 10 0 1 0 12 2Z" />
    </svg>
  ),
}

export async function Footer({ locale, settings }: { locale: Locale; settings: SiteSetting }) {
  const t = await getTranslations({ locale })

  const socials: Array<[string, string | null | undefined]> = [
    ['Twitter / X', settings.socialLinks?.twitter],
    ['Instagram', settings.socialLinks?.instagram],
    ['Pinterest', settings.socialLinks?.pinterest],
  ]
  const activeSocials = socials.filter((s): s is [string, string] => Boolean(s[1]))

  const navLinks = [
    ['/', t('nav.home')],
    ['/blog', t('nav.blog')],
    ['/ambassador', t('nav.ambassador')],
    ['/n-line-print', t('nav.nlineprint')],
    ['/about', t('nav.about')],
    ['/contact', t('nav.contact')],
    ['/privacy', t('nav.privacy')],
  ] as const

  return (
    <footer className="bg-shell text-shell-fg">
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-cream.png"
          alt="Homeland of Wine Magazine"
          className="h-16 w-auto sm:h-20"
        />

        <div className="mt-16 flex flex-col justify-between gap-12 md:flex-row">
          <div className="max-w-md">
            <p className="text-3xl font-medium leading-snug tracking-tight sm:text-4xl">
              {settings.footerTagline || t('footer.tagline')}
            </p>
            <SubscribeButton className="mt-8 inline-block rounded-md bg-shell-fg px-5 py-3 text-sm font-semibold text-shell transition-colors hover:opacity-90">
              {t('newsletter.subscribe')}
            </SubscribeButton>
          </div>
          <div className="flex flex-col gap-12 sm:flex-row sm:gap-20">
            <nav className="grid grid-cols-2 content-start gap-x-12 gap-y-3" aria-label="Footer">
              {navLinks.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-shell-dim transition-colors hover:text-shell-fg"
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex content-start gap-3 sm:flex-col">
              {activeSocials.map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="grid h-10 w-10 place-items-center rounded-full border border-shell-line text-shell-fg transition-colors hover:border-accent hover:bg-accent"
                >
                  {SOCIAL_ICONS[name] ?? name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse justify-between gap-10 border-t border-shell-line pt-10 md:flex-row md:items-end">
          <a
            href="#top"
            className="group inline-flex items-center gap-2 text-sm text-shell-dim transition-colors hover:text-shell-fg"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="h-3 w-3 stroke-current transition-transform duration-200 group-hover:-translate-y-0.5"
              strokeWidth="1.5"
            >
              <path d="M8 14V2M8 2 3 7M8 2l5 5" strokeLinecap="square" />
            </svg>
            {t('footer.backToTop')}
          </a>
          <div className="flex flex-col gap-2 text-sm text-shell-dim md:items-end">
            <p>
              {new Date().getFullYear()} © {settings.siteName} — {t('footer.rights')}
            </p>
            <p>
              Powered By{' '}
              <a
                href="https://mushcore.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-shell-fg transition-colors hover:text-accent-soft"
              >
                MushCore
              </a>{' '}
              | Digital Agency
            </p>
          </div>
        </div>
      </div>

      {settings.footerImage && typeof settings.footerImage === 'object' && (
        <Img
          media={settings.footerImage}
          sizes="100vw"
          className="h-64 w-full object-cover sm:h-80"
        />
      )}
    </footer>
  )
}
