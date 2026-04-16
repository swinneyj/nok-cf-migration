export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'

export const metadata: Metadata = {
  title: 'Hustler Club Las Vegas | Larry Flynt\'s Strip Club VIP Packages',
  description: 'VIP entry to Larry Flynt\'s Hustler Club Las Vegas — high energy, celebrity appearances, premium entertainment. Skip the line, no cover, free drinks. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/hustler-club' },
}

export default function HustlerClub() {
  return (
    <VenuePage
      venue={{
        name: 'Hustler Club',
        hotel: 'Off-Strip (Transportation provided)',
        address: '6007 Dean Martin Dr, Las Vegas, NV 89118',
        category: 'Strip Club',
        size: 'Full-featured entertainment venue',
        capacity: 'Large — multiple stages and VIP areas',
        openDays: 'Monday–Sunday',
        hours: '6:00 PM – 7:00 AM',
        tableMin: 'VIP packages from $50/person (includes entry + drinks)',
        coverCharge: '$50 weekdays, $100 weekends (waived with our packages)',
        music: 'Hip-hop, R&B, Top 40',
        dresscode: 'Smart casual — no athletic wear',
        image: '/images/venues/hustler-club.jpg',
        description: "Larry Flynt's Hustler Club is the flagship venue of the legendary Hustler brand. Located just minutes from the Las Vegas Strip, this high-energy establishment is known for attracting celebrities, VIPs, and Las Vegas enthusiasts seeking premium entertainment. With multiple stages, sophisticated VIP areas, and a reputation for unforgettable experiences, Hustler Club delivers world-class service and non-stop entertainment.",
        highlights: [
          'Larry Flynt\'s flagship gentlemen\'s club',
          'High-energy atmosphere with frequent celebrity appearances',
          'Multiple stages with continuous entertainment',
          'Premium VIP areas for private group experiences',
          'Minutes from the Las Vegas Strip',
          'Professional staff and top-tier service',
          'Free transportation from your hotel',
          'Ideal for bachelor parties and exclusive celebrations',
        ],
        slug: 'hustler-club',
      }}
      relatedVenues={[
        { name: 'Crazy Horse 3', href: '/places/crazy-horse-3' },
        { name: 'Sapphire Las Vegas', href: '/places/sapphire' },
        { name: 'All Strip Club Packages', href: '/strip-clubs' },
      ]}
    />
  )
}
