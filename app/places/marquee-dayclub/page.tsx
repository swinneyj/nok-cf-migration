export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'
import BookingFlowV2 from '@/components/booking-v2/BookingFlowV2'

const useBookingV2 = true

export const metadata: Metadata = {
  title: 'Marquee Dayclub Las Vegas | VIP Cabana & Pool Party Reservations',
  description: 'Book VIP cabanas and daybeds at Marquee Dayclub at The Cosmopolitan Las Vegas. Infinity-edge pools, Strip views, personal host. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/marquee-dayclub' },
}

export default async function MarqueeDayclub() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'Marquee Dayclub',
        hotel: 'The Cosmopolitan of Las Vegas',
        address: '3708 S Las Vegas Blvd, Las Vegas, NV 89109',
        category: 'Dayclub',
        size: '65,000 sq ft outdoor',
        capacity: '~4,000 guests',
        openDays: 'Friday–Sunday (seasonal April–October)',
        hours: '11:00 AM – 6:00 PM',
        tableMin: '$1,500+ (cabana), $350+ (daybed)',
        coverCharge: '$40–$65 general admission',
        music: 'Hip-hop, EDM, House',
        dresscode: 'Fashion swimwear — board shorts acceptable for men, no cargo or athletic shorts',
        image: '/images/venues/marquee-dayclub.jpg',
        description: 'Marquee Dayclub at The Cosmopolitan delivers one of the most visually spectacular dayclub experiences in Las Vegas. Infinity-edge pools overlook the Strip, upper-level bungalows offer private plunge pools with panoramic views, and the programming rotates between top-tier EDM and hip-hop acts throughout the season.',
        highlights: [
          'Infinity-edge pools with unobstructed Las Vegas Strip views',
          'Upper bungalows feature private pools and the best views in dayclubbing',
          'Strong mix of hip-hop and EDM programming throughout the season',
          'Central Cosmopolitan Strip location — easy access from any hotel',
          'Connected to Marquee Nightclub for day-to-night packages',
          'More accessible pricing than Encore Beach Club',
        ],
        slug: 'marquee-dayclub',
      }}
      bookingReasons={[
        {
          title: 'We Help You Choose Between Daybed, Cabana, or Bungalow',
          desc: 'Marquee Dayclub has a wider range of price points than EBC, but that also means more ways to book the wrong setup. We help groups line up the right spend with the kind of day they actually want.',
        },
        {
          title: 'Cosmopolitan Groups Get a Smoother Plan',
          desc: 'If your crew is staying at The Cosmopolitan or nearby, Marquee is one of the easiest venues to build around. We help time arrival, table check-in, and the rest of the day so it feels effortless.',
        },
        {
          title: 'Hip-Hop vs EDM Days Change the Value',
          desc: 'Marquee can feel very different depending on the artist and crowd. We help you book around the right date and table tier instead of assuming every pool day has the same energy.',
        },
        {
          title: 'It Works Especially Well in a Day-to-Night Itinerary',
          desc: 'Marquee Dayclub and Marquee Nightclub pair well for groups that want one home base at Cosmo. We can build that weekend so the transitions and spend make sense.',
        },
      ]}
      reviewsHeading="What Clients Say About Booking With Nokturnal"
      reviews={[
        {
          name: 'Angel G.',
          date: 'April 2023',
          location: 'Bell, CA',
          rating: 5,
          source: 'Yelp review',
          text: 'My boy Justin and his brother took care of us for all of our events. As easy as shooting us a price and coordinating every single detail with TAO nightclub and Marquee Day Party and we just showed up. They were always prompt to greet us and show us around.',
        },
        {
          name: 'Rohit R.',
          date: 'January 2015',
          location: 'Jacksonville, FL',
          rating: 5,
          source: 'Yelp review',
          text: 'He hooked us up with a party bus and a table by the pool at XS, it was just amazing and the next time we hung out at Marquee at a pool party all day. We all had a very good time and will definitely reach out to Justin the next time we are in Vegas.',
        },
        {
          name: 'Florencia L.',
          date: '6/22/2016 Updated review',
          location: 'México, D.F., Mexico',
          rating: 5,
          source: 'Yelp review',
          text: 'Justin and Josh are by far the best hosts and concierges in Vegas. They are amazing, always taking the best care of you and giving you the best service. I have organized my Vegas time with them a couple of times and I am looking forward to the next time.',
        },
      ]}
      relatedVenues={[
        { name: 'Encore Beach Club', href: '/places/encore-beach-club' },
        { name: 'Elia Beach Club', href: '/pool-parties' },
        { name: 'Marquee Nightclub', href: '/places/marquee-nightclub' },
      ]}
    />

<section id="event-booking" className="bg-gray-50 py-12 md:py-16 scroll-mt-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-4xl font-bold text-gray-900 mb-2">Book Your Experience</h2>
    <p className="text-gray-600 mb-12 text-lg">
      Browse upcoming events, select your table, and submit a reservation request
    </p>
    {useBookingV2 ? (
      <BookingFlowV2 venueName="Marquee Dayclub" venueSlug="marquee-dayclub" />
    ) : (
      <EventPricingSelector venueName="Marquee Dayclub" venueSlug="marquee-dayclub" />
    )}
  </div>
</section>
    </>
  )
}
