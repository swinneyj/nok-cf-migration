import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.nokturnallifestyle.com'),
  title: {
    default: 'Las Vegas VIP Concierge | Bachelor & Bachelorette Packages | Nokturnal Lifestyle',
    template: '%s | Nokturnal Lifestyle Concierge Las Vegas',
  },
  description: 'Las Vegas #1 VIP concierge for bachelor & bachelorette parties. Bottle service, nightclub access, party buses & strip clubs. Personal host included. Call (702) 996-4884.',
  keywords: [
    'Las Vegas VIP concierge', 'Las Vegas bachelor party', 'Las Vegas bachelorette party',
    'Las Vegas bottle service', 'Las Vegas nightclub packages', 'Las Vegas party bus',
    'VIP host Las Vegas', 'Las Vegas strip club packages', 'Hakkasan bottle service',
    'XS nightclub table', 'Marquee Las Vegas VIP', 'Las Vegas pool party packages',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.nokturnallifestyle.com',
    siteName: 'Nokturnal Lifestyle Concierge',
    title: 'Las Vegas VIP Concierge | Bachelor & Bachelorette Party Packages',
    description: 'Las Vegas #1 VIP concierge for bachelor & bachelorette parties. Bottle service, nightclubs, party buses & more. Personal host included. Call (702) 996-4884.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Nokturnal Lifestyle VIP Concierge Las Vegas' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Las Vegas VIP Concierge | Nokturnal Lifestyle',
    description: 'Bachelor & bachelorette party packages in Las Vegas. Bottle service, nightclubs, party buses & personal VIP host.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.nokturnallifestyle.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

const schemaOrg = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://www.nokturnallifestyle.com/#business',
      name: 'Nokturnal Lifestyle Concierge',
      description: 'Las Vegas VIP concierge specializing in bachelor parties, bachelorette parties, bottle service, nightclubs, and party bus packages.',
      url: 'https://www.nokturnallifestyle.com',
      telephone: '+17029964884',
      email: 'sales@nokturnallifestyle.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Las Vegas',
        addressRegion: 'NV',
        addressCountry: 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 36.1699,
        longitude: -115.1398,
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '23:59',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '200',
        bestRating: '5',
      },
      sameAs: [
        'https://www.facebook.com/nokturnallifestyle',
        'https://www.instagram.com/nokturnallifestyle',
        'https://twitter.com/nokturnallife',
      ],
      priceRange: '$$$',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much does bottle service cost in Las Vegas?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Las Vegas bottle service minimums typically range from $300–$500 on weekdays and $700–$3,000+ on weekends depending on the venue. This is per table, not per person. Gratuity of 20–24% is additional.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is included in a Las Vegas bachelor party package?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our bachelor party packages include a personal VIP host, skip-the-line nightclub entry, reserved VIP table with bottle service, party bus transportation, and gentleman\'s club access. All packages are fully customizable.',
          },
        },
        {
          '@type': 'Question',
          name: 'How far in advance should I book a Las Vegas VIP package?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We recommend booking 2–4 weeks in advance for weekend events to secure the best table placement. However, we specialize in last-minute bookings and can often accommodate same-day requests.',
          },
        },
        {
          '@type': 'Question',
          name: 'What Las Vegas nightclubs do you have access to?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We have VIP access to all major Las Vegas nightclubs including XS, Hakkasan, Omnia, Marquee, TAO, Zouk, Drai\'s, and Jewel, as well as top dayclubs including Encore Beach Club, Marquee Dayclub, and Elia Beach Club.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you provide a personal host for every package?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Every Nokturnal Lifestyle package includes a personal VIP host who meets your group at the hotel or venue, escorts you through VIP entry, handles table check-in, and stays with you throughout the night.',
          },
        },
      ],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#080810" />
      </head>
      <body className="bg-night-900 text-white font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FloatingCTA />
      </body>
    </html>
  )
}
