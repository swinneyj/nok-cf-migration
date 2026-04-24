export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'
import BookingFlowV2 from '@/components/booking-v2/BookingFlowV2'

const useBookingV2 = true

export const metadata: Metadata = {
  title: 'TAO Nightclub Las Vegas | VIP Table Reservations & Bottle Service',
  description: 'Book VIP bottle service at TAO Nightclub at Venetian Las Vegas. Skip the line, personal host, celebrity-loved venue. Minimums from $350. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/tao-nightclub' },
}

export default async function TaoNightclub() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'TAO Nightclub',
        hotel: 'The Venetian Las Vegas',
        address: '3377 S Las Vegas Blvd, Las Vegas, NV 89109',
        category: 'Nightclub',
        size: '10,000 sq ft',
        capacity: '~1,500 guests',
        openDays: 'Friday & Saturday (select Thursdays)',
        hours: '10:30 PM – 4:00 AM',
        tableMin: '$350–$2,000+ (weekend)',
        coverCharge: '$25–$40 general admission',
        music: 'Hip-hop, R&B, EDM',
        dresscode: 'Upscale — dress shoes required for men, no shorts or athletic wear',
        image: '/images/venues/tao-nightclub.jpg',
        description: 'TAO Nightclub at The Venetian Las Vegas is one of the most iconic and celebrity-frequented venues on the Strip. Despite being more intimate than the mega-clubs, TAO delivers a high-energy experience with A-list appearances, stunning Asian-inspired décor, and a 40-foot terrace overlooking the Las Vegas Strip. Eight private skyboxes make it the go-to for groups who want exclusivity.',
        highlights: [
          '40-foot terrace with panoramic Las Vegas Strip views',
          'Eight private skyboxes with dedicated bottle service',
          'One of the most celebrity-frequented nightclubs in Las Vegas',
          'Stunning Asian-inspired décor — some of the best interior design in Vegas nightlife',
          'More intimate than mega-clubs — every table feels premium',
          'Consistent A-list DJ and entertainer bookings',
        ],
        slug: 'tao-nightclub',
      }}
      bookingReasons={[
        {
          title: 'TAO Is Best When You Know the Table Layout',
          desc: 'TAO is more intimate than the mega-clubs, so table position changes the entire night. We help groups avoid spending on the wrong area and aim for the parts of the room that actually feel premium.',
        },
        {
          title: 'We Time TAO Around Venetian Weekend Traffic',
          desc: 'TAO can feel easy or frustrating depending on when your group arrives. We handle the timing so the entry and check-in process stays smooth instead of eating into the night.',
        },
        {
          title: 'Skybox and Terrace Nights Need a Different Strategy',
          desc: 'Some groups want visibility and views, others want a tighter party setup. We help you book TAO around the experience you want instead of just whatever is quoted first.',
        },
        {
          title: 'TAO Often Works Best in a Multi-Stop Weekend',
          desc: 'If you are pairing TAO with a dayclub, dinner, or a second nightlife plan, we can shape the order and spend so the full weekend flows better.',
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
          text: "VEGAS can't get any better. Vegas is a party city by itself but Justin just made it a hell lot better for us. It was my 4th trip to Vegas and the last 2 times I was in town were for bachelor parties and Justin took care of everything for us.",
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
        { name: 'XS Nightclub', href: '/places/xs-nightclub' },
        { name: 'Hakkasan', href: '/places/hakkasan' },
        { name: "Drai's Nightclub", href: '/places/drais-nightclub' },
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
      <BookingFlowV2 venueName="TAO Nightclub" venueSlug="tao-nightclub" />
    ) : (
      <EventPricingSelector venueName="TAO Nightclub" venueSlug="tao-nightclub" />
    )}
  </div>
</section>
    </>
  )
}
