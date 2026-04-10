export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'
import BookingFlowV2 from '@/components/booking-v2/BookingFlowV2'

const useBookingV2 = true

export const metadata: Metadata = {
  title: 'TAO Nightclub Las Vegas | VIP Table Reservations & Bottle Service',
  description: 'Book VIP bottle service at TAO Nightclub at Venetian Las Vegas. Skip the line, personal host, celebrity-loved venue. Minimums from $350. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/tao-nightclub' },
}

export default async function TaoNightclub() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'TAO Nightclub',
        hotel: 'The Venetian Las Vegas',
        address: '3377 S Las Vegas Blvd, Las Vegas, NV 89109',
        category: 'Nightclub',
        size: '10,000 sq ft',
        capacity: '~1,500 guests',
        openDays: 'Friday & Saturday (select Thursdays)',
        hours: '10:30 PM – 4:00 AM',
        tableMin: '$350–$2,000+ (weekend)',
        coverCharge: '$25–$40 general admission',
        music: 'Hip-hop, R&B, EDM',
        dresscode: 'Upscale — dress shoes required for men, no shorts or athletic wear',
        image: '/images/venues/tao-nightclub.jpg',
        description: 'TAO Nightclub at The Venetian Las Vegas is one of the most iconic and celebrity-frequented venues on the Strip. Despite being more intimate than the mega-clubs, TAO delivers a high-energy experience with A-list appearances, stunning Asian-inspired décor, and a 40-foot terrace overlooking the Las Vegas Strip. Eight private skyboxes make it the go-to for groups who want exclusivity.',
        highlights: [
          '40-foot terrace with panoramic Las Vegas Strip views',
          'Eight private skyboxes with dedicated bottle service',
          'One of the most celebrity-frequented nightclubs in Las Vegas',
          'Stunning Asian-inspired décor — some of the best interior design in Vegas nightlife',
          'More intimate than mega-clubs — every table feels premium',
          'Consistent A-list DJ and entertainer bookings',
        ],
        slug: 'tao-nightclub',
      }}
      relatedVenues={[
        { name: 'XS Nightclub', href: '/places/xs-nightclub' },
        { name: 'Hakkasan', href: '/places/hakkasan' },
        { name: "Drai's Nightclub", href: '/places/drais-nightclub' },
        { name: 'Marquee Nightclub', href: '/places/marquee-nightclub' },
      ]}
    />

<section id="event-booking" className="bg-gray-50 py-12 md:py-16 scroll-mt-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-4xl font-bold text-gray-900 mb-2">Book Your Experience</h2>
    <p className="text-gray-600 mb-12 text-lg">
      Browse upcoming events, select your table, and submit a reservation request
    </p>
    {useBookingV2 ? (
      <BookingFlowV2 venueName="TAO Nightclub" venueSlug="tao-nightclub" />
    ) : (
      <EventPricingSelector venueName="TAO Nightclub" venueSlug="tao-nightclub" />
    )}
  </div>
</section>
    </>
  )
}
