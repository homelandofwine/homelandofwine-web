import { AboutStrip } from '@/components/sections/AboutStrip'
import { ArticlesGridSection } from '@/components/sections/ArticlesGridSection'
import { CtaBand } from '@/components/sections/CtaBand'
import { Faq } from '@/components/sections/Faq'
import { FeaturedSlides } from '@/components/home/FeaturedSlides'
import { InfoCards } from '@/components/sections/InfoCards'
import { MagazineCovers } from '@/components/sections/MagazineCovers'
import { NewsletterSticky } from '@/components/sections/NewsletterSticky'
import { PartnersMarquee } from '@/components/sections/PartnersMarquee'
import { StatsTiles } from '@/components/sections/StatsTiles'
import { Steps } from '@/components/sections/Steps'
import { Testimonials } from '@/components/sections/Testimonials'
import type { Locale } from '@/i18n/routing'
import type { AboutPage, Article, Homepage, SiteSetting } from '@/payload-types'

type Section = NonNullable<Homepage['sections']>[number]

export function SectionRenderer({
  sections,
  locale,
  articles,
  settings,
  about,
}: {
  sections: Section[]
  locale: Locale
  articles: Article[]
  settings: SiteSetting
  about: AboutPage
}) {
  return sections.map((block, i) => {
    const key = block.id ?? `${block.blockType}-${i}`
    switch (block.blockType) {
      case 'partners':
        return (
          <PartnersMarquee
            key={key}
            locale={locale}
            partners={block.partners ?? []}
            heading={block.heading}
          />
        )
      case 'aboutStrip':
        return (
          <AboutStrip
            key={key}
            locale={locale}
            settings={settings}
            about={about}
            heading={block.heading}
          />
        )
      case 'featuredSlides':
        return <FeaturedSlides key={key} slides={block.slides ?? []} />
      case 'magazineCovers':
        return <MagazineCovers key={key} heading={block.heading} covers={block.covers ?? []} />
      case 'stats':
        return <StatsTiles key={key} heading={block.heading} items={block.items ?? []} />
      case 'articlesGrid':
        return (
          <ArticlesGridSection
            key={key}
            locale={locale}
            articles={articles.slice(0, block.count ?? 6)}
            heading={block.heading}
          />
        )
      case 'newsletter':
        return (
          <NewsletterSticky
            key={key}
            locale={locale}
            titleLine1={block.titleLine1}
            titleLine2={block.titleLine2}
            helperTitle={block.helperTitle}
            description={block.description}
          />
        )
      case 'steps':
        return <Steps key={key} heading={block.heading} items={block.items ?? []} />
      case 'testimonials':
        return <Testimonials key={key} heading={block.heading} quotes={block.quotes ?? []} />
      case 'faq':
        return <Faq key={key} heading={block.heading} items={block.items ?? []} />
      case 'infoCards':
        return <InfoCards key={key} heading={block.heading} cards={block.cards ?? []} />
      case 'cta':
        return (
          <CtaBand
            key={key}
            heading={block.heading}
            buttonLabel={block.buttonLabel}
            buttonHref={block.buttonHref}
            background={block.background}
          />
        )
      default:
        return null
    }
  })
}

export const DEFAULT_SECTIONS: Section[] = [
  { blockType: 'aboutStrip' },
  { blockType: 'articlesGrid', count: 6 },
  { blockType: 'newsletter' },
]
