export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'
import BookingFlowV2 from '@/components/booking-v2/BookingFlowV2'

const useBookingV2 = true

export const metadata: Metadata = {
  title: "Drai's Nightclub Las Vegas | Rooftop VIP Tables & Bottle Service",
  description: "Book VIP tables at Drai's Nightclub at The Cromwell Las Vegas. The only rooftop nightclub on the Strip, hip-hop focus, Strip views. Personal host. Call (702) 996-4884.",
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/drais-nightclub' },
}

export default async function DraisNightclub() {
  return (
    <>
      <VenuePage
      venue={{
        name: "Drai's Nightclub",
        hotel: 'The Cromwell Las Vegas',
        address: '3595 S Las Vegas Blvd, Las Vegas, NV 89109',
        category: 'Nightclub',
        size: 'Rooftop venue',
        capacity: '~1,500 guests',
        openDays: 'Thursday–Saturday',
        hours: '11:00 PM – 4:00 AM',
        tableMin: '$350–$1,800+ (weekend)',
        coverCharge: '$25–$40 general admission',
        music: 'Hip-hop, R&B, Top 40',
        dresscode: 'Smart casual to upscale — clean sneakers acceptable, no shorts',
        image: '/images/venues/drais.jpg',
        description: "Drai's Nightclub sits atop The Cromwell hotel, making it the only true rooftop nightclub directly on the Las Vegas Strip. The skyline views are unmatched, and the venue's dedication to hip-hop and R&B programming attracts an urban crowd that you won't find at the EDM-focused mega-clubs. If your group is into hip-hop, Drai's is the move.",
        highlights: [
          'Only rooftop nightclub directly on the Las Vegas Strip — views are truly spectacular',
          'Best hip-hop and R&B nightclub programming in Las Vegas',
          'Open-air sections bring a unique outdoor nightclub experience',
          'Connected to Drai\'s Beach Club for day-to-night weekend packages',
          'More relaxed dress code than Wynn or Caesars properties',
          'Consistent A-list hip-hop and R&B artist residencies',
        ],
        slug: 'drais-nightclub',
      }}
      bookingReasons={[
        {
          title: 'Rooftop Tables at Drai’s Are Not All Equal',
          desc: 'Drai’s is all about views, artist nights, and the right section for your group. We help you avoid paying for a weak table and steer you toward the parts of the rooftop that actually feel worth it.',
        },
        {
          title: 'Hip-Hop Nights Need a Different Booking Strategy',
          desc: 'Drai’s attracts a different crowd than the EDM mega-clubs, and the value can shift fast on artist-driven nights. We help groups book around the right event instead of guessing.',
        },
        {
          title: 'The Cromwell Timing Can Make or Break the Night',
          desc: 'Because Drai’s sits on top of The Cromwell, arrival flow matters more than people expect. We help your group hit the venue at the right time and avoid getting bogged down.',
        },
        {
          title: 'Drai’s Works Best for the Right Group',
          desc: 'If your group wants rooftop energy, hip-hop, and a more open-air Vegas feel, Drai’s can be a great fit. If not, we will usually tell you that before you spend the money.',
        },
      ]}
      reviewsHeading="What Clients Say About Booking With Nokturnal"
      reviews={[
        {
          name: 'Elyyse L.',
          date: 'June 2018',
          location: 'Summerlin, Las Vegas, NV',
          rating: 5,
          source: 'Yelp review',
          text: 'Top notch! Justin and Josh hooked it up for my sisters bachelorette party. We did a table at Drais for 2 Chainz with amazing bottle deals. Josh got us upgraded from a patio table to a table on the balcony overlooking the stage, which literally made the night.',
        },
        {
          name: 'Nay J.',
          date: 'February 2017',
          location: 'Los Angeles, CA',
          rating: 5,
          source: 'Yelp review',
          text: 'Everything was great! We used Nokturnal Lifestyle to go Drais on Saturday. We got in free too! Thank you guys!',
        },
        {
          name: 'Arthur C.',
          date: 'November 2014',
          location: 'Brea, CA',
          rating: 5,
          source: 'Yelp review',
          text: "I recently went to Vegas on 2 separate occasions, and Justin at NLS really made things come together perfectly. I've gone to many of the clubs in Vegas through many different hosts throughout the years, but how Justin takes care of you makes things just so easy and worry-free.",
        },
      ]}
      relatedVenues={[
        { name: 'Marquee Nightclub', href: '/places/marquee-nightclub' },
        { name: 'TAO Nightclub', href: '/places/tao-nightclub' },
        { name: "Drai's Beach Club", href: '/places/drais-beach-club' },
        { name: 'LIV Nightclub', href: '/places/liv-nightclub' },
      ]}
    />

<section id="event-booking" className="bg-gray-50 py-12 md:py-16 scroll-mt-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-4xl font-bold text-gray-900 mb-2">Book Your Experience</h2>
    <p className="text-gray-600 mb-12 text-lg">
      Browse upcoming events, select your table, and submit a reservation request
    </p>
    {useBookingV2 ? (
      <BookingFlowV2 venueName="Drai's Nightclub" venueSlug="drais-nightclub" />
    ) : (
      <EventPricingSelector venueName="Drai's Nightclub" venueSlug="drais-nightclub" />
    )}
  </div>
</section>
    </>
  )
}
