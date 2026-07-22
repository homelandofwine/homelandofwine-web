import { getPayload } from 'payload'

import config from '@/payload.config'

async function run() {
  const payload = await getPayload({ config })

  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  if (!settings.metaTitle) {
    await payload.updateGlobal({
      slug: 'site-settings',
      locale: 'ka',
      data: { metaTitle: 'Homeland of Wine — ჟურნალი ქართულ ღვინოზე: ქვევრი, ჯიშები, რეგიონები' },
    })
    await payload.updateGlobal({
      slug: 'site-settings',
      locale: 'en',
      data: {
        metaTitle: 'Homeland of Wine — Georgian Wine Magazine: Qvevri, Varieties, Regions',
      },
    })
    payload.logger.info('Seeded homepage meta titles.')
  }

  const descriptions: Record<string, { ka: string; en: string }> = {
    news: {
      ka: 'სიახლეები ქართული ღვინის სამყაროდან — რთველი, ფესტივალები, ჯილდოები და ინდუსტრიის ამბები.',
      en: 'News from the world of Georgian wine — harvests, festivals, awards and industry stories.',
    },
    'wine-guides': {
      ka: 'გზამკვლევები ქართულ ღვინოზე — ქვევრის ღვინო, საფერავი, რქაწითელი, ქარვისფერი და ვარდისფერი ღვინოები.',
      en: 'Guides to Georgian wine — qvevri wine, Saperavi, Rkatsiteli, amber and rosé styles.',
    },
    regions: {
      ka: 'საქართველოს ღვინის რეგიონები — კახეთი, ქართლი, იმერეთი, რაჭა, გურია და მათი ჯიშები.',
      en: 'Georgian wine regions — Kakheti, Kartli, Imereti, Racha, Guria and their grape varieties.',
    },
    stories: {
      ka: 'ისტორიები ღვინის სამშობლოდან — მეღვინეები, მარნები და 8000-წლიანი ტრადიცია.',
      en: 'Stories from the homeland of wine — winemakers, cellars and an 8,000-year tradition.',
    },
  }

  const { docs: categories } = await payload.find({ collection: 'categories', limit: 100 })
  for (const cat of categories) {
    const d = cat.slug ? descriptions[cat.slug] : undefined
    if (!d || cat.description) continue
    await payload.update({
      collection: 'categories',
      id: cat.id,
      locale: 'ka',
      data: { description: d.ka },
    })
    await payload.update({
      collection: 'categories',
      id: cat.id,
      locale: 'en',
      data: { description: d.en },
    })
    payload.logger.info(`Seeded description for category ${cat.slug}.`)
  }

  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
