import { Hr, Link, Section, Text } from '@react-email/components'

export const BRAND = 'Homeland of Wine Magazine'
export const WINE = '#993334'
export const INK = '#141110'
export const CREAM = '#f1edec'
export const MUTED = '#6d675f'
export const FAINT = '#9a938a'
export const LINE = '#e4e0d9'
export const SERIF = 'Georgia, "Times New Roman", serif'

const SOCIALS: Array<[string, string]> = [
  ['Instagram', 'https://www.instagram.com/homelandofwinemagazine/'],
  ['X', 'https://x.com/HomelandOf3857'],
  ['Pinterest', 'https://www.pinterest.com/homelandofwinemagazine/'],
]

export function MagazineHeader() {
  return (
    <Section style={{ backgroundColor: INK, padding: '30px 32px', textAlign: 'center' as const }}>
      <Text
        style={{
          color: CREAM,
          fontFamily: SERIF,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: 2,
          lineHeight: 1.15,
          margin: 0,
          textTransform: 'uppercase' as const,
        }}
      >
        Homeland of Wine
      </Text>
      <Text
        style={{
          color: WINE,
          fontFamily: SERIF,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 6,
          margin: '6px 0 0',
          textTransform: 'uppercase' as const,
        }}
      >
        Magazine
      </Text>
    </Section>
  )
}

export function MagazineFooter({
  siteUrl,
  unsubscribeUrl,
}: {
  siteUrl: string
  unsubscribeUrl?: string
}) {
  const linkStyle = {
    color: INK,
    fontFamily: SERIF,
    fontSize: 13,
    fontWeight: 700,
    textDecoration: 'none',
  }
  return (
    <Section style={{ padding: '0 32px 32px' }}>
      <Hr style={{ borderColor: LINE, margin: '8px 0 20px' }} />
      <Text style={{ margin: '0 0 6px', textAlign: 'center' as const }}>
        <Link href={`${siteUrl}/blog`} style={linkStyle}>
          Articles
        </Link>
        <span style={{ color: FAINT }}> · </span>
        <Link href={`${siteUrl}/about`} style={linkStyle}>
          About
        </Link>
        {SOCIALS.map(([name, url]) => (
          <span key={name}>
            <span style={{ color: FAINT }}> · </span>
            <Link href={url} style={linkStyle}>
              {name}
            </Link>
          </span>
        ))}
      </Text>
      <Text
        style={{
          color: MUTED,
          fontFamily: SERIF,
          fontSize: 13,
          fontStyle: 'italic' as const,
          lineHeight: 1.6,
          margin: '14px 0 0',
          textAlign: 'center' as const,
        }}
      >
        {BRAND} — the story of Georgian wine, told from its homeland.
      </Text>
      {unsubscribeUrl && (
        <Text
          style={{
            color: FAINT,
            fontSize: 11,
            lineHeight: 1.5,
            margin: '14px 0 0',
            textAlign: 'center' as const,
          }}
        >
          You are receiving this because you subscribed to the {BRAND} newsletter.{' '}
          <Link href={unsubscribeUrl} style={{ color: FAINT, textDecoration: 'underline' }}>
            Unsubscribe
          </Link>
        </Text>
      )}
    </Section>
  )
}
