export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'
import BookingFlowV2 from '@/components/booking-v2/BookingFlowV2'

const useBookingV2 = true

export const metadata: Metadata = {
  title: 'Jewel Nightclub ARIA Las Vegas | VIP Table Reservations & Bottle Service',
  description: 'Book VIP tables at Jewel Nightclub at ARIA Resort Las Vegas. Intimate skybox suites, LED Grand Staircase, personal host. Minimums from $300. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/jewel-nightclub' },
}

export default async function JewelNightclub() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'Jewel Nightclub',
        hotel: 'ARIA Resort & Casino',
        address: '3730 S Las Vegas Blvd, Las Vegas, NV 89158',
        category: 'Nightclub',
        size: '24,000 sq ft',
        capacity: '~800 guests',
        openDays: 'Friday & Saturday',
        hours: '10:30 PM – 4:00 AM',
        tableMin: '$300–$1,500+ (weekend)',
        coverCharge: '$20–$35 general admission',
        music: 'EDM, Hip-hop, Top 40',
        dresscode: 'Upscale — dress shoes or clean leather sneakers, no shorts or athletic wear',
        image: '/images/venues/jewel.jpg',
        description: 'Jewel Nightclub at ARIA Resort is one of the most glamorous boutique nightclub experiences in Las Vegas. At 24,000 square feet, it is intentionally more intimate than the mega-clubs — every table has a genuine sightline, every guest feels the VIP treatment. The iconic LED Grand Staircase and tasseled VIP banquettes create an atmosphere that is genuinely luxurious rather than overwhelming.',
        highlights: [
          'Iconic LED Grand Staircase — one of the most photographed features in Vegas nightlife',
          'Intimate scale — 800 capacity means better service and real VIP atmosphere',
          'Private skybox suites: The Bling Tiger and The Studio for exclusive group experiences',
          'Tasseled VIP banquettes with premium sightlines from every table',
          'ARIA\'s world-class service standards extend to every corner of the venue',
          'Best choice for smaller groups (4–12) wanting a genuine luxury experience',
        ],
        slug: 'jewel-nightclub',
      }}
      bookingReasons={[
        {
          title: 'Jewel Is Best for Groups That Want Intimacy Over Chaos',
          desc: 'Jewel is not trying to be the biggest room in Vegas, and that is exactly why some groups love it. We help you choose it when you want a boutique feel and avoid it when your crew expects mega-club energy.',
        },
        {
          title: 'Smaller Room Does Not Mean Lower Stakes',
          desc: 'Because Jewel is more intimate, table location and timing still matter. We help groups book the sections that actually preserve the luxury feel instead of ending up in a weaker spot.',
        },
        {
          title: 'ARIA Guests Can Build Around Jewel Easily',
          desc: 'If your group is staying at ARIA or nearby, Jewel can be one of the easiest premium nights to organize. We make that convenience work in your favor.',
        },
        {
          title: 'It Is a Strong Play for Smaller Groups',
          desc: 'For groups in the 4 to 12 range, Jewel can deliver a more controlled and polished night than the bigger venues. We help you know when it is the right fit.',
        },
      ]}
      reviewsHeading="What Clients Say About Booking With Nokturnal"
      reviews={[
        {
          name: 'Keith R.',
          date: 'April 2019',
          location: 'Cleveland, OH',
          rating: 5,
          source: 'Yelp review',
          text: 'My friends and I have been using Justin for the last couple years when visiting Las Vegas. I have dealt with 4 different people now when coming to party in Vegas and I am happy to say once I was introduced to Justin I deleted the other 3 phone numbers.',
        },
        {
          name: 'Makayla Altfillisch',
          date: 'August 2022',
          location: '',
          rating: 5,
          source: 'Google review',
          text: 'I had my first experience at Jewel. Let me say the music, the vibes, the people, and everything else were perfect. I had so much fun!',
        },
        {
          name: 'Nick Kazmer',
          date: 'January 2022',
          location: '',
          rating: 5,
          source: 'Google review',
          text: 'For a first timer coming to Vegas you are always nervous about the experience. Nokturnal set up an incredible night for my buddies and me, with an upgraded table, upgraded service, and a night to remember.',
        },
      ]}
      relatedVenues={[
        { name: 'XS Nightclub', href: '/places/xs-nightclub' },
        { name: 'Omnia', href: '/places/omnia' },
        { name: 'TAO Nightclub', href: '/places/tao-nightclub' },
        { name: 'Zouk', href: '/places/zouk-nightclub' },
      ]}
    />

<section id="event-booking" className="bg-gray-50 py-12 md:py-16 scroll-mt-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-4xl font-bold text-gray-900 mb-2">Book Your Experience</h2>
    <p className="text-gray-600 mb-12 text-lg">
      Browse upcoming events, select your table, and submit a reservation request
    </p>
    {useBookingV2 ? (
      <BookingFlowV2 venueName="Jewel Nightclub" venueSlug="jewel-nightclub" />
    ) : (
      <EventPricingSelector venueName="Jewel Nightclub" venueSlug="jewel-nightclub" />
    )}
  </div>
</section>
    </>
  )
}
