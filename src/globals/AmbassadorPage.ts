import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '@/hooks/revalidate'

function specialPage(slug: string, label: string): GlobalConfig {
  return {
    slug,
    label,
    admin: {
      group: 'Pages & Settings',
    },
    access: {
      read: () => true,
    },
    hooks: {
      afterChange: [revalidateGlobal(slug)],
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
        localized: true,
      },
      {
        name: 'intro',
        type: 'textarea',
        localized: true,
      },
      {
        name: 'logo',
        type: 'upload',
        relationTo: 'media',
        admin: { description: 'Optional logo shown in the page header.' },
      },
      {
        name: 'gallery',
        type: 'array',
        labels: { singular: 'Photo', plural: 'Photos' },
        admin: {
          description:
            'Event photos — visitors can open them in a zoomable gallery. Section stays hidden while empty.',
        },
        fields: [
          { name: 'image', type: 'upload', relationTo: 'media', required: true },
          { name: 'caption', type: 'text', localized: true },
        ],
      },
    ],
  }
}

export const AmbassadorPage = specialPage('ambassador-page', 'Ambassador Page')
export const NLinePrintPage = specialPage('n-line-print-page', 'N Line Print Page')
