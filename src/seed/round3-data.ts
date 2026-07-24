import { getPayload, type Payload } from 'payload'

import config from '@/payload.config'

const NEW_CATEGORIES = [
  { slug: 'wine-regions', en: 'Wine Regions', ka: 'ღვინის რეგიონები' },
  {
    slug: 'georgian-wine-in-foreign-market',
    en: 'Georgian Wine in Foreign Market',
    ka: 'ქართული ღვინო უცხოურ ბაზარზე',
  },
]

const SOCIALS = {
  instagram: 'https://www.instagram.com/homelandofwinemagazine/',
  twitter: 'https://x.com/HomelandOf3857',
  pinterest: 'https://www.pinterest.com/homelandofwinemagazine/',
}

type LexicalNode = {
  type?: string
  text?: string
  children?: LexicalNode[]
}

function paragraphText(node: LexicalNode): string {
  if (node.type === 'text') return node.text ?? ''
  return (node.children ?? []).map(paragraphText).join('')
}

function matchesLocale(text: string, locale: 'en' | 'ka'): boolean {
  const georgian = (text.match(/[\u10D0-\u10FF]/g) ?? []).length
  return locale === 'ka' ? georgian > text.length * 0.3 : georgian < text.length * 0.1
}

function excerptFromBody(
  body: { root?: LexicalNode } | null | undefined,
  locale: 'en' | 'ka',
): string | null {
  const children = body?.root?.children ?? []
  const paragraphs = children
    .filter((c) => c.type === 'paragraph')
    .map((c) => paragraphText(c).trim())
    .filter((t) => t.length > 140 && t.includes('.') && matchesLocale(t, locale))
  if (paragraphs.length === 0) return null

  const source = paragraphs.slice(0, 2).join(' ')
  const sentences = source.split(/(?<=[.!?…])\s+/).filter(Boolean)
  const out: string[] = []
  let len = 0
  for (const s of sentences) {
    out.push(s)
    len += s.length
    if (out.length >= 3 || (out.length >= 2 && len >= 160)) break
  }
  if (out.length < 2 && sentences.length > out.length) out.push(sentences[out.length])
  const result = out.join(' ').trim()
  return result.length >= 60 ? result : null
}

async function updateExcerpts(payload: Payload) {
  const { docs } = await payload.find({
    collection: 'articles',
    locale: 'all',
    depth: 0,
    limit: 100,
    select: { slug: true },
    where: { _status: { equals: 'published' } },
  })

  for (const doc of docs) {
    const slugs = doc.slug as unknown as { en?: string | null; ka?: string | null } | null
    for (const locale of ['en', 'ka'] as const) {
      if (!slugs?.[locale]) continue
      const article = await payload.findByID({
        collection: 'articles',
        id: doc.id,
        locale,
        depth: 0,
        fallbackLocale: false,
      })
      const excerpt = excerptFromBody(article.body as { root?: LexicalNode } | null, locale)
      if (!excerpt) {
        payload.logger.warn(`no excerpt derived: article ${doc.id} [${locale}]`)
        continue
      }
      await payload.update({
        collection: 'articles',
        id: doc.id,
        locale,
        draft: false,
        data: { excerpt },
        context: { skipNewsletter: true },
      })
      payload.logger.info(`excerpt [${locale}] #${doc.id}: ${excerpt.slice(0, 70)}…`)
    }
  }
}

async function linkSteps(payload: Payload) {
  const homepage = await payload.findGlobal({ slug: 'homepage', depth: 0 })
  const sections = (homepage.sections ?? []) as Array<Record<string, unknown>>
  const stepsBlock = sections.find((s) => s.blockType === 'steps') as
    | { items?: Array<{ title?: string | null; article?: number | null }> }
    | undefined
  if (!stepsBlock?.items) {
    payload.logger.warn('no steps block found')
    return
  }

  const bySlug: Record<string, string> = {
    shaverde: 'shaverde-heritage-continued',
    argvani: 'from-dream-to-wine-argvani-cellar',
  }
  let changed = false
  for (const item of stepsBlock.items) {
    const key = Object.keys(bySlug).find((k) => (item.title ?? '').toLowerCase().includes(k))
    if (!key || item.article) continue
    const { docs } = await payload.find({
      collection: 'articles',
      locale: 'en',
      limit: 1,
      depth: 0,
      where: { slug: { equals: bySlug[key] } },
    })
    if (docs[0]) {
      item.article = docs[0].id as number
      changed = true
      payload.logger.info(`step "${item.title}" → article ${docs[0].id}`)
    }
  }
  if (changed) {
    await payload.updateGlobal({ slug: 'homepage', data: { sections: homepage.sections } })
  }
}

async function run() {
  const payload = await getPayload({ config })

  for (const cat of NEW_CATEGORIES) {
    const { docs } = await payload.find({
      collection: 'categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
    })
    if (docs[0]) {
      payload.logger.info(`category exists: ${cat.slug}`)
      continue
    }
    const doc = await payload.create({
      collection: 'categories',
      locale: 'en',
      data: { name: cat.en, slug: cat.slug },
    })
    await payload.update({
      collection: 'categories',
      id: doc.id,
      locale: 'ka',
      data: { name: cat.ka },
    })
    payload.logger.info(`category created: ${cat.slug}`)
  }

  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  await payload.updateGlobal({
    slug: 'site-settings',
    data: { socialLinks: { ...(settings.socialLinks ?? {}), ...SOCIALS } },
  })
  payload.logger.info('social links set')

  await payload.updateGlobal({
    slug: 'ambassador-page',
    locale: 'en',
    data: { title: 'Wine Ambassadors' },
  })
  await payload.updateGlobal({
    slug: 'ambassador-page',
    locale: 'ka',
    data: { title: 'ღვინის ამბასადორები' },
  })
  payload.logger.info('ambassador page title updated')

  await linkSteps(payload)
  await updateExcerpts(payload)

  payload.logger.info('Round 3 data complete.')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
