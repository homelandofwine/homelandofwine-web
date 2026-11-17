import type { CollectionConfig } from 'payload'

import { revalidateCategories, revalidateCategoriesDelete } from '@/hooks/revalidate'
import { slugify } from '@/lib/slugify'

const RESERVED_SLUGS = [
  'blog',
  'about',
  'contact',
  'search',
  'privacy',
  'unsubscribed',
  'ambassador',
  'n-line-print',
  'ka',
  'en',
  'api',
  'admin',
]

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  hooks: {
    afterChange: [revalidateCategories],
    afterDelete: [revalidateCategoriesDelete],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      validate: (value: string | null | undefined) =>
        value && RESERVED_SLUGS.includes(value)
          ? `"${value}" is reserved by the site and cannot be a category slug`
          : true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL name, e.g. "wine-guides". Leave empty to generate from the name.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (typeof value === 'string' && value.trim() !== '') return slugify(value)
            if (typeof data?.name === 'string' && data.name.trim() !== '') return slugify(data.name)
            return value
          },
        ],
      },
    },
    {
      name: 'banner',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Category cover shown at the top of the category page. Wide images work best, about 2000x700.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Optional intro shown on the category page (also used as its meta description).',
      },
    },
  ],
}
