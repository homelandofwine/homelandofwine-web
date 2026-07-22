import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    description:
      'Upload images at least 1600px wide — Google Discover requires 1200px+ for large previews.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Describe the image for screen readers and search engines.',
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'video/mp4', 'video/quicktime', 'video/webm'],
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 480,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        position: 'centre',
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
      },
    ],
  },
}
