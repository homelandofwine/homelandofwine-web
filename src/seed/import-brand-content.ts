import { readFileSync } from 'fs'
import { getPayload, type Payload } from 'payload'

import config from '@/payload.config'
import { docxText, lexicalFromParagraphs, parseBody } from './docx'

const BASE = '/Users/lukaliparteliani/Downloads/ლუკას '
const SP =
  '/private/tmp/claude-501/-Users-lukaliparteliani-Documents-homelandofwine-web/f3e5ab6a-47ea-4b4b-8ea9-993a3decf0da/scratchpad/assets'

const MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  mp4: 'video/mp4',
}

async function upload(payload: Payload, path: string, altEn: string, altKa?: string) {
  const ext = path.split('.').pop()!.toLowerCase()
  const name = path.split('/').pop()!.replace(/\s+/g, '-').toLowerCase()
  const media = await payload.create({
    collection: 'media',
    locale: 'en',
    data: { alt: altEn },
    file: { data: readFileSync(path), name, mimetype: MIME[ext] ?? 'application/octet-stream', size: 0 },
  })
  await payload.update({
    collection: 'media',
    id: media.id,
    locale: 'ka',
    data: { alt: altKa ?? altEn },
  })
  return media.id
}

const CATEGORIES = [
  { slug: 'main-feature', en: 'Main Feature', ka: 'მთავარი თემა' },
  { slug: 'grape-varieties', en: 'Grape Varieties', ka: 'ვაზის ჯიშები' },
  { slug: 'producers', en: 'Producers', ka: 'მწარმოებლები' },
  { slug: 'wines', en: 'Wines', ka: 'ღვინოები' },
  { slug: 'food-and-travel', en: 'Food and Travel', ka: 'კვება და მოგზაურობა' },
  { slug: 'food-and-wine', en: 'Food and Wine', ka: 'კვება და ღვინო' },
  { slug: 'events', en: 'Events', ka: 'ღონისძიებები' },
  { slug: 'ambassador', en: 'Ambassador', ka: 'ამბასადორი' },
  { slug: 'n-line-print', en: 'N Line Print', ka: 'N Line Print' },
]

const PARTNER_URLS = [
  'https://www.hs-geisenheim.de', 'https://www.instagram.com/gvino.no/', 'https://kartuli.co.uk',
  'https://wijnhuis-mana.nl', 'https://lepontcaucasien.com', 'https://montecarlogastronomie.com',
  'https://chamamama.com', 'http://www.wine.gov.ge/', 'https://wyndhamhotels.com',
  'https://marriott.com', 'https://hilton.com', 'https://marriott.com', 'https://marriott.com',
  'https://marriott.com', 'https://marriott.com', 'https://bodbehotel.ge', 'https://bazzarhotel.com',
  'https://marriott.com', 'https://gratus.ge', 'https://hilton.com', 'https://dakishvili.ge',
  'https://www.facebook.com/solomnishvili.winery',
  'https://www.facebook.com/profile.php?id=100057078145120',
  'https://www.facebook.com/profile.php?id=61557692527056',
]

const PARTNER_FILES: Record<number, string> = {
  1: '1.svg', 2: '2.png', 3: '3.jpg', 4: '4.webp', 5: '5.jpeg', 6: '6.jpeg', 7: '7.jpeg',
  8: '8.jpeg', 9: '9.png', 10: '10.png', 11: '11.jpeg', 12: '12.png', 13: '13.jpeg', 14: '14.jpeg',
  15: '15.png', 16: '16.jpeg', 17: '17.jpeg', 18: '18.jpeg', 19: '19.jpeg', 20: '20.jpeg',
  21: '21.jpeg', 22: '22.jpeg', 23: '23.jpeg', 24: '24.jpg',
}

