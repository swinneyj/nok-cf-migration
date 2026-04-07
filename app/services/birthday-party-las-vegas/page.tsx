import type { Metadata } from 'next'
import Link from 'next/link'
import InquiryForm from '@/components/InquiryForm'

export const metadata: Metadata = {
  title: 'Las Vegas Birthday Party Packages | 21st, 30th, 50th & More',
  description: 'Las Vegas birthday party packages for every milestone — 21st, 30th, 50th and beyond. VIP nightclub access, bottle service, party bus, personal host. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/services/birthday-party-las-vegas' },
  openGraph: {
    title: 'Las Vegas Birthday Party Packages | 21st, 30th, 50th & More',
    description: 'Celebrate every milestone birthday in Las Vegas in true VIP style. Packages from $149/person with personal host.',
    images: [{ url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1200&q=80' }],
  },
}

const milestones = [
  {
    age: '21st Birthday',
    headline: 'Your first legal night — make it legendary',
    desc: 'The 21st birthday in Las Vegas is a rite of passage. We build an itinerary that introduces you to the city right: VIP nightclub, bottle service, and every door opened.',
    popular: ['Nightclub VIP table with bottle service', 'Strip club VIP access', 'Party bus between venues', 'Free guestlist backup option'],
    href: '/services/21st-birthday-las-vegas',
  },
  {
    age: '30th Birthday',
    headline: 'Thirty and done right',
    desc: 'The 30th calls for something more elevated. Rooftop bars, premium venues, private dining, and a night that actually reflects where you are in life.',
    popular: ['Premium nightclub (XS, Hakkasan, Omnia)', 'VIP dinner reservation', 'Dayclub cabana the next afternoon', 'Custom weekend itinerary'],
    href: '/services/30th-birthday-las-vegas',
  },
  {
    age: '40th Birthday',
    headline: 'Forty — do it properly',
    desc: 'The 40th birthday deserves the full Vegas treatment. We build a weekend that balances nightlife with daytime experiences your whole group will actually enjoy.',
    popular: ['Top Golf VIP experience', 'Premium pool party', 'Nightclub VIP tables', 'Bespoke weekend itinerary'],
    href: '/services/birthday-party-las-vegas',
  },
  {
    age: '50th Birthday',
    headline: 'Fifty and fabulous',
    desc: 'The 50th birthday is a landmark. We focus on comfort, exclusivity, and experiences that actually match the occasion — quality over chaos.',
    popular: ['Private dining at top restaurant', 'Luxury suite at Wynn/Bellagio', 'Exclusive nightclub access', 'Show tickets + nightlife combo'],
    href: '/services/50th-birthday-las-vegas',
  },
]

export default function BirthdayPartyLasVegas() {
  return (
    <>
      <section className="relative page-hero overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1600&q=85" alt="Las Vegas birthday party packages VIP 21st 30th 50th" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
          <div className="max-w-3xl">
            <div className="section-eyebrow mb-4">Birthday Parties</div>
            <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
              Las Vegas Birthday Party Packages
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
              Every birthday milestone deserves the right Las Vegas experience. We customize every detail — from the venue to the transportation — around the birthday person and the group.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#milestones" className="btn-gold">Find Your Package</Link>
              <a href="tel:+17029964884" className="btn-ghost flex items-center gap-2">📞 (702) 996-4884</a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-night-800 border-y border-gold-500/10 py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '5,000+', label: 'Events Hosted' },
            { value: '8+ Years', label: 'In Business' },
            { value: '4.9★', label: 'Average Rating' },
            { value: '$0', label: 'Booking Fees' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="stat-number text-2xl">{value}</div>
              <div className="text-white/40 text-xs uppercase tracking-wider mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones */}
      <section id="milestones" className="py-20 px-4 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-eyebrow mb-3">By Milestone</div>
            <h2 className="font-display text-white font-bold text-3xl">Birthday Packages by Age</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {milestones.map((m) => (
              <div key={m.age} className="card-dark p-6 flex flex-col">
                <div className="text-gold-400 font-display font-bold text-2xl mb-1">{m.age}</div>
                <div className="text-white font-semibold mb-3">{m.headline}</div>
                <p className="text-white/55 text-sm leading-relaxed mb-4">{m.desc}</p>
                <div className="flex-1">
                  <div className="text-white/35 text-xs uppercase tracking-wider mb-2">Popular for this milestone:</div>
                  <ul className="space-y-1.5 mb-5">
                    {m.popular.map(item => (
                      <li key={item} className="flex items-start gap-2 text-white/65 text-xs">
                        <span className="text-gold-400 flex-shrink-0">✓</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/contact" className="btn-gold text-xs py-3 text-center">Plan My {m.age}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What makes a birthday special */}
      <section className="py-16 px-4 bg-night-800/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="section-eyebrow mb-3">The Nokturnal Difference</div>
            <h2 className="font-display text-white font-bold text-2xl">What We Do for Birthday Groups</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { title: 'Birthday Perks', desc: 'Complimentary sash, tiara, or birthday setup at the venue when arranged in advance. We make sure the birthday person gets treated.' },
              { title: 'Group Logistics', desc: 'Getting 12 people to the right place at the right time is harder than it sounds. We coordinate all transportation and timing so nobody gets separated.' },
              { title: 'Venue Selection', desc: 'Not every club is right for every birthday. We match the venue to the birthday person\'s personality and the group\'s vibe — not just whatever\'s available.' },
            ].map(({ title, desc }) => (
              <div key={title} className="card-dark p-5">
                <div className="text-gold-400 font-semibold mb-2">{title}</div>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <div className="section-eyebrow mb-4">Book Now</div>
            <h2 className="font-display text-white font-bold text-3xl mb-4">Plan the Perfect Birthday</h2>
            <p className="text-white/60 leading-relaxed mb-6">Tell us whose birthday it is, the milestone, and your group — Justin will build something unforgettable within your budget.</p>
            <ul className="check-list">
              <li>Fully customized to the birthday person</li>
              <li>Any group size — 4 to 100+</li>
              <li>Personal VIP host all night</li>
              <li>No booking fees, ever</li>
            </ul>
          </div>
          <div className="card-dark p-8">
            <InquiryForm defaultPackage="birthday" />
          </div>
        </div>
      </section>
    </>
  )
}
