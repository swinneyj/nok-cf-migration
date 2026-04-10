export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'
import BookingFlowV2 from '@/components/booking-v2/BookingFlowV2'

const useBookingV2 = true

export const metadata: Metadata = {
  title: 'Encore Beach Club at Night Las Vegas | Outdoor Nightclub & VIP Tables',
  description: "Book VIP tables at Encore Beach Club at Night at Wynn Las Vegas. The world's best outdoor nightclub experience. Personal host, skip the line. Call (702) 996-4884.",
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/ebc-at-night' },
}

export default async function EBCAtNight() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'Encore Beach Club at Night',
        hotel: 'Encore at Wynn Las Vegas',
        address: '3121 S Las Vegas Blvd, Las Vegas, NV 89109',
        category: 'Nightclub',
        size: '60,000 sq ft outdoor',
        capacity: '~4,000 guests',
        openDays: 'Select Friday & Saturday nights (seasonal, May–September)',
        hours: '9:00 PM – 2:00 AM',
        tableMin: '$1,500–$4,000+ (premium outdoor experience)',
        coverCharge: '$40–$70 general admission',
        music: 'EDM, House, Top 40',
        dresscode: 'Upscale — same standards as XS; dress shoes, no shorts, no athletic wear (men)',
        image: '/images/venues/ebc-at-night.jpg',
        description: "Encore Beach Club at Night transforms the world's premier dayclub into a spectacular open-air nightclub experience. The same stunning pool setting that defines EBC daytime — the glowing bungalows, the pristine pools, the Wynn-standard service — runs until the early morning hours on select nights. There is genuinely no other outdoor nightclub experience like it in the world.",
        highlights: [
          'The same world-class EBC setting transformed into an after-dark experience',
          'Open-air pool nightclub — completely unique in Las Vegas nightlife',
          'Wynn-level service and production quality at every point',
          'Private bungalows available with pool access after dark',
          'Top-tier DJ residencies in an outdoor amphitheater setting',
          'Pairs perfectly with EBC daytime for a full day-to-night Wynn experience',
        ],
        slug: 'ebc-at-night',
      }}
      relatedVenues={[
        { name: 'XS Nightclub', href: '/places/xs-nightclub' },
        { name: 'Encore Beach Club', href: '/places/encore-beach-club' },
        { name: 'Omnia', href: '/places/omnia' },
      ]}
    />

<section id="event-booking" className="bg-gray-50 py-12 md:py-16 scroll-mt-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-4xl font-bold text-gray-900 mb-2">Book Your Experience</h2>
    <p className="text-gray-600 mb-12 text-lg">
      Browse upcoming events, select your table, and submit a reservation request
    </p>
    {useBookingV2 ? (
      <BookingFlowV2 venueName="Encore Beach Club at Night" venueSlug="ebc-at-night" />
    ) : (
      <EventPricingSelector venueName="Encore Beach Club at Night" venueSlug="ebc-at-night" />
    )}
  </div>
</section>
    </>
  )
}
