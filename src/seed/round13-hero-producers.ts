import { getPayload } from 'payload'

import config from '@/payload.config'

const SCRATCH =
  '/private/tmp/claude-502/-Users-lukaliparteliani-Documents-homelandofwine-web/f3e5ab6a-47ea-4b4b-8ea9-993a3decf0da/scratchpad'

async function run() {
  const payload = await getPayload({ config })
  const up = (filePath: string, alt: string) =>
    payload.create({ collection: 'media', data: { alt }, filePath })

  const video = await up(`${SCRATCH}/hero-2026.mp4`, 'Homeland of Wine hero video')
  const poster = await up(`${SCRATCH}/hero-2026-poster.jpg`, 'Homeland of Wine hero poster')
  const gvinia = await up(`${SCRATCH}/Gvinia.jpg`, 'Gvinia')
  const marbano = await up(`${SCRATCH}/Marbano.jpg`, 'Marbano')
  const solo = await up(`${SCRATCH}/Solomnishvili-Winery.jpg`, 'Solomnishvili Winery')
  payload.logger.info(`media ids: ${video.id}, ${poster.id}, ${gvinia.id}, ${marbano.id}, ${solo.id}`)

  const home = await payload.findGlobal({ slug: 'homepage', locale: 'en', depth: 0 })
  const sections = (home.sections ?? []) as Array<Record<string, unknown>>
  const pages = [
    { image: gvinia.id, name: 'Gvinia' },
    { image: marbano.id, name: 'Marbano' },
    { image: solo.id, name: 'Solomnishvili Winery' },
  ]
  const existing = sections.find((s) => s.blockType === 'producerPages')
  if (existing) {
    existing.pages = pages
    existing.heading = 'Producers'
  } else {
    const block = { blockType: 'producerPages', heading: 'Producers', pages }
    const partnersIdx = sections.findIndex((s) => s.blockType === 'partners')
    if (partnersIdx === -1) sections.push(block)
    else sections.splice(partnersIdx, 0, block)
  }
  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'en',
    data: { heroVideo: video.id, heroPoster: poster.id, sections },
  })

  const homeKa = await payload.findGlobal({ slug: 'homepage', locale: 'ka', depth: 0 })
  const kaSections = (homeKa.sections ?? []) as Array<Record<string, unknown>>
  const kaBlock = kaSections.find((s) => s.blockType === 'producerPages')
  if (kaBlock) kaBlock.heading = 'მწარმოებლები'
  await payload.updateGlobal({ slug: 'homepage', locale: 'ka', data: { sections: kaSections } })

  payload.logger.info('Round 13 hero video + producer pages set.')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
