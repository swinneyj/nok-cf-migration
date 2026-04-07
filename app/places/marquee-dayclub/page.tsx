export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'

export const metadata: Metadata = {
  title: 'Marquee Dayclub Las Vegas | VIP Cabana & Pool Party Reservations',
  description: 'Book VIP cabanas and daybeds at Marquee Dayclub at The Cosmopolitan Las Vegas. Infinity-edge pools, Strip views, personal host. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/marquee-dayclub' },
}

export default async function MarqueeDayclub() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'Marquee Dayclub',
        hotel: 'The Cosmopolitan of Las Vegas',
        address: '3708 S Las Vegas Blvd, Las Vegas, NV 89109',
        category: 'Dayclub',
        size: '65,000 sq ft outdoor',
        capacity: '~4,000 guests',
        openDays: 'Friday–Sunday (seasonal April–October)',
        hours: '11:00 AM – 6:00 PM',
        tableMin: '$1,500+ (cabana), $350+ (daybed)',
        coverCharge: '$40–$65 general admission',
        music: 'Hip-hop, EDM, House',
        dresscode: 'Fashion swimwear — board shorts acceptable for men, no cargo or athletic shorts',
        image: '/images/venues/marquee-dayclub.jpg',
        description: 'Marquee Dayclub at The Cosmopolitan delivers one of the most visually spectacular dayclub experiences in Las Vegas. Infinity-edge pools overlook the Strip, upper-level bungalows offer private plunge pools with panoramic views, and the programming rotates between top-tier EDM and hip-hop acts throughout the season.',
        highlights: [
          'Infinity-edge pools with unobstructed Las Vegas Strip views',
          'Upper bungalows feature private pools and the best views in dayclubbing',
          'Strong mix of hip-hop and EDM programming throughout the season',
          'Central Cosmopolitan Strip location — easy access from any hotel',
          'Connected to Marquee Nightclub for day-to-night packages',
          'More accessible pricing than Encore Beach Club',
        ],
        slug: 'marquee-dayclub',
      }}
      relatedVenues={[
        { name: 'Encore Beach Club', href: '/places/encore-beach-club' },
        { name: 'Elia Beach Club', href: '/pool-parties' },
        { name: 'Marquee Nightclub', href: '/places/marquee-nightclub' },
      ]}
    />

      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Book Your Experience</h2>
          <p className="text-gray-600 mb-12 text-lg">
            Browse upcoming events, select your table, and submit a reservation request
          </p>
          <EventPricingSelector venueName="Marquee Dayclub" venueSlug="marquee-dayclub" />
        </div>
      </section>
    </>
  )
}
