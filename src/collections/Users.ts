import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'System',
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      admin: {
        description: 'Public author name shown with articles (never the email).',
      },
    },
    {
      name: 'role',
      type: 'text',
      localized: true,
      admin: {
        description: 'Public title shown next to the name, e.g. "Wine writer", "Master of Oenology".',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Author photo — shown as a small circle in bylines. Square images work best.',
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
