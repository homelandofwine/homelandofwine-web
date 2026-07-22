import { getPayload } from 'payload'

import config from '@/payload.config'

async function run() {
  const payload = await getPayload({ config })

  await payload.update({
    collection: 'articles',
    id: 4,
    locale: 'en',
    draft: false,
    data: {
      excerpt: 'This year’s harvest forecast, and what makes the Georgian rtveli special.',
      newsletterSentAt: new Date().toISOString(),
      _status: 'published',
    },
    context: { skipNewsletter: true },
  })
  payload.logger.info('Article 4 republished and marked sent.')

  const { docs: testArticles } = await payload.find({
    collection: 'articles',
    where: { title: { contains: 'სატესტო' } },
    locale: 'ka',
  })
  for (const a of testArticles) {
    await payload.delete({ collection: 'articles', id: a.id })
    payload.logger.info(`Deleted test article ${a.id}.`)
  }

  const { docs: testSubs } = await payload.find({
    collection: 'subscribers',
    where: { email: { like: '@example.com' } },
    overrideAccess: true,
  })
  for (const s of testSubs) {
    await payload.delete({ collection: 'subscribers', id: s.id, overrideAccess: true })
    payload.logger.info(`Deleted test subscriber ${s.email}.`)
  }

  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
