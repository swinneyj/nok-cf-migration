export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'
import BookingFlowV2 from '@/components/booking-v2/BookingFlowV2'

const useBookingV2 = true

export const metadata: Metadata = {
  title: 'Crazy Horse 3 Las Vegas | VIP Entry & Strip Club Packages',
  description: 'VIP entry to Crazy Horse 3 Las Vegas — skip the line, no cover, free drinks. Personal host from hotel pickup. The largest gentleman\'s club in Las Vegas. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/crazy-horse-3' },
}

export default function CrazyHorse3() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'Crazy Horse 3',
        hotel: 'Off-Strip (Transportation provided)',
        address: '3525 W Russell Rd, Las Vegas, NV 89118',
        category: 'Strip Club',
        size: 'World-class multi-room venue',
        capacity: 'Large — multiple stages and VIP areas',
        openDays: 'Monday–Sunday',
        hours: '4:00 PM – 6:00 AM',
        tableMin: 'VIP packages from $50/person (includes entry + drinks)',
        coverCharge: '$40+ at door (waived with our packages)',
        music: 'Hip-hop, Top 40, EDM',
        dresscode: 'Smart casual — no athletic wear or flip flops',
        image: '/images/venues/crazy-horse-3.jpg',
        description: "Crazy Horse 3 is Las Vegas's largest and most renowned gentleman's club. Unlike most entertainment venues, CH3 operates at a level of quality and scale that places it in a class of its own. World-class entertainment, VIP suites, multiple themed rooms, and a reputation that draws visitors from around the world make it the go-to stop on any Las Vegas bachelor party or group night out.",
        highlights: [
          'Las Vegas\'s largest gentleman\'s club — world-class scale and production',
          'Multiple themed entertainment rooms',
          'VIP suites for private group experiences',
          'Frequent celebrity appearances and special events',
          'Free hotel transportation coordinated through Nokturnal',
          'Best bachelor party strip club experience in Las Vegas',
        ],
        slug: 'crazy-horse-3',
      }}
      relatedVenues={[
        { name: 'Sapphire Las Vegas', href: '/places/sapphire' },
        { name: 'All Strip Club Packages', href: '/strip-clubs' },
      ]}
    />
  

<section id="event-booking" className="bg-gray-50 py-12 md:py-16 scroll-mt-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-4xl font-bold text-gray-900 mb-2">Book Your Experience</h2>
    <p className="text-gray-600 mb-12 text-lg">
      Browse upcoming events, select your table, and submit a reservation request
    </p>
    {useBookingV2 ? (
      <BookingFlowV2 venueName="Crazy Horse 3" venueSlug="crazy-horse-3" />
    ) : (
      <EventPricingSelector venueName="Crazy Horse 3" venueSlug="crazy-horse-3" />
    )}
  </div>
</section>
    </>
  )
}
