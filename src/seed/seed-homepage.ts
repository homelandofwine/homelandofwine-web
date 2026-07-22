import { getPayload } from 'payload'

import config from '@/payload.config'

async function run() {
  const payload = await getPayload({ config })

  const current = await payload.findGlobal({ slug: 'homepage', depth: 0 })
  if (current.sections && current.sections.length > 0) {
    payload.logger.info('Homepage sections already configured — skipping.')
    process.exit(0)
  }

  const ka = {
    sections: [
      { blockType: 'partners' as const },
      { blockType: 'aboutStrip' as const },
      { blockType: 'featuredSlides' as const, count: 4 },
      {
        blockType: 'steps' as const,
        heading: 'როგორ ვმუშაობთ',
        items: [
          {
            title: 'ვსტუმრობთ მარნებს',
            text: 'ყოველი ნომრისთვის ვსტუმრობთ მეღვინეებს მთელი საქართველოს მასშტაბით და ვსინჯავთ ღვინოებს ადგილზე.',
          },
          {
            title: 'ვესაუბრებით ექსპერტებს',
            text: 'ენოლოგები, ამპელოგრაფები და სომელიეები განიხილავენ თითოეულ თემას მრგვალ მაგიდასთან.',
          },
          {
            title: 'ვწერთ ორ ენაზე',
            text: 'ყველა სტატია ქვეყნდება ქართულად და ინგლისურად — საქართველოსა და მსოფლიოსთვის.',
          },
          {
            title: 'ვაზიარებთ ისტორიას',
            text: 'ღვინის სამშობლოს ამბები ყოველთვიურად მკითხველის ინბოქსშიც ხვდება.',
          },
        ],
      },
      {
        blockType: 'testimonials' as const,
        heading: 'რას ამბობენ ჩვენზე',
        quotes: [
          {
            quote:
              'ეს გამოცემა ქართული ღვინის სამყაროს ისე აღწერს, როგორც აქამდე არავის გაუკეთებია.',
            author: 'დემო ციტატა',
            role: 'შეცვალეთ ადმინ პანელიდან',
          },
          {
            quote: 'ყოველი ნომერი ღვინის კულტურის ნამდვილი ენციკლოპედიაა.',
            author: 'მეორე დემო ციტატა',
            role: 'შეცვალეთ ადმინ პანელიდან',
          },
        ],
      },
      { blockType: 'articlesGrid' as const, count: 6 },
      {
        blockType: 'faq' as const,
        heading: 'ხშირად დასმული კითხვები',
        items: [
          {
            question: 'როგორ გამოვიწერო ჟურნალი?',
            answer:
              'დატოვეთ ელფოსტა გამოწერის ფორმაში და ყოველი ახალი სტატია პირდაპირ ინბოქსში მოგივათ.',
          },
          {
            question: 'ვისთვის არის Homeland of Wine?',
            answer:
              'ყველასთვის, ვისაც ქართული ღვინო აინტერესებს — დამწყებიდან პროფესიონალამდე.',
          },
        ],
      },
      {
        blockType: 'cta' as const,
        heading: 'აღმოაჩინე ღვინის სამშობლო',
        buttonLabel: 'წაიკითხე ბლოგი',
        buttonHref: '/blog',
      },
      { blockType: 'newsletter' as const },
    ],
  }

  const updated = await payload.updateGlobal({ slug: 'homepage', locale: 'ka', data: ka })

  const sections = updated.sections ?? []
  const findId = (type: string) => sections.find((s) => s.blockType === type)?.id
  const stepsId = findId('steps')
  const testimonialsId = findId('testimonials')
  const faqId = findId('faq')
  const ctaId = findId('cta')

  const en = {
    sections: sections.map((s) => {
      if (s.blockType === 'steps' && s.id === stepsId) {
        return {
          ...s,
          heading: 'How we work',
          items: (s.items ?? []).map((item, i) => ({
            ...item,
            title: [
              'We visit the cellars',
              'We talk to the experts',
              'We write in two languages',
              'We share the story',
            ][i],
            text: [
              'For every issue we travel to winemakers across Georgia and taste at the source.',
              'Oenologists, ampelographers and sommeliers debate each topic at a round table.',
              'Every article is published in Georgian and English — for Georgia and the world.',
              'Stories from the homeland of wine also land in your inbox.',
            ][i],
          })),
        }
      }
      if (s.blockType === 'testimonials' && s.id === testimonialsId) {
        return {
          ...s,
          heading: 'What readers say',
          quotes: (s.quotes ?? []).map((q, i) => ({
            ...q,
            quote: [
              'This magazine captures the world of Georgian wine like nothing before it.',
              'Every issue is a true encyclopedia of wine culture.',
            ][i],
            role: 'Edit this in the admin panel',
          })),
        }
      }
      if (s.blockType === 'faq' && s.id === faqId) {
        return {
          ...s,
          heading: 'Frequently asked questions',
          items: (s.items ?? []).map((item, i) => ({
            ...item,
            question: ['How do I subscribe?', 'Who is Homeland of Wine for?'][i],
            answer: [
              'Leave your email in the subscribe form and every new article lands in your inbox.',
              'Everyone curious about Georgian wine — from beginners to professionals.',
            ][i],
          })),
        }
      }
      if (s.blockType === 'cta' && s.id === ctaId) {
        return { ...s, heading: 'Discover the homeland of wine', buttonLabel: 'Read the blog' }
      }
      return s
    }),
  }

  await payload.updateGlobal({ slug: 'homepage', locale: 'en', data: en })

  payload.logger.info(`Homepage seeded with ${sections.length} sections in Stoop order.`)
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
