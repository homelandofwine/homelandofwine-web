import type { CollectionConfig } from 'payload'

import { revalidateArticlesAll } from '@/hooks/revalidate'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'role'],
    description:
      'Article authors — no account or login needed. English and Georgian fields sit side by side; Georgian falls back to English when empty.',
  },
  hooks: {
    afterChange: [revalidateArticlesAll],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Name (English)',
          required: true,
        },
        {
          name: 'nameKa',
          type: 'text',
          label: 'Name (Georgian)',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'role',
          type: 'text',
          label: 'Role (English)',
          admin: {
            description: 'e.g. "Wine writer", "Master of Oenology".',
          },
        },
        {
          name: 'roleKa',
          type: 'text',
          label: 'Role (Georgian)',
        },
      ],
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Author photo — shown in bylines. Square images work best.',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Bio (English)',
      admin: {
        description: 'Short author bio shown under articles.',
      },
    },
    {
      name: 'bioKa',
      type: 'textarea',
      label: 'Bio (Georgian)',
    },
  ],
}
