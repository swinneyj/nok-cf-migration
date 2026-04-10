export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'
import BookingFlowV2 from '@/components/booking-v2/BookingFlowV2'

const useBookingV2 = true

export const metadata: Metadata = {
  title: 'LIV Nightclub Las Vegas | Fontainebleau VIP Tables & Bottle Service',
  description: 'Book VIP tables at LIV Nightclub at Fontainebleau Las Vegas. The legendary Miami club brings its elite experience to the Strip. Personal host. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/liv-nightclub' },
}

export default async function LIVNightclub() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'LIV Nightclub',
        hotel: 'Fontainebleau Las Vegas',
        address: '2777 S Las Vegas Blvd, Las Vegas, NV 89109',
        category: 'Nightclub',
        size: '18,000 sq ft',
        capacity: '~1,200 guests',
        openDays: 'Friday & Saturday',
        hours: '11:00 PM – 5:00 AM',
        tableMin: '$500–$2,500+ (weekend)',
        coverCharge: '$30–$50 general admission',
        music: 'Hip-hop, EDM, Top 40',
        dresscode: 'Upscale — dress shoes or clean leather sneakers, no shorts or athletic wear',
        image: '/images/venues/liv-nightclub.jpg',
        description: "LIV Nightclub brings the legendary Miami Beach club — famous for celebrity-packed nights and world-class DJ performances — to the Fontainebleau Las Vegas. LIV Miami has long been considered one of the greatest nightclubs in the world, and the Las Vegas location delivers the same energy, production, and exclusivity in a stunning new venue at the north end of the Strip.",
        highlights: [
          'Extension of the world-famous LIV Miami — global nightlife royalty on the Vegas Strip',
          'Fontainebleau\'s stunning architecture creates a unique venue aesthetic',
          'Mix of hip-hop and EDM programming — broad appeal for any group',
          'Celebrity-friendly environment with strong entertainment connections',
          'Newer venue with state-of-the-art sound and lighting production',
          'North Strip location — less crowded approach than mid-Strip mega-clubs',
        ],
        slug: 'liv-nightclub',
      }}
      relatedVenues={[
        { name: 'XS Nightclub', href: '/places/xs-nightclub' },
        { name: 'Zouk', href: '/places/zouk-nightclub' },
        { name: "Drai's Nightclub", href: '/places/drais-nightclub' },
        { name: 'LIV Beach Club', href: '/places/liv-beach-club' },
      ]}
    />

<section id="event-booking" className="bg-gray-50 py-12 md:py-16 scroll-mt-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-4xl font-bold text-gray-900 mb-2">Book Your Experience</h2>
    <p className="text-gray-600 mb-12 text-lg">
      Browse upcoming events, select your table, and submit a reservation request
    </p>
    {useBookingV2 ? (
      <BookingFlowV2 venueName="LIV Nightclub" venueSlug="liv-nightclub" />
    ) : (
      <EventPricingSelector venueName="LIV Nightclub" venueSlug="liv-nightclub" />
    )}
  </div>
</section>
    </>
  )
}
