export const dynamic = "force-dynamic";

import type { Metadata } from 'next'
import VenuePage from '@/components/VenuePage'

export const metadata: Metadata = {
  title: 'Kassi Beach Club Las Vegas | VIP Cabanas & Pool Party Packages',
  description: 'Book VIP cabanas at Kassi Beach Club Las Vegas. Mediterranean-inspired dayclub experience, personal host, skip the line. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/places/kassi-beach-club' },
}

export default function KassiBeachClub() {
  return (
    <>
      <VenuePage
      venue={{
        name: 'Kassi Beach Club',
        hotel: 'Las Vegas Strip',
        address: 'Las Vegas, NV 89109',
        category: 'Dayclub',
        size: 'Outdoor pool complex',
        capacity: '~2,000 guests',
        openDays: 'Friday–Sunday (seasonal)',
        hours: '11:00 AM – 6:00 PM',
        tableMin: '$1,000+ (cabana), $300+ (daybed)',
        coverCharge: '$35–$55 general admission',
        music: 'House, EDM, Mediterranean-influenced',
        dresscode: 'Fashion swimwear — no cargo shorts, athletic wear, or flip flops (men)',
        image: '/images/venues/kassi.jpg',
        description: "Kassi Beach Club brings a fresh Mediterranean-inspired aesthetic to the Las Vegas dayclub scene. With a distinctively designed pool environment and a music programming approach that leans into deeper house and Mediterranean sounds, Kassi offers a sophisticated alternative to the mega-dayclubs — with equally impressive service and a crowd that appreciates quality over chaos.",
        highlights: [
          'Mediterranean-inspired design — distinct aesthetic from every other Vegas dayclub',
          'Music programming that favors deep house and quality electronic acts',
          'More sophisticated, less chaotic atmosphere than the largest dayclubs',
          'Premium cabana service with personalized attention',
          'Great alternative for groups who want quality over spectacle',
          'Personal host coordination makes arrival and setup seamless',
        ],
        slug: 'kassi-beach-club',
      }}
      useReserveInquiryCta
      relatedVenues={[
        { name: 'Encore Beach Club', href: '/places/encore-beach-club' },
        { name: 'Omnia Dayclub', href: '/places/omnia-dayclub' },
        { name: 'LIV Beach Club', href: '/places/liv-beach-club' },
        { name: 'AYU Dayclub', href: '/places/ayu-dayclub' },
      ]}
    />
    </>
  )
}
