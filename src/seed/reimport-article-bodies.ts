import { getPayload } from 'payload'

import config from '@/payload.config'
import { lexicalFromDocBlocks, parseDocxRich } from './docx'

const BASE = '/Users/lukaliparteliani/Downloads/ლუკას '
const EN = `${BASE}/7. არტიკლები - რაც უნდა აიტვირთოს - ყველა/ინგლისური`
const KA = `${BASE}/7. არტიკლები - რაც უნდა აიტვირთოს - ყველა/ქართული `

type Item = { slug: string; slugLocale: 'en' | 'ka'; en?: string; ka?: string }

const ITEMS: Item[] = [
  { slug: 'georgian-rose-wines', slugLocale: 'en', en: `${EN}/Main Feature for Maya.docx`, ka: `${KA}/MAIN Homeland of Wine Magazine - მთავარი თემა - ვარდისფერი ღვინოები-2.docx` },
  { slug: 'a-periphrasis-of-rose-wine', slugLocale: 'en', en: `${EN}/A Periphrasis of Rose Wine for Maya 2.docx`, ka: `${KA}/ვარდისფერი ღვინის პერიფრაზი - ნანა - #16.docx` },
  { slug: 'from-dream-to-wine-argvani-cellar', slugLocale: 'en', en: `${EN}/Argvani for Maya.docx`, ka: `${KA}/ARGVANI - Homeland of Wine Magazine #16.docx` },
  { slug: 'asureti', slugLocale: 'en', en: `${EN}/Asureti for Maya 3.docx`, ka: `${KA}/ასურეთი - HoWm #16 .docx` },
  { slug: 'autochthonous-varieties-of-samegrelo', slugLocale: 'en', en: `${EN}/Autochthonous Varieties Samegrelo For Maya.docx`, ka: `${KA}/Homeland of Wine _სამეგრელოს ვაზის ჯიშები_MDINARADZE_03032026.docx` },
  { slug: 'georgian-wheat', slugLocale: 'en', en: `${EN}/Georgian Wheat for Maya.docx`, ka: `${KA}/ქართული ხორბალი 06.04.26..docx` },
  { slug: 'orta-cellar', slugLocale: 'en', en: `${EN}/Orta for Maya.docx`, ka: `${KA}/Orta Cellar - Homeland of Wine Magazine #16.docx` },
  { slug: 'shaverde-heritage-continued', slugLocale: 'en', en: `${EN}/Shaverde for MAYA.docx`, ka: `${KA}/Shaverde (1).docx` },
  { slug: 'agidela', slugLocale: 'en', en: `${EN}/agidela for Maya.docx`, ka: `${KA}/აგიდელა - HoWm #16 .docx` },
  { slug: 'tazo-tamazashvili', slugLocale: 'en', en: `${EN}/Tazo Tamazashvili for Maya.docx` },
  { slug: 'white-bunny-by-natalia-dakishvili', slugLocale: 'en', en: `${EN}/White Bunny for Maya edit.docx` },
  { slug: 'gandagana-of-the-black-sea', slugLocale: 'en', en: `${EN}/gandagana of black sea For Maya.docx` },
  { slug: 'food-travel', slugLocale: 'ka', ka: `${KA}/Food & Travel #16.docx` },
  { slug: 'food-wine', slugLocale: 'ka', ka: `${KA}/Food & Wine #16 corrected.docx` },
]

const dryRun = process.argv.includes('--dry-run')

function describe(file: string) {
  const blocks = parseDocxRich(file)
  const counts = { heading: 0, quote: 0, paragraph: 0, italicRuns: 0 }
  for (const b of blocks) {
    counts[b.kind]++
    counts.italicRuns += b.runs.filter((r) => (r.format & 2) === 2).length
  }
  return { blocks, counts }
}

async function run() {
  const payload = dryRun ? null : await getPayload({ config })

  for (const item of ITEMS) {
    for (const [locale, file] of [['en', item.en], ['ka', item.ka]] as const) {
      if (!file) continue
      const { blocks, counts } = describe(file)
      const label = `${item.slug} [${locale}]`
      console.log(
        `${label}: ${counts.paragraph}p ${counts.heading}h ${counts.quote}q ${counts.italicRuns}i`,
      )
      if (dryRun) {
        for (const b of blocks.slice(0, 3)) {
          console.log(`   ${b.kind}: ${b.runs.map((r) => r.text).join('').slice(0, 90)}`)
        }
        continue
      }

      const { docs } = await payload!.find({
        collection: 'articles',
        locale: item.slugLocale,
        limit: 1,
        where: { slug: { equals: item.slug } },
      })
      if (!docs[0]) throw new Error(`article not found: ${item.slug}`)
      await payload!.update({
        collection: 'articles',
        id: docs[0].id,
        locale,
        draft: false,
        data: { body: lexicalFromDocBlocks(blocks) },
      })
    }
  }
  if (!dryRun) console.log('All article bodies re-imported.')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
