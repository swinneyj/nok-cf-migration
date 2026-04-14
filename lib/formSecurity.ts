import type { NextRequest } from 'next/server'

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

function getTurnstileSecretKey() {
  return process.env.TURNSTILE_SECRET_KEY || process.env.NEXT_PUBLIC_TURNSTILE_SECRET_KEY || ''
}

function getForwardedIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (!forwardedFor) return undefined
  return forwardedFor.split(',')[0]?.trim() || undefined
}

export async function verifyTurnstileToken(request: NextRequest, token: string) {
  const secret = getTurnstileSecretKey()
  if (!secret) {
    throw new Error('Missing TURNSTILE_SECRET_KEY')
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  })

  const remoteIp = getForwardedIp(request)
  if (remoteIp) {
    body.set('remoteip', remoteIp)
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    cache: 'no-store',
  })

  const data = await response.json()
  return Boolean(data?.success)
}

export async function forwardToFormspree(formId: string, payload: Record<string, unknown>) {
  const response = await fetch(`https://formspree.io/f/${formId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  return response
}
