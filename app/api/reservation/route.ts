import { NextRequest, NextResponse } from 'next/server'
import { getEventByEventId, getSectionsForEvent } from '@/lib/db/client'
import {
  enforceFormRateLimit,
  forwardToFormspree,
  parseReservationSubmission,
  verifyTurnstileToken,
} from '@/lib/formSecurity'

const DEFAULT_RESERVATION_FORM_ID = 'mvzvobod'

export async function POST(request: NextRequest) {
  try {
    const rateLimit = enforceFormRateLimit(request, 'reservation')
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many reservation attempts. Please wait a few minutes and try again.' },
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

    const submission = parseReservationSubmission(body)
    if (!submission) {
      return NextResponse.json(
        { error: 'Invalid reservation payload' },
        { status: 400, headers: rateLimit.headers }
      )
    }

    const totalGuests = submission.numGuys + submission.numGirls
    if (totalGuests <= 0) {
      return NextResponse.json(
        { error: 'Guest count must be at least 1' },
        { status: 400, headers: rateLimit.headers }
      )
    }

    const isValid = await verifyTurnstileToken(request, turnstileToken, 'reservation')
    if (!isValid) {
      return NextResponse.json(
        { error: 'Spam protection verification failed' },
        { status: 400, headers: rateLimit.headers }
      )
    }

    const event = await getEventByEventId(submission.eventId)
    if (!event || event.venue_id !== submission.venueSlug) {
      return NextResponse.json(
        { error: 'Reservation event could not be verified' },
        { status: 400, headers: rateLimit.headers }
      )
    }

    const sections = await getSectionsForEvent(submission.eventId)
    const matchingSection = sections.find((section) => {
      if (submission.tableSection && section.title !== submission.tableSection) {
        return false
      }

      return section.tiers.some((tier) => tier.name === submission.tableName)
    })

    const matchingTier = matchingSection?.tiers.find((tier) => tier.name === submission.tableName)
    if (!matchingSection || !matchingTier) {
      return NextResponse.json(
        { error: 'Reservation table could not be verified' },
        { status: 400, headers: rateLimit.headers }
      )
    }

    const reservationStatus =
      matchingTier.capacity && matchingTier.capacity > 0 && totalGuests > matchingTier.capacity
        ? 'OVER_CAPACITY'
        : 'VALID'

    const formId =
      process.env.FORMSPREE_RESERVATION_FORM_ID ||
      process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID ||
      DEFAULT_RESERVATION_FORM_ID

    const payload = {
      firstName: submission.firstName,
      lastName: submission.lastName,
      email: submission.email,
      phone: submission.phone,
      numGuys: submission.numGuys,
      numGirls: submission.numGirls,
      totalGuests,
      reservationStatus,
      venueSlug: submission.venueSlug,
      venueName: event.venue_name,
      eventId: submission.eventId,
      eventName: event.event_title,
      eventDateKey: submission.eventDateKey,
      eventDate: submission.eventDateKey,
      tableName: matchingTier.name,
      tableSection: matchingSection.title,
      tablePrice: matchingTier.price,
      tableCapacity: matchingTier.capacity,
      _subject: `${reservationStatus === 'OVER_CAPACITY' ? '⚠️ OVER CAPACITY — ' : ''}New Reservation Request - ${event.event_title} at ${event.venue_name}`,
      _replyto: submission.email,
    }

    const response = await forwardToFormspree(formId, payload)
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to submit reservation' },
        { status: 502, headers: rateLimit.headers }
      )
    }

    return NextResponse.json({ ok: true }, { headers: rateLimit.headers })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit reservation' },
      { status: 500 }
    )
  }
}
