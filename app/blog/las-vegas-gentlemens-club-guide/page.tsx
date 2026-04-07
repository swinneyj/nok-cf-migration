import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Las Vegas Gentleman\'s Club Guide 2026 | What to Know Before You Go',
  description: 'Complete guide to Las Vegas gentleman\'s clubs — the best venues, what to expect, how pricing works, how to get VIP access, and mistakes to avoid. Updated for 2026.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/blog/las-vegas-gentlemens-club-guide' },
  openGraph: {
    title: 'Las Vegas Gentleman\'s Club Guide 2026 | Complete Insider Guide',
    description: 'What to know before visiting a Las Vegas gentleman\'s club — best venues, pricing, VIP access, and how to avoid getting ripped off.',
    images: [{ url: '/blog/las-vegas-gentlemens-club-guide/cover.jpg' }],
  },
}

const clubs = [
  { name: 'Crazy Horse 3', type: 'Topless', location: 'Off-Strip (15 min from Strip)', coverVIP: 'Waived with package', vibe: 'High energy, world-class entertainment, multiple stages' },
  { name: 'Sapphire Las Vegas', type: 'Topless', location: 'Off-Strip (10 min)', coverVIP: 'Waived with package', vibe: 'World\'s largest — massive scale, multiple floors, rooftop pool' },
  { name: 'Spearmint Rhino', type: 'Topless', location: 'Off-Strip (15 min)', coverVIP: 'Waived with package', vibe: 'Global brand, consistent quality, private VIP rooms' },
  { name: 'Larry Flynt\'s Hustler Club', type: 'Topless', location: 'On the Strip', coverVIP: 'Waived with package', vibe: 'Most convenient location, direct Strip access' },
  { name: 'Little Darlings', type: 'Fully Nude', location: 'Off-Strip (15 min)', coverVIP: 'Waived with package', vibe: 'No alcohol (BYOB), nude entertainment — unique in Vegas' },
  { name: 'Palomino', type: 'Topless', location: 'Off-Strip (20 min)', coverVIP: 'Waived with package', vibe: 'Only topless club with a full bar directly on the Strip corridor' },
]

