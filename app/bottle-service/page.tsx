import type { Metadata } from 'next'
import Link from 'next/link'
import { Phone, Check } from 'lucide-react'
import InquiryForm from '@/components/InquiryForm'

export const metadata: Metadata = {
  title: 'Las Vegas Bottle Service | VIP Table Reservations at Top Nightclubs',
  description:
    'Reserve VIP bottle service at Hakkasan, XS, Omnia, Marquee & more. Skip the line, best price guaranteed. Personal host included. Call (702) 996-4884.',
}

const venues = [
  { name: 'XS Nightclub', venue: 'Encore', min: '$500', img: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=400&q=80', alt: 'XS Nightclub Las Vegas bottle service VIP table' },
  { name: 'Hakkasan', venue: 'MGM Grand', min: '$400', img: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=400&q=80', alt: 'Hakkasan Las Vegas VIP bottle service table reservation' },
  { name: 'Omnia', venue: 'Caesars Palace', min: '$450', img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&q=80', alt: 'Omnia nightclub Las Vegas VIP table' },
  { name: 'Marquee', venue: 'The Cosmopolitan', min: '$400', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80', alt: 'Marquee nightclub Las Vegas bottle service' },
  { name: 'TAO Nightclub', venue: 'Venetian', min: '$350', img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80', alt: 'TAO nightclub Las Vegas VIP' },
  { name: 'Zouk', venue: 'Resorts World', min: '$400', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80', alt: 'Zouk Las Vegas nightclub VIP table' },
]

const perks = [
  'Skip the line — VIP entrance every time',
  'Best table location in the venue',
  'Price-match guarantee vs. direct booking',
  'Personal host meets you at the door',
  'No surprise fees — total is what you pay',
  'Last-minute bookings accepted',
]

export default function BottleServicePage() {
  return (
    <>
      <section className="relative page-hero overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=1600&q=85"
            alt="Las Vegas VIP bottle service nightclub table"
            className="w-full h-full object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
          <div className="max-w-3xl">
            <div className="section-eyebrow mb-4">Bottle Service</div>
            <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
              Las Vegas VIP Bottle Service & Table Reservations
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
              Skip the line and get the best tables at Hakkasan, XS, Omnia, Marquee, TAO and more.
              Our connections guarantee better placement than booking direct.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#venues" className="btn-gold">Browse Venues</Link>
              <a href="tel:+17029964884" className="btn-ghost flex items-center gap-2">
                <Phone size={14} /> (702) 996-4884
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Venues grid */}
      <section id="venues" className="py-20 px-4 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-eyebrow mb-3">Venues</div>
            <h2 className="font-display text-white font-bold text-3xl">Top Nightclubs We Work With</h2>
            <p className="text-white/50 mt-3 text-sm">Minimums are per table, not per person. Contact us for current pricing.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {venues.map((v) => (
              <div key={v.name} className="card-dark overflow-hidden flex flex-col">
                <div className="h-40 overflow-hidden">
                  <img src={v.img} alt={v.alt} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-display text-white font-bold text-lg">{v.name}</h3>
                    <span className="text-gold-400 font-bold text-sm">{v.min}+</span>
                  </div>
                  <div className="text-white/40 text-xs mb-4">{v.venue}</div>
                  <Link href="/contact" className="btn-gold text-xs py-2.5 text-center mt-auto">
                    Reserve a Table
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks + Form */}
      <section className="py-20 px-4 bg-night-800/50">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="section-eyebrow mb-4">Why Book Through Us</div>
            <h2 className="font-display text-white font-bold text-3xl mb-6">
              Better Tables. Better Prices. Personal Host.
            </h2>
            <ul className="space-y-3">
              {perks.map((p) => (
                <li key={p} className="flex items-start gap-3 text-white/70">
                  <Check size={15} className="text-gold-400 flex-shrink-0 mt-0.5" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="card-dark p-8">
            <h3 className="font-display text-white font-bold text-xl mb-6">Reserve Your Table</h3>
            <InquiryForm defaultPackage="bottle" />
          </div>
        </div>
      </section>
    </>
  )
}
