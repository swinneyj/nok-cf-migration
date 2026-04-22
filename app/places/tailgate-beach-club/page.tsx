export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import Link from 'next/link'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'
import BookingFlowV2 from '@/components/booking-v2/BookingFlowV2'

const useBookingV2 = true

export const metadata: Metadata = {
  title: 'Tailgate Beach Club Las Vegas | VIP Cabana & Pool Party Reservations',
  description: 'Book VIP cabanas and daybeds at Tailgate Beach Club at Mandalay Bay Las Vegas. Grand Opening 2026. Premium F&B, world-class DJs, beachfront atmosphere. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/tailgate-beach-club' },
}

export default async function TailgateBeachClub() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'Tailgate Beach Club',
        hotel: 'Mandalay Bay Las Vegas',
        address: '3950 S Las Vegas Blvd, Las Vegas, NV 89119',
        category: 'Dayclub',
        size: '45,000 sq ft',
        capacity: '~3,500 guests',
        openDays: 'Thursday–Sunday (seasonal)',
        hours: '11:00 AM – 6:00 PM',
        tableMin: '$1,000+ (cabana), $250+ (daybed)',
        coverCharge: '$25–$50 general admission',
        music: 'Hip-Hop, Top 40, Electronic',
        dresscode: 'Swimwear and fashion casual — no aggressive athletic wear (men)',
        image: '/images/venues/tailgate-beach-club.jpg',
        description: 'Tailgate Beach Club reimagines the Las Vegas pool party experience with a sophisticated yet fun atmosphere. Located at Mandalay Bay, this newly opened venue combines premium cabana experiences with an energetic beach club vibe. Multiple tiered pool areas, state-of-the-art sound system, and exceptional food and beverage programming make Tailgate a fresh addition to Las Vegas\'s dayclub scene.',
        highlights: [
          'Brand new Grand Opening 2026 — Vegas\'s newest dayclub experience',
          'Multiple tiered pool areas with premium cabanas and daybed options',
          'Premium F&B programming with top local chefs and beverage specialists',
          'State-of-the-art sound and lighting system',
          'Mandalay Bay South Beach location — unique positioning off the main Strip',
          'Sophisticated yet fun atmosphere — less corporate than mega-clubs',
          'Perfect for groups seeking a fresh Vegas dayclub experience',
        ],
        slug: 'tailgate-beach-club',
      }}
      relatedVenues={[
        { name: 'Encore Beach Club', href: '/places/encore-beach-club' },
        { name: 'Marquee Dayclub', href: '/places/marquee-dayclub' },
        { name: 'LIV Beach Club', href: '/places/liv-beach-club' },
      ]}
      beforeAboutSection={
        <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-night-900 to-night-800">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Grand Opening Party
                </h2>
                <p className="text-white/80 text-lg mb-6 leading-relaxed">
                  Experience the ultimate Vegas pool party at Tailgate Beach Club's exclusive Grand Opening celebration. Premium cabanas, world-class entertainment, and unforgettable vibes. This is the event you don't want to miss.
                </p>
                <Link href="/contact" className="btn-gold inline-block">
                  RESERVE YOUR SPOT
                </Link>
              </div>
              <div className="order-1 md:order-2">
                <img
                  src="/images/venues/tailgate-opening-day-flyer.jpg"
                  alt="Tailgate Beach Club Grand Opening Party"
                  className="w-full rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>
      }
    />

    <section id="event-booking" className="bg-gray-50 py-12 md:py-16 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">Book Your Experience</h2>
        <p className="text-gray-600 mb-12 text-lg">
          Browse upcoming Tailgate events, view live flyer-backed pricing, and submit a reservation request.
        </p>
        {useBookingV2 ? (
          <BookingFlowV2 venueName="Tailgate Beach Club" venueSlug="tailgate-beach-club" />
        ) : (
          <EventPricingSelector venueName="Tailgate Beach Club" venueSlug="tailgate-beach-club" />
        )}
      </div>
    </section>
    </>
  )
}
