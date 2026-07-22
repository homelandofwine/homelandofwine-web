import { getPayload, type Payload } from 'payload'
import { readFileSync } from 'fs'
import sharp from 'sharp'

import config from '@/payload.config'
import { docxText, lexicalFromParagraphs, parseBody } from './docx'

const BASE = '/Users/lukaliparteliani/Downloads/ლუკას '
const EN = `${BASE}/7. არტიკლები - რაც უნდა აიტვირთოს - ყველა/ინგლისური`
const KA = `${BASE}/7. არტიკლები - რაც უნდა აიტვირთოს - ყველა/ქართული `
const SLIDES = `${BASE}/3. 4 სლაიდიანი სქროლვადი სექცია`

type Item = {
  key: string
  category: string
  en?: { file: string; title: string; excerpt: string }
  ka?: { file: string; title: string; excerpt: string }
  cover?: string
  hue: number
}

const ARTICLES: Item[] = [
  {
    key: 'periphrasis-rose',
    category: 'wines',
    en: { file: `${EN}/A Periphrasis of Rose Wine for Maya 2.docx`, title: 'A Periphrasis of Rosé Wine', excerpt: 'The diversity of Georgian varieties and rosé wines.' },
    ka: { file: `${KA}/ვარდისფერი ღვინის პერიფრაზი - ნანა - #16.docx`, title: 'ვარდისფერი ღვინის პერიფრაზი', excerpt: 'ქართული ჯიშების მრავალფეროვნება და ვარდისფერი ღვინოები.' },
    cover: `${SLIDES}/3.jpg`,
    hue: 340,
  },
  {
    key: 'argvani',
    category: 'producers',
    en: { file: `${EN}/Argvani for Maya.docx`, title: 'From Dream to Wine: Argvani Cellar', excerpt: 'The story of Colchian red pheasants and Megrelian Ojaleshi at Argvani Cellar.' },
    ka: { file: `${KA}/ARGVANI - Homeland of Wine Magazine #16.docx`, title: 'არგვანი — ოცნებიდან ღვინომდე', excerpt: 'კოლხური წითელი ხოხბებისა და მეგრული ოჯალეშის ისტორია არგვანის მარანში.' },
    hue: 15,
  },
  {
    key: 'asureti',
    category: 'producers',
    en: { file: `${EN}/Asureti for Maya 3.docx`, title: 'Asureti', excerpt: 'A village with German roots and a winemaking story of its own.' },
    ka: { file: `${KA}/ასურეთი - HoWm #16 .docx`, title: 'ასურეთი', excerpt: 'სოფელი გერმანული ფესვებით და საკუთარი მეღვინეობის ისტორიით.' },
    hue: 90,
  },
  {
    key: 'samegrelo-varieties',
    category: 'grape-varieties',
    en: { file: `${EN}/Autochthonous Varieties Samegrelo For Maya.docx`, title: 'Autochthonous Varieties of Samegrelo', excerpt: 'The native grape varieties of Samegrelo and their revival.' },
    ka: { file: `${KA}/Homeland of Wine _სამეგრელოს ვაზის ჯიშები_MDINARADZE_03032026.docx`, title: 'სამეგრელოს ვაზის ჯიშები', excerpt: 'სამეგრელოს ადგილობრივი ვაზის ჯიშები და მათი აღორძინება.' },
    hue: 270,
  },
  {
    key: 'georgian-wheat',
    category: 'food-and-wine',
    en: { file: `${EN}/Georgian Wheat for Maya.docx`, title: 'Georgian Wheat', excerpt: 'Ancient Georgian wheat varieties and the bread culture beside the wine.' },
    ka: { file: `${KA}/ქართული ხორბალი 06.04.26..docx`, title: 'ქართული ხორბალი', excerpt: 'უძველესი ქართული ხორბლის ჯიშები და პურის კულტურა ღვინის გვერდით.' },
    hue: 45,
  },
  {
    key: 'orta',
    category: 'producers',
    en: { file: `${EN}/Orta for Maya.docx`, title: 'Orta Cellar', excerpt: 'A cellar with its own voice in Georgian winemaking.' },
    ka: { file: `${KA}/Orta Cellar - Homeland of Wine Magazine #16.docx`, title: 'Orta Cellar', excerpt: 'მარანი საკუთარი ხმით ქართულ მეღვინეობაში.' },
    hue: 200,
  },
  {
    key: 'shaverde',
    category: 'producers',
    en: { file: `${EN}/Shaverde for MAYA.docx`, title: 'Shaverde — Heritage Continued', excerpt: 'Shaverde’s goals and brand positioning.' },
    ka: { file: `${KA}/Shaverde (1).docx`, title: 'შავერდე — მემკვიდრეობის გაგრძელება', excerpt: 'შავერდეს მიზნები და ბრენდის პოზიცია.' },
    cover: `${SLIDES}/1.jpg`,
    hue: 25,
  },
  {
    key: 'agidela',
    category: 'producers',
    en: { file: `${EN}/agidela for Maya.docx`, title: 'Agidela', excerpt: 'A winery story from the homeland of wine.' },
    ka: { file: `${KA}/აგიდელა - HoWm #16 .docx`, title: 'აგიდელა', excerpt: 'მარნის ისტორია ღვინის სამშობლოდან.' },
    hue: 120,
  },
  {
    key: 'tazo-tamazashvili',
    category: 'producers',
    en: { file: `${EN}/Tazo Tamazashvili for Maya.docx`, title: 'Tazo Tamazashvili', excerpt: 'A winemaker’s portrait.' },
    hue: 60,
  },
  {
    key: 'white-bunny',
    category: 'wines',
    en: { file: `${EN}/White Bunny for Maya edit.docx`, title: 'White Bunny by Natalia Dakishvili', excerpt: 'Wine as a story.' },
    cover: `${SLIDES}/2.jpg`,
    hue: 315,
  },
  {
    key: 'gandagana',
    category: 'wines',
    en: { file: `${EN}/gandagana of black sea For Maya.docx`, title: 'Gandagana of the Black Sea', excerpt: 'A wine story from the Black Sea coast.' },
    hue: 190,
  },
  {
    key: 'food-travel-16',
    category: 'food-and-travel',
    ka: { file: `${KA}/Food & Travel #16.docx`, title: 'Food & Travel', excerpt: 'გემო და მოგზაურობა — მე-16 ნომრიდან.' },
    hue: 150,
  },
  {
    key: 'food-wine-16',
    category: 'food-and-wine',
    ka: { file: `${KA}/Food & Wine #16 corrected.docx`, title: 'Food & Wine', excerpt: 'კვება და ღვინო — მე-16 ნომრიდან.' },
    hue: 10,
  },
]

