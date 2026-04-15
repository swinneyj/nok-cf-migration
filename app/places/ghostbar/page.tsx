export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'

export const metadata: Metadata = {
  title: 'Ghostbar Las Vegas | Palms Casino Rooftop Lounge VIP Access',
  description: 'VIP access to Ghostbar at Palms Casino Las Vegas. Iconic 55th-floor rooftop lounge with Strip views and outdoor ghost deck. Personal host. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/ghostbar' },
}

export default function Ghostbar() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'Ghostbar',
        hotel: 'Palms Casino Resort',
        address: '4321 W Flamingo Rd, Las Vegas, NV 89103',
        category: 'Nightclub',
        size: '8,000 sq ft — 55th floor rooftop',
        capacity: '~400 guests',
        openDays: 'Thursday–Sunday',
        hours: '8:00 PM – 4:00 AM',
        tableMin: '$150–$600 (bottle service available)',
        coverCharge: '$15–$30 general admission',
        music: 'Top 40, Hip-hop, EDM — live DJ nightly',
        dresscode: 'Smart casual — clean sneakers acceptable',
        image: '/images/venues/ghostbar.jpg',
        description: "Ghostbar at Palms Casino Resort is one of Las Vegas's most iconic lounge experiences. Perched on the 55th floor, the venue features a transparent ghost deck that extends over the edge of the building — stand on it and look straight down 55 stories. The panoramic Las Vegas Strip views are among the best in the city, and the intimate capacity creates a VIP-feeling experience that the mega-clubs can't replicate.",
        highlights: [
          'Iconic transparent ghost deck — stand 55 floors up with the Strip beneath your feet',
          'Panoramic Las Vegas Strip views — one of the best vantage points in the city',
          '55th floor location makes every table feel like a VIP experience',
          'Intimate capacity — never feels overcrowded, service is always attentive',
          'Off-Strip location at Palms — popular with locals and those in the know',
          'Great for milestone birthdays, anniversary celebrations, or sophisticated group nights',
        ],
        slug: 'ghostbar',
      }}
      useReserveInquiryCta
      relatedVenues={[
        { name: 'Bottled Blonde', href: '/places/bottled-blonde' },
        { name: 'All Lounges', href: '/lounges' },
        { name: 'Nightclub Packages', href: '/nightclubs' },
      ]}
    />
    </>
  )
}
