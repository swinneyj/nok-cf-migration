import type { NextRequest } from 'next/server'

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const MAX_TURNSTILE_AGE_MS = 10 * 60 * 1000
const FORM_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const FORM_RATE_LIMIT_MAX_REQUESTS = 5

type FormRateLimitScope = 'inquiry' | 'reservation'

interface RateLimitEntry {
  count: number
  resetAt: number
}

const formRateLimitStore = new Map<string, RateLimitEntry>()

function getTurnstileSecretKey() {
  return process.env.TURNSTILE_SECRET_KEY || ''
}

function getForwardedIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (!forwardedFor) return undefined
  return forwardedFor.split(',')[0]?.trim() || undefined
}

function getRateLimitClientId(request: NextRequest) {
  const forwardedIp = getForwardedIp(request)
  if (forwardedIp) {
    return forwardedIp
  }

  const realIp = request.headers.get('x-real-ip')?.trim()
  if (realIp) {
    return realIp
  }

  const userAgent = request.headers.get('user-agent')?.trim() || 'unknown-agent'
  return `ua:${userAgent.slice(0, 120)}`
}

function pruneExpiredRateLimitEntries(now: number) {
  for (const [key, entry] of Array.from(formRateLimitStore.entries())) {
    if (entry.resetAt <= now) {
      formRateLimitStore.delete(key)
    }
  }
}

function buildRateLimitHeaders(limit: number, remaining: number, resetAt: number, retryAfterSeconds?: number) {
  const headers = new Headers({
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(Math.max(remaining, 0)),
    'X-RateLimit-Reset': String(Math.ceil(resetAt / 1000)),
  })

  if (typeof retryAfterSeconds === 'number') {
    headers.set('Retry-After', String(Math.max(retryAfterSeconds, 1)))
  }

  return headers
}

export function enforceFormRateLimit(request: NextRequest, scope: FormRateLimitScope) {
  const now = Date.now()
  pruneExpiredRateLimitEntries(now)

  const clientId = getRateLimitClientId(request)
  const key = `${scope}:${clientId}`
  const existing = formRateLimitStore.get(key)

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + FORM_RATE_LIMIT_WINDOW_MS
    formRateLimitStore.set(key, {
      count: 1,
      resetAt,
    })

    return {
      allowed: true,
      headers: buildRateLimitHeaders(
        FORM_RATE_LIMIT_MAX_REQUESTS,
        FORM_RATE_LIMIT_MAX_REQUESTS - 1,
        resetAt
      ),
    }
  }

  if (existing.count >= FORM_RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil((existing.resetAt - now) / 1000)

    return {
      allowed: false,
      headers: buildRateLimitHeaders(
        FORM_RATE_LIMIT_MAX_REQUESTS,
        0,
        existing.resetAt,
        retryAfterSeconds
      ),
    }
  }

  existing.count += 1
  formRateLimitStore.set(key, existing)

  return {
    allowed: true,
    headers: buildRateLimitHeaders(
      FORM_RATE_LIMIT_MAX_REQUESTS,
      FORM_RATE_LIMIT_MAX_REQUESTS - existing.count,
      existing.resetAt
    ),
  }
}

