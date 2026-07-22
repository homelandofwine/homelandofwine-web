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

  const candidates = [
    media.sizes?.thumbnail,
    media.sizes?.card,
    media.sizes?.hero,
    { url: media.url, width: media.width },
  ].filter((s): s is { url: string; width: number } => Boolean(s?.url && s?.width))

  const srcSet = candidates.map((s) => `${s.url} ${s.width}w`).join(', ')

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={media.url ?? undefined}
      srcSet={srcSet || undefined}
      sizes={sizes}
      alt={media.alt ?? ''}
      width={media.width ?? undefined}
      height={media.height ?? undefined}
      className={className}
      loading={loading}
      fetchPriority={fetchPriority}
      style={style}
      decoding="async"
    />
  )
}
