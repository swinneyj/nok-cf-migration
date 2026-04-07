export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'

export const metadata: Metadata = {
  title: 'Jewel Nightclub ARIA Las Vegas | VIP Table Reservations & Bottle Service',
  description: 'Book VIP tables at Jewel Nightclub at ARIA Resort Las Vegas. Intimate skybox suites, LED Grand Staircase, personal host. Minimums from $300. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/jewel-nightclub' },
}

export default async function JewelNightclub() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'Jewel Nightclub',
        hotel: 'ARIA Resort & Casino',
        address: '3730 S Las Vegas Blvd, Las Vegas, NV 89158',
        category: 'Nightclub',
        size: '24,000 sq ft',
        capacity: '~800 guests',
        openDays: 'Friday & Saturday',
        hours: '10:30 PM – 4:00 AM',
        tableMin: '$300–$1,500+ (weekend)',
        coverCharge: '$20–$35 general admission',
        music: 'EDM, Hip-hop, Top 40',
        dresscode: 'Upscale — dress shoes or clean leather sneakers, no shorts or athletic wear',
        image: '/images/venues/jewel.jpg',
        description: 'Jewel Nightclub at ARIA Resort is one of the most glamorous boutique nightclub experiences in Las Vegas. At 24,000 square feet, it is intentionally more intimate than the mega-clubs — every table has a genuine sightline, every guest feels the VIP treatment. The iconic LED Grand Staircase and tasseled VIP banquettes create an atmosphere that is genuinely luxurious rather than overwhelming.',
        highlights: [
          'Iconic LED Grand Staircase — one of the most photographed features in Vegas nightlife',
          'Intimate scale — 800 capacity means better service and real VIP atmosphere',
          'Private skybox suites: The Bling Tiger and The Studio for exclusive group experiences',
          'Tasseled VIP banquettes with premium sightlines from every table',
          'ARIA\'s world-class service standards extend to every corner of the venue',
          'Best choice for smaller groups (4–12) wanting a genuine luxury experience',
        ],
        slug: 'jewel-nightclub',
      }}
      relatedVenues={[
        { name: 'XS Nightclub', href: '/places/xs-nightclub' },
        { name: 'Omnia', href: '/places/omnia' },
        { name: 'TAO Nightclub', href: '/places/tao-nightclub' },
        { name: 'Zouk', href: '/places/zouk-nightclub' },
      ]}
    />

      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Book Your Experience</h2>
          <p className="text-gray-600 mb-12 text-lg">
            Browse upcoming events, select your table, and submit a reservation request
          </p>
          <EventPricingSelector venueName="Jewel Nightclub" venueSlug="jewel-nightclub" />
        </div>
      </section>
    </>
  )
}
