export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'

export const metadata: Metadata = {
  title: 'Bottled Blonde Las Vegas | Park MGM Lounge VIP Access & Reservations',
  description: 'VIP access to Bottled Blonde at Park MGM Las Vegas. High-energy cocktail lounge with live DJ, great food, skip the line. Personal host. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/bottled-blonde' },
}

export default function BottledBlonde() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'Bottled Blonde',
        hotel: 'Park MGM Las Vegas',
        address: '3770 S Las Vegas Blvd, Las Vegas, NV 89109',
        category: 'Nightclub',
        size: 'Bar & lounge format',
        capacity: '~600 guests',
        openDays: 'Thursday–Sunday',
        hours: '8:00 PM – 3:00 AM',
        tableMin: '$200–$800 (reserved seating)',
        coverCharge: '$15–$25 general admission',
        music: 'Top 40, Hip-hop, Pop — live DJ nightly',
        dresscode: 'Smart casual — more relaxed than major nightclubs',
        image: '/images/venues/bottled-blonde.jpg',
        description: "Bottled Blonde at Park MGM Las Vegas is a high-energy cocktail lounge and bar that blurs the line between upscale bar and nightclub. With a live DJ nightly, an impressive cocktail program, and a more approachable atmosphere than the Strip's mega-clubs, it's the ideal spot for pregaming, birthday celebrations, or a full night out for groups who want great vibes without the intensity of a full nightclub.",
        highlights: [
          'High-energy cocktail lounge format — great for pregaming or a standalone night',
          'Live DJ every night creates a nightclub atmosphere without the nightclub minimum',
          'Excellent food menu — one of the better bar food programs in Las Vegas',
          'Park MGM location puts you near T-Mobile Arena for pre/post-concert crowds',
          'More relaxed dress code makes it accessible for mixed groups',
          'Popular with locals and visitors alike — authentic Vegas experience',
        ],
        slug: 'bottled-blonde',
      }}
      useReserveInquiryCta
      relatedVenues={[
        { name: 'Ghostbar', href: '/places/ghostbar' },
        { name: 'All Lounges', href: '/lounges' },
        { name: 'Nightclub Packages', href: '/nightclubs' },
      ]}
    />
    </>
  )
}
