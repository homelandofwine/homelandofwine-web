import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '@/hooks/revalidate'

export const ArticlesPage: GlobalConfig = {
  slug: 'articles-page',
  label: 'Articles Page',
  admin: {
    group: 'Pages & Settings',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal('articles-page')],
  },
  fields: [
    {
      name: 'banner',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Informational banner image shown at the top of the articles listing.',
      },
    },
    {
      name: 'heading',
      type: 'text',
      localized: true,
      admin: { description: 'Optional heading override for the listing page.' },
    },
  ],
}
