import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '@/hooks/revalidate'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Contact Page',
  admin: {
    group: 'Pages & Settings',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal('contact-page')],
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'intro',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Short text above the contact form. Also used as the meta description.',
      },
    },
    {
      name: 'email',
      type: 'text',
      admin: {
        description: 'Public contact email shown on the page (optional).',
      },
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'instagram',
      type: 'text',
      admin: { description: 'Instagram handle or full URL.' },
    },
    {
      name: 'company',
      type: 'text',
      admin: { description: 'Legal name / address line shown on the page.' },
    },
  ],
}
