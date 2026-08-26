import type { Field, FieldHook } from 'payload'

import { slugify } from '@/lib/slugify'

function normalize(sourceField: string): FieldHook {
  return ({ value, data }) => {
    if (typeof value === 'string' && value.trim() !== '') return slugify(value)
    const source = data?.[sourceField]
    if (typeof source === 'string' && source.trim() !== '') return slugify(source)
    return value
  }
}

const copySuffix = (v: unknown) => (typeof v === 'string' && v ? slugify(`${v}-copy`) : v)

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
      beforeValidate: [normalize(sourceField)],
      beforeChange: [normalize(sourceField)],
      beforeDuplicate: [
        ({ value }) =>
          value && typeof value === 'object'
            ? Object.fromEntries(
                Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, copySuffix(v)]),
              )
            : copySuffix(value),
      ],
    },
  }
}
