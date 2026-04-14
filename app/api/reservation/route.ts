import { NextRequest, NextResponse } from 'next/server'
import { forwardToFormspree, verifyTurnstileToken } from '@/lib/formSecurity'

const DEFAULT_RESERVATION_FORM_ID = 'mvzvobod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const turnstileToken = String(body.turnstileToken || '')

    if (!turnstileToken) {
      return NextResponse.json({ error: 'Missing spam protection token' }, { status: 400 })
    }

    if (body.website) {
      return NextResponse.json({ error: 'Spam detected' }, { status: 400 })
    }

    const isValid = await verifyTurnstileToken(request, turnstileToken)
    if (!isValid) {
      return NextResponse.json({ error: 'Spam protection verification failed' }, { status: 400 })
    }

    const formId =
      process.env.FORMSPREE_RESERVATION_FORM_ID ||
      process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID ||
      DEFAULT_RESERVATION_FORM_ID

    const { turnstileToken: _turnstileToken, website: _website, ...payload } = body

    const response = await forwardToFormspree(formId, payload)
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to submit reservation' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit reservation' },
      { status: 500 }
    )
  }
}
