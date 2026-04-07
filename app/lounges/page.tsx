import type { Metadata } from 'next'
import Link from 'next/link'
import InquiryForm from '@/components/InquiryForm'

export const metadata: Metadata = {
  title: 'Las Vegas Lounges | VIP Access to Bottled Blonde, Ghostbar & More',
  description: 'VIP access to the best Las Vegas lounges — Bottled Blonde, Ghostbar and more. Skip the line, reserved seating, personal host. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/lounges' },
}

const lounges = [
  {
    name: 'Bottled Blonde',
    location: 'Park MGM Las Vegas',
    vibe: 'High-energy bar & lounge with live DJ, great for pregaming or a full night out',
    href: '/places/bottled-blonde',
    image: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=600&q=80',
    alt: 'Bottled Blonde Las Vegas lounge VIP access',
  },
  {
    name: 'Ghostbar',
    location: 'Palms Casino Resort',
    vibe: 'Iconic rooftop lounge with stunning 55th-floor Strip views and an outdoor ghost deck',
    href: '/places/ghostbar',
    image: 'https://images.unsplash.com/photo-1545431781-3e1b506e9a37?w=600&q=80',
    alt: 'Ghostbar Las Vegas rooftop lounge VIP access Palms',
  },
]

export default function LoungesPage() {
  return (
    <>
      <section className="relative page-hero overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=1600&q=85" alt="Las Vegas lounges VIP access" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
          <div className="max-w-3xl">
            <div className="section-eyebrow mb-4">Lounges</div>
            <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
              Las Vegas VIP Lounges
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
              Not every great night needs a nightclub. Las Vegas lounges offer a more laid-back
              atmosphere with great cocktails, DJs, and stunning settings — perfect for pregaming,
              birthday celebrations, or a night that doesn't need to go until 4am.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#lounges" className="btn-gold">Browse Lounges</Link>
              <a href="tel:+17029964884" className="btn-ghost flex items-center gap-2">📞 (702) 996-4884</a>
            </div>
          </div>
        </div>
      </section>

      {/* Lounge cards */}
      <section id="lounges" className="py-20 px-4 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-eyebrow mb-3">Venues</div>
            <h2 className="font-display text-white font-bold text-3xl">Las Vegas Lounges We Work With</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {lounges.map((lounge) => (
              <Link
                key={lounge.name}
                href={lounge.href}
                prefetch={false}
                className="card-dark overflow-hidden group flex flex-col"
              >
                <div className="h-52 overflow-hidden">
                  <img src={lounge.image} alt={lounge.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-display text-white font-bold text-xl mb-1">{lounge.name}</h3>
                  <div className="text-gold-500 text-sm mb-3">{lounge.location}</div>
                  <p className="text-white/55 text-sm leading-relaxed flex-1">{lounge.vibe}</p>
                  <div className="mt-4 text-gold-400 text-xs font-semibold uppercase tracking-wider">View Lounge →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lounges vs nightclubs */}
      <section className="py-16 px-4 bg-night-800/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="section-eyebrow mb-3">Which is Right for You?</div>
            <h2 className="font-display text-white font-bold text-2xl">Lounge vs. Nightclub</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="card-dark p-6">
              <h3 className="font-display text-gold-400 font-bold text-xl mb-4">Choose a Lounge if...</h3>
              <ul className="space-y-2">
                {[
                  'You want great cocktails without earsplitting volume',
                  'Your group is mixed ages and not everyone wants a club',
                  'You\'re starting early (9–11pm) and may move to a club later',
                  'It\'s a smaller group (2–8 people)',
                  'You want to actually have conversations',
                  'You\'re celebrating something low-key',
                ].map(i => (
                  <li key={i} className="flex items-start gap-2 text-white/65 text-sm">
                    <span className="text-gold-400 flex-shrink-0">✓</span>{i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-dark p-6">
              <h3 className="font-display text-gold-400 font-bold text-xl mb-4">Choose a Nightclub if...</h3>
              <ul className="space-y-2">
                {[
                  'You want the full Vegas nightlife experience',
                  'Your group wants to dance all night',
                  'You\'re doing a bachelor or bachelorette party',
                  'You want VIP bottle service with reserved seating',
                  'You want to see a world-class DJ performance',
                  'Your group is 6+ people who all want the same thing',
                ].map(i => (
                  <li key={i} className="flex items-start gap-2 text-white/65 text-sm">
                    <span className="text-gold-400 flex-shrink-0">✓</span>{i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <div className="section-eyebrow mb-4">Book VIP Lounge Access</div>
            <h2 className="font-display text-white font-bold text-3xl mb-4">Reserve Your Spot</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Tell us your date and group size. Justin will confirm availability and handle your VIP entry coordination.
            </p>
            <ul className="check-list">
              <li>Skip the line at every venue</li>
              <li>Reserved seating arranged in advance</li>
              <li>Can be combined with nightclub packages</li>
              <li>Personal host available</li>
            </ul>
          </div>
          <div className="card-dark p-8">
            <InquiryForm defaultPackage="nightclub" />
          </div>
        </div>
      </section>
    </>
  )
}
