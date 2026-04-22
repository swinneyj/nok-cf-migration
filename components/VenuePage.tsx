'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import InquiryForm from '@/components/InquiryForm'
import ReviewCard from '@/components/ReviewCard'

interface VenuePageProps {
  venue: {
    name: string
    hotel: string
    address: string
    category: string
    size: string
    capacity: string
    openDays: string
    hours: string
    tableMin: string
    coverCharge: string
    music: string
    dresscode: string
    image: string
    description: string
    highlights: string[]
    slug: string
  }
  reviews?: Array<{ name: string; date: string; location: string; rating: number; text: string }>
  relatedVenues?: Array<{ name: string; href: string }>
  useReserveInquiryCta?: boolean
  beforeAboutSection?: React.ReactNode
}

const defaultReviews = [
  { name: 'Marcus T.', date: 'February 2026', location: 'Chicago, IL', rating: 5, text: "Justin got us the best table in the house. We've been to this venue three times now always through Nokturnal — the difference in table placement vs booking direct is night and day." },
  { name: 'Sarah K.', date: 'January 2026', location: 'New York, NY', rating: 5, text: 'Bachelorette party and our host was waiting for us at the door. VIP entry, amazing table, champagne already chilled. Absolutely flawless experience.' },
  { name: 'David R.', date: 'December 2025', location: 'Los Angeles, CA', rating: 5, text: "Thought I could book this venue directly for a better price. Justin beat the direct rate AND got us a better table. Will always go through Nokturnal for Vegas." },
]

