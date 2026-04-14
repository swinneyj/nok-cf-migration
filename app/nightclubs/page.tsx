import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { Phone } from 'lucide-react'
import CategoryEventsBrowserFallback from '@/components/CategoryEventsBrowserFallback'
import InquiryForm from '@/components/InquiryForm'
import PreloadedCategoryEventsBrowser from '@/components/PreloadedCategoryEventsBrowser'
import { nightclubVenues as clubs } from '@/lib/categoryVenueData'

export const metadata: Metadata = {
  title: 'Las Vegas Nightclubs | VIP Table & Skip-The-Line Access 2026',
  description: "VIP access to all top Las Vegas nightclubs — XS, Hakkasan, Omnia, Marquee, TAO, Zouk, LIV, Drai's, Jewel & EBC at Night. Skip lines, best tables, personal host. (702) 996-4884.",
  alternates: { canonical: 'https://www.nokturnallifestyle.com/nightclubs' },
}

export default function NightclubsPage() {
  return (
    <>
      <section className="relative page-hero overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/venues/nightclubs-hero.jpg" alt="Las Vegas nightclubs VIP access" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
          <div className="max-w-3xl">
            <div className="section-eyebrow mb-4">Nightclubs</div>
            <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
              Las Vegas Nightclub VIP Access
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
              Direct relationships with every major Las Vegas nightclub. Skip the line, get the best table,
              pay less than booking direct — with a personal VIP host at every venue.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#events" className="btn-gold">View Events</Link>
              <Link href="#clubs" className="btn-ghost">Browse All {clubs.length} Nightclubs</Link>
              <a href="tel:+17029964884" className="btn-ghost flex items-center gap-2"><Phone size={14} /> (702) 996-4884</a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-night-800 border-y border-gold-500/10 py-6 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[{ value: String(clubs.length), label: 'Active Venues' }, { value: 'Skip', label: 'Every Line' }, { value: '$0', label: 'Booking Fees' }, { value: '30 min', label: 'Response Time' }].map(({ value, label }) => (
            <div key={label}><div className="stat-number text-2xl">{value}</div><div className="text-white/40 text-xs uppercase tracking-wider mt-1">{label}</div></div>
          ))}
        </div>
      </section>

      <Suspense fallback={<CategoryEventsBrowserFallback />}>
        <PreloadedCategoryEventsBrowser
          category="nightclubs"
          anchorId="events"
          title="What’s Happening Each Night"
          description="Pick your date and browse the nightclub calendar for that night and the days right after it. Clicking any event takes you to the exact venue page with that event preselected."
        />
      </Suspense>

      <section id="clubs" className="py-20 px-4 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-eyebrow mb-3">All Venues</div>
            <h2 className="font-display text-white font-bold text-3xl">Every Las Vegas Nightclub We Work With</h2>
            <p className="text-white/45 text-sm mt-3">Click any venue for full details, pricing, and to reserve your table.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {clubs.map((club) => (
              <Link
                key={club.name}
                href={club.href}
                prefetch={false}
                className="card-dark overflow-hidden flex flex-col group"
              >
                <div className="h-36 overflow-hidden">
                  <img src={club.img} alt={club.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="text-white font-bold font-display text-sm mb-0.5 group-hover:text-gold-400 transition-colors">{club.name}</div>
                  <div className="text-gold-500 text-xs mb-2">{club.venue}</div>
                  <p className="text-white/45 text-xs leading-relaxed mb-3 flex-1">{club.desc}</p>
                  <div className="text-gold-400 text-xs font-semibold">View Details   →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-night-800/50">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <div className="section-eyebrow mb-4">Book a Table</div>
            <h2 className="font-display text-white font-bold text-3xl mb-4">Reserve Your VIP Table</h2>
            <p className="text-white/60 mb-6 leading-relaxed">Tell us which venue and your group size — Justin confirms availability and pricing within 30 minutes.</p>
            <ul className="check-list">
              <li>No cover charges at any venue</li>
              <li>Skip-the-line VIP entry</li>
              <li>Personal host all night</li>
              <li>Best price guaranteed</li>
            </ul>
          </div>
          <div className="card-dark p-8">
            <InquiryForm defaultPackage="nightclub" />
          </div>
        </div>
      </section>
    </>
  )
}
