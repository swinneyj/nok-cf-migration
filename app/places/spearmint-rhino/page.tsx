export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'

export const metadata: Metadata = {
  title: 'Spearmint Rhino Las Vegas | VIP Entry & Strip Club Packages',
  description: 'VIP entry to Spearmint Rhino Las Vegas — 24-hour gentlemen\'s club with private VIP rooms. Skip the line, no cover, free drinks. Personal host service. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/spearmint-rhino' },
}

export default function SpearmintRhino() {
  return (
    <VenuePage
      venue={{
        name: 'Spearmint Rhino',
        hotel: 'Off-Strip (Transportation provided)',
        address: '3340 S Highland Dr, Las Vegas, NV 89109',
        category: 'Strip Club',
        size: 'Multi-floor entertainment venue',
        capacity: 'Large — multiple stages and VIP areas',
        openDays: 'Monday–Sunday',
        hours: '24 hours (Open daily)',
        tableMin: 'VIP packages from $50/person (includes entry + drinks)',
        coverCharge: '$20 before 5 PM, $50 after 5 PM (waived with our packages)',
        music: 'Hip-hop, Top 40, R&B',
        dresscode: 'Smart casual — no athletic wear or flip flops',
        image: '/images/venues/spearmint-rhino.jpg',
        description: "Spearmint Rhino is a globally recognized brand with one of the best locations in the world. The Las Vegas location features multiple floors of entertainment, private VIP rooms, and operates 24/7 for maximum convenience. Known for its consistent quality, energetic atmosphere, and world-class entertainment, Spearmint Rhino is a premium choice for bachelor parties, corporate events, and group outings.",
        highlights: [
          'Global brand with premium Las Vegas location',
          'Open 24 hours — 7 days a week, 365 days a year',
          'Multiple entertainment floors and stages',
          'Private VIP rooms for group experiences',
          'Exceptional staff and professional atmosphere',
          'Free hotel transportation coordinated through Nokturnal',
          'Perfect for bachelor parties and celebrations',
        ],
        slug: 'spearmint-rhino',
      }}
      relatedVenues={[
        { name: 'Sapphire Las Vegas', href: '/places/sapphire' },
        { name: 'Crazy Horse 3', href: '/places/crazy-horse-3' },
        { name: 'All Strip Club Packages', href: '/strip-clubs' },
      ]}
    />
  )
}
