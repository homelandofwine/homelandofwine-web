import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

export function NewArticleEmail({
  siteName,
  title,
  excerpt,
  articleUrl,
  coverUrl,
  unsubscribeUrl,
}: {
  siteName: string
  title: string
  excerpt: string
  articleUrl: string
  coverUrl?: string
  unsubscribeUrl: string
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{excerpt}</Preview>
      <Body style={{ backgroundColor: '#f5f1eb', fontFamily: 'Helvetica, Arial, sans-serif', margin: 0, padding: '24px 0' }}>
        <Container style={{ backgroundColor: '#ffffff', borderRadius: 8, overflow: 'hidden', maxWidth: 560 }}>
          <Section style={{ backgroundColor: '#1b1917', padding: '20px 32px' }}>
            <Text style={{ color: '#f5f1eb', fontSize: 14, fontWeight: 700, margin: 0 }}>
              {siteName}
            </Text>
          </Section>
          {coverUrl && (
            <Img src={coverUrl} alt="" width="560" style={{ width: '100%', height: 'auto', display: 'block' }} />
          )}
          <Section style={{ padding: '32px' }}>
            <Text style={{ color: '#1b1917', fontSize: 26, fontWeight: 700, lineHeight: 1.2, margin: '0 0 16px' }}>
              {title}
            </Text>
            <Text style={{ color: '#6d675f', fontSize: 15, lineHeight: 1.6, margin: '0 0 24px' }}>
              {excerpt}
            </Text>
            <Button
              href={articleUrl}
              style={{
                backgroundColor: '#993334',
                borderRadius: 6,
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 600,
                padding: '12px 24px',
                textDecoration: 'none',
              }}
            >
              Read More →
            </Button>
            <Hr style={{ borderColor: '#e4e0d9', margin: '32px 0 16px' }} />
            <Text style={{ color: '#9a938a', fontSize: 12, lineHeight: 1.5, margin: 0 }}>
              You are receiving this because you subscribed to the {siteName} newsletter.{' '}
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
