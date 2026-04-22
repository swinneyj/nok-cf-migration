export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'
import EventPricingSelector from '@/components/EventPricingSelector'
import BookingFlowV2 from '@/components/booking-v2/BookingFlowV2'

const useBookingV2 = true

export const metadata: Metadata = {
  title: 'XS Nightclub Las Vegas | VIP Table Reservations & Skip-The-Line Access',
  description: 'Book VIP table service at XS Nightclub at Encore at Wynn Las Vegas. Skip the line, best table placement, personal host. Minimums from $1,000. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/xs-nightclub' },
}

export default async function XSNightclub() {
  return (
    <>
      <VenuePage
        venue={{
          name: 'XS Nightclub',
          hotel: 'Encore at Wynn Las Vegas',
          address: '3121 S Las Vegas Blvd, Las Vegas, NV 89109',
          category: 'Nightclub',
          size: '40,000 sq ft',
          capacity: '~3,500 guests',
          openDays: 'Friday, Saturday, Monday',
          hours: '10:30 PM – 4:00 AM',
          tableMin: '$1,000–$3,000+ (weekend)',
          coverCharge: '$30–$50 general admission',
          music: 'EDM, House, Top 40',
          dresscode: 'Upscale — dress shoes or clean leather sneakers, dark jeans or slacks (men)',
          image: '/images/venues/xs-nightclub.jpg',
          description: 'XS Nightclub at Encore at Wynn Las Vegas is consistently rated one of the top nightclubs in the world. Its stunning combination of indoor space and a luminous outdoor pool area creates an experience unlike any other venue in Las Vegas. World-class DJ residencies, Wynn-level service, and an atmosphere that lives up to every expectation.',
          highlights: [
            'Breathtaking outdoor pool area lit with thousands of lights',
            'World-class DJ residencies year-round including top-tier EDM acts',
            'Multiple bar areas spanning indoor and outdoor space',
            'Premium Wynn service — the best staff in Las Vegas nightlife',
            'Celebrity sightings every weekend',
            'Connected to Encore Beach Club for day-to-night experiences',
          ],
          slug: 'xs-nightclub',
        }}
        bookingReasons={[
          {
            title: 'We Guide You Toward the Right XS Table',
            desc: 'XS is one of the easiest clubs to overpay at if you do not know the room. We help groups choose between main room, outdoor pool-facing, and value tables based on their budget and how they actually want the night to feel.',
          },
          {
            title: 'Encore and Wynn Guests Get a Smarter Plan',
            desc: 'If your group is already staying at Wynn or Encore, we can build the night around your hotel logistics and timing so entry, arrival, and table check-in feel seamless instead of rushed.',
          },
          {
            title: 'XS Demand Swings Fast on Headliner Nights',
            desc: 'XS minimums can move quickly when the right DJ is on. We help you book early when it matters, avoid weak-value positions, and pivot if another venue is a better fit for the same spend.',
          },
          {
            title: 'We Make the Poolside Experience Easier',
            desc: 'The indoor-outdoor layout is what makes XS special, but it also changes where your group should sit. We help match your table to your vibe, whether you want energy near the action or more room to host.',
          },
        ]}
        reviewsHeading="What XS Clients Say About Booking Through Us"
        reviews={[
          {
            name: 'Ethan M.',
            date: 'March 2026',
            location: 'Dallas, TX',
            rating: 5,
            text: 'We almost booked XS direct and would have picked the wrong table for our group. Justin explained the room, moved us to a better location, and the night felt high-end from the second we walked in.',
          },
          {
            name: 'Nina P.',
            date: 'February 2026',
            location: 'Miami, FL',
            rating: 5,
            text: 'XS was the one club we cared about for our trip. Nokturnal handled everything, timed our arrival perfectly, and our host got us through Encore and into the venue without any chaos.',
          },
          {
            name: 'Jordan L.',
            date: 'January 2026',
            location: 'San Diego, CA',
            rating: 5,
            text: 'The best part was having someone who actually knew XS. We told Justin we wanted the outdoor energy without being crammed, and he nailed the recommendation. Easily the strongest night of the weekend.',
          },
        ]}
        relatedVenues={[
          { name: 'Hakkasan', href: '/places/hakkasan' },
          { name: 'Omnia', href: '/places/omnia' },
          { name: 'Marquee', href: '/places/marquee-nightclub' },
          { name: 'Zouk', href: '/nightclubs' },
          { name: 'TAO Nightclub', href: '/nightclubs' },
        ]}
      />

      {/* Event Pricing Selector */}

<section id="event-booking" className="bg-gray-50 py-12 md:py-16 scroll-mt-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-4xl font-bold text-gray-900 mb-2">Book Your Experience</h2>
    <p className="text-gray-600 mb-12 text-lg">
      Browse upcoming events, select your table, and submit a reservation request
    </p>
    {useBookingV2 ? (
      <BookingFlowV2 venueName="XS Nightclub" venueSlug="xs-nightclub" />
    ) : (
      <EventPricingSelector venueName="XS Nightclub" venueSlug="xs-nightclub" />
    )}
  </div>
</section>
    </>
  )
}
