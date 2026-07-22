import { readFileSync } from 'fs'
import { getPayload } from 'payload'

import config from '@/payload.config'

async function run() {
  const payload = await getPayload({ config })
  const backupPath = process.argv[2]
  if (!backupPath) throw new Error('usage: tsx migrate-partners-into-block.ts <backup.json>')

  const partners: Array<{ name: string; logo: number; url?: string }> = JSON.parse(
    readFileSync(backupPath, 'utf8'),
  )

  const homepage = await payload.findGlobal({ slug: 'homepage', depth: 0 })
  const sections = (homepage.sections ?? []).map((s) =>
    s.blockType === 'partners' && (!s.partners || s.partners.length === 0)
      ? { ...s, partners }
      : s,
  )
  await payload.updateGlobal({ slug: 'homepage', locale: 'ka', data: { sections } })
  payload.logger.info(`Moved ${partners.length} partners into the homepage partners block.`)
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
