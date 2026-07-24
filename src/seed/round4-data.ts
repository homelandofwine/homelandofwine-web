import { getPayload } from 'payload'

import config from '@/payload.config'

const STATEMENT = {
  en: 'We tell the story of Georgian wine — eight thousand vintages of unbroken tradition, autochthonous grape varieties, and the people who make wine as a cultural act.',
  ka: 'ჩვენ ვყვებით ქართული ღვინის ისტორიას — რვაათასწლიანი უწყვეტი ტრადიცია, ავტოქტონური ჯიშები და ადამიანები, რომლებისთვისაც ღვინო კულტურული ქმედებაა.',
}

async function run() {
  const payload = await getPayload({ config })

  for (const locale of ['en', 'ka'] as const) {
    const homepage = await payload.findGlobal({ slug: 'homepage', locale, depth: 0 })
    const sections = (homepage.sections ?? []) as Array<Record<string, unknown>>
    let changed = false

    for (const section of sections) {
      if (section.blockType === 'stats' && !section.statement) {
        section.statement = STATEMENT[locale]
        changed = true
      }
      if (locale === 'ka' && section.blockType === 'steps') {
        const items = (section.items ?? []) as Array<{ title?: string | null }>
        for (const item of items) {
          if (item.title && /[a-z]/.test(item.title)) {
            item.title = item.title.toUpperCase()
            changed = true
          }
        }
      }
    }

    if (changed) {
      await payload.updateGlobal({ slug: 'homepage', locale, data: { sections } })
      payload.logger.info(`homepage updated [${locale}]`)
    }
  }

  payload.logger.info('Round 4 data complete.')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
