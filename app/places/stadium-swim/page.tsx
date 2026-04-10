export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'
import BookingFlowV2 from '@/components/booking-v2/BookingFlowV2'

const useBookingV2 = true

export const metadata: Metadata = {
  title: 'Stadium Swim Las Vegas | Circa Resort Pool Party & VIP Cabanas',
  description: 'Book VIP cabanas at Stadium Swim at Circa Resort Las Vegas. Watch sports on a 143-foot screen from the pool. Personal host. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/stadium-swim' },
}

export default function StadiumSwim() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'Stadium Swim',
        hotel: 'Circa Resort & Casino',
        address: '8 Fremont St, Las Vegas, NV 89101',
        category: 'Dayclub',
        size: 'Five-story amphitheater pool',
        capacity: '~4,000 guests',
        openDays: 'Daily (pool), Event nights vary',
        hours: '8:00 AM – 10:00 PM (pool), later for events',
        tableMin: '$500+ (cabana), $150+ (daybed)',
        coverCharge: 'Varies by event — often free for hotel guests',
        music: 'Sports audio, live DJ events',
        dresscode: 'Standard swimwear — more relaxed than Strip dayclubs',
        image: '/images/venues/stadium-swim.jpg',
        description: "Stadium Swim at Circa Resort is unlike anything else in Las Vegas — a five-story amphitheater pool with a 143-foot LED screen broadcasting sports, concerts, and events. It's the ultimate destination for watching the big game from the pool. Located in Downtown Las Vegas rather than the Strip, Stadium Swim offers a uniquely Vegas experience that no other city in the world can replicate.",
        highlights: [
          '143-foot LED screen — watch any major sporting event from the pool',
          'Five-story amphitheater design with tiered pool and seating levels',
          'Downtown Las Vegas location — different energy from the Strip',
          'Adults-only (21+) throughout the Circa property',
          'Perfect for sports events: Super Bowl, March Madness, UFC, NFL',
          'Live DJ events on weekend nights transform the experience after dark',
        ],
        slug: 'stadium-swim',
      }}
      relatedVenues={[
        { name: 'Encore Beach Club', href: '/places/encore-beach-club' },
        { name: 'Marquee Dayclub', href: '/places/marquee-dayclub' },
        { name: 'AYU Dayclub', href: '/places/ayu-dayclub' },
      ]}
    />
  

<section id="event-booking" className="bg-gray-50 py-12 md:py-16 scroll-mt-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-4xl font-bold text-gray-900 mb-2">Book Your Experience</h2>
    <p className="text-gray-600 mb-12 text-lg">
      Browse upcoming events, select your table, and submit a reservation request
    </p>
    {useBookingV2 ? (
      <BookingFlowV2 venueName="Stadium Swim" venueSlug="stadium-swim" />
    ) : (
      <EventPricingSelector venueName="Stadium Swim" venueSlug="stadium-swim" />
    )}
  </div>
</section>
    </>
  )
}
