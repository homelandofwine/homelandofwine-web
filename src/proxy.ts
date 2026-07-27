import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'

import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

function equals(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

function authorized(request: NextRequest, password: string) {
  const header = request.headers.get('authorization')
  if (!header?.startsWith('Basic ')) return false
  let decoded: string
  try {
    decoded = atob(header.slice(6))
  } catch {
    return false
  }
  const separator = decoded.indexOf(':')
  return separator !== -1 && equals(decoded.slice(separator + 1), password)
}

export default function proxy(request: NextRequest) {
  // SITE_PASSWORD (Vercel env var) keeps the site private while it is being finished —
  // remove the variable and redeploy to open it to the public.
  const password = process.env.SITE_PASSWORD
  if (password && !authorized(request, password)) {
    return new NextResponse('Authentication required.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Homeland of Wine Magazine", charset="UTF-8"',
        'Cache-Control': 'no-store',
      },
    })
  }
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/',
    '/(ka|en)/:path*',
    '/rss.xml',
    '/((?!api|admin|_next|_vercel|.*\\..*).*)',
  ],
}
