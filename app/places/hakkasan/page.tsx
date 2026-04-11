export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'
import BookingFlowV2 from '@/components/booking-v2/BookingFlowV2'

const useBookingV2 = true

export const metadata: Metadata = {
  title: 'Hakkasan Nightclub Las Vegas | VIP Table Reservations & Bottle Service',
  description: 'Book VIP bottle service at Hakkasan Nightclub at MGM Grand Las Vegas. Skip the line, personal host, best table placement. Minimums from $800. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/hakkasan' },
}

export default async function Hakkasan() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'Hakkasan Nightclub',
        hotel: 'MGM Grand Las Vegas',
        address: '3799 S Las Vegas Blvd, Las Vegas, NV 89109',
        category: 'Nightclub',
        size: '80,000 sq ft',
        capacity: '~7,500 guests',
        openDays: 'Thursday–Sunday',
        hours: '10:00 PM – 4:00 AM',
        tableMin: '$800–$2,500+ (weekend)',
        coverCharge: '$25–$40 general admission',
        music: 'EDM, House, Hip-hop (varies by room)',
        dresscode: 'Upscale — no athletic sneakers, shorts, or baseball caps',
        image: '/images/venues/hakkasan.jpg',
        description: 'Hakkasan Nightclub at MGM Grand is the largest nightclub in Las Vegas, spanning six unique rooms across 80,000 square feet. The venue offers an unmatched range of experiences under one roof — from the massive main stage floor to the intimate Ling Ling Club, making it the best choice for large groups who want options.',
        highlights: [
          'Six distinct rooms spanning six floors — more variety than any other Vegas club',
          'The Ling Ling Club: intimate, upscale lounge within the venue',
          'Main stage with world-class DJ residencies including Tiësto and Calvin Harris',
          'Best Las Vegas nightclub for groups of 10 or more',
          'Adjacent to MGM Grand for easy hotel access',
          'Multiple music genres playing simultaneously across rooms',
        ],
        slug: 'hakkasan',
      }}
      relatedVenues={[
        { name: 'XS Nightclub', href: '/places/xs-nightclub' },
        { name: 'Omnia', href: '/places/omnia' },
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
      <BookingFlowV2 venueName="Hakkasan Nightclub" venueSlug="hakkasan" />
    ) : (
      <EventPricingSelector venueName="Hakkasan Nightclub" venueSlug="hakkasan" />
    )}
  </div>
</section>
    </>
  )
}
