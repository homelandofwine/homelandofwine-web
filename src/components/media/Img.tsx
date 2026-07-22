import Image from 'next/image'

import type { Media } from '@/payload-types'

export function Img({
  media,
  sizes = '100vw',
  className,
  loading = 'lazy',
  fetchPriority,
  style,
}: {
  media: Media | string | number | null | undefined
  sizes?: string
  className?: string
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
  style?: React.CSSProperties
}) {
  if (!media || typeof media === 'string' || typeof media === 'number') return null
  if (!media.url) return null

  const isOptimizable =
    Boolean(media.width && media.height) &&
    Boolean(media.mimeType?.startsWith('image/')) &&
    !media.mimeType?.includes('svg')

  if (!isOptimizable) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={media.url}
        alt={media.alt ?? ''}
        width={media.width ?? undefined}
        height={media.height ?? undefined}
        className={className}
        loading={loading}
        style={style}
        decoding="async"
      />
    )
  }

  const eager = loading === 'eager' || fetchPriority === 'high'

  return (
    <Image
      src={media.url}
      alt={media.alt ?? ''}
      width={media.width!}
      height={media.height!}
      sizes={sizes}
      quality={70}
      className={className}
      loading={eager ? undefined : 'lazy'}
      priority={eager}
      style={style}
    />
  )
}
