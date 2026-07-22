import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slugField'
import { revalidateArticles, revalidateArticlesDelete } from '@/hooks/revalidate'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status', 'newsletterSentAt'],
    preview: (doc, { locale }) =>
      `/api/preview?slug=${doc?.slug ?? ''}&locale=${locale ?? 'en'}`,
  },
  hooks: {
    afterChange: [revalidateArticles],
    afterDelete: [revalidateArticlesDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 800,
      },
    },
    maxPerDoc: 25,
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { _status: { equals: 'published' } }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: 'Short summary shown on cards, in search results and in the newsletter email.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    slugField('title'),
    {
      name: 'newsletterSend',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '/components/admin/SendNewsletterButton#SendNewsletterButton',
        },
      },
    },
    {
      name: 'newsletterSentAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Set automatically when the newsletter button is used.',
      },
    },
    {
      name: 'review',
      type: 'group',
      admin: {
        description:
          'Fill only when this article reviews a specific wine — enables star rich results in Google.',
      },
      fields: [
        {
          name: 'isReview',
          type: 'checkbox',
          defaultValue: false,
          label: 'This article is a wine review',
        },
        {
          name: 'wineName',
          type: 'text',
          localized: true,
          admin: {
            description: 'Full wine name, e.g. "Nareklishvili Vardisperi Rkatsiteli 2020".',
            condition: (_, siblingData) => Boolean(siblingData?.isReview),
          },
        },
        {
          name: 'rating',
          type: 'number',
          min: 0,
          max: 100,
          admin: {
            description: 'Score on your scale (default scale: 50–100 points).',
            condition: (_, siblingData) => Boolean(siblingData?.isReview),
          },
        },
        {
          name: 'bestRating',
          type: 'number',
          defaultValue: 100,
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.isReview),
          },
        },
        {
          name: 'worstRating',
          type: 'number',
          defaultValue: 50,
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.isReview),
          },
        },
      ],
    },
    {
      name: 'facts',
      type: 'array',
      maxRows: 10,
      labels: { singular: 'Fact', plural: 'Facts' },
      admin: {
        description:
          'Taste profile / quick facts table shown between the cover and the text (e.g. Color — deep pink, Serve at — 10°C).',
      },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'value', type: 'text', required: true, localized: true },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      admin: {
        description: 'Optional overrides. If empty, the title and excerpt are used.',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          localized: true,
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          localized: true,
        },
      ],
    },
  ],
}