const SLIDES = [
  { img: '3. 4 სლაიდიანი სქროლვადი სექცია/1.jpg', en: { t: 'Shaverde — Heritage Continued', c: 'Shaverde’s goals and brand positioning' }, ka: { t: 'შავერდე — მემკვიდრეობის გაგრძელება', c: 'შავერდეს მიზნები და ბრენდის პოზიცია' } },
  { img: '3. 4 სლაიდიანი სქროლვადი სექცია/2.jpg', en: { t: 'White Bunny by Natalia Dakishvili', c: 'Wine as a story' }, ka: { t: 'White Bunny by Natalia Dakishvili', c: 'ღვინო, როგორც ამბავი' } },
  { img: '3. 4 სლაიდიანი სქროლვადი სექცია/3.jpg', en: { t: 'Periphrasis of Rosé Wine', c: 'The Diversity of Georgian Varieties and Rosé Wines' }, ka: { t: 'ვარდისფერი ღვინის პერიფრაზი', c: 'ქართული ჯიშების მრავალფეროვნება და ვარდისფერი ღვინოები' } },
  { img: '3. 4 სლაიდიანი სქროლვადი სექცია/4.jpg', en: { t: 'Georgian Rosé Wines', c: 'A Broad Spectrum of Styles, Varieties, Traditions, and Techniques' }, ka: { t: 'ქართული ვარდისფერი ღვინოები', c: 'მრავალფეროვანი გამა, ჯიშები, ტრადიციები, ტექნოლოგიები' } },
]

const STEPS = [
  { img: `${BASE}/5. 01,02,03,04 სექციისთვის /1.jpg`, en: { t: 'Teliany Valley', x: 'Best Georgian Wine Producer 2026' }, ka: { t: 'Teliany Valley', x: 'საუკეთესო ქართველი მწარმოებელი 2026' } },
  { img: `${BASE}/5. 01,02,03,04 სექციისთვის /2.jpg`, en: { t: '8000 History', x: '8000 years in the hand of one family' }, ka: { t: '8000 ისტორია', x: '8000 წელი ერთი ოჯახის ხელში' } },
  { img: `${BASE}/5. 01,02,03,04 სექციისთვის /3.jpg`, en: { t: 'Shaverde Winery', x: 'Goals and brand positioning' }, ka: { t: 'შავერდეს მარანი', x: 'მიზნები და ბრენდის პოზიცია' } },
  { img: `${SP}/step4.jpg`, en: { t: 'From Dream to Wine', x: 'The Story of Colchian Red Pheasants and Megrelian Ojaleshi at Argvani Cellar' }, ka: { t: 'ოცნებიდან ღვინომდე', x: 'კოლხური წითელი ხოხბებისა და მეგრული ოჯალეშის ისტორია არგვანის მარანში' } },
]

const FAQ = [
  { en: { q: 'About advertising in Homeland of Wine.', a: 'Please write to us about yourself at the following email: homelandofwinemagazine@gmail.com' }, ka: { q: 'Homeland of Wine-ში რეკლამის განთავსების შესახებ.', a: 'გთხოვთ, თქვენს შესახებ მოგვწეროთ შემდეგ მეილზე: homelandofwinemagazine@gmail.com' } },
  { en: { q: 'In how many countries is Homeland of Wine magazine distributed?', a: 'Homeland of Wine is distributed in 15 countries.' }, ka: { q: 'რამდენ ქვეყანაში ვრცელდება ჟურნალი Homeland of Wine?', a: 'Homeland of Wine ვრცელდება 15 ქვეყანაში.' } },
  { en: { q: 'At which locations and events is Homeland of Wine magazine presented?', a: 'Outside the country — at wine festivals and competitions, international wine associations, and wine stores.' }, ka: { q: 'რომელ ლოკაციებსა და ღონისძიებებზე ვრცელდება ჟურნალი Homeland of Wine?', a: 'ქვეყნის გარეთ — ღვინის ფესტივალებსა და კონკურსებზე, ღვინის საერთაშორისო ასოციაციებში, ღვინის მაღაზიებში.' } },
  { en: { q: 'How do I subscribe to Homeland of Wine magazine?', a: 'Click the Subscribe button.' }, ka: { q: 'როგორ გამოვიწეროთ ჟურნალი Homeland of Wine?', a: 'დააჭირეთ ღილაკს Subscribe.' } },
]

const STATS = [
  { value: '500 K+', en: 'Readership', ka: 'მკითხველი' },
  { value: '15 +', en: 'Distribution Area (Countries)', ka: 'გავრცელების არეალი (ქვეყანა)' },
  { value: '100 +', en: 'Wine Festivals & Exhibitions', ka: 'ღვინის ფესტივალი და გამოფენა' },
]

