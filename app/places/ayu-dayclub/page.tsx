export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'

export const metadata: Metadata = {
  title: 'AYU Dayclub Las Vegas | Resorts World Pool Party VIP Cabanas',
  description: 'Book VIP cabanas and daybeds at AYU Dayclub at Resorts World Las Vegas. Multi-pool layout, world-class DJs, personal host. From $200/daybed. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/ayu-dayclub' },
}

export default async function AYUDayclub() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'AYU Dayclub',
        hotel: 'Resorts World Las Vegas',
        address: '3000 S Las Vegas Blvd, Las Vegas, NV 89109',
        category: 'Dayclub',
        size: 'Multi-pool outdoor complex',
        capacity: '~3,000 guests',
        openDays: 'Friday–Sunday (seasonal April–October)',
        hours: '11:00 AM – 6:00 PM',
        tableMin: '$800+ (cabana), $200+ (daybed)',
        coverCharge: '$35–$60 general admission',
        music: 'EDM, House, Electronic',
        dresscode: 'Fashion swimwear — no cargo shorts, athletic wear, or work boots',
        image: '/images/venues/ayu.jpg',
        description: "AYU Dayclub at Resorts World Las Vegas is one of the newest and most impressive dayclubs on the Strip. The multi-pool outdoor complex brings the same world-class programming ethos as the adjacent Zouk Nightclub to the daytime scene. AYU is increasingly becoming the go-to for groups who want a premium dayclub experience at more accessible pricing than Encore Beach Club.",
        highlights: [
          'Multi-pool layout with varied seating options from daybeds to full cabanas',
          'World-class DJ programming aligned with Zouk\'s music-forward approach',
          'Newer facilities — premium infrastructure throughout',
          'More accessible pricing than Encore Beach Club with comparable quality',
          'Connected to Zouk Nightclub for seamless day-to-night packages',
          'North Strip location — easier arrival and departure than mid-Strip venues',
        ],
        slug: 'ayu-dayclub',
      }}
      relatedVenues={[
        { name: 'Encore Beach Club', href: '/places/encore-beach-club' },
        { name: 'Marquee Dayclub', href: '/places/marquee-dayclub' },
        { name: 'Zouk Nightclub', href: '/places/zouk-nightclub' },
        { name: 'Omnia Dayclub', href: '/places/omnia-dayclub' },
      ]}
    />

      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Book Your Experience</h2>
          <p className="text-gray-600 mb-12 text-lg">
            Browse upcoming events, select your table, and submit a reservation request
          </p>
          <EventPricingSelector venueName="AYU Dayclub" venueSlug="ayu-dayclub" />
        </div>
      </section>
    </>
  )
}
