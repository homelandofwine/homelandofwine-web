import type { Block, GlobalConfig } from 'payload'

import { revalidateGlobal } from '@/hooks/revalidate'

const headingOverride = {
  name: 'heading',
  type: 'text' as const,
  localized: true,
  admin: { description: 'Optional. Leave empty to use the default heading.' },
}

const Partners: Block = {
  slug: 'partners',
  labels: { singular: 'Partners marquee', plural: 'Partners marquees' },
  fields: [
    headingOverride,
    {
      name: 'partners',
      type: 'array',
      labels: { singular: 'Partner', plural: 'Partners' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'logo', type: 'upload', relationTo: 'media', required: true },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}

const AboutStrip: Block = {
  slug: 'aboutStrip',
  labels: { singular: 'About strip', plural: 'About strips' },
  fields: [headingOverride],
}

const FeaturedSlides: Block = {
  slug: 'featuredSlides',
  labels: { singular: 'Featured slides (pinned)', plural: 'Featured slides (pinned)' },
  fields: [
    {
      name: 'slides',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'caption', type: 'text', localized: true },
        {
          name: 'article',
          type: 'relationship',
          relationTo: 'articles',
          admin: { description: 'Where the slide links (optional).' },
        },
      ],
    },
  ],
}

const MagazineCovers: Block = {
  slug: 'magazineCovers',
  labels: { singular: 'Magazine covers', plural: 'Magazine covers' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'covers',
      type: 'array',
      minRows: 2,
      maxRows: 8,
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
  ],
}

const Stats: Block = {
  slug: 'stats',
  labels: { singular: 'Stats tiles', plural: 'Stats tiles' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true, localized: true },
      ],
    },
  ],
}

const ArticlesGrid: Block = {
  slug: 'articlesGrid',
  labels: { singular: 'Articles grid', plural: 'Articles grids' },
  fields: [
    headingOverride,
    {
      name: 'count',
      type: 'number',
      defaultValue: 6,
      min: 3,
      max: 12,
    },
  ],
}

const Newsletter: Block = {
  slug: 'newsletter',
  labels: { singular: 'Newsletter (sticky heading)', plural: 'Newsletters' },
  fields: [
    {
      name: 'titleLine1',
      type: 'text',
      localized: true,
      admin: { description: 'First line of the giant heading. Empty = default.' },
    },
    {
      name: 'titleLine2',
      type: 'text',
      localized: true,
      admin: { description: 'Second line of the giant heading. Empty = default.' },
    },
    {
      name: 'helperTitle',
      type: 'text',
      localized: true,
      admin: { description: 'Bold line next to the heading. Empty = default.' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: { description: 'Text under the bold line. Empty = default.' },
    },
  ],
}

const Steps: Block = {
  slug: 'steps',
  labels: { singular: 'Numbered steps (stacking)', plural: 'Numbered steps' },
  fields: [
    { name: 'heading', type: 'text', required: true, localized: true },
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'text', type: 'textarea', required: true, localized: true },
      ],
    },
  ],
}

const Testimonials: Block = {
  slug: 'testimonials',
  labels: { singular: 'Quotes carousel', plural: 'Quotes carousels' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'quotes',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'quote', type: 'textarea', required: true, localized: true },
        { name: 'author', type: 'text', required: true },
        { name: 'role', type: 'text', localized: true },
      ],
    },
  ],
}

const Faq: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ accordion', plural: 'FAQ accordions' },
  fields: [
    { name: 'heading', type: 'text', required: true, localized: true },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'question', type: 'text', required: true, localized: true },
        { name: 'answer', type: 'textarea', required: true, localized: true },
      ],
    },
  ],
}

const InfoCards: Block = {
  slug: 'infoCards',
  labels: { singular: 'Info cards', plural: 'Info cards' },
  fields: [
    { name: 'heading', type: 'text', required: true, localized: true },
    {
      name: 'cards',
      type: 'array',
      minRows: 2,
      maxRows: 8,
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'text', type: 'textarea', localized: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

const CtaBand: Block = {
  slug: 'cta',
  labels: { singular: 'CTA band', plural: 'CTA bands' },
  fields: [
    { name: 'heading', type: 'text', required: true, localized: true },
    { name: 'buttonLabel', type: 'text', required: true, localized: true },
    {
      name: 'buttonHref',
      type: 'text',
      required: true,
      admin: { description: 'Where the button leads, e.g. /blog or #newsletter or a full URL.' },
    },
    { name: 'background', type: 'upload', relationTo: 'media' },
  ],
}

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage Sections',
  admin: {
    group: 'Pages & Settings',
    description:
      'Drag to reorder the homepage. The hero (latest article) is always first; every section below it is optional and reorderable.',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal('homepage')],
  },
  fields: [
    {
      name: 'heroVideo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional looping background video for the hero (mp4). Muted autoplay.',
      },
    },
    {
      name: 'heroPoster',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Image shown while the hero video loads (and on slow connections).',
      },
    },
    {
      name: 'sections',
      type: 'blocks',
      blocks: [
        Partners,
        AboutStrip,
        FeaturedSlides,
        MagazineCovers,
        Stats,
        ArticlesGrid,
        Newsletter,
        Steps,
        Testimonials,
        Faq,
        InfoCards,
        CtaBand,
      ],
    },
  ],
}
