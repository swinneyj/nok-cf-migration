export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'
import BookingFlowV2 from '@/components/booking-v2/BookingFlowV2'

const useBookingV2 = true

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
      bookingReasons={[
        {
          title: 'EBC Is Expensive Enough That Table Choice Really Matters',
          desc: 'Encore Beach Club is one of the most premium dayclub spends in Vegas. We help groups decide when a bungalow is worth it, when a cabana is enough, and when a daybed is the smarter move.',
        },
        {
          title: 'Wynn and Encore Guests Have a Real Advantage',
          desc: 'If your group is already staying on property, we can build the day around that. That makes arrival, entry, and the handoff into the venue much smoother than trying to improvise it.',
        },
        {
          title: 'Headliner Pool Days Change Fast',
          desc: 'EBC pricing and value can swing quickly around major DJs and holiday weekends. We help you lock in early when it matters and avoid overpaying for weak positioning.',
        },
        {
          title: 'It Pairs Naturally With XS and EBC at Night',
          desc: 'Encore Beach Club is one of the easiest venues to build into a full Wynn weekend. We can shape the day and night plan together instead of treating each booking separately.',
        },
      ]}
      reviewsHeading="What Clients Say About Booking With Nokturnal"
      reviews={[
        {
          name: 'Jonathan C.',
          date: 'April 2016',
          location: 'Las Vegas, NV',
          rating: 5,
          source: 'Yelp review',
          text: 'Sick service and everything is clear when I had to book a table for encore beach club. Easy to contact with fast replies. Made the whole partying process a breeze. A must if you wanna party in Vegas!',
        },
        {
          name: 'Florencia L.',
          date: '6/22/2016 Updated review',
          location: 'México, D.F., Mexico',
          rating: 5,
          source: 'Yelp review',
          text: 'Justin and Josh are by far the best hosts and concierges in Vegas. They are amazing, always taking the best care of you and giving you the best service. I have organized my Vegas time with them a couple of times and I am looking forward to the next time.',
        },
        {
          name: 'Kathy H.',
          date: 'May 2017',
          location: 'Huntington Beach, CA',
          rating: 5,
          source: 'Yelp review',
          text: 'Justin was wonderful and a great help with Day Pool, clubs, and strip clubs. He stayed in contact with me and made sure everything was ok. My experience was amazing in Vegas!',
        },
      ]}
      relatedVenues={[
        { name: 'Marquee Dayclub', href: '/places/marquee-dayclub' },
        { name: 'Elia Beach Club', href: '/pool-parties' },
        { name: "Drai's Beach Club", href: '/pool-parties' },
        { name: 'AYU Dayclub', href: '/pool-parties' },
      ]}
    />

<section id="event-booking" className="bg-gray-50 py-12 md:py-16 scroll-mt-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-4xl font-bold text-gray-900 mb-2">Book Your Experience</h2>
    <p className="text-gray-600 mb-12 text-lg">
      Browse upcoming events, select your table, and submit a reservation request
    </p>
    {useBookingV2 ? (
      <BookingFlowV2 venueName="Encore Beach Club" venueSlug="encore-beach-club" />
    ) : (
      <EventPricingSelector venueName="Encore Beach Club" venueSlug="encore-beach-club" />
    )}
  </div>
</section>
    </>
  )
}