export default function VenuePage({
  venue,
  reviews = defaultReviews,
  relatedVenues = [],
  useReserveInquiryCta = false,
  beforeAboutSection,
}: VenuePageProps) {
  const pathname = usePathname()
  const isNightclub = venue.category === 'Nightclub'
  const isDayclub = venue.category === 'Dayclub'
  const isStripClub = venue.category === 'Strip Club'
  const primaryTargetId = useReserveInquiryCta ? 'reserve-inquiry' : 'event-booking'
  const primaryHash = `#${primaryTargetId}`
  const primaryCtaLabel = useReserveInquiryCta ? 'Reserve Now' : 'View Events'
  const primaryCtaAriaLabel = useReserveInquiryCta ? 'Jump to reservation form' : 'View upcoming events'

  useEffect(() => {
    if (typeof window === 'undefined') return

    const scrollToBooking = (behavior: ScrollBehavior) => {
      const target = document.getElementById(primaryTargetId)
      if (!target) return

      target.scrollIntoView({
        behavior,
        block: 'start',
      })
    }

    if (window.location.hash === primaryHash) {
      requestAnimationFrame(() => {
        scrollToBooking('auto')
      })
      return
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    })
  }, [pathname, primaryHash, primaryTargetId])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const onHashChange = () => {
      if (window.location.hash !== primaryHash) return

      const target = document.getElementById(primaryTargetId)
      if (!target) return

      requestAnimationFrame(() => {
        target.scrollIntoView({
          behavior: 'auto',
          block: 'start',
        })
      })
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [primaryHash, primaryTargetId])

  const handleViewEvents = () => {
    if (typeof window === 'undefined') return

    const target = document.getElementById(primaryTargetId)
    if (!target) return

    if (window.location.hash !== primaryHash) {
      window.history.replaceState(null, '', `${window.location.pathname}${primaryHash}`)
    }

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <>
      <section className="relative page-hero overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={venue.image}
            alt={`${venue.name} Las Vegas VIP table bottle service`}
            className="w-full h-full object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Link
                href={isNightclub ? '/nightclubs' : isDayclub ? '/pool-parties' : '/strip-clubs'}
                className="section-eyebrow hover:text-gold-300 transition-colors"
              >
                ← {isNightclub ? 'Nightclubs' : isDayclub ? 'Pool Parties' : 'Strip Clubs'}
              </Link>
            </div>

            <h1
              className="font-display text-white font-bold mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)' }}
            >
              {venue.name} Las Vegas
            </h1>

            <p className="text-gold-400 font-semibold mb-4">{venue.hotel}</p>

            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
              {isNightclub
                ? `VIP table reservations, skip-the-line entry, and personal host at ${venue.name}. Better table placement and pricing than booking direct.`
                : isDayclub
                  ? `VIP cabana and daybed reservations at ${venue.name}. Personal host, bottle service, and skip-the-line access included.`
                  : `VIP entry, free drinks, and best seats at ${venue.name}. Personal host coordinates your group from hotel pickup to VIP access.`}
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleViewEvents}
                className="btn-gold"
                aria-label={primaryCtaAriaLabel}
              >
                {primaryCtaLabel}
              </button>

              <a href="tel:+17029964884" className="btn-ghost flex items-center gap-2">
                📞 (702) 996-4884
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-night-800 border-y border-gold-500/10 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'Size', value: venue.size },
            { label: 'Capacity', value: venue.capacity },
            { label: 'Open', value: venue.openDays },
            { label: 'Hours', value: venue.hours },
            { label: isNightclub || isDayclub ? 'Table Min.' : 'Entry', value: venue.tableMin },
            { label: 'Music', value: venue.music },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-white/35 text-xs uppercase tracking-wider mb-1">{label}</div>
              <div className="text-white font-semibold text-xs leading-tight">{value}</div>
            </div>
          ))}
        </div>
      </section>

      {beforeAboutSection}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <div className="section-eyebrow mb-3">About {venue.name}</div>
              <h2 className="font-display text-white font-bold text-2xl mb-4">
                {venue.name} VIP Experience
              </h2>
              <p className="text-white/70 leading-relaxed mb-6 text-lg">{venue.description}</p>
              <ul className="space-y-2">
                {venue.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-white/65 text-sm">
                    <span className="text-gold-400 mt-0.5 flex-shrink-0">✓</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-white font-bold text-2xl mb-4">Venue Information</h2>
              <div className="card-dark p-6 grid sm:grid-cols-2 gap-4 text-sm">
                {[
                  { label: 'Hotel / Location', value: venue.hotel },
                  { label: 'Address', value: venue.address },
                  { label: 'Open Days', value: venue.openDays },
                  { label: 'Hours', value: venue.hours },
                  { label: 'Music Style', value: venue.music },
                  { label: 'Dress Code', value: venue.dresscode },
                  { label: isStripClub ? 'Entry' : 'Table Minimum', value: venue.tableMin },
                  { label: 'Cover Charge', value: venue.coverCharge },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-white/35 text-xs uppercase tracking-wider mb-1">{label}</div>
                    <div className="text-white/80">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-white font-bold text-2xl mb-4">
                Why Book {venue.name} Through Nokturnal?
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: 'Better Table Location', desc: "We know exactly which tables have the best sightlines and position. Booking direct gets you whatever's available." },
                  { title: 'Price Match + Better', desc: "We regularly beat direct booking prices, and when we can't, we add value through better placement or service." },
                  { title: 'Personal Host', desc: 'Justin or one of our team meets you at the door, handles check-in, and stays with your group throughout the night.' },
                  { title: 'Skip the Line', desc: 'Zero waiting. VIP entry direct to your table, no standing in the general admission queue.' },
                ].map(({ title, desc }) => (
                  <div key={title} className="card-dark p-4">
                    <div className="text-gold-400 font-semibold text-sm mb-1">{title}</div>
                    <div className="text-white/55 text-xs leading-relaxed">{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-white font-bold text-2xl mb-4">What Our Clients Say</h2>
              <div className="space-y-4">
                {reviews.map((r) => (
                  <ReviewCard key={r.name} {...r} />
                ))}
              </div>
            </div>

            {relatedVenues.length > 0 && (
              <div>
                <h2 className="font-display text-white font-bold text-xl mb-4">Compare Other Venues</h2>
                <div className="flex flex-wrap gap-3">
                  {relatedVenues.map((v) => (
                    <Link
                      key={v.href}
                      href={v.href}
                      prefetch={false}
                      className="venue-badge hover:text-gold-400"
                    >
                      {v.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div id="reserve-inquiry" className="scroll-mt-24">
            <div className="card-dark p-6 sticky top-24">
              <h3 className="font-display text-white font-bold text-xl mb-2">
                Reserve at {venue.name}
              </h3>
              <p className="text-white/45 text-xs mb-6">
                Justin responds within 30 minutes · No booking fees
              </p>
              <InquiryForm
                defaultPackage={isNightclub ? 'nightclub' : isDayclub ? 'pool' : 'strip'}
                compact={true}
              />
              <div className="mt-6 pt-5 border-t border-white/5 text-center">
                <div className="text-white/30 text-xs mb-2">Or call directly</div>
                <a
                  href="tel:+17029964884"
                  className="text-gold-400 font-display font-bold text-lg hover:text-gold-300 transition-colors"
                >
                  (702) 996-4884
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
