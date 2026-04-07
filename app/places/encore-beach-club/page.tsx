export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'

export const metadata: Metadata = {
  title: 'Encore Beach Club Las Vegas | VIP Cabana & Daybed Reservations',
  description: 'Book VIP cabanas and daybeds at Encore Beach Club at Wynn Las Vegas. The #1 Las Vegas dayclub. Personal host, skip the line, bottle service. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/encore-beach-club' },
}

export default async function EncoreBeachClub() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'Encore Beach Club',
        hotel: 'Encore at Wynn Las Vegas',
        address: '3121 S Las Vegas Blvd, Las Vegas, NV 89109',
        category: 'Dayclub',
        size: '60,000 sq ft outdoor',
        capacity: '~4,000 guests',
        openDays: 'Friday–Sunday (seasonal May–September)',
        hours: '11:00 AM – 6:00 PM',
        tableMin: '$2,500+ (cabana), $500+ (daybed)',
        coverCharge: '$50–$80 general admission',
        music: 'EDM, House, Top 40',
        dresscode: 'Fashion swimwear — no cargo shorts, athletic wear, or flip flops (men)',
        image: '/images/venues/encore-beach-club.jpg',
        description: 'Encore Beach Club is the gold standard of Las Vegas dayclubs. The outdoor venue features multiple pool areas, private bungalows with their own plunge pools, and the world-class DJ programming that defines the Wynn brand. Every detail — from the service to the sound system — operates at a level that genuinely separates EBC from every other Las Vegas dayclub.',
        highlights: [
          'Private bungalows with personal plunge pools — the most exclusive dayclub experience in Vegas',
          'World-class DJ residencies poolside: Diplo, Kygo, and top EDM acts',
          'Wynn-level service standard — best staff in Las Vegas dayclubbing',
          'Multiple pool and lounge areas with tiered seating options',
          'Connected to XS Nightclub for seamless day-to-night progression',
          'Best cabana layout of any Las Vegas dayclub',
        ],
        slug: 'encore-beach-club',
      }}
      relatedVenues={[
        { name: 'Marquee Dayclub', href: '/places/marquee-dayclub' },
        { name: 'Elia Beach Club', href: '/pool-parties' },
        { name: "Drai's Beach Club", href: '/pool-parties' },
        { name: 'AYU Dayclub', href: '/pool-parties' },
      ]}
    />

      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Book Your Experience</h2>
          <p className="text-gray-600 mb-12 text-lg">
            Browse upcoming events, select your table, and submit a reservation request
          </p>
          <EventPricingSelector venueName="Encore Beach Club" venueSlug="encore-beach-club" />
        </div>
      </section>
    </>
  )
}
