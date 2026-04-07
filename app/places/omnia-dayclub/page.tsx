export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'

export const metadata: Metadata = {
  title: 'Omnia Dayclub Las Vegas | Caesars Palace Pool Party VIP Cabanas',
  description: 'Book VIP cabanas at Omnia Dayclub at Caesars Palace Las Vegas. Brand new dayclub experience from the creators of Omnia Nightclub. Personal host. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/omnia-dayclub' },
}

export default async function OmniaDayclub() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'Omnia Dayclub',
        hotel: 'Caesars Palace Las Vegas',
        address: '3570 S Las Vegas Blvd, Las Vegas, NV 89109',
        category: 'Dayclub',
        size: 'Outdoor pool complex',
        capacity: '~2,500 guests',
        openDays: 'Friday–Sunday (seasonal)',
        hours: '11:00 AM – 6:00 PM',
        tableMin: '$1,500+ (cabana), $400+ (daybed)',
        coverCharge: '$40–$65 general admission',
        music: 'EDM, House, Top 40',
        dresscode: 'Fashion swimwear — no cargo shorts, athletic wear, or flip flops (men)',
        image: '/images/venues/omnia-dayclub.jpg',
        description: "Omnia Dayclub is the brand new daytime experience from Hakkasan Group at Caesars Palace, bringing the same world-class production standards that define Omnia Nightclub to Las Vegas pool party culture. Located at one of the most prestigious addresses on the Strip, Omnia Dayclub offers a premium dayclub experience backed by Caesars' legendary service and the Omnia brand's reputation for spectacular production.",
        highlights: [
          'Brand new dayclub from the creators of Omnia Nightclub — instant prestige',
          'Caesars Palace location — one of the most iconic addresses on the Strip',
          'Omnia-level production quality brought to the daytime pool experience',
          'Premium cabana options with dedicated service',
          'Connects with Omnia Nightclub for full day-to-night Caesars experiences',
          'World-class DJ programming from the Hakkasan Group entertainment team',
        ],
        slug: 'omnia-dayclub',
      }}
      relatedVenues={[
        { name: 'Encore Beach Club', href: '/places/encore-beach-club' },
        { name: 'Marquee Dayclub', href: '/places/marquee-dayclub' },
        { name: 'Omnia Nightclub', href: '/places/omnia' },
        { name: 'Kassi Beach Club', href: '/places/kassi-beach-club' },
      ]}
    />

      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Book Your Experience</h2>
          <p className="text-gray-600 mb-12 text-lg">
            Browse upcoming events, select your table, and submit a reservation request
          </p>
          <EventPricingSelector venueName="Omnia Dayclub" venueSlug="omnia-dayclub" />
        </div>
      </section>
    </>
  )
}
