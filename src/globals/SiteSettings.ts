import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '@/hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Pages & Settings',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal('settings')],
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Homeland of Wine',
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: 'Used as the default meta description and in the footer.',
      },
    },
    {
      name: 'metaTitle',
      type: 'text',
      localized: true,
      admin: {
        description:
          'Homepage title shown in Google results and the browser tab. Include your main keywords, e.g. "Homeland of Wine — Georgian Wine Magazine". Empty = site name only.',
      },
    },
    {
      name: 'footerTagline',
      type: 'text',
      localized: true,
      admin: {
        description: 'Large line in the footer. Leave empty to use the default.',
      },
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'twitter', type: 'text', admin: { description: 'Full URL, e.g. https://x.com/…' } },
        { name: 'instagram', type: 'text' },
        { name: 'pinterest', type: 'text' },
      ],
    },
    {
      name: 'defaultOgImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Fallback social-share image for pages without their own.',
      },
    },
    {
      name: 'footerImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Wide image shown at the very bottom of the footer (optional).',
      },
    },
  ],
}