export default function GentlemensClubGuide() {
  return (
    <>
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/blog/las-vegas-gentlemens-club-guide/cover.jpg" alt="Las Vegas gentleman's club guide VIP access 2026" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/blog" className="section-eyebrow hover:text-gold-300 transition-colors">← Blog</Link>
            <span className="text-white/25">·</span>
            <span className="section-eyebrow">Strip Clubs</span>
          </div>
          <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
            Las Vegas Gentleman's Club Guide 2026: What to Know Before You Go
          </h1>
          <div className="flex items-center gap-4 text-white/40 text-sm">
            <span>April 8, 2026</span><span>·</span><span>9 min read</span><span>·</span><span>By Justin — Nokturnal Lifestyle</span>
          </div>
        </div>
      </section>

      <article className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-10">

          <div className="card-dark p-6 border-l-4 border-gold-500">
            <p className="text-gold-400 font-semibold text-sm mb-2">The Most Important Thing to Know</p>
            <p className="text-white/80 text-sm leading-relaxed">
              Walking into a Las Vegas gentleman's club without a VIP arrangement is significantly more expensive than going with a concierge. Cover charges, drink minimums, and upsells add up fast. With us, you typically get <strong className="text-white">free entry, free drinks to start, and better seat placement</strong> — at a lower total cost than walking in off the street.
            </p>
          </div>

          <p className="text-white/70 leading-relaxed text-lg">
            Las Vegas gentleman's clubs are a major part of the city's nightlife economy. After 8 years of coordinating VIP access for bachelor parties and groups, I can tell you exactly what to expect, which venues are worth it, and how to avoid the mistakes that most first-timers make.
          </p>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-5">The Best Las Vegas Gentleman's Clubs (2026)</h2>
            <div className="space-y-4">
              {clubs.map(club => (
                <div key={club.name} className="card-dark p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display text-white font-bold text-lg">{club.name}</h3>
                      <div className="flex gap-3 mt-0.5">
                        <span className="text-gold-500 text-xs">{club.type}</span>
                        <span className="text-white/35 text-xs">·</span>
                        <span className="text-white/45 text-xs">{club.location}</span>
                      </div>
                    </div>
                    <span className="text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded flex-shrink-0">VIP: {club.coverVIP}</span>
                  </div>
                  <p className="text-white/60 text-sm">{club.vibe}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-5">How Pricing Works (Honest Breakdown)</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              This is the area where most visitors get surprised. Here's how it actually works at a Las Vegas gentleman's club:
            </p>
            <div className="space-y-3">
              {[
                { item: 'Cover charge', walkIn: '$20–$60 at the door', withUs: 'Waived — free entry' },
                { item: 'Drink minimum', walkIn: '$10–$20 per person mandatory', withUs: 'First round often included' },
                { item: 'Seat location', walkIn: 'Whatever is available', withUs: 'Better sections pre-arranged' },
                { item: 'Transportation', walkIn: 'Uber/taxi on your own', withUs: 'Party bus or limo coordinated' },
                { item: 'Private dances', walkIn: '$20–$60 per song', withUs: 'Same pricing — no discount (no one gets this)' },
                { item: 'VIP room (extended private)', walkIn: '$200–$500/hr + more', withUs: 'Same pricing — this is between you and the club' },
              ].map(({ item, walkIn, withUs }) => (
                <div key={item} className="card-dark p-3 grid grid-cols-3 gap-3 text-xs">
                  <div className="text-white/60 font-semibold">{item}</div>
                  <div className="text-red-400">{walkIn}</div>
                  <div className="text-green-400">{withUs}</div>
                </div>
              ))}
            </div>
            <div className="card-dark p-3 grid grid-cols-3 gap-3 text-xs mt-1">
              <div className="text-white/35 font-semibold">Category</div>
              <div className="text-white/35">Walk-in</div>
              <div className="text-white/35">With Nokturnal</div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-5">Mistakes to Avoid</h2>
            <div className="space-y-3">
              {[
                { mistake: 'Going on an empty stomach', fix: 'These venues are not known for food. Eat before. Alcohol hits differently when you\'re going late night on an empty stomach.' },
                { mistake: 'Not setting a personal budget beforehand', fix: 'Decide what you\'re comfortable spending before you walk in and stick to it. The environment is designed to encourage more spending.' },
                { mistake: 'Splitting the group across different clubs', fix: 'Go together. Groups that split up always struggle to reconnect. Choose one club and commit.' },
                { mistake: 'Booking transportation last minute', fix: 'Most clubs are off-Strip. Ubers from venues at 2am take 20+ minutes. Pre-book a party bus or car service for the return.' },
                { mistake: 'Walking in without a VIP arrangement', fix: 'You pay cover at the door, get a mid-tier seat, and pay full drink prices. Going through a concierge eliminates all three of these.' },
              ].map(({ mistake, fix }) => (
                <div key={mistake} className="card-dark p-4">
                  <div className="text-red-400 text-sm font-semibold mb-1">✗ {mistake}</div>
                  <div className="text-white/60 text-xs">→ {fix}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-4">Gentleman's Club + Nightclub Packages</h2>
            <p className="text-white/70 leading-relaxed">
              The most popular bachelor party itinerary we run starts with a gentleman's club visit (usually 9–11pm) and then transitions to a nightclub VIP table for the rest of the night. The party bus handles both transitions. We coordinate VIP entry at both venues so there's no waiting and no separate arrangements to make. Everything flows.
            </p>
          </div>

          <div className="card-dark p-8 text-center">
            <div className="section-eyebrow mb-3">VIP Access — No Cover, No Wait</div>
            <h3 className="font-display text-white font-bold text-xl mb-3">We Get You In Better, For Less</h3>
            <p className="text-white/55 text-sm mb-6">Free entry, first round on us at most venues, and party bus transportation — as part of a full bachelor party package.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/strip-clubs" className="btn-gold">View Strip Club Packages</Link>
              <Link href="/contact" className="btn-ghost">Get a Free Quote</Link>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
