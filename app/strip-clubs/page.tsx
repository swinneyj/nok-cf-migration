import type { Metadata } from 'next'
import Link from 'next/link'
import { Phone, Check } from 'lucide-react'
import InquiryForm from '@/components/InquiryForm'

export const metadata: Metadata = {
  title: 'Las Vegas Strip Clubs | VIP Access & Packages | Nokturnal Lifestyle',
  description:
    'Las Vegas strip club VIP packages. Crazy Horse 3, Sapphire, Spearmint Rhino & more. Skip entry, free drinks, best table. Personal host. Call (702) 996-4884.',
}

const clubs = [
  { name: 'Crazy Horse 3', desc: 'Las Vegas\'s largest gentleman\'s club. World-class entertainment, multiple rooms, VIP suites.', img: '/images/venues/crazy-horse-3.jpg', alt: 'Crazy Horse 3 Las Vegas VIP strip club' },
  { name: 'Sapphire', desc: '70,000 sq ft — the world\'s largest gentleman\'s club. Multiple floors and stage shows.', img: '/images/venues/sapphire.jpg', alt: 'Sapphire Las Vegas strip club VIP access' },
  { name: 'Spearmint Rhino', desc: 'A global brand. Las Vegas location is one of the best in the world with private VIP rooms.', img: '/images/venues/spearmint-rhino.jpg', alt: 'Spearmint Rhino Las Vegas VIP' },
  { name: 'Hustler Club', desc: 'Larry Flynt\'s flagship. On the Strip, convenient, high energy, celebrity appearances.', img: '/images/venues/hustler-club.jpg', alt: 'Hustler Club Las Vegas strip club VIP' },
  { name: 'Little Darlings', desc: 'Unique all-nude venue. No alcohol allowed — drinks are BYOB or purchased inside.', img: '/images/venues/little-darlings.jpg', alt: 'Little Darlings Las Vegas strip club' },
  { name: 'Palomino', desc: 'The only topless club with a full bar located directly on the Las Vegas Strip.', img: '/images/venues/palomino.jpg', alt: 'Palomino Las Vegas strip club VIP access' },
]

const perks = [
  'VIP entry — no wait, no cover charge',
  'Free drinks (included in most packages)',
  'Best seats and VIP sections reserved',
  'Personal host escorts your group in',
  'Better pricing than paying at the door',
  'Can be bundled with nightclub packages',
]

export default function StripClubsPage() {
  return (
    <>
      <section className="relative page-hero overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/venues/strip-clubs-hero.jpg" alt="Las Vegas strip club VIP access packages" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
          <div className="max-w-3xl">
            <div className="section-eyebrow mb-4">Gentleman's Clubs</div>
            <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
              Las Vegas Strip Club VIP Packages
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
              Skip entry, no cover, free drinks and the best seats — at Crazy Horse 3, Sapphire,
              Spearmint Rhino and more. Often bundled with nightclub packages for the ultimate night.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#clubs" className="btn-gold">View Clubs</Link>
              <a href="tel:+17029964884" className="btn-ghost flex items-center gap-2"><Phone size={14} /> (702) 996-4884</a>
            </div>
          </div>
        </div>
      </section>

      <section id="clubs" className="py-20 px-4 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-eyebrow mb-3">Venues</div>
            <h2 className="font-display text-white font-bold text-3xl">Las Vegas's Best Gentleman's Clubs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {clubs.map((club) => (
              <div key={club.name} className="card-dark overflow-hidden flex flex-col">
                <div className="h-40 overflow-hidden">
                  <img src={club.img} alt={club.alt} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-white font-bold font-display text-lg mb-2">{club.name}</div>
                  <p className="text-white/55 text-sm leading-relaxed mb-5 flex-1">{club.desc}</p>
                  <Link href="/contact" className="btn-gold text-xs py-2.5 text-center">Book VIP Access</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-night-800/50">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="section-eyebrow mb-4">Why Book Through Us</div>
            <h2 className="font-display text-white font-bold text-3xl mb-6">VIP Access vs. Walking In</h2>
            <ul className="space-y-3">
              {perks.map((p) => (
                <li key={p} className="flex items-start gap-3 text-white/70 text-sm">
                  <Check size={14} className="text-gold-400 flex-shrink-0 mt-0.5" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="card-dark p-8">
            <h3 className="font-display text-white font-bold text-xl mb-6">Reserve VIP Access</h3>
            <InquiryForm defaultPackage="strip" />
          </div>
        </div>
      </section>
    </>
  )
}