async function placeholderCover(label: string, hue: number): Promise<Buffer> {
  const svg = `<svg width="1920" height="1280" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${hue}, 30%, 22%)"/>
      <stop offset="60%" stop-color="hsl(${hue + 12}, 35%, 34%)"/>
      <stop offset="100%" stop-color="hsl(${hue - 8}, 28%, 16%)"/>
    </linearGradient></defs>
    <rect width="1920" height="1280" fill="url(#g)"/>
    <circle cx="1500" cy="320" r="420" fill="hsl(${hue + 20}, 32%, 40%)" opacity="0.3"/>
    <text x="96" y="1180" font-family="Georgia, serif" font-size="52" fill="rgba(255,250,246,0.35)" letter-spacing="8">${label.toUpperCase().slice(0, 26)}</text>
  </svg>`
  return sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toBuffer()
}

async function uploadCover(payload: Payload, item: Item): Promise<number> {
  const alt = item.en?.title ?? item.ka?.title ?? item.key
  const data = item.cover
    ? readFileSync(item.cover)
    : await placeholderCover(item.key.replace(/-/g, ' '), item.hue)
  const media = await payload.create({
    collection: 'media',
    locale: 'en',
    data: { alt },
    file: { data, name: `${item.key}-cover.jpg`, mimetype: 'image/jpeg', size: 0 },
  })
  if (item.ka?.title) {
    await payload.update({ collection: 'media', id: media.id, locale: 'ka', data: { alt: item.ka.title } })
  }
  return media.id as number
}

async function run() {
  const payload = await getPayload({ config })

  const { totalDocs } = await payload.count({ collection: 'articles' })
  if (totalDocs > 1) {
    payload.logger.info('Articles already imported — skipping.')
    process.exit(0)
  }

  const { docs: cats } = await payload.find({ collection: 'categories', limit: 100 })
  const catBySlug = Object.fromEntries(cats.map((c) => [c.slug, c.id]))

  let day = 0
  for (const item of ARTICLES) {
    const categoryId = catBySlug[item.category]
    if (!categoryId) throw new Error(`missing category ${item.category}`)
    const cover = await uploadCover(payload, item)
    const primary = item.en ?? item.ka!
    const primaryLocale = item.en ? 'en' : 'ka'
    const publishedAt = new Date(Date.now() - day * 86400000).toISOString()
    day += 1

    const doc = await payload.create({
      collection: 'articles',
      locale: primaryLocale,
      data: {
        title: primary.title,
        excerpt: primary.excerpt,
        body: lexicalFromParagraphs(parseBody(docxText(primary.file), 1)),
        coverImage: cover,
        category: categoryId,
        publishedAt,
        newsletterSentAt: publishedAt,
        _status: 'published',
      },
      context: { skipNewsletter: true },
    })

    const secondary = item.en && item.ka ? item.ka : null
    if (secondary) {
      await payload.update({
        collection: 'articles',
        id: doc.id,
        locale: 'ka',
        draft: false,
        data: {
          title: secondary.title,
          excerpt: secondary.excerpt,
          body: lexicalFromParagraphs(parseBody(docxText(secondary.file), 1)),
          _status: 'published',
        },
      })
    }
    payload.logger.info(`Imported: ${primary.title}`)
  }

  payload.logger.info(`Imported ${ARTICLES.length} articles.`)
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
