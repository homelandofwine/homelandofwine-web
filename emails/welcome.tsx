import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

import { BRAND, CREAM, INK, LINE, MagazineFooter, MagazineHeader, MUTED, SERIF, WINE } from './brand'

export function WelcomeEmail({
  siteUrl,
  unsubscribeUrl,
}: {
  siteUrl: string
  unsubscribeUrl: string
}) {
  const sectionLink = {
    color: WINE,
    fontFamily: SERIF,
    fontSize: 14,
    fontWeight: 700,
    textDecoration: 'none',
  }
  return (
    <Html lang="en">
      <Head />
      <Preview>Welcome to {BRAND} — the story of Georgian wine, in your inbox.</Preview>
      <Body style={{ backgroundColor: CREAM, fontFamily: SERIF, margin: 0, padding: '28px 0' }}>
        <Container
          style={{ backgroundColor: '#ffffff', borderRadius: 8, maxWidth: 600, overflow: 'hidden' }}
        >
          <MagazineHeader />
          <Section style={{ padding: '40px 40px 24px' }}>
            <Text
              style={{
                color: INK,
                fontFamily: SERIF,
                fontSize: 30,
                fontWeight: 700,
                lineHeight: 1.2,
                margin: '0 0 16px',
                textAlign: 'center' as const,
              }}
            >
              Gaumarjos — you’re in!
            </Text>
            <Text style={{ color: MUTED, fontSize: 15, lineHeight: 1.7, margin: '0 0 12px' }}>
              Welcome — we’re glad you found us. {BRAND} tells the story of Georgian wine: 8,000
              years of unbroken winemaking, autochthonous grape varieties, and the people who make
              wine as a cultural act.
            </Text>
            <Text style={{ color: MUTED, fontSize: 15, lineHeight: 1.7, margin: '0 0 28px' }}>
              Whenever we publish a new feature, you’ll be the first to read it. Here’s a taste of
              what we’ll be pouring.
            </Text>
            <Section style={{ textAlign: 'center' as const }}>
              <Button
                href={`${siteUrl}/blog`}
                style={{
                  backgroundColor: WINE,
                  borderRadius: 6,
                  color: '#ffffff',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 2,
                  padding: '14px 28px',
                  textDecoration: 'none',
                  textTransform: 'uppercase' as const,
                }}
              >
                Take a look around
              </Button>
            </Section>
            <Section
              style={{
                borderTop: `1px solid ${LINE}`,
                marginTop: 32,
                paddingTop: 20,
                textAlign: 'center' as const,
              }}
            >
              <Text style={{ margin: 0 }}>
                <Link href={`${siteUrl}/blog`} style={sectionLink}>
                  The Magazine
                </Link>
                <span style={{ color: MUTED }}> · </span>
                <Link href={`${siteUrl}/ambassador`} style={sectionLink}>
                  Wine Ambassadors
                </Link>
                <span style={{ color: MUTED }}> · </span>
                <Link href={`${siteUrl}/n-line-print`} style={sectionLink}>
                  N Line Print
                </Link>
              </Text>
            </Section>
          </Section>
          <MagazineFooter siteUrl={siteUrl} unsubscribeUrl={unsubscribeUrl} />
        </Container>
      </Body>
    </Html>
  )
}
