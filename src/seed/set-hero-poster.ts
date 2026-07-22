import { readFileSync } from 'fs'
import { getPayload } from 'payload'

import config from '@/payload.config'

async function run() {
  const file = process.argv[2]
  if (!file) throw new Error('usage: set-hero-poster.ts <path-to-jpg>')
  const payload = await getPayload({ config })

  const media = await payload.create({
    collection: 'media',
    locale: 'en',
    data: { alt: 'Homeland of Wine magazines — video still' },
    file: {
      data: readFileSync(file),
      name: 'hero-video-poster.jpg',
      mimetype: 'image/jpeg',
      size: readFileSync(file).length,
    },
  })
  await payload.updateGlobal({ slug: 'homepage', locale: 'en', data: { heroPoster: media.id } })
  payload.logger.info(`Hero poster set to media ${media.id}.`)
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
