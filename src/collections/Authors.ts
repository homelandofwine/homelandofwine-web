import type { CollectionConfig } from 'payload'

import { revalidateArticlesAll } from '@/hooks/revalidate'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'role'],
    description: 'Article authors — no account or login needed, just a name and photo.',
  },
  hooks: {
    afterChange: [revalidateArticlesAll],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Public author name shown with articles.',
      },
    },
    {
      name: 'role',
      type: 'text',
      localized: true,
      admin: {
        description:
          'Public title shown next to the name, e.g. "Wine writer", "Master of Oenology".',
      },
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
      localized: true,
      admin: {
        description:
          'Short author bio shown under articles — mention wine credentials if any (builds trust with readers and Google).',
      },
    },
  ],
}
