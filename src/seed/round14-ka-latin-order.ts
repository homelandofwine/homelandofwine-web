import { getPayload } from 'payload'

import config from '@/payload.config'

async function run() {
  const payload = await getPayload({ config })

  const { docs: cats } = await payload.find({
    collection: 'categories',
    locale: 'ka',
    limit: 100,
    fallbackLocale: false,
  })
  for (const c of cats) {
    if (c.name && /[a-z]/.test(c.name)) {
      await payload.update({
        collection: 'categories',
        id: c.id,
        locale: 'ka',
        data: { name: c.name.toUpperCase().trim() },
      })
      payload.logger.info(`category ${c.slug} ka -> ${c.name.toUpperCase().trim()}`)
    }
  }

  const ap = await payload.findGlobal({ slug: 'articles-page', locale: 'ka', depth: 0 })
  if (ap.heading && /[a-z]/.test(ap.heading)) {
    await payload.updateGlobal({
      slug: 'articles-page',
      locale: 'ka',
      data: { heading: ap.heading.toUpperCase().trim() },
    })
    payload.logger.info(`articles-page ka heading -> ${ap.heading.toUpperCase().trim()}`)
  }
  const apEn = await payload.findGlobal({ slug: 'articles-page', locale: 'en', depth: 0 })
  if (apEn.heading && apEn.heading !== apEn.heading.trim()) {
    await payload.updateGlobal({
      slug: 'articles-page',
      locale: 'en',
      data: { heading: apEn.heading.trim() },
    })
  }

  const home = await payload.findGlobal({ slug: 'homepage', locale: 'en', depth: 0 })
  const sections = (home.sections ?? []) as Array<Record<string, unknown>>
  const prodIdx = sections.findIndex((s) => s.blockType === 'producerPages')
  const faqIdx = sections.findIndex((s) => s.blockType === 'faq')
  if (prodIdx !== -1 && faqIdx !== -1 && prodIdx > faqIdx) {
    const [block] = sections.splice(prodIdx, 1)
    sections.splice(faqIdx, 0, block)
    await payload.updateGlobal({ slug: 'homepage', locale: 'en', data: { sections } })
    payload.logger.info('producerPages moved above faq')
  }

  payload.logger.info('Round 14 data complete.')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
