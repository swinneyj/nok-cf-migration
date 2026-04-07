export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'

export const metadata: Metadata = {
  title: 'Marquee Nightclub Las Vegas | VIP Bungalows & Bottle Service',
  description: 'Book VIP tables and rooftop bungalows at Marquee Nightclub at The Cosmopolitan Las Vegas. Hip-hop & EDM. Personal host included. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/marquee-nightclub' },
}

export default async function MarqueeNightclub() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'Marquee Nightclub',
        hotel: 'The Cosmopolitan of Las Vegas',
        address: '3708 S Las Vegas Blvd, Las Vegas, NV 89109',
        category: 'Nightclub',
        size: '60,000 sq ft',
        capacity: '~3,000 guests',
        openDays: 'Friday, Saturday, Sunday',
        hours: '10:30 PM – 4:00 AM',
        tableMin: '$800–$2,000+ (weekend)',
        coverCharge: '$25–$40 general admission',
        music: 'Hip-hop, EDM, Top 40',
        dresscode: 'Smart casual to upscale — clean sneakers acceptable',
        image: '/images/venues/marquee-nightclub.jpg',
        description: 'Marquee Nightclub at The Cosmopolitan of Las Vegas is the premier destination for hip-hop programming on the Las Vegas Strip. Its exclusive rooftop bungalows — complete with private plunge pools — are among the most coveted table experiences in the city. The Boombox Room brings a dedicated hip-hop space, while the main floor delivers world-class EDM.',
        highlights: [
          'Rooftop bungalows with private plunge pools — uniquely elite experience',
          'Boombox Room: Las Vegas Strip\'s premier dedicated hip-hop room',
          'Central Cosmopolitan location in the heart of the Strip',
          'Connected to Marquee Dayclub for morning-to-midnight bookings',
          'Strong weekly hip-hop residencies from top touring acts',
          'More relaxed dress code than Wynn or Caesars properties',
        ],
        slug: 'marquee-nightclub',
      }}
      relatedVenues={[
        { name: 'XS Nightclub', href: '/places/xs-nightclub' },
        { name: 'Hakkasan', href: '/places/hakkasan' },
        { name: "Drai's", href: '/nightclubs' },
        { name: 'Marquee Dayclub', href: '/places/marquee-dayclub' },
      ]}
    />

      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Book Your Experience</h2>
          <p className="text-gray-600 mb-12 text-lg">
            Browse upcoming events, select your table, and submit a reservation request
          </p>
          <EventPricingSelector venueName="Marquee Nightclub" venueSlug="marquee-nightclub" />
        </div>
      </section>
    </>
  )
}
