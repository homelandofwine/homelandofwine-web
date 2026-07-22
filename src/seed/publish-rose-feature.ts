import { readFileSync } from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import sharp from 'sharp'

import config from '@/payload.config'

type Run = { text: string; bold?: boolean }
type Block = { h2?: string; runs?: Run[] }

const HEADING_HINT = /Winery|Marani|მარანი|Kobidzeebis/

function parseArticle(file: string, startMarker: string): Block[] {
  const raw = readFileSync(path.resolve('src/seed/content', file), 'utf8')
  const blocks = raw
    .split(/\n\s*\n/)
    .map((b) => b.split('\n').map((l) => l.trim()).filter(Boolean))
    .filter((lines) => lines.length > 0)

  const startIdx = blocks.findIndex((lines) => lines.join(' ').includes(startMarker))
  if (startIdx === -1) throw new Error(`start marker not found in ${file}`)

  const out: Block[] = []
  for (const lines of blocks.slice(startIdx)) {
    const joined = lines.join(' ')
    if (joined.length < 160 && HEADING_HINT.test(joined) && !joined.includes(':')) {
      out.push({ h2: lines[0].replace(/\s*\.\s*$/, '') })
      const rest = lines.slice(1).join(' ').trim()
      if (rest) out.push({ runs: [{ text: rest, bold: true }] })
      continue
    }
    for (const line of lines) {
      const m = line.match(/^(.{2,80}?):\s+(.+)$/s)
      if (m) {
        out.push({ runs: [{ text: `${m[1]}: `, bold: true }, { text: m[2] }] })
      } else {
        out.push({ runs: [{ text: line }] })
      }
    }
  }
  return out
}

function lexicalFromBlocks(blocks: Block[]) {
  const textNode = (r: Run) => ({
    type: 'text',
    text: r.text,
    detail: 0,
    format: r.bold ? 1 : 0,
    mode: 'normal',
    style: '',
    version: 1,
  })
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1 as const,
      direction: 'ltr' as const,
      children: blocks.map((b) =>
        b.h2 !== undefined
          ? {
              type: 'heading',
              tag: 'h2',
              format: '' as const,
              indent: 0,
              version: 1 as const,
              direction: 'ltr' as const,
              children: [textNode({ text: b.h2 })],
            }
          : {
              type: 'paragraph',
              format: '' as const,
              indent: 0,
              version: 1 as const,
              direction: 'ltr' as const,
              textFormat: 0,
              textStyle: '',
              children: (b.runs ?? []).map(textNode),
            },
      ),
    },
  }
}

async function coverBuffer(): Promise<Buffer> {
  const svg = `<svg width="1920" height="1280" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="hsl(345, 45%, 30%)"/>
        <stop offset="55%" stop-color="hsl(350, 55%, 48%)"/>
        <stop offset="100%" stop-color="hsl(340, 40%, 22%)"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="1280" fill="url(#g)"/>
    <circle cx="1480" cy="330" r="430" fill="hsl(348, 60%, 60%)" opacity="0.35"/>
    <circle cx="420" cy="1010" r="520" fill="hsl(335, 45%, 35%)" opacity="0.4"/>
    <text x="96" y="1180" font-family="Georgia, serif" font-size="56" fill="rgba(255,244,240,0.4)" letter-spacing="8">ROSÉ</text>
  </svg>`
  return sharp(Buffer.from(svg)).jpeg({ quality: 84 }).toBuffer()
}

async function run() {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'articles',
    locale: 'ka',
    where: { title: { contains: 'ვარდისფერი ღვინოები' } },
    limit: 1,
  })
  if (existing.docs.length > 0) {
    payload.logger.info('Rosé feature already exists — skipping.')
    process.exit(0)
  }

  const { docs: cats } = await payload.find({
    collection: 'categories',
    where: { slug: { equals: 'main-feature' } },
    limit: 1,
  })
  if (!cats[0]) throw new Error('main-feature category missing')

  const { readFileSync } = await import('fs')
  const media = await payload.create({
    collection: 'media',
    locale: 'ka',
    data: { alt: 'ვარდისფერი ღვინის ფერები' },
    file: {
      data: readFileSync(
        '/Users/lukaliparteliani/Downloads/ლუკას /3. 4 სლაიდიანი სქროლვადი სექცია/4.jpg',
      ),
      name: 'rose-feature.jpg',
      mimetype: 'image/jpeg',
      size: 0,
    },
  })
  await payload.update({
    collection: 'media',
    id: media.id,
    locale: 'en',
    data: { alt: 'Shades of Georgian rosé wine' },
  })

  const ka = parseArticle('rose-feature-ka.txt', 'დღეს, ღვინის მოყვარულთა')
  const en = parseArticle('rose-feature-en.txt', 'At present, interest')

  const doc = await payload.create({
    collection: 'articles',
    locale: 'ka',
    data: {
      title: 'ქართული ვარდისფერი ღვინოები',
      excerpt:
        'მრავალფეროვანი გამა, ჯიშები, ტრადიციები, ტექნოლოგიები — ამ ნომრის მთავარი თემა ვარდისფერი ღვინოებია.',
      body: lexicalFromBlocks(ka),
      coverImage: media.id,
      category: cats[0].id,
      publishedAt: new Date().toISOString(),
      _status: 'published',
    },
  })
  await payload.update({
    collection: 'articles',
    id: doc.id,
    locale: 'en',
    draft: false,
    data: {
      title: 'Georgian Rosé Wines',
      excerpt:
        'A broad spectrum of styles, varieties, traditions, and techniques — the main feature of this issue of Homeland of Wine.',
      body: lexicalFromBlocks(en),
      _status: 'published',
    },
  })

  payload.logger.info(`Published rosé feature as article ${doc.id}.`)
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
