import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'

export const metadata: Metadata = {
  title: 'XS Nightclub Las Vegas | VIP Table Reservations & Skip-The-Line Access',
  description: 'Book VIP table service at XS Nightclub at Encore at Wynn Las Vegas. Skip the line, best table placement, personal host. Minimums from $1,000. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/xs-nightclub' },
}

export default function XSNightclub() {
  return (
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
      relatedVenues={[
        { name: 'Hakkasan', href: '/places/hakkasan' },
        { name: 'Omnia', href: '/places/omnia' },
        { name: 'Marquee', href: '/places/marquee-nightclub' },
        { name: 'Zouk', href: '/nightclubs' },
        { name: 'TAO Nightclub', href: '/nightclubs' },
      ]}
    />
  )
}
