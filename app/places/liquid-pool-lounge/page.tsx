export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'
import BookingFlowV2 from '@/components/booking-v2/BookingFlowV2'

const useBookingV2 = true

export const metadata: Metadata = {
  title: 'Liquid Pool Lounge ARIA Las Vegas | VIP Cabanas & Daybed Reservations',
  description: 'Book VIP cabanas at Liquid Pool Lounge at ARIA Las Vegas. Adults-only, intimate pool experience with 8 VIP cabanas. Personal host. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/liquid-pool-lounge' },
}

export default async function LiquidPoolLounge() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'Liquid Pool Lounge',
        hotel: 'ARIA Resort & Casino',
        address: '3730 S Las Vegas Blvd, Las Vegas, NV 89158',
        category: 'Dayclub',
        size: 'Boutique adults-only pool',
        capacity: '~400 guests',
        openDays: 'Daily (seasonal)',
        hours: '10:00 AM – 6:00 PM',
        tableMin: '$600+ (cabana), $150+ (daybed)',
        coverCharge: '$25–$40 general admission',
        music: 'Ambient, House, Top 40 (lower volume than mega-dayclubs)',
        dresscode: 'Standard fashion swimwear',
        image: '/images/venues/liquid.jpg',
        description: "Liquid Pool Lounge at ARIA Resort is Las Vegas's premier adults-only boutique pool experience. With only 8 VIP cabanas and a limited total capacity, Liquid delivers a level of exclusivity and personalized service that the larger dayclubs simply cannot match. Dipping pools within cabanas, refreshing cocktails, and poolside food from ARIA's world-class kitchen make this the most refined pool experience in Las Vegas.",
        highlights: [
          'Adults-only — guaranteed sophisticated, controlled atmosphere',
          'Only 8 VIP cabanas — the most exclusive cabana experience in Las Vegas',
          'Private dipping pools within select cabanas',
          'ARIA\'s world-class culinary team serves the pool — better food than any other dayclub',
          'Lower volume music creates a genuinely relaxing atmosphere',
          'Perfect for groups who want luxury over nightclub energy',
        ],
        slug: 'liquid-pool-lounge',
      }}
      relatedVenues={[
        { name: 'Encore Beach Club', href: '/places/encore-beach-club' },
        { name: 'Marquee Dayclub', href: '/places/marquee-dayclub' },
        { name: 'Jewel Nightclub', href: '/places/jewel-nightclub' },
      ]}
    />

<section id="event-booking" className="bg-gray-50 py-12 md:py-16 scroll-mt-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-4xl font-bold text-gray-900 mb-2">Book Your Experience</h2>
    <p className="text-gray-600 mb-12 text-lg">
      Browse upcoming events, select your table, and submit a reservation request
    </p>
    {useBookingV2 ? (
      <BookingFlowV2 venueName="Liquid Pool Lounge" venueSlug="liquid-pool-lounge" />
    ) : (
      <EventPricingSelector venueName="Liquid Pool Lounge" venueSlug="liquid-pool-lounge" />
    )}
  </div>
</section>
    </>
  )
}
