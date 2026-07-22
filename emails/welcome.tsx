import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

export function WelcomeEmail({
  siteName,
  siteUrl,
  unsubscribeUrl,
}: {
  siteName: string
  siteUrl: string
  unsubscribeUrl: string
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Welcome to {siteName} — the story of Georgian wine, in your inbox.</Preview>
      <Body style={{ backgroundColor: '#f5f2ef', fontFamily: 'Georgia, serif', margin: 0, padding: '24px 0' }}>
        <Container style={{ backgroundColor: '#ffffff', borderRadius: 8, overflow: 'hidden', maxWidth: 560 }}>
          <Section style={{ backgroundColor: '#1b1717', padding: '28px 32px', textAlign: 'center' as const }}>
            <Text style={{ color: '#f5f1ef', fontSize: 22, fontWeight: 700, margin: 0 }}>
              {siteName}
            </Text>
          </Section>
          <Section style={{ padding: '36px 32px' }}>
            <Text style={{ color: '#141110', fontSize: 26, fontWeight: 700, margin: '0 0 14px', textAlign: 'center' as const }}>
              Gaumarjos — you’re in!
            </Text>
            <Text style={{ color: '#6b6462', fontSize: 15, lineHeight: 1.7, margin: '0 0 10px' }}>
              Welcome — we’re glad you found us. {siteName} tells the story of Georgian wine:
              8,000 years of unbroken winemaking, autochthonous grape varieties, and the people
              who make wine as a cultural act.
            </Text>
            <Text style={{ color: '#6b6462', fontSize: 15, lineHeight: 1.7, margin: '0 0 24px' }}>
              Whenever we publish a new feature, you’ll be the first to read it. Here’s a taste of
              what we’ll be pouring.
            </Text>
            <Section style={{ textAlign: 'center' as const }}>
              <Button
                href={`${siteUrl}/blog`}
                style={{
                  backgroundColor: '#993334',
                  borderRadius: 6,
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: 600,
                  padding: '12px 28px',
                  textDecoration: 'none',
                }}
              >
                Take a look around
              </Button>
            </Section>
            <Hr style={{ borderColor: '#eee7e5', margin: '30px 0 16px' }} />
            <Text style={{ color: '#6b6462', fontSize: 13, margin: '0 0 6px', textAlign: 'center' as const }}>
              <Link href={`${siteUrl}/blog`} style={{ color: '#993334' }}>Articles</Link>
              {'   ·   '}
              <Link href={`${siteUrl}/about`} style={{ color: '#993334' }}>About the magazine</Link>
            </Text>
            <Text style={{ color: '#9a938a', fontSize: 12, lineHeight: 1.5, margin: '14px 0 0', textAlign: 'center' as const }}>
              You are receiving this because you subscribed at {siteName}.{' '}
              <Link href={unsubscribeUrl} style={{ color: '#9a938a', textDecoration: 'underline' }}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
