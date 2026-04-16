export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'

export const metadata: Metadata = {
  title: 'Little Darlings Las Vegas | Totally Nude Strip Club VIP Packages',
  description: 'VIP entry to Little Darlings Las Vegas — the only all-nude gentlemen\'s club in Las Vegas. No alcohol on premises. Skip the line, free entry with packages. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/little-darlings' },
}

export default function LittleDarlings() {
  return (
    <VenuePage
      venue={{
        name: 'Little Darlings',
        hotel: 'Off-Strip (Transportation provided)',
        address: '1514 Western Ave, Las Vegas, NV 89102',
        category: 'Strip Club',
        size: 'Multi-level entertainment venue',
        capacity: 'Medium-large — multiple stages and VIP areas',
        openDays: 'Monday–Sunday',
        hours: 'Mon-Sat: 11:00 AM - 6:00 AM | Sun: 6:00 PM - 4:00 AM',
        tableMin: 'VIP packages available (includes entry)',
        coverCharge: 'Varies (waived with our VIP packages)',
        music: 'Hip-hop, Top 40, R&B',
        dresscode: 'Casual — appropriate street attire',
        image: '/images/venues/little-darlings.jpg',
        description: "Little Darlings stands as Las Vegas's only fully-nude gentlemen's club, offering a unique entertainment experience for those seeking the ultimate in premium entertainment. Located conveniently behind the Stratosphere, the venue features world-class performers, multiple stages, and an exciting atmosphere. Being alcohol-free on premises, it offers a distinctly different vibe while maintaining the highest standards of entertainment and service.",
        highlights: [
          'Only all-nude gentlemen\'s club in Las Vegas',
          'Extended hours with late-night entertainment',
          'Multiple stages and intimate VIP areas',
          'No alcohol on premises — BYOB friendly policy',
          'Convenient location near downtown Las Vegas',
          'Professional entertainment and top-tier service',
          'Free transportation from your hotel',
          'Unique and exclusive Las Vegas experience',
        ],
        slug: 'little-darlings',
      }}
      relatedVenues={[
        { name: 'Palomino Club', href: '/places/palomino' },
        { name: 'Spearmint Rhino', href: '/places/spearmint-rhino' },
        { name: 'All Strip Club Packages', href: '/strip-clubs' },
      ]}
    />
  )
}
