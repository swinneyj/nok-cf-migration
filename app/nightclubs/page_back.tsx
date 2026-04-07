import type { Metadata } from 'next'
import Link from 'next/link'
import { Phone } from 'lucide-react'
import InquiryForm from '@/components/InquiryForm'

export const metadata: Metadata = {
  title: 'Las Vegas Nightclubs | VIP Table & Skip-The-Line Access 2026',
  description: "VIP access to all top Las Vegas nightclubs — XS, Hakkasan, Omnia, Marquee, TAO, Zouk, LIV, Drai's, Jewel & EBC at Night. Skip lines, best tables, personal host. (702) 996-4884.",
  alternates: { canonical: 'https://www.nokturnallifestyle.com/nightclubs' },
}

const clubs = [
  { name: 'XS Nightclub', venue: 'Encore at Wynn', desc: '#1 in Las Vegas. World-class DJs, iconic outdoor pool area, Wynn-level service.', img: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=500&q=80', alt: 'XS Nightclub Las Vegas VIP table', href: '/places/xs-nightclub' },
  { name: 'Hakkasan', venue: 'MGM Grand', desc: "80,000 sq ft, six rooms. Vegas's largest nightclub — best for groups who want variety.", img: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=500&q=80', alt: 'Hakkasan Las Vegas VIP', href: '/places/hakkasan' },
  { name: 'Omnia', venue: 'Caesars Palace', desc: 'Iconic kinetic chandelier, rooftop terrace — the best production show in Las Vegas nightlife.', img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500&q=80', alt: 'Omnia Caesars Palace Las Vegas VIP', href: '/places/omnia' },
  { name: 'Marquee Nightclub', venue: 'The Cosmopolitan', desc: 'Rooftop bungalows with private pools, Boombox Room hip-hop, central Strip location.', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=80', alt: 'Marquee nightclub Las Vegas VIP', href: '/places/marquee-nightclub' },
  { name: 'TAO Nightclub', venue: 'Venetian', desc: 'A-list celebrity venue, 40-foot Strip terrace, 8 private skyboxes, stunning décor.', img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', alt: 'TAO nightclub Venetian Las Vegas VIP', href: '/places/tao-nightclub' },
  { name: 'Zouk Nightclub', venue: 'Resorts World', desc: "Vegas's most technologically advanced nightclub. Best sound system, tech house focus.", img: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=500&q=80', alt: 'Zouk Resorts World Las Vegas VIP', href: '/places/zouk-nightclub' },
  { name: 'LIV Nightclub', venue: 'Fontainebleau', desc: 'Legendary Miami club brings its celebrity programming and energy to the Las Vegas Strip.', img: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=500&q=80', alt: 'LIV Nightclub Fontainebleau Las Vegas VIP', href: '/places/liv-nightclub' },
  { name: "Drai's Nightclub", venue: 'The Cromwell', desc: 'Only rooftop nightclub on the Strip. Best hip-hop programming in Las Vegas, epic views.', img: 'https://images.unsplash.com/photo-1545431781-3e1b506e9a37?w=500&q=80', alt: "Drai's rooftop Las Vegas VIP", href: '/places/drais-nightclub' },
  { name: 'Jewel Nightclub', venue: 'ARIA', desc: 'Intimate 24,000 sq ft. LED Grand Staircase, private skyboxes — best small-group luxury.', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', alt: 'Jewel nightclub ARIA Las Vegas VIP', href: '/places/jewel-nightclub' },
  { name: 'EBC at Night', venue: 'Encore at Wynn', desc: "Encore Beach Club as an open-air nightclub. The world's best outdoor nightclub experience.", img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80', alt: 'EBC at Night Las Vegas outdoor nightclub VIP', href: '/places/ebc-at-night' },
]

export default function NightclubsPage() {
  return (
    <>
      <section className="relative page-hero overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=1600&q=85" alt="Las Vegas nightclubs VIP access" className="w-full h-full object-cover" />
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
              <Link href="#clubs" className="btn-gold">Browse All 10 Nightclubs</Link>
              <a href="tel:+17029964884" className="btn-ghost flex items-center gap-2"><Phone size={14} /> (702) 996-4884</a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-night-800 border-y border-gold-500/10 py-6 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[{ value: '10', label: 'Active Venues' }, { value: 'Skip', label: 'Every Line' }, { value: '$0', label: 'Booking Fees' }, { value: '30 min', label: 'Response Time' }].map(({ value, label }) => (
            <div key={label}><div className="stat-number text-2xl">{value}</div><div className="text-white/40 text-xs uppercase tracking-wider mt-1">{label}</div></div>
          ))}
        </div>
      </section>

      <section id="clubs" className="py-20 px-4 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-eyebrow mb-3">All Venues</div>
            <h2 className="font-display text-white font-bold text-3xl">Every Las Vegas Nightclub We Work With</h2>
            <p className="text-white/45 text-sm mt-3">Click any venue for full details, pricing, and to reserve your table.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {clubs.map((club) => (
              <Link key={club.name} href={club.href} className="card-dark overflow-hidden flex flex-col group">
                <div className="h-36 overflow-hidden">
                  <img src={club.img} alt={club.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="text-white font-bold font-display text-sm mb-0.5 group-hover:text-gold-400 transition-colors">{club.name}</div>
                  <div className="text-gold-500 text-xs mb-2">{club.venue}</div>
                  <p className="text-white/45 text-xs leading-relaxed mb-3 flex-1">{club.desc}</p>
                  <div className="text-gold-400 text-xs font-semibold">View Details →</div>
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