function getExpectedTurnstileHostnames(request: NextRequest) {
  const configuredHostnames = (process.env.TURNSTILE_ALLOWED_HOSTNAMES || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

  if (configuredHostnames.length > 0) {
    return configuredHostnames
  }

  return [request.nextUrl.hostname.toLowerCase()]
}

function isTurnstileTimestampFresh(challengeTs: unknown) {
  if (typeof challengeTs !== 'string' || !challengeTs) {
    return false
  }

  const timestamp = Date.parse(challengeTs)
  if (Number.isNaN(timestamp)) {
    return false
  }

  return Date.now() - timestamp <= MAX_TURNSTILE_AGE_MS
}

export async function verifyTurnstileToken(
  request: NextRequest,
  token: string,
  expectedAction: string
) {
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

  if (!data?.success) {
    console.warn('[Turnstile] Verification failed', {
      errorCodes: data?.['error-codes'],
      hostname: data?.hostname,
      action: data?.action,
    })
    return false
  }

  const hostname = typeof data?.hostname === 'string' ? data.hostname.toLowerCase() : ''
  const action = typeof data?.action === 'string' ? data.action : ''
  const allowedHostnames = getExpectedTurnstileHostnames(request)

  if (!hostname || !allowedHostnames.includes(hostname)) {
    console.warn('[Turnstile] Hostname mismatch', { hostname, allowedHostnames })
    return false
  }

  if (action && action !== expectedAction) {
    console.warn('[Turnstile] Action mismatch ignored', { action, expectedAction })
  }

  if (!isTurnstileTimestampFresh(data?.challenge_ts)) {
    console.warn('[Turnstile] Challenge timestamp missing or stale', {
      challengeTs: data?.challenge_ts,
    })
    return false
  }

  return true
}

export async function forwardToFormspree(formId: string, payload: object) {
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

function normalizeString(value: unknown, maxLength: number) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim().slice(0, maxLength)
}

function normalizeOptionalString(value: unknown, maxLength: number) {
  const normalized = normalizeString(value, maxLength)
  return normalized || undefined
}

function normalizeInteger(value: unknown, { min = 0, max = 1000 }: { min?: number; max?: number } = {}) {
  const parsed = typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10)
  if (!Number.isFinite(parsed)) {
    return null
  }

  const normalized = Math.trunc(parsed)
  if (normalized < min || normalized > max) {
    return null
  }

  return normalized
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidDateKey(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

export function normalizeComparableName(value: string) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export interface InquirySubmission {
  name: string
  phone: string
  email: string
  event_type?: string
  group_size?: string
  event_date?: string
  message?: string
}

export function parseInquirySubmission(body: unknown): InquirySubmission | null {
  if (!body || typeof body !== 'object') {
    return null
  }

  const source = body as Record<string, unknown>
  const name = normalizeString(source.name, 120)
  const phone = normalizeString(source.phone, 40)
  const email = normalizeString(source.email, 160).toLowerCase()
  const eventDate = normalizeOptionalString(source.event_date, 20)

  if (!name || !phone || !email || !isValidEmail(email)) {
    return null
  }

  if (eventDate && !isValidDateKey(eventDate)) {
    return null
  }

  return {
    name,
    phone,
    email,
    event_type: normalizeOptionalString(source.event_type, 80),
    group_size: normalizeOptionalString(source.group_size, 40),
    event_date: eventDate,
    message: normalizeOptionalString(source.message, 2000),
  }
}

export interface ReservationSubmission {
  venueSlug: string
  eventId: string
  eventDateKey: string
  tableName: string
  tableSection?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  numGuys: number
  numGirls: number
}

export function parseReservationSubmission(body: unknown): ReservationSubmission | null {
  if (!body || typeof body !== 'object') {
    return null
  }

  const source = body as Record<string, unknown>
  const venueSlug = normalizeString(source.venueSlug, 120)
  const eventId = normalizeString(source.eventId, 255)
  const eventDateKey = normalizeString(source.eventDateKey, 20)
  const tableName = normalizeString(source.tableName, 160)
  const firstName = normalizeString(source.firstName, 80)
  const lastName = normalizeString(source.lastName, 80)
  const email = normalizeString(source.email, 160).toLowerCase()
  const phone = normalizeString(source.phone, 40)
  const numGuys = normalizeInteger(source.numGuys, { min: 0, max: 100 })
  const numGirls = normalizeInteger(source.numGirls, { min: 0, max: 100 })

  if (
    !venueSlug ||
    !eventId ||
    !tableName ||
    !firstName ||
    !lastName ||
    !phone ||
    !email ||
    !isValidEmail(email) ||
    !isValidDateKey(eventDateKey) ||
    numGuys === null ||
    numGirls === null
  ) {
    return null
  }

  return {
    venueSlug,
    eventId,
    eventDateKey,
    tableName,
    tableSection: normalizeOptionalString(source.tableSection, 160),
    firstName,
    lastName,
    email,
    phone,
    numGuys,
    numGirls,
  }
}
