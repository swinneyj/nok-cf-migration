export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'
import BookingFlowV2 from '@/components/booking-v2/BookingFlowV2'

const useBookingV2 = true

export const metadata: Metadata = {
  title: 'Omnia Nightclub Caesars Palace Las Vegas | VIP Tables & Bottle Service',
  description: 'VIP table reservations at Omnia Nightclub at Caesars Palace. Skip the line, personal host, best seats. Famous kinetic chandelier. Minimums from $900. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/omnia' },
}

export default async function Omnia() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'Omnia Nightclub',
        hotel: 'Caesars Palace Las Vegas',
        address: '3570 S Las Vegas Blvd, Las Vegas, NV 89109',
        category: 'Nightclub',
        size: '75,000 sq ft',
        capacity: '~3,000 guests',
        openDays: 'Thursday–Sunday',
        hours: '10:30 PM – 4:00 AM',
        tableMin: '$900–$2,500+ (weekend)',
        coverCharge: '$30–$50 general admission',
        music: 'EDM, House, Top 40',
        dresscode: 'Upscale — no athletic shoes, shorts, or caps',
        image: '/images/venues/omnia.jpg',
        description: "Omnia Nightclub at Caesars Palace delivers the most spectacular production show of any Las Vegas nightclub. The venue's iconic kinetic chandelier descends from the ceiling and moves in sync with the music — a sight that genuinely stops people in their tracks. Three distinct levels offer different experiences, from the main floor to an intimate rooftop terrace overlooking the Strip.",
        highlights: [
          'Iconic kinetic LED chandelier — the most dramatic production element in Vegas nightlife',
          'Rooftop terrace with panoramic Las Vegas Strip views',
          'The Heart: intimate underground lounge within the venue',
          'Three-level layout with distinct atmospheres on each floor',
          'Caesars Palace location — ideal Strip positioning',
          'Best light show and production value of any Vegas nightclub',
        ],
        slug: 'omnia',
      }}
      relatedVenues={[
        { name: 'XS Nightclub', href: '/places/xs-nightclub' },
        { name: 'Hakkasan', href: '/places/hakkasan' },
        { name: 'Marquee', href: '/places/marquee-nightclub' },
      ]}
    />

<section id="event-booking" className="bg-gray-50 py-12 md:py-16 scroll-mt-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-4xl font-bold text-gray-900 mb-2">Book Your Experience</h2>
    <p className="text-gray-600 mb-12 text-lg">
      Browse upcoming events, select your table, and submit a reservation request
    </p>
    {useBookingV2 ? (
      <BookingFlowV2 venueName="Omnia Nightclub" venueSlug="omnia" />
    ) : (
      <EventPricingSelector venueName="Omnia Nightclub" venueSlug="omnia" />
    )}
  </div>
</section>
    </>
  )
}
