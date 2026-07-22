import { Img } from '@/components/media/Img'
import type { Media } from '@/payload-types'

export function CtaBand({
  heading,
  buttonLabel,
  buttonHref,
  background,
}: {
  heading: string
  buttonLabel: string
  buttonHref: string
  background?: Media | string | number | null
}) {
  return (
    <section className="relative overflow-hidden bg-shell text-shell-fg">
      {background && typeof background === 'object' && (
        <div className="absolute inset-0" data-parallax>
          <Img media={background} sizes="100vw" className="h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-shell via-shell/50 to-shell/30" />
        </div>
      )}
      <div className="relative mx-auto flex max-w-[1400px] flex-col items-start gap-10 px-4 py-24 sm:px-6 lg:py-36">
        <h2
          className="max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)] uppercase leading-[1.02] tracking-tight"
          data-reveal="up"
        >
          {heading}
        </h2>
        <a
          href={buttonHref}
          className="rounded-md bg-accent px-8 py-4 text-sm font-semibold text-shell-fg transition-colors hover:bg-accent-soft"
          data-reveal="up"
          style={{ '--reveal-delay': '0.15s' } as React.CSSProperties}
        >
          {buttonLabel}
        </a>
      </div>
    </section>
  )
}
