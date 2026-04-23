import { NextRequest, NextResponse } from 'next/server'
import {
  enforceFormRateLimit,
  forwardToFormspree,
  parseInquirySubmission,
  verifyTurnstileToken,
} from '@/lib/formSecurity'

const DEFAULT_INQUIRY_FORM_ID = 'mvzvobod'

export async function POST(request: NextRequest) {
  try {
    const rateLimit = enforceFormRateLimit(request, 'inquiry')
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many inquiry attempts. Please wait a few minutes and try again.' },
        { status: 429, headers: rateLimit.headers }
      )
    }

    const body = await request.json()
    const turnstileToken = String(body.turnstileToken || '')

    if (!turnstileToken) {
      return NextResponse.json(
        { error: 'Missing spam protection token' },
        { status: 400, headers: rateLimit.headers }
      )
    }

    if (body.website) {
      return NextResponse.json({ error: 'Spam detected' }, { status: 400, headers: rateLimit.headers })
    }

    const submission = parseInquirySubmission(body)
    if (!submission) {
      return NextResponse.json({ error: 'Invalid inquiry payload' }, { status: 400, headers: rateLimit.headers })
    }

    const isValid = await verifyTurnstileToken(request, turnstileToken, 'inquiry')
    if (!isValid) {
      return NextResponse.json(
        { error: 'Spam protection verification failed' },
        { status: 400, headers: rateLimit.headers }
      )
    }

    const formId =
      process.env.FORMSPREE_INQUIRY_FORM_ID ||
      process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID ||
      DEFAULT_INQUIRY_FORM_ID

    const response = await forwardToFormspree(formId, submission)
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to submit inquiry' },
        { status: 502, headers: rateLimit.headers }
      )
    }

    return NextResponse.json({ ok: true }, { headers: rateLimit.headers })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit inquiry' },
      { status: 500 }
    )
  }
}
