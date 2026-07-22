import { Body, Container, Head, Hr, Html, Preview, Section, Text } from '@react-email/components'

export function ContactNotificationEmail({
  name,
  email,
  message,
}: {
  name: string
  email: string
  message: string
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>New contact form message from {name}</Preview>
      <Body style={{ backgroundColor: '#f5f1eb', fontFamily: 'Helvetica, Arial, sans-serif', margin: 0, padding: '24px 0' }}>
        <Container style={{ backgroundColor: '#ffffff', borderRadius: 8, maxWidth: 560, padding: 32 }}>
          <Text style={{ color: '#1b1917', fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>
            New contact message
          </Text>
          <Text style={{ color: '#6d675f', fontSize: 14, margin: '0 0 4px' }}>
            From: {name} ({email})
          </Text>
          <Hr style={{ borderColor: '#e4e0d9', margin: '16px 0' }} />
          <Section>
            <Text style={{ color: '#1b1917', fontSize: 15, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {message}
            </Text>
          </Section>
          <Hr style={{ borderColor: '#e4e0d9', margin: '16px 0' }} />
          <Text style={{ color: '#9a938a', fontSize: 12, margin: 0 }}>
            Reply directly to this email to answer.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
