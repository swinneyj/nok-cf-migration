import type { Metadata } from 'next'
import Link from 'next/link'
import { Phone } from 'lucide-react'
import PackageCard from '@/components/PackageCard'
import ReviewCard from '@/components/ReviewCard'
import InquiryForm from '@/components/InquiryForm'

export const metadata: Metadata = {
  title: 'Las Vegas Bachelorette Party Packages | VIP Nightclub & Pool Party',
  description:
    'Las Vegas bachelorette party packages from $149/person. Limo, nightclub, pool party, VIP host. Champagne included. Call (702) 996-4884.',
}

const packages = [
  {
    title: 'Girls Night Out',
    price: '$149',
    priceLabel: '/person',
    image: '/images/venues/bachelorette-package-1.png',
    imageAlt: 'Las Vegas bachelorette party nightclub VIP',
    badge: 'Best Value',
    includes: [
      'VIP nightclub entry',
      'Reserved table with champagne',
      'Personal host',
      'Free guestlist access',
    ],
    href: '/contact',
    rating: 4.9,
    reviewCount: 38,
  },
  {
    title: 'Bachelorette Glam Package',
    price: '$249',
    priceLabel: '/person',
    image: '/images/venues/bachelorette-package-2.png',
    imageAlt: 'Las Vegas bachelorette party luxury limo champagne',
    badge: 'Most Popular',
    includes: [
      'Luxury limo from hotel',
      'VIP nightclub entry',
      'Champagne toast + reserved table',
      'Pool party / dayclub access',
      'Personal female-friendly host',
      'Bride sash & tiara',
    ],
    href: '/contact',
    rating: 5.0,
    reviewCount: 62,
  },
  {
    title: 'Vegas Queen Weekend',
    price: '$399',
    priceLabel: '/person',
    image: '/images/venues/bachelorette-package-3.png',
    imageAlt: 'Las Vegas bachelorette VIP weekend package',
    badge: 'Premium',
    includes: [
      'Party bus + limo both nights',
      'VIP dinner at top restaurant',
      'Dayclub VIP cabana',
      'Nightclub VIP table (2 nights)',
      'Male revue show tickets',
      'Full weekend dedicated host',
      'Custom weekend itinerary',
    ],
    href: '/contact',
    rating: 5.0,
    reviewCount: 19,
  },
]

const reviews = [
  {
    name: 'Tam T.',
    date: 'September 2023',
    location: 'Houston, TX',
    rating: 5,
    text: 'Phenomenal experience. They made sure I was taken care of when I was in Vegas. Answered all my questions and always answered my phone calls on the spot!',
  },
  {
    name: 'Joanne G.',
    date: 'March 2023',
    location: 'Los Angeles, CA',
    rating: 5,
    text: 'Justin is the best. Always super fast and very responsive. I texted him last minute with some changes and he never disappoints. So easy to work with!',
  },
  {
    name: 'Mervin C.',
    date: 'November 2023',
    location: 'Seattle, WA',
    rating: 5,
    text: 'As always, Justin with Nokturnal Lifestyle never fails to amaze. Took care of us in spite of a very late request. I highly recommend him for any of your concierge needs.',
  },
]

export default function BachelorettePage() {
  return (
    <>
      <section className="relative page-hero overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&q=85"
            alt="Las Vegas bachelorette party VIP experience"
            className="w-full h-full object-cover object-top"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
          <div className="max-w-3xl">
            <div className="section-eyebrow mb-4">Bachelorette Parties</div>
            <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
              Las Vegas Bachelorette Party Packages
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
              The bride deserves the best. Limo, champagne, VIP nightclub, pool party and more —
              from $149/person with a dedicated personal host.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#packages" className="btn-gold">See Packages</Link>
              <a href="tel:+17029964884" className="btn-ghost flex items-center gap-2">
                <Phone size={14} /> Call (702) 996-4884
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="packages" className="py-20 px-4 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-eyebrow mb-3">Packages</div>
            <h2 className="font-display text-white font-bold text-3xl">Choose Your Package</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => <PackageCard key={pkg.title} {...pkg} />)}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="section-eyebrow mb-3">Reviews</div>
            <h2 className="font-display text-white font-bold text-2xl">What the Brides Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {reviews.map((r) => <ReviewCard key={r.name} {...r} />)}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-night-800/50">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <div className="section-eyebrow mb-4">Book Now</div>
            <h2 className="font-display text-white font-bold text-3xl mb-4">
              Plan the Perfect Bachelorette
            </h2>
            <p className="text-white/60 mb-6 leading-relaxed">
              Tell us about your group and we'll build a custom itinerary. Our team responds within
              30 minutes.
            </p>
            <ul className="check-list">
              <li>Bride perks included in every package</li>
              <li>Female-friendly hosts available</li>
              <li>Custom itineraries for any vibe</li>
              <li>No hidden fees, ever</li>
            </ul>
          </div>
          <div className="card-dark p-8">
            <InquiryForm defaultPackage="bachelorette" />
          </div>
        </div>
      </section>
    </>
  )
}
