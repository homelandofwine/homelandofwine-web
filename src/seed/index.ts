import { getPayload } from 'payload'
import sharp from 'sharp'

import config from '@/payload.config'
import { lexical } from './lexical'

const ADMIN_EMAIL = 'admin@homelandofwine.local'
const ADMIN_PASSWORD = 'change-me-please'

async function makePlaceholder(label: string, hue: number): Promise<Buffer> {
  const svg = `<svg width="1920" height="1280" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="hsl(${hue}, 45%, 14%)"/>
        <stop offset="60%" stop-color="hsl(${hue + 15}, 55%, 22%)"/>
        <stop offset="100%" stop-color="hsl(${hue - 10}, 40%, 9%)"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="1280" fill="url(#g)"/>
    <circle cx="1500" cy="300" r="420" fill="hsl(${hue + 25}, 50%, 26%)" opacity="0.35"/>
    <circle cx="380" cy="1000" r="520" fill="hsl(${hue - 20}, 45%, 18%)" opacity="0.4"/>
    <text x="96" y="1180" font-family="Georgia, serif" font-size="56" fill="rgba(255,244,230,0.35)" letter-spacing="8">${label.toUpperCase()}</text>
  </svg>`
  return sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toBuffer()
}

async function run() {
  const payload = await getPayload({ config })

  const { totalDocs: userCount } = await payload.count({ collection: 'users' })
  if (userCount === 0) {
    await payload.create({
      collection: 'users',
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    })
    payload.logger.info(`Created admin user ${ADMIN_EMAIL} (password: ${ADMIN_PASSWORD})`)
  }

  const { totalDocs: articleCount } = await payload.count({ collection: 'articles' })
  if (articleCount > 0) {
    payload.logger.info('Articles already exist — skipping content seed.')
    process.exit(0)
  }

  const uploadImage = async (label: string, hue: number, altKa: string, altEn: string) => {
    const media = await payload.create({
      collection: 'media',
      locale: 'ka',
      data: { alt: altKa },
      file: {
        data: await makePlaceholder(label, hue),
        name: `${label.replace(/\s+/g, '-').toLowerCase()}.jpg`,
        mimetype: 'image/jpeg',
        size: 0,
      },
    })
    await payload.update({
      collection: 'media',
      id: media.id,
      locale: 'en',
      data: { alt: altEn },
    })
    return media
  }

  const categoriesSeed = [
    { slug: 'news', ka: 'სიახლეები', en: 'News' },
    { slug: 'wine-guides', ka: 'ღვინის გზამკვლევი', en: 'Wine Guides' },
    { slug: 'regions', ka: 'რეგიონები', en: 'Regions' },
    { slug: 'stories', ka: 'ისტორიები', en: 'Stories' },
  ]
  const categories: Record<string, number> = {}
  for (const c of categoriesSeed) {
    const doc = await payload.create({
      collection: 'categories',
      locale: 'ka',
      data: { name: c.ka, slug: c.slug },
    })
    await payload.update({
      collection: 'categories',
      id: doc.id,
      locale: 'en',
      data: { name: c.en },
    })
    categories[c.slug] = doc.id
  }
  payload.logger.info('Created categories.')

  const articlesSeed = [
    {
      category: 'wine-guides',
      image: { label: 'qvevri', hue: 18 },
      ka: {
        title: 'ქვევრი — 8000 წლის ცოცხალი ტრადიცია',
        excerpt:
          'რატომ რჩება თიხის ქვევრი ქართული მეღვინეობის გულად და როგორ ამზადებენ მასში ღვინოს დღეს.',
        alt: 'მიწაში ჩაფლული თიხის ქვევრები მარანში',
        body: lexical([
          {
            p: 'ქვევრი თიხისგან დამზადებული კვერცხისებრი ფორმის ჭურჭელია, რომელიც მთლიანად მიწაშია ჩაფლული. მასში ღვინო დუღს, მწიფდება და ინახება — ისე, როგორც ეს საქართველოში ათასწლეულების წინ ხდებოდა.',
          },
          { h2: 'როგორ მუშაობს ქვევრი' },
          {
            p: 'მიწა ქვევრს ბუნებრივ, სტაბილურ ტემპერატურას უნარჩუნებს. დურდო — ყურძნის კანი, წიპწა და ზოგჯერ ქლერტიც — ღვინოსთან ერთად რჩება, რაც ქართულ ღვინოს განსაკუთრებულ სხეულს, ფერსა და ტანინებს აძლევს.',
          },
          {
            p: '2013 წელს იუნესკომ ქვევრში ღვინის დაყენების ქართული ტრადიციული მეთოდი არამატერიალური კულტურული მემკვიდრეობის ნუსხაში შეიტანა.',
          },
          { h2: 'რას ნიშნავს ეს დღეს' },
          {
            p: 'დღეს ქვევრის ღვინოებს მსოფლიოს საუკეთესო რესტორნებში შეხვდებით, ხოლო ქვევრის მეთოდს უცხოელი მეღვინეებიც ითვისებენ — ავსტრიიდან ორეგონამდე.',
          },
        ]),
      },
      en: {
        title: 'Qvevri — A Living, 8,000-Year-Old Tradition',
        excerpt:
          'Why the buried clay qvevri remains the heart of Georgian winemaking, and how wine is made in it today.',
        alt: 'Clay qvevri vessels buried in the floor of a Georgian wine cellar',
        body: lexical([
          {
            p: 'A qvevri is an egg-shaped clay vessel buried entirely in the ground. Wine ferments, matures and is stored inside it — just as it was done in Georgia thousands of years ago.',
          },
          { h2: 'How a qvevri works' },
          {
            p: 'The earth keeps the qvevri at a naturally stable temperature. The must — skins, pips and sometimes stems — stays with the wine, giving Georgian wine its distinctive body, colour and tannin.',
          },
          {
            p: 'In 2013, UNESCO inscribed the ancient Georgian traditional qvevri winemaking method on its list of the Intangible Cultural Heritage of Humanity.',
          },
          { h2: 'What it means today' },
          {
            p: 'Today you will find qvevri wines on the lists of the world’s best restaurants, and winemakers from Austria to Oregon are adopting the method for themselves.',
          },
        ]),
      },
    },
    {
      category: 'wine-guides',
      image: { label: 'saperavi', hue: 345 },
      ka: {
        title: 'საფერავი — საქართველოს დიდი წითელი',
        excerpt: 'გაიცანით ჯიში, რომელიც ქართული წითელი ღვინის სინონიმად იქცა.',
        alt: 'მუქი წითელი ღვინო ჭიქაში, ვენახის ფონზე',
        body: lexical([
          {
            p: 'საფერავი საქართველოში ყველაზე გავრცელებული წითელი ჯიშია. მისი სახელი „საღებავს" ნიშნავს — ის იშვიათი ჯიშია, რომლის რბილობიც შეფერილია და არა მხოლოდ კანი.',
          },
          { h2: 'გემო და ხასიათი' },
          {
            p: 'საფერავისგან მუქი, თითქმის შავი ფერის ღვინო დგება — ალუბლის, შავი ქლიავისა და სანელებლების ტონებით, მაღალი მჟავიანობითა და მკვრივი ტანინით. ის ერთნაირად კარგად გრძნობს თავს როგორც ქვევრში, ისე მუხის კასრში.',
          },
          { h2: 'რას მიირთმევთ მასთან' },
          {
            p: 'კლასიკური წყვილია მწვადი და საფერავი. ასევე კარგად უხდება ხაშლამას, ყველს და მუქ შოკოლადს.',
          },
        ]),
      },
      en: {
        title: 'Saperavi — Georgia’s Great Red',
        excerpt: 'Meet the grape that became synonymous with Georgian red wine.',
        alt: 'A glass of deep red wine against a vineyard backdrop',
        body: lexical([
          {
            p: 'Saperavi is Georgia’s most widely planted red variety. Its name means “dye” — it is one of the rare grapes whose flesh is coloured, not just its skin.',
          },
          { h2: 'Taste and character' },
          {
            p: 'Saperavi makes dark, almost black wine — notes of sour cherry, black plum and spice, with high acidity and firm tannin. It is equally at home in a qvevri or an oak barrel.',
          },
          { h2: 'What to eat with it' },
          {
            p: 'The classic pairing is mtsvadi — Georgian grilled pork — but it also loves stews, cheese and dark chocolate.',
          },
        ]),
      },
    },
    {
      category: 'regions',
      image: { label: 'kakheti', hue: 35 },
      ka: {
        title: 'კახეთი — ქართული ღვინის სამშობლო',
        excerpt: 'რეგიონი, სადაც ქართული ღვინის 70% იბადება: ალაზნის ველი, მარნები და ღვინის გზა.',
        alt: 'ალაზნის ველი და კავკasიონის ქედი კახეთში',
        body: lexical([
          {
            p: 'კახეთი საქართველოს უკიდურეს აღმოსავლეთშია და ქვეყნის ღვინის წარმოების დაახლოებით 70%-ს იძლევა. აქ მდებარეობს ცნობილი მიკროზონები: წინანდალი, მუკუზანი, ყვარელი და ნაფარეული.',
          },
          { h2: 'რქაწითელი და ქარვისფერი ღვინო' },
          {
            p: 'კახეთი ქარვისფერი ღვინის სამშობლოა — რქაწითელი, ქისი და ხიხვი ქვევრში კანთან ერთად დუღს და ღვინო ქარვის ფერს იძენს. ეს სტილი დღეს მთელ მსოფლიოშია აღიარებული.',
          },
          { h2: 'ესტუმრეთ' },
          {
            p: 'თბილისიდან ორ საათში შეგიძლიათ სიღნაღის, თელავისა და ალაზნის ველის მარნებს ესტუმროთ — უმეტესობა დეგუსტაციასაც გთავაზობთ.',
          },
        ]),
      },
      en: {
        title: 'Kakheti — The Homeland of Georgian Wine',
        excerpt:
          'The region where 70% of Georgian wine is born: the Alazani Valley, family cellars and the wine route.',
        alt: 'The Alazani Valley with the Caucasus mountains in Kakheti',
        body: lexical([
          {
            p: 'Kakheti lies in Georgia’s far east and produces roughly 70% of the country’s wine. It is home to the famous appellations of Tsinandali, Mukuzani, Kvareli and Napareuli.',
          },
          { h2: 'Rkatsiteli and amber wine' },
          {
            p: 'Kakheti is the homeland of amber wine — Rkatsiteli, Kisi and Khikhvi ferment on their skins in qvevri, taking on a deep amber colour. The style is now celebrated worldwide.',
          },
          { h2: 'Visit' },
          {
            p: 'Two hours from Tbilisi you can tour the cellars of Sighnaghi, Telavi and the Alazani Valley — most offer tastings.',
          },
        ]),
      },
    },
    {
      category: 'news',
      image: { label: 'harvest', hue: 90 },
      ka: {
        title: 'რთველი 2026 — რას ელიან მეღვინეები',
        excerpt: 'წლევანდელი მოსავლის პროგნოზი და ის, რაც რთველს განსაკუთრებულს ხდის.',
        alt: 'ყურძნის კრეფა რთველზე, კალათები ვენახში',
        body: lexical([
          {
            p: 'რთველი საქართველოში მხოლოდ მოსავლის აღება არ არის — ის ოჯახის, მეზობლებisა და მეგობრების დღესასწაულია, რომელიც სექტემბერსა და ოქტომბერში მთელ ქვეყანას მოიცავს.',
          },
          {
            p: 'წელს მეღვინეები კარგ წელიწადს პროგნოზირებენ: მშრალმა ზაფხულმა ყურძენს კონცენტრაცია შემატა, ხოლო აგვისტოს წვიმებმა მჟავიანობა შეინარჩუნა.',
          },
          { h2: 'გაემგზავრეთ რთველზე' },
          {
            p: 'ბევრი მარანი სტუმრებსაც იწვევს რთველში მონაწილეობის მისაღებად — შეგიძლიათ ყურძენი თავად დაკრიფოთ და საწნახელში ჩაყაროთ.',
          },
        ]),
      },
      en: {
        title: 'Rtveli 2026 — What Winemakers Expect',
        excerpt: 'This year’s harvest forecast, and what makes the Georgian rtveli special.',
        alt: 'Grape picking during rtveli, baskets in the vineyard',
        body: lexical([
          {
            p: 'Rtveli, the Georgian harvest, is more than picking grapes — it is a festival of family, neighbours and friends that sweeps the country every September and October.',
          },
          {
            p: 'This year winemakers are forecasting a strong vintage: a dry summer concentrated the fruit, while August rains preserved acidity.',
          },
          { h2: 'Join a harvest' },
          {
            p: 'Many cellars invite guests to take part in rtveli — you can pick grapes yourself and tread them in the satsnakheli, the traditional wine press.',
          },
        ]),
      },
    },
  ]

  for (const a of articlesSeed) {
    const media = await uploadImage(a.image.label, a.image.hue, a.ka.alt, a.en.alt)
    const doc = await payload.create({
      collection: 'articles',
      locale: 'ka',
      draft: false,
      data: {
        title: a.ka.title,
        excerpt: a.ka.excerpt,
        body: a.ka.body,
        coverImage: media.id,
        category: categories[a.category],
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
        title: a.en.title,
        excerpt: a.en.excerpt,
        body: a.en.body,
        _status: 'published',
      },
    })
    payload.logger.info(`Created article: ${a.en.title}`)
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'ka',
    data: {
      siteName: 'Homeland of Wine',
      siteDescription:
        'ბლოგი ქართულ ღვინოზე — ქვევრი, ჯიშები, რეგიონები და ის ადამიანები, ვინც ღვინოს აკეთებენ.',
      socialLinks: {
        twitter: 'https://x.com/homelandofwine',
        instagram: 'https://instagram.com/homelandofwine',
        pinterest: 'https://pinterest.com/homelandofwine',
      },
    },
  })
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      siteName: 'Homeland of Wine',
      siteDescription:
        'A journal of Georgian wine — qvevri, grape varieties, regions and the people who make it.',
    },
  })

  await payload.updateGlobal({
    slug: 'about-page',
    locale: 'ka',
    data: {
      title: 'ჩვენ შესახებ',
      intro:
        'Homeland of Wine არის ბლოგი ღვინის სამშობლოდან — საქართველოდან. ვწერთ ქვევრზე, ჯიშებზე, რეგიონებსა და ადამიანებზე, ვინც ღვინოს აკეთებენ.',
      body: lexical([
        {
          p: 'საქართველოში ღვინოს 8000 წელია აყენებენ — ეს მსოფლიოში უწყვეტი მეღვინეობის ყველაზე ხანგრძლივი ისტორიაა. ჩვენი მიზანია ეს ისტორია მსოფლიოს გავაცნოთ.',
        },
        {
          p: 'აქ ნახავთ გზამკვლევებს ჯიშებზე და რეგიონებზე, სიახლეებს ქართული ღვინის სამყაროდან და ისტორიებს მარნებიდან.',
        },
      ]),
    },
  })
  await payload.updateGlobal({
    slug: 'about-page',
    locale: 'en',
    data: {
      title: 'About Us',
      intro:
        'Homeland of Wine is a journal from the birthplace of wine — Georgia. We write about qvevri, grape varieties, regions and the people who make the wine.',
      body: lexical([
        {
          p: 'Wine has been made in Georgia for 8,000 years — the longest unbroken winemaking history in the world. Our goal is to tell that story to the world.',
        },
        {
          p: 'Here you will find guides to varieties and regions, news from the world of Georgian wine, and stories from the cellars.',
        },
      ]),
    },
  })

  await payload.updateGlobal({
    slug: 'contact-page',
    locale: 'ka',
    data: {
      heading: 'დაგვიკავშირდით',
      intro: 'გაქვთ შეკითხვა, იდეა ან თანამშრომლობის შეთავაზება? მოგვწერეთ.',
    },
  })
  await payload.updateGlobal({
    slug: 'contact-page',
    locale: 'en',
    data: {
      heading: 'Get in Touch',
      intro: 'Have a question, an idea or a partnership proposal? Write to us.',
    },
  })

  payload.logger.info('Seed complete.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
