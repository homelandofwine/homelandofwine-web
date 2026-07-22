import { getPayload } from 'payload'
import sharp from 'sharp'

import config from '@/payload.config'

async function footerImageBuffer(): Promise<Buffer> {
  const svg = `<svg width="2400" height="800" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="hsl(28, 55%, 22%)"/>
        <stop offset="55%" stop-color="hsl(18, 50%, 15%)"/>
        <stop offset="100%" stop-color="hsl(20, 40%, 9%)"/>
      </linearGradient>
    </defs>
    <rect width="2400" height="800" fill="url(#sky)"/>
    <circle cx="1900" cy="220" r="130" fill="hsl(35, 70%, 55%)" opacity="0.5"/>
    ${Array.from({ length: 14 }, (_, i) => {
      const x = 100 + i * 170
      return `<path d="M${x} 800 L${x + 40} 560 L${x + 80} 800 Z" fill="hsl(100, 18%, ${10 + (i % 3) * 3}%)" opacity="0.8"/>`
    }).join('')}
    <text x="96" y="720" font-family="Georgia, serif" font-size="44" fill="rgba(245,241,235,0.28)" letter-spacing="10">VINEYARDS OF KAKHETI</text>
  </svg>`
  return sharp(Buffer.from(svg)).jpeg({ quality: 84 }).toBuffer()
}

async function run() {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  if (settings.footerImage) {
    payload.logger.info('Footer image already set — skipping.')
    process.exit(0)
  }

  const media = await payload.create({
    collection: 'media',
    locale: 'ka',
    data: { alt: 'ვენახები მზის ჩასვლისას' },
    file: {
      data: await footerImageBuffer(),
      name: 'footer-vineyards.jpg',
      mimetype: 'image/jpeg',
      size: 0,
    },
  })
  await payload.update({
    collection: 'media',
    id: media.id,
    locale: 'en',
    data: { alt: 'Vineyards at sunset' },
  })
  await payload.updateGlobal({ slug: 'site-settings', locale: 'ka', data: { footerImage: media.id } })
  payload.logger.info('Footer image set.')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
