import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { Phone } from 'lucide-react'
import CategoryEventsBrowserFallback from '@/components/CategoryEventsBrowserFallback'
import PreloadedCategoryEventsBrowser from '@/components/PreloadedCategoryEventsBrowser'

export const metadata: Metadata = {
  title: 'Las Vegas Events Calendar | Nightclubs & Pool Parties 2026',
  description:
    'Browse Las Vegas nightclub and pool party events by date. See what is happening across the city, then jump straight into the exact venue event page to book tables, cabanas, or VIP access.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/events' },
}

export default function EventsPage() {
  return (
    <>
      <section className="relative page-hero overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/venues/nightclubs-hero.jpg"
            alt="Las Vegas events calendar for nightclubs and pool parties"
            className="h-full w-full object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="section-eyebrow mb-4">Events Calendar</div>
            <h1
              className="mb-5 font-display font-bold text-white"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
            >
              Find the Right Vegas Event for Your Trip
            </h1>
            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-white/70">
              Pick a date and see what&apos;s going on across Las Vegas nightclubs and pool parties.
              When something stands out, click through to the exact venue page with that event ready
              to book.
            </p>
            <div className="max-w-xl space-y-4">
              <div>
                <Link href="#events-browser" className="btn-gold inline-flex min-w-[220px] justify-center">
                  Browse All
                </Link>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/nightclubs#events" className="btn-ghost inline-flex min-w-[180px] justify-center">
                  Nightclubs
                </Link>
                <Link href="/pool-parties#events" className="btn-ghost inline-flex min-w-[180px] justify-center">
                  Pool Parties
                </Link>
              </div>
              <div>
                <a
                  href="tel:+17029964884"
                  className="inline-flex items-center gap-2 rounded-xl border border-gold-500/25 bg-night-900/35 px-5 py-3 text-sm font-semibold text-gold-400 transition-colors hover:border-gold-500/40 hover:text-gold-300"
                >
                  <Phone size={14} /> (702) 996-4884
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<CategoryEventsBrowserFallback />}>
        <PreloadedCategoryEventsBrowser
          category="all"
          anchorId="events-browser"
          title="What’s Happening in Las Vegas"
          description="Browse all featured nightlife and pool party events for your dates, then jump into the exact venue page to reserve."
          allowCategorySwitching
        />
      </Suspense>
    </>
  )
}
