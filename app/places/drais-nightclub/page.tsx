export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'

export const metadata: Metadata = {
  title: "Drai's Nightclub Las Vegas | Rooftop VIP Tables & Bottle Service",
  description: "Book VIP tables at Drai's Nightclub at The Cromwell Las Vegas. The only rooftop nightclub on the Strip, hip-hop focus, Strip views. Personal host. Call (702) 996-4884.",
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/drais-nightclub' },
}

export default async function DraisNightclub() {
  return (
    <>
      <VenuePage
      venue={{
        name: "Drai's Nightclub",
        hotel: 'The Cromwell Las Vegas',
        address: '3595 S Las Vegas Blvd, Las Vegas, NV 89109',
        category: 'Nightclub',
        size: 'Rooftop venue',
        capacity: '~1,500 guests',
        openDays: 'Thursday–Saturday',
        hours: '11:00 PM – 4:00 AM',
        tableMin: '$350–$1,800+ (weekend)',
        coverCharge: '$25–$40 general admission',
        music: 'Hip-hop, R&B, Top 40',
        dresscode: 'Smart casual to upscale — clean sneakers acceptable, no shorts',
        image: '/images/venues/drais.jpg',
        description: "Drai's Nightclub sits atop The Cromwell hotel, making it the only true rooftop nightclub directly on the Las Vegas Strip. The skyline views are unmatched, and the venue's dedication to hip-hop and R&B programming attracts an urban crowd that you won't find at the EDM-focused mega-clubs. If your group is into hip-hop, Drai's is the move.",
        highlights: [
          'Only rooftop nightclub directly on the Las Vegas Strip — views are truly spectacular',
          'Best hip-hop and R&B nightclub programming in Las Vegas',
          'Open-air sections bring a unique outdoor nightclub experience',
          'Connected to Drai\'s Beach Club for day-to-night weekend packages',
          'More relaxed dress code than Wynn or Caesars properties',
          'Consistent A-list hip-hop and R&B artist residencies',
        ],
        slug: 'drais-nightclub',
      }}
      relatedVenues={[
        { name: 'Marquee Nightclub', href: '/places/marquee-nightclub' },
        { name: 'TAO Nightclub', href: '/places/tao-nightclub' },
        { name: "Drai's Beach Club", href: '/places/drais-beach-club' },
        { name: 'LIV Nightclub', href: '/places/liv-nightclub' },
      ]}
    />

      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Book Your Experience</h2>
          <p className="text-gray-600 mb-12 text-lg">
            Browse upcoming events, select your table, and submit a reservation request
          </p>
          <EventPricingSelector venueName="Drai's Nightclub" venueSlug="drais-nightclub" />
        </div>
      </section>
    </>
  )
}
