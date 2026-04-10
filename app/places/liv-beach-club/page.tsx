export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'
import BookingFlowV2 from '@/components/booking-v2/BookingFlowV2'

const useBookingV2 = true

export const metadata: Metadata = {
  title: 'LIV Beach Club Las Vegas | Fontainebleau Pool Party VIP Cabanas',
  description: 'Book VIP cabanas at LIV Beach Club at Fontainebleau Las Vegas. The legendary Miami brand brings its pool party to the Strip. Personal host. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/liv-beach-club' },
}

export default async function LIVBeachClub() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'LIV Beach Club',
        hotel: 'Fontainebleau Las Vegas',
        address: '2777 S Las Vegas Blvd, Las Vegas, NV 89109',
        category: 'Dayclub',
        size: 'Multi-level outdoor pool complex',
        capacity: '~3,000 guests',
        openDays: 'Friday–Sunday (seasonal)',
        hours: '11:00 AM – 6:00 PM',
        tableMin: '$1,200+ (cabana), $350+ (daybed)',
        coverCharge: '$40–$65 general admission',
        music: 'Hip-hop, EDM, Top 40',
        dresscode: 'Fashion swimwear — no cargo shorts, athletic wear, or flip flops (men)',
        image: '/images/venues/liv-beach-club.jpg',
        description: "LIV Beach Club at Fontainebleau Las Vegas brings the energy of LIV Miami — one of the world's most famous nightlife brands — to the Las Vegas pool scene. The multi-level outdoor complex at Fontainebleau is one of the most architecturally impressive dayclub settings in the city, and the brand's legacy of hip-hop and celebrity-driven entertainment translates seamlessly to the desert pool environment.",
        highlights: [
          'LIV Miami\'s legendary entertainment brand now at the Fontainebleau Las Vegas',
          'Multi-level outdoor pool complex — one of Vegas\'s most impressive dayclub layouts',
          'Hip-hop and celebrity-driven programming — the LIV brand DNA',
          'Connected to LIV Nightclub for the ultimate day-to-night experience',
          'Fontainebleau\'s architectural splendor creates a truly unique setting',
          'North Strip location with easier access and less Strip traffic',
        ],
        slug: 'liv-beach-club',
      }}
      relatedVenues={[
        { name: 'Encore Beach Club', href: '/places/encore-beach-club' },
        { name: 'LIV Nightclub', href: '/places/liv-nightclub' },
        { name: 'Marquee Dayclub', href: '/places/marquee-dayclub' },
        { name: 'Kassi Beach Club', href: '/places/kassi-beach-club' },
      ]}
    />

<section id="event-booking" className="bg-gray-50 py-12 md:py-16 scroll-mt-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-4xl font-bold text-gray-900 mb-2">Book Your Experience</h2>
    <p className="text-gray-600 mb-12 text-lg">
      Browse upcoming events, select your table, and submit a reservation request
    </p>
    {useBookingV2 ? (
      <BookingFlowV2 venueName="LIV Beach Club" venueSlug="liv-beach-club" />
    ) : (
      <EventPricingSelector venueName="LIV Beach Club" venueSlug="liv-beach-club" />
    )}
  </div>
</section>
    </>
  )
}
