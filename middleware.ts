import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self' https://formspree.io",
    "img-src 'self' data: blob: https://images.unsplash.com https://booketing.com https://venueeventartist.com https://www.venueeventartist.com",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com`,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "connect-src 'self' https://formspree.io https://challenges.cloudflare.com",
    "frame-src https://challenges.cloudflare.com",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join('; ')

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  response.headers.set('Content-Security-Policy', csp)

  return response
}

export const config = {
  matcher: [
    {
      source: '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
