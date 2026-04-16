export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'

export const metadata: Metadata = {
  title: 'Palomino Club Las Vegas | Full Bar Topless Club on the Strip',
  description: 'VIP entry to Palomino Club Las Vegas — the only topless club with full bar on the Strip. Skip the line, no cover, free drinks with packages. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/palomino' },
}

export default function Palomino() {
  return (
    <VenuePage
      venue={{
        name: 'Palomino Club',
        hotel: 'On the Las Vegas Strip',
        address: '1848 Las Vegas Blvd N, North Las Vegas, NV 89030',
        category: 'Strip Club',
        size: 'Full-service entertainment venue',
        capacity: 'Large — multiple stages and VIP areas',
        openDays: 'Monday–Sunday',
        hours: 'Mon-Thu & Sun: 6:00 PM - 4:00 AM | Fri-Sat: 6:00 PM - 6:00 AM',
        tableMin: 'VIP packages from $50/person (includes entry + drinks)',
        coverCharge: 'Locals free, $36 non-locals (waived with our packages)',
        music: 'Hip-hop, R&B, Top 40',
        dresscode: 'Smart casual — no athletic wear',
        image: '/images/venues/palomino.jpg',
        description: "The Palomino Club holds a unique distinction as the only topless gentlemen's club in Las Vegas legally permitted to operate with a full liquor license. Located directly on the Las Vegas Strip, this legendary venue combines the best of both worlds — premium full-bar service with world-class adult entertainment. The Palomino has been a Las Vegas institution since 1969, offering unmatched convenience and entertainment.",
        highlights: [
          'Only Strip club with full bar on the Las Vegas Strip',
          'Unique liquor license and entertainment combination',
          'Las Vegas Strip location for ultimate convenience',
          'Multiple entertainment stages and VIP areas',
          'Extended weekend hours — open until 6:00 AM Friday and Saturday',
          'Complimentary round-trip transportation from all Strip hotels',
          'Professional service and premium entertainment',
          'Iconic Las Vegas experience since 1969',
        ],
        slug: 'palomino',
      }}
      relatedVenues={[
        { name: 'Little Darlings', href: '/places/little-darlings' },
        { name: 'Spearmint Rhino', href: '/places/spearmint-rhino' },
        { name: 'All Strip Club Packages', href: '/strip-clubs' },
      ]}
    />
  )
}
