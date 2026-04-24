export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'
import BookingFlowV2 from '@/components/booking-v2/BookingFlowV2'

const useBookingV2 = true

export const metadata: Metadata = {
  title: 'Zouk Nightclub Las Vegas | Resorts World VIP Tables & Bottle Service',
  description: "Book VIP tables at Zouk Nightclub at Resorts World Las Vegas. Vegas's most technologically advanced nightclub. Personal host, skip the line. Call (702) 996-4884.",
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/zouk-nightclub' },
}

export default async function ZoukNightclub() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'Zouk Nightclub',
        hotel: 'Resorts World Las Vegas',
        address: '3000 S Las Vegas Blvd, Las Vegas, NV 89109',
        category: 'Nightclub',
        size: '130,000 sq ft complex',
        capacity: '~4,000 guests',
        openDays: 'Friday & Saturday (select Thursdays)',
        hours: '10:30 PM – 4:00 AM',
        tableMin: '$400–$2,000+ (weekend)',
        coverCharge: '$25–$45 general admission',
        music: 'Tech House, Electronic, EDM',
        dresscode: 'Smart casual to upscale — fitted clothing, clean sneakers acceptable',
        image: '/images/venues/zouk.jpg',
        description: "Zouk Nightclub at Resorts World Las Vegas is the newest mega-club on the Strip and the most technologically advanced nightclub in Las Vegas. The Singapore-based Zouk brand brings a global perspective to Vegas nightlife — the sound system, lighting rig, and production technology exceed anything found at older venues. For music purists and anyone who wants to experience the future of nightlife, Zouk is the destination.",
        highlights: [
          'Most advanced sound system and lighting production of any Las Vegas nightclub',
          'Global Zouk brand — renowned for music-forward programming across Asia and beyond',
          'Tech house and electronic music focus appeals to a more discerning crowd',
          'Resorts World complex includes AYU Dayclub for day-to-night packages',
          'Newer venue — premium facilities throughout, no aging infrastructure',
          'Less touristy vibe than mid-Strip clubs — popular with music enthusiasts',
        ],
        slug: 'zouk-nightclub',
      }}
      bookingReasons={[
        {
          title: 'We Help You Avoid the Wrong Zouk Spend',
          desc: 'Zouk attracts groups who care about sound, production, and a more music-forward room. We help you decide whether to pay for a table, work a guest-list strategy, or pivot if the value is not there that night.',
        },
        {
          title: 'Resorts World Logistics Matter More Than People Expect',
          desc: 'Zouk is easier when someone understands the property flow, arrival timing, and where your group should meet. That keeps the night smooth instead of chaotic at the front end.',
        },
        {
          title: 'We Match Zouk to the Right Crowd',
          desc: 'Not every Vegas group is a Zouk group. We recommend it when your crew actually wants the music-first, tech-forward vibe and steer you elsewhere when another club fits better.',
        },
        {
          title: 'AYU and Zouk Work Best as a Coordinated Weekend',
          desc: 'If your group is doing both day and night at Resorts World, we can shape the weekend around that plan so the spend and timing make more sense together.',
        },
      ]}
      reviewsHeading="What Clients Say About Booking With Nokturnal"
      reviews={[
        {
          name: 'prashanth m.',
          date: 'April 2023',
          location: 'Chicago, IL',
          rating: 5,
          source: 'Yelp review',
          text: "When I took on the responsibilities of planning a guys weekend in Vegas, I didn't know how deep of a hole I would slip into researching options and things to do. From the very first communication with Justin, I felt a huge weight off my shoulders.",
        },
        {
          name: 'Elliot Y.',
          date: 'March 2015',
          location: 'Redlands, CA',
          rating: 5,
          source: 'Yelp review',
          text: "I recently had Justin and Jay help me out with table service at XS for a bachelor party of 12. I really can't say enough good things about these guys. They're honest, on time and reliable. They have a good grasp on all the hot spots with all the right connections.",
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
        { name: 'LIV Nightclub', href: '/places/liv-nightclub' },
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
      <BookingFlowV2 venueName="Zouk Nightclub" venueSlug="zouk-nightclub" />
    ) : (
      <EventPricingSelector venueName="Zouk Nightclub" venueSlug="zouk-nightclub" />
    )}
  </div>
</section>
    </>
  )
}