const PRIVACY_EN = [
  { h2: 'What data we collect' },
  { runs: [{ text: 'If you subscribe to our newsletter, we store the email address you provide, the language you were reading the site in, and the date you subscribed. We collect nothing else about you: no analytics profiles, no advertising identifiers, no tracking cookies.' }] },
  { h2: 'How we use it' },
  { runs: [{ text: 'Your email address is used for exactly one purpose: sending you Homeland of Wine articles and, occasionally, magazine news. Every email we send contains a one-click unsubscribe link. Unsubscribing stops all future emails immediately.' }] },
  { h2: 'Cookies' },
  { runs: [{ text: 'This site sets only functional cookies and browser storage that it needs to work: your light/dark theme preference, your cookie-banner choice, and — if you log into the editorial admin — an authentication cookie. None of these track you across other websites.' }] },
  { h2: 'Who processes your data' },
  { runs: [{ text: 'Newsletter emails are delivered through Resend (resend.com), which processes your email address on our behalf. Our website is hosted on infrastructure that may keep standard server logs (IP address, request time) for security purposes.' }] },
  { h2: 'Your rights' },
  { runs: [{ text: 'You may at any time request access to, correction of, or deletion of your data by writing to homelandofwinemagazine@gmail.com. Unsubscribing from the newsletter can be done directly from any email we send.' }] },
  { h2: 'Contact' },
  { runs: [{ text: 'Homeland of Wine Magazine LLC — homelandofwinemagazine@gmail.com' }] },
]

const PRIVACY_KA = [
  { h2: 'რა მონაცემებს ვაგროვებთ' },
  { runs: [{ text: 'თუ გამოიწერთ ჩვენს სიახლეებს, ვინახავთ თქვენს ელფოსტას, საიტის ენას, რომელზეც კითხულობდით, და გამოწერის თარიღს. სხვას არაფერს ვაგროვებთ: არც ანალიტიკურ პროფილებს, არც სარეკლამო იდენტიფიკატორებს, არც თვალთვალის ქუქიებს.' }] },
  { h2: 'როგორ ვიყენებთ' },
  { runs: [{ text: 'თქვენი ელფოსტა გამოიყენება მხოლოდ ერთი მიზნით: Homeland of Wine-ის სტატიებისა და ჟურნალის სიახლეების გასაგზავნად. ყველა წერილს აქვს გამოწერის გაუქმების ღილაკი. გაუქმების შემდეგ წერილები აღარ მოგივათ.' }] },
  { h2: 'ქუქიები' },
  { runs: [{ text: 'საიტი იყენებს მხოლოდ ფუნქციონალურ ქუქიებს: თემის (ღია/მუქი) არჩევანს, ქუქი-ბანერის პასუხს და — რედაქციის ადმინში შესვლისას — ავტორიზაციის ქუქის. არცერთი მათგანი არ გადევნებთ სხვა საიტებზე.' }] },
  { h2: 'ვინ ამუშავებს მონაცემებს' },
  { runs: [{ text: 'სიახლეების წერილებს აგზავნის Resend (resend.com), რომელიც თქვენს ელფოსტას ჩვენი სახელით ამუშავებს. საიტის ჰოსტინგი უსაფრთხოების მიზნით ინახავს სტანდარტულ სერვერის ლოგებს (IP მისამართი, მოთხოვნის დრო).' }] },
  { h2: 'თქვენი უფლებები' },
  { runs: [{ text: 'ნებისმიერ დროს შეგიძლიათ მოითხოვოთ თქვენი მონაცემების ნახვა, შესწორება ან წაშლა მისამართზე homelandofwinemagazine@gmail.com. გამოწერის გაუქმება შესაძლებელია ნებისმიერი წერილიდან.' }] },
  { h2: 'კონტაქტი' },
  { runs: [{ text: 'Homeland of Wine Magazine LLC — homelandofwinemagazine@gmail.com' }] },
]

