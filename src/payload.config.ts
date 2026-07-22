import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Articles } from './collections/Articles'
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Subscribers } from './collections/Subscribers'
import { Users } from './collections/Users'
import { AboutPage } from './globals/AboutPage'
import { AmbassadorPage, NLinePrintPage } from './globals/AmbassadorPage'
import { ArticlesPage } from './globals/ArticlesPage'
import { ContactPage } from './globals/ContactPage'
import { Homepage } from './globals/Homepage'
import { PrivacyPage } from './globals/PrivacyPage'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Homeland of Wine',
    },
  },
  localization: {
    locales: [
      { code: 'en', label: 'English' },
      { code: 'ka', label: 'ქართული' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  collections: [Articles, Categories, Media, Subscribers, Users],
  globals: [
    SiteSettings,
    Homepage,
    ArticlesPage,
    AboutPage,
    ContactPage,
    AmbassadorPage,
    NLinePrintPage,
    PrivacyPage,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    push: process.env.PAYLOAD_DB_PUSH !== 'false',
  }),
  sharp,
  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: { media: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
})
