import type { Field } from 'payload'

import { slugify } from '@/lib/slugify'

export function slugField(sourceField = 'title'): Field {
  return {
    name: 'slug',
    type: 'text',
    localized: true,
    unique: true,
    index: true,
    admin: {
      position: 'sidebar',
      description: 'URL name. Leave empty to generate from the title.',
    },
    hooks: {
      beforeValidate: [
        ({ value, data }) => {
          if (typeof value === 'string' && value.trim() !== '') return slugify(value)
          const source = data?.[sourceField]
          if (typeof source === 'string' && source.trim() !== '') return slugify(source)
          return value
        },
      ],
    },
  }
}