async function run() {
  const payload = await getPayload({ config })

  const existing = await payload.count({ collection: 'categories' })
  if (existing.totalDocs > 0) {
    payload.logger.info('Categories exist — brand content already imported. Skipping.')
    process.exit(0)
  }

  // 1. Categories
  const catIds: Record<string, number> = {}
  for (const c of CATEGORIES) {
    const doc = await payload.create({
      collection: 'categories',
      locale: 'en',
      data: { name: c.en, slug: c.slug },
    })
    await payload.update({ collection: 'categories', id: doc.id, locale: 'ka', data: { name: c.ka } })
    catIds[c.slug] = doc.id as number
  }
  payload.logger.info(`Created ${CATEGORIES.length} categories.`)

  // 2. Partner logos
  const partners: Array<{ name: string; logo: number; url: string }> = []
  for (let i = 1; i <= 24; i++) {
    const url = PARTNER_URLS[i - 1]
    const name = url.replace(/^https?:\/\/(www\.)?/, '').split(/[/?]/)[0]
    const logo = await upload(
      payload,
      `${BASE}/13. პარტნიორების შესახებ ინფორმაცია და ლოგოები /${PARTNER_FILES[i]}`,
      `${name} logo`,
    )
    partners.push({ name, logo: logo as number, url })
  }
  payload.logger.info('Uploaded 24 partner logos.')

  // 3. Slides / steps / covers / banner / hero media
  const slideMedia: number[] = []
  for (const [i, s] of SLIDES.entries()) {
    slideMedia.push((await upload(payload, `${BASE}/${s.img}`, s.en.t, s.ka.t)) as number)
    void i
  }
  const stepMedia: number[] = []
  for (const s of STEPS) {
    stepMedia.push((await upload(payload, s.img, s.en.t, s.ka.t)) as number)
  }
  const coverMedia: number[] = []
  for (const n of [14, 15, 16]) {
    coverMedia.push(
      (await upload(payload, `${BASE}/4. ჟურნალის ყდისთვის შესაქმნელი სექციისთვის/Cover #${n}.jpg`, `Homeland of Wine Magazine — Cover #${n}`)) as number,
    )
  }
  const bannerId = await upload(
    payload,
    `${BASE}/9. არტიკლების გვერდზე გადასაყვანი ინფორმაციული სახის ბანერი/ნახეთ ყველა სტატია - See all articles.jpg`,
    'See all articles',
    'ნახეთ ყველა სტატია',
  )
  const heroPosterId = await upload(payload, `${BASE}/Hero Banner.jpg`, 'Homeland of Wine — hero')
  const heroVideoId = await upload(payload, `${SP}/hero-video.mp4`, 'Homeland of Wine — video')
  const nlpLogoId = await upload(payload, `${BASE}/N LINE PRINT/ლოგო .png`, 'N Line Print logo')
  payload.logger.info('Uploaded section media, covers, banner, hero video.')

  // 4. Homepage global — order per stakeholder: partners LAST (above footer)
  const heading = (en: string) => en
  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'en',
    data: {
      heroVideo: heroVideoId,
      heroPoster: heroPosterId,
      sections: [
        { blockType: 'aboutStrip' },
        {
          blockType: 'featuredSlides',
          slides: SLIDES.map((s, i) => ({ image: slideMedia[i], title: s.en.t, caption: s.en.c })),
        },
        {
          blockType: 'steps',
          heading: heading('In this issue'),
          items: STEPS.map((s, i) => ({ image: stepMedia[i], title: s.en.t, text: s.en.x })),
        },
        { blockType: 'stats', items: STATS.map((s) => ({ value: s.value, label: s.en })) },
        { blockType: 'magazineCovers', heading: 'The Magazine', covers: coverMedia.map((image) => ({ image })) },
        { blockType: 'articlesGrid', count: 6 },
        { blockType: 'faq', heading: 'Frequently Asked Questions', items: FAQ.map((f) => ({ question: f.en.q, answer: f.en.a })) },
        { blockType: 'newsletter' },
        { blockType: 'partners', partners },
      ],
    },
  })
  // localized text pass (ka)
  const hp = await payload.findGlobal({ slug: 'homepage', depth: 0 })
  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'ka',
    data: {
      sections: (hp.sections ?? []).map((s) => {
        if (s.blockType === 'featuredSlides') {
          return { ...s, slides: (s.slides ?? []).map((sl, i) => ({ ...sl, title: SLIDES[i].ka.t, caption: SLIDES[i].ka.c })) }
        }
        if (s.blockType === 'steps') {
          return { ...s, heading: 'ამ ნომერში', items: (s.items ?? []).map((it, i) => ({ ...it, title: STEPS[i].ka.t, text: STEPS[i].ka.x })) }
        }
        if (s.blockType === 'stats') {
          return { ...s, items: (s.items ?? []).map((it, i) => ({ ...it, label: STATS[i].ka })) }
        }
        if (s.blockType === 'magazineCovers') {
          return { ...s, heading: 'ჟურნალი' }
        }
        if (s.blockType === 'faq') {
          return { ...s, heading: 'ხშირად დასმული კითხვები', items: (s.items ?? []).map((it, i) => ({ ...it, question: FAQ[i].ka.q, answer: FAQ[i].ka.a })) }
        }
        return s
      }),
    },
  })
  payload.logger.info('Homepage sections configured (partners above footer).')

  // 5. Articles page banner
  await payload.updateGlobal({ slug: 'articles-page', locale: 'en', data: { banner: bannerId } })

  // 6. About: section texts → settings + about page full text
  const aboutSection = docxText(`${BASE}/2. ჩვენ შესახებ სექცია.docx`)
  const aboutParas = aboutSection.split('\n').map((l) => l.trim()).filter(Boolean)
  const enSectionText = aboutParas[0]
  const kaSectionIdx = aboutParas.findIndex((p) => p.startsWith('Homeland of Wine Magazine - გამოცემა'))
  const kaSectionText = aboutParas[kaSectionIdx]

  const aboutEn = docxText(`${BASE}/16. ჩვენ შესახებ/16 ENG.docx`)
  const aboutKa = docxText(`${BASE}/16. ჩვენ შესახებ/16 GEO.docx`)

  await payload.updateGlobal({
    slug: 'about-page',
    locale: 'en',
    data: {
      title: 'About Us',
      intro: enSectionText,
      body: lexicalFromParagraphs(parseBody(aboutEn)),
    },
  })
  await payload.updateGlobal({
    slug: 'about-page',
    locale: 'ka',
    data: {
      title: 'ჩვენ შესახებ',
      intro: kaSectionText,
      body: lexicalFromParagraphs(parseBody(aboutKa)),
    },
  })

  // 7. Site settings
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      siteName: 'Homeland of Wine',
      siteDescription: enSectionText,
      metaTitle: 'Homeland of Wine — Georgian Wine Magazine: Qvevri, Varieties, Producers',
      footerTagline: 'The story of Georgian wine, told from its homeland',
      socialLinks: { instagram: 'https://instagram.com/homelandofwinemagazine' },
    },
  })
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'ka',
    data: {
      siteName: 'Homeland of Wine',
      siteDescription: kaSectionText,
      metaTitle: 'Homeland of Wine — ჟურნალი ქართულ ღვინოზე: ქვევრი, ჯიშები, მწარმოებლები',
      footerTagline: 'ქართული ღვინის ისტორია — ღვინის სამშობლოდან',
    },
  })

  // 8. Contact
  await payload.updateGlobal({
    slug: 'contact-page',
    locale: 'en',
    data: {
      heading: 'Contact Us',
      intro: null,
      email: 'homelandofwinemagazine@gmail.com',
      phone: '555 182 484',
      instagram: 'homelandofwinemagazine',
      company: 'Homeland of Wine Magazine LLC',
    },
  })
  await payload.updateGlobal({
    slug: 'contact-page',
    locale: 'ka',
    data: { heading: 'დაგვიკავშირდით' },
  })

  // 9. Ambassador + N Line Print pages
  await payload.updateGlobal({ slug: 'ambassador-page', locale: 'en', data: { title: 'Ambassador' } })
  await payload.updateGlobal({ slug: 'ambassador-page', locale: 'ka', data: { title: 'ამბასადორი' } })
  await payload.updateGlobal({
    slug: 'n-line-print-page',
    locale: 'en',
    data: { title: 'N Line Print', logo: nlpLogoId },
  })
  await payload.updateGlobal({ slug: 'n-line-print-page', locale: 'ka', data: { title: 'N Line Print' } })

  // 10. Privacy
  await payload.updateGlobal({
    slug: 'privacy-page',
    locale: 'en',
    data: { title: 'Privacy Policy', body: lexicalFromParagraphs(PRIVACY_EN) },
  })
  await payload.updateGlobal({
    slug: 'privacy-page',
    locale: 'ka',
    data: { title: 'კონფიდენციალურობის პოლიტიკა', body: lexicalFromParagraphs(PRIVACY_KA) },
  })

  payload.logger.info('Brand content import complete.')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
