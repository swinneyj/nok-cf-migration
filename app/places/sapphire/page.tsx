export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'

export const metadata: Metadata = {
  title: 'Sapphire Las Vegas | VIP Entry & Strip Club Packages',
  description: 'VIP entry to Sapphire Las Vegas — the world\'s largest gentleman\'s club. Skip cover, free drinks, personal host. Bachelor party packages from $50/person. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/sapphire' },
}

export default function Sapphire() {
  return (
    <VenuePage
      venue={{
        name: 'Sapphire Las Vegas',
        hotel: 'Off-Strip (Transportation provided)',
        address: '3025 S Industrial Rd, Las Vegas, NV 89109',
        category: 'Strip Club',
        size: '70,000 sq ft — world\'s largest',
        capacity: 'Large — multiple floors and stages',
        openDays: 'Monday–Sunday',
        hours: '11:00 AM – 8:00 AM (nearly 24 hrs)',
        tableMin: 'VIP packages from $50/person (includes entry + drinks)',
        coverCharge: '$30+ at door (waived with our packages)',
        music: 'Hip-hop, R&B, Top 40',
        dresscode: 'Smart casual — no athletic wear',
        image: '/images/venues/sapphire.jpg',
        description: "Sapphire Las Vegas holds the title of the world's largest gentleman's club at 70,000 square feet. Multiple floors, a rooftop pool, private VIP rooms, and nearly round-the-clock operation make it a Las Vegas institution. The venue's size means there's always a show happening, always a great section available, and the scale of entertainment is simply unmatched.",
        highlights: [
          'World\'s largest gentleman\'s club — 70,000 sq ft across multiple floors',
          'Rooftop pool and dayclub experience',
          'Multiple stages with simultaneous entertainment',
          'VIP rooms for private group experiences',
          'Nearly 24-hour operation — open late afternoon through early morning',
          'Sapphire Pool Party events during dayclub season',
        ],
        slug: 'sapphire',
      }}
      relatedVenues={[
        { name: 'Crazy Horse 3', href: '/places/crazy-horse-3' },
        { name: 'All Strip Club Packages', href: '/strip-clubs' },
      ]}
    />
  )
}
