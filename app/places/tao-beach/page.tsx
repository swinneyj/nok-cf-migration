export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'
import BookingFlowV2 from '@/components/booking-v2/BookingFlowV2'

const useBookingV2 = true

export const metadata: Metadata = {
  title: 'Tao Beach Las Vegas | VIP Cabana & Daybed Reservations at Venetian',
  description: 'Book VIP cabanas and daybeds at Tao Beach at The Venetian Las Vegas. Premium pool experience with world-class DJ programming. Personal host, skip the line, bottle service. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/tao-beach' },
}

export default async function TaoBench() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'Tao Beach',
        hotel: 'The Venetian Las Vegas',
        address: '3355 S Las Vegas Blvd, Las Vegas, NV 89109',
        category: 'Dayclub',
        size: '50,000 sq ft',
        capacity: '~3,500 guests',
        openDays: 'Friday–Sunday (seasonal May–September)',
        hours: '11:00 AM – 6:00 PM',
        tableMin: '$2,000+ (cabana), $400+ (daybed)',
        coverCharge: '$40–$70 general admission',
        music: 'EDM, House, Top 40, Hip-Hop',
        dresscode: 'Smart casual swimwear — no baggy shorts, athletic wear, or flip flops (men)',
        image: '/images/venues/tao-beach.jpg',
        description: 'Tao Beach brings Asian-inspired luxury poolside living to Las Vegas. Located at The Venetian, this premier dayclub features multiple pool levels, private cabanas with premium furnishings, and a sophisticated atmosphere that combines world-class DJ programming with upscale dining. Every element is designed for guests who demand the finest in Las Vegas dayclub experiences.',
        highlights: [
          'Multiple tiered pool levels with exclusive cabana areas and premium lounging',
          'World-class DJ programming with top residencies and guest appearances',
          'Exceptional service standards matching The Venetian\'s luxury hospitality',
          'Asian-inspired design aesthetic and sophisticated poolside atmosphere',
          'Adjacent to Tao Nightclub for seamless night-life transition',
          'Premium cabanas with prime views and priority service',
        ],
        slug: 'tao-beach',
      }}
      relatedVenues={[
        { name: 'Encore Beach Club', href: '/places/encore-beach-club' },
        { name: 'Marquee Dayclub', href: '/places/marquee-dayclub' },
        { name: 'Omnia Dayclub', href: '/places/omnia-dayclub' },
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
      <BookingFlowV2 venueName="Tao Beach" venueSlug="tao-beach" />
    ) : (
      <EventPricingSelector venueName="Tao Beach" venueSlug="tao-beach" />
    )}
  </div>
</section>
    </>
  )
}
