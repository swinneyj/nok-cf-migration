import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { Phone } from 'lucide-react'
import CategoryEventsBrowserFallback from '@/components/CategoryEventsBrowserFallback'
import InquiryForm from '@/components/InquiryForm'
import PreloadedCategoryEventsBrowser from '@/components/PreloadedCategoryEventsBrowser'
import { poolPartyVenues as dayclubs } from '@/lib/categoryVenueData'

export const metadata: Metadata = {
  title: 'Las Vegas Pool Parties & Dayclubs | VIP Cabana Reservations 2026',
  description: "VIP cabanas and daybeds at Encore Beach Club, Marquee Dayclub, Omnia Dayclub, LIV Beach Club, AYU, Kassi, Liquid & Stadium Swim. Personal host included. (702) 996-4884.",
  alternates: { canonical: 'https://www.nokturnallifestyle.com/pool-parties' },
}

export default function PoolPartiesPage() {
  return (
    <>
      <section className="relative page-hero overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/venues/pool-parties-hero.jpg" alt="Las Vegas pool party dayclub VIP cabana 2026" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
          <div className="max-w-3xl">
            <div className="section-eyebrow mb-4">Pool Parties & Dayclubs</div>
            <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
              Las Vegas Pool Party VIP Access
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
              VIP cabanas and daybeds at all major Las Vegas dayclubs — Encore Beach Club, Marquee,
              Omnia Dayclub, LIV Beach Club and more. Personal host included in every booking.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#events" className="btn-gold">View Events</Link>
              <Link href="#dayclubs" className="btn-ghost">Browse All {dayclubs.length} Dayclubs</Link>
              <a href="tel:+17029964884" className="btn-ghost flex items-center gap-2"><Phone size={14} /> (702) 996-4884</a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-night-800 border-y border-gold-500/10 py-6 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[{ value: String(dayclubs.length), label: 'Dayclubs' }, { value: 'May–Oct', label: 'Peak Season' }, { value: 'Skip', label: 'Every Line' }, { value: '$0', label: 'Booking Fees' }].map(({ value, label }) => (
            <div key={label}><div className="stat-number text-2xl">{value}</div><div className="text-white/40 text-xs uppercase tracking-wider mt-1">{label}</div></div>
          ))}
        </div>
      </section>

      <Suspense fallback={<CategoryEventsBrowserFallback />}>
        <PreloadedCategoryEventsBrowser
          category="pool-parties"
          anchorId="events"
          title="What’s Happening Poolside"
          description="Pick your date and see what’s going on across Las Vegas pool parties and dayclubs. Clicking an event opens the exact venue page with that event ready to book."
          enableSearch
        />
      </Suspense>

      <section id="dayclubs" className="py-20 px-4 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-eyebrow mb-3">All Venues</div>
            <h2 className="font-display text-white font-bold text-3xl">Every Las Vegas Dayclub We Work With</h2>
            <p className="text-white/45 text-sm mt-3">Click any venue for full details, cabana pricing, and to make a reservation.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {dayclubs.map((club) => (
              <Link
                key={club.name}
                href={club.href}
                prefetch={false}
                className="card-dark overflow-hidden flex flex-col group"
              >
                <div className="h-44 overflow-hidden relative">
                  <img src={club.img} alt={club.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  {club.badge && (
                    <div className="absolute top-3 left-3 bg-gold-500 text-black text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                      {club.badge}
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-white font-bold font-display text-lg mb-0.5 group-hover:text-gold-400 transition-colors">{club.name}</div>
                  <div className="text-gold-500 text-xs mb-3">{club.venue}</div>
                  <p className="text-white/55 text-sm leading-relaxed mb-4 flex-1">{club.desc}</p>
                  <div className="text-gold-400 text-xs font-semibold">Reserve a Cabana →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-night-800/50">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <div className="section-eyebrow mb-4">Book Now</div>
            <h2 className="font-display text-white font-bold text-3xl mb-4">Reserve Your Cabana or Daybed</h2>
            <p className="text-white/60 mb-6 leading-relaxed">Popular dates sell out weeks in advance. Tell us your date, venue preference, and group size — our team confirms availability within 30 minutes.</p>
            <ul className="check-list">
              <li>Cabanas and daybeds at all 8 dayclubs</li>
              <li>Skip general admission lines</li>
              <li>Bottle service and dedicated server</li>
              <li>Personal host on the day</li>
            </ul>
          </div>
          <div className="card-dark p-8">
            <InquiryForm defaultPackage="dayclub" />
          </div>
        </div>
      </section>
    </>
  )
}
