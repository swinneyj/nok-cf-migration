export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'

export const metadata: Metadata = {
  title: 'Zouk Nightclub Las Vegas | Resorts World VIP Tables & Bottle Service',
  description: "Book VIP tables at Zouk Nightclub at Resorts World Las Vegas. Vegas's most technologically advanced nightclub. Personal host, skip the line. Call (702) 996-4884.",
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/zouk-nightclub' },
}

export default async function ZoukNightclub() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'Zouk Nightclub',
        hotel: 'Resorts World Las Vegas',
        address: '3000 S Las Vegas Blvd, Las Vegas, NV 89109',
        category: 'Nightclub',
        size: '130,000 sq ft complex',
        capacity: '~4,000 guests',
        openDays: 'Friday & Saturday (select Thursdays)',
        hours: '10:30 PM – 4:00 AM',
        tableMin: '$400–$2,000+ (weekend)',
        coverCharge: '$25–$45 general admission',
        music: 'Tech House, Electronic, EDM',
        dresscode: 'Smart casual to upscale — fitted clothing, clean sneakers acceptable',
        image: '/images/venues/zouk.jpg',
        description: "Zouk Nightclub at Resorts World Las Vegas is the newest mega-club on the Strip and the most technologically advanced nightclub in Las Vegas. The Singapore-based Zouk brand brings a global perspective to Vegas nightlife — the sound system, lighting rig, and production technology exceed anything found at older venues. For music purists and anyone who wants to experience the future of nightlife, Zouk is the destination.",
        highlights: [
          'Most advanced sound system and lighting production of any Las Vegas nightclub',
          'Global Zouk brand — renowned for music-forward programming across Asia and beyond',
          'Tech house and electronic music focus appeals to a more discerning crowd',
          'Resorts World complex includes AYU Dayclub for day-to-night packages',
          'Newer venue — premium facilities throughout, no aging infrastructure',
          'Less touristy vibe than mid-Strip clubs — popular with music enthusiasts',
        ],
        slug: 'zouk-nightclub',
      }}
      relatedVenues={[
        { name: 'XS Nightclub', href: '/places/xs-nightclub' },
        { name: 'Hakkasan', href: '/places/hakkasan' },
        { name: 'LIV Nightclub', href: '/places/liv-nightclub' },
        { name: 'AYU Dayclub', href: '/places/ayu-dayclub' },
      ]}
    />

      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Book Your Experience</h2>
          <p className="text-gray-600 mb-12 text-lg">
            Browse upcoming events, select your table, and submit a reservation request
          </p>
          <EventPricingSelector venueName="Zouk Nightclub" venueSlug="zouk-nightclub" />
        </div>
      </section>
    </>
  )
}
