import { getPayload } from 'payload'

import config from '@/payload.config'

async function run() {
  const payload = await getPayload({ config })
  const { totalDocs } = await payload.count({ collection: 'users' })
  if (totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: { email: 'admin@homelandofwine.local', password: 'change-me-please' },
    })
    payload.logger.info('Admin user created (admin@homelandofwine.local / change-me-please).')
  } else {
    payload.logger.info('Users exist — nothing to do.')
  }
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
