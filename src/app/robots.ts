import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  // SITE_NOINDEX (Vercel env var) hides the whole site from search engines
  // until launch — remove the variable and redeploy to go public.
  if (process.env.SITE_NOINDEX) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/'],
    },
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/news-sitemap.xml`],
  }
}
