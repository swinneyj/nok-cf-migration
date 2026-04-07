import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Phone } from 'lucide-react'
import PackageCard from '@/components/PackageCard'
import ReviewCard from '@/components/ReviewCard'
import InquiryForm from '@/components/InquiryForm'

export const metadata: Metadata = {
  title: 'Las Vegas Bachelor Party Packages | VIP Nightclub & Strip Club',
  description:
    'Epic Las Vegas bachelor party packages from $149/person. Personal VIP host, party bus, bottle service, nightclub & strip club access. Call (702) 996-4884.',
  openGraph: {
    title: 'Las Vegas Bachelor Party Packages | Nokturnal Lifestyle',
    description: 'Epic Las Vegas bachelor party packages. Personal VIP host, party bus, bottle service & strip club access. Call (702) 996-4884.',
    images: [{ url: '/og-bachelor.jpg' }],
  },
}

const packages = [
  {
    title: 'The Classic Bachelor',
    price: '$149',
    priceLabel: '/person',
    image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=600&q=80',
    imageAlt: 'Las Vegas bachelor party nightclub VIP',
    badge: 'Best Value',
    includes: [
      'VIP nightclub entry (skip the line)',
      'Reserved table with bottle service',
      'Personal VIP host',
      'Free guestlist access',
    ],
    href: '/contact',
    rating: 4.8,
    reviewCount: 44,
  },
  {
    title: 'Ultimate Bachelor Package',
    price: '$299',
    priceLabel: '/person',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&q=80',
    imageAlt: 'Las Vegas VIP bachelor package party bus',
    badge: 'Most Popular',
    includes: [
      'Party bus from hotel (2 hrs)',
      'VIP entry to 2 nightclubs',
      'Reserved VIP tables both venues',
      'Bottle service included (2 bottles)',
      'Gentleman\'s club VIP entry',
      'Personal host all night',
    ],
    href: '/contact',
    rating: 4.9,
    reviewCount: 89,
  },
  {
    title: 'All-Inclusive Takeover',
    price: '$449',
    priceLabel: '/person',
    image: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=600&q=80',
    imageAlt: 'Las Vegas VIP all-inclusive bachelor takeover',
    badge: 'Premium',
    includes: [
      'Luxury limo from hotel',
      'VIP dinner at top restaurant',
      'Nightclub VIP table (premium venue)',
      'Strip club VIP access + drinks',
      'Pool party next morning',
      'Dedicated host all weekend',
      'Custom itinerary built for your group',
    ],
    href: '/contact',
    rating: 5.0,
    reviewCount: 28,
  },
]

const addOns = [
  'Pool party / dayclub access',
  'Male exotic dancer (party bus)',
  'Airport pickup & drop-off',
  'Top Golf experience',
  'Karaoke private room',
  'Helicopter ride over the Strip',
  'Shooting range experience',
  'Drag racing at Las Vegas Motor Speedway',
]

const reviews = [
  {
    name: 'Patrick A.',
    date: 'May 2024',
    location: 'Phoenix, AZ',
    rating: 5,
    text: 'Justin put in the works for my bachelor party. He arranged everything perfectly — party bus, nightclub, and gentlemen\'s club. Best bachelor party I could have asked for.',
  },
  {
    name: 'Prashanth M.',
    date: 'April 2024',
    location: 'San Jose, CA',
    rating: 5,
    text: 'Justin is the buddy you wish you had in Vegas. He coordinated everything. Got us in through the express lane at Zouk and my buddies said it was the best weekend ever.',
  },
  {
    name: 'Angel G.',
    date: 'April 2023',
    location: 'Dallas, TX',
    rating: 5,
    text: 'As easy as shooting us a price and coordinating every single detail with TAO nightclub and Marquee Day Party. They were always prompt to greet us. Made our Vegas trip super easy.',
  },
]

export default function BachelorPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="relative page-hero overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=1600&q=85"
            alt="Las Vegas bachelor party VIP nightclub bottle service"
            className="w-full h-full object-cover object-center"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
          <div className="max-w-3xl">
            <div className="section-eyebrow mb-4">Bachelor Parties</div>
            <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
              Las Vegas Bachelor Party Packages
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
              Give the groom the send-off he deserves. From $149/person with a personal VIP host,
              skip-the-line nightclub access, bottle service, party bus, and more.
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

      {/* Packages */}
      <section id="packages" className="py-20 px-4 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-eyebrow mb-3">Packages</div>
            <h2 className="font-display text-white font-bold text-3xl">Choose Your Package</h2>
            <p className="text-white/50 mt-3 text-sm">All prices are per person. Min. group size: 4. Custom packages available.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg.title} {...pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* Add-Ons */}
      <section className="py-16 px-4 bg-night-800/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="section-eyebrow mb-3">Customize It</div>
            <h2 className="font-display text-white font-bold text-2xl">Available Add-Ons</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {addOns.map((addon) => (
              <div key={addon} className="card-dark p-4 flex items-start gap-2 text-sm">
                <Check size={13} className="text-gold-400 flex-shrink-0 mt-0.5" />
                <span className="text-white/70">{addon}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="section-eyebrow mb-3">Reviews</div>
            <h2 className="font-display text-white font-bold text-2xl">Straight from the Grooms</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {reviews.map((r) => <ReviewCard key={r.name} {...r} />)}
          </div>
        </div>
      </section>

      {/* CTA + Form */}
      <section className="py-20 px-4 bg-night-800/50">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <div className="section-eyebrow mb-4">Book Now</div>
            <h2 className="font-display text-white font-bold text-3xl mb-4">
              Ready to Plan the Perfect Bachelor Party?
            </h2>
            <p className="text-white/60 mb-6 leading-relaxed">
              Fill out the form and Justin will reach out within 30 minutes with a custom itinerary
              and pricing tailored to your group.
            </p>
            <ul className="check-list">
              <li>No booking fees</li>
              <li>Personal VIP host included</li>
              <li>Best price guarantee</li>
              <li>Last-minute bookings welcome</li>
            </ul>
          </div>
          <div className="card-dark p-8">
            <InquiryForm defaultPackage="bachelor" />
          </div>
        </div>
      </section>
    </>
  )
}
