import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'

import { CREAM, INK, MagazineFooter, MagazineHeader, MUTED, SERIF, WINE } from './brand'

export function NewArticleEmail({
  title,
  excerpt,
  articleUrl,
  siteUrl,
  coverUrl,
  unsubscribeUrl,
}: {
  title: string
  excerpt: string
  articleUrl: string
  siteUrl: string
  coverUrl?: string
  unsubscribeUrl: string
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{excerpt}</Preview>
      <Body style={{ backgroundColor: CREAM, fontFamily: SERIF, margin: 0, padding: '28px 0' }}>
        <Container
          style={{ backgroundColor: '#ffffff', borderRadius: 8, maxWidth: 600, overflow: 'hidden' }}
        >
          <MagazineHeader siteUrl={siteUrl} />
          {coverUrl && (
            <Img
              src={coverUrl}
              alt=""
              width="600"
              style={{ display: 'block', height: 'auto', width: '100%' }}
            />
          )}
          <Section style={{ padding: '36px 40px 24px' }}>
            <Text
              style={{
                color: WINE,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 3,
                margin: '0 0 14px',
                textTransform: 'uppercase' as const,
              }}
            >
              New Article
            </Text>
            <Text
              style={{
                color: INK,
                fontFamily: SERIF,
                fontSize: 30,
                fontWeight: 700,
                lineHeight: 1.2,
                margin: '0 0 16px',
              }}
            >
              {title}
            </Text>
            <Text style={{ color: MUTED, fontSize: 15, lineHeight: 1.7, margin: '0 0 26px' }}>
              {excerpt}
            </Text>
            <Button
              href={articleUrl}
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
              Read More →
            </Button>
          </Section>
          <MagazineFooter siteUrl={siteUrl} unsubscribeUrl={unsubscribeUrl} />
        </Container>
      </Body>
    </Html>
  )
}
