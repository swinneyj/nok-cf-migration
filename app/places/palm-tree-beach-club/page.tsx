export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'

export const metadata: Metadata = {
  title: 'Palm Tree Beach Club Las Vegas | Tropical VIP Cabana Dayclubs',
  description: 'Book VIP cabanas at Palm Tree Beach Club Las Vegas. Tropical vibes, premium bottle service, world-class DJs. Personal host included. From $1,800. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/palm-tree-beach-club' },
}

export default function PalmTreeBeachClub() {
  return (
    <VenuePage
      venue={{
        name: 'Palm Tree Beach Club',
        hotel: 'Las Vegas Strip',
        address: 'Las Vegas, NV',
        category: 'Dayclub',
        size: 'Beachside pool complex',
        capacity: '~2,000+ guests',
        openDays: 'Friday–Sunday (seasonal April–October)',
        hours: '10:00 AM – 6:00 PM',
        tableMin: '$1,800+ (cabana), $300+ (daybed)',
        coverCharge: '$25–$50 general admission',
        music: 'House, Electronic, Hip-Hop, Top 40',
        dresscode: 'Fashion swimwear — no cargo shorts, athletic wear, or work boots',
        image: '/images/venues/palm-tree.jpg',
        description: "Palm Tree Beach Club brings a tropical paradise vibe to Las Vegas pool parties. With its beachside atmosphere, multiple pool areas, and premium VIP cabana suites, this venue offers a unique blend of relaxation and high-energy entertainment. Whether you're looking for a chill daybed experience or an all-out cabana party, Palm Tree Beach Club delivers on both fronts with world-class DJs, premium bottle service, and dedicated staff attention.",
        highlights: [
          'Tropical beachside atmosphere — escape the Vegas heat',
          'Multiple pool areas with varied seating from daybeds to full cabanas',
          'Premium VIP cabana suites with private lounging and prime pool views',
          'World-class DJ programming throughout the day',
          'Full bottle service with premium spirits and champagne',
          'Personal VIP host included with every package',
          'Food and dining options available poolside',
          'Seamless transition from day-to-night entertainment',
        ],
        slug: 'palm-tree-beach-club',
      }}
      relatedVenues={[
        { name: 'Encore Beach Club', href: '/places/encore-beach-club' },
        { name: 'Marquee Dayclub', href: '/places/marquee-dayclub' },
        { name: 'AYU Dayclub', href: '/places/ayu-dayclub' },
        { name: 'LIV Beach Club', href: '/places/liv-beach-club' },
      ]}
    />
  )
}
