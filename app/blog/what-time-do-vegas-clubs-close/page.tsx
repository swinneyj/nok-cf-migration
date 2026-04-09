import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'What Time Do Las Vegas Clubs Close? (Every Major Venue, 2026)',
  description: 'Exact closing times for every major Las Vegas nightclub — XS, Hakkasan, Omnia, Marquee, TAO, Zouk, LIV, Drai\'s and more. Plus last entry times and after-hours options.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/blog/what-time-do-vegas-clubs-close' },
  openGraph: {
    title: 'What Time Do Las Vegas Nightclubs Close? (2026 Guide)',
    description: 'Closing times for every major Las Vegas nightclub, plus last entry times and after-hours options.',
    images: [{ url: '/blog/what-time-do-vegas-clubs-close/cover.jpg' }],
  },
}

const clubs = [
  { name: 'XS Nightclub', hotel: 'Encore at Wynn', open: '10:30 PM', close: '4:00 AM', lastEntry: '~2:30 AM', days: 'Fri, Sat, Mon' },
  { name: 'Hakkasan', hotel: 'MGM Grand', open: '10:00 PM', close: '4:00 AM', lastEntry: '~2:30 AM', days: 'Thu–Sun' },
  { name: 'Omnia', hotel: 'Caesars Palace', open: '10:30 PM', close: '4:00 AM', lastEntry: '~2:30 AM', days: 'Thu–Sun' },
  { name: 'Marquee Nightclub', hotel: 'Cosmopolitan', open: '10:30 PM', close: '4:00 AM', lastEntry: '~2:30 AM', days: 'Fri, Sat, Sun' },
  { name: 'TAO Nightclub', hotel: 'Venetian', open: '10:30 PM', close: '4:00 AM', lastEntry: '~2:30 AM', days: 'Fri, Sat' },
  { name: 'Zouk Nightclub', hotel: 'Resorts World', open: '10:30 PM', close: '4:00 AM', lastEntry: '~2:30 AM', days: 'Fri, Sat' },
  { name: 'LIV Nightclub', hotel: 'Fontainebleau', open: '11:00 PM', close: '5:00 AM', lastEntry: '~3:00 AM', days: 'Fri, Sat' },
  { name: "Drai's Nightclub", hotel: 'The Cromwell', open: '11:00 PM', close: '4:00 AM', lastEntry: '~2:30 AM', days: 'Thu–Sat' },
  { name: 'Jewel Nightclub', hotel: 'ARIA', open: '10:30 PM', close: '4:00 AM', lastEntry: '~2:30 AM', days: 'Fri, Sat' },
  { name: 'EBC at Night', hotel: 'Encore at Wynn', open: '9:00 PM', close: '2:00 AM', lastEntry: '~12:00 AM', days: 'Select nights' },
]

const dayclubs = [
  { name: 'Encore Beach Club', open: '11:00 AM', close: '6:00 PM', days: 'Fri–Sun (seasonal)' },
  { name: 'Marquee Dayclub', open: '11:00 AM', close: '6:00 PM', days: 'Fri–Sun (seasonal)' },
  { name: 'Omnia Dayclub', open: '11:00 AM', close: '6:00 PM', days: 'Fri–Sun (seasonal)' },
  { name: 'AYU Dayclub', open: '11:00 AM', close: '6:00 PM', days: 'Fri–Sun (seasonal)' },
]

export default function WhatTimeDoVegasClubsClose() {
  return (
    <>
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/blog/what-time-do-vegas-clubs-close/cover.jpg" alt="What time do Las Vegas nightclubs close 2026" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/blog" className="section-eyebrow hover:text-gold-300 transition-colors">← Blog</Link>
            <span className="text-white/25">·</span>
            <span className="section-eyebrow">Nightlife Guide</span>
          </div>
          <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
            What Time Do Las Vegas Clubs Close? (Every Major Venue, 2026)
          </h1>
          <div className="flex items-center gap-4 text-white/40 text-sm">
            <span>April 10, 2026</span><span>·</span><span>5 min read</span><span>·</span><span>By Justin — Nokturnal Lifestyle</span>
          </div>
        </div>
      </section>

      <article className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-10">

          <div className="card-dark p-6 border-l-4 border-gold-500">
            <p className="text-gold-400 font-semibold text-sm mb-2">Quick Answer</p>
            <p className="text-white/80 text-sm leading-relaxed">
              Most major Las Vegas nightclubs close at <strong className="text-white">4:00 AM</strong>. Last entry is typically around <strong className="text-white">2:30 AM</strong>. Nevada has no last call — alcohol is served until closing. LIV Nightclub at Fontainebleau stays open until 5:00 AM on weekends.
            </p>
          </div>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-5">Nightclub Hours — Complete 2026 List</h2>
            <p className="text-white/55 text-sm mb-4">All times are approximate and subject to change for special events. Always verify with the venue for holiday weekends.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold-500/20">
                    {['Nightclub', 'Hotel', 'Opens', 'Closes', 'Last Entry', 'Days'].map(h => (
                      <th key={h} className="text-left py-3 pr-3 text-gold-400 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clubs.map((club, i) => (
                    <tr key={club.name} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                      <td className="py-3 pr-3 text-white font-semibold text-xs whitespace-nowrap">{club.name}</td>
                      <td className="py-3 pr-3 text-white/50 text-xs whitespace-nowrap">{club.hotel}</td>
                      <td className="py-3 pr-3 text-white/70 text-xs whitespace-nowrap">{club.open}</td>
                      <td className="py-3 pr-3 text-white/70 text-xs whitespace-nowrap">{club.close}</td>
                      <td className="py-3 pr-3 text-white/45 text-xs whitespace-nowrap">{club.lastEntry}</td>
                      <td className="py-3 text-white/45 text-xs">{club.days}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-5">Dayclub Hours</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold-500/20">
                    {['Dayclub', 'Opens', 'Closes', 'Season'].map(h => (
                      <th key={h} className="text-left py-3 pr-4 text-gold-400 font-semibold text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dayclubs.map((club, i) => (
                    <tr key={club.name} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                      <td className="py-3 pr-4 text-white font-semibold text-xs">{club.name}</td>
                      <td className="py-3 pr-4 text-white/70 text-xs">{club.open}</td>
                      <td className="py-3 pr-4 text-white/70 text-xs">{club.close}</td>
                      <td className="py-3 text-white/45 text-xs">{club.days}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-5">Key Things to Know About Vegas Club Hours</h2>
            <div className="space-y-3">
              {[
                { q: 'Is there a last call for alcohol?', a: 'No. Nevada law does not require a last call. You can order drinks until the club closes. This is one of the key differences from most US cities.' },
                { q: 'What is "last entry" vs. closing time?', a: 'Last entry is when the club stops letting new people in — typically 1–1.5 hours before closing. If you arrive at 3:00 AM hoping to get into XS, you\'ll be turned away even if the club is technically open until 4.' },
                { q: 'Do clubs close earlier on weeknights?', a: 'Some clubs don\'t open at all on weeknights (Thursday–Sunday is standard). Those that do open on Monday or Wednesday typically maintain the same 4 AM closing time.' },
                { q: 'What about holidays and special events?', a: 'New Year\'s Eve, EDC weekend, Formula 1 weekend, and major fights can push closing times to 6 AM or later at some venues. These are the exception, not the rule.' },
                { q: 'Are there after-hours options after 4 AM?', a: 'Yes. Several venues operate after-hours, including Drai\'s After Hours and some Fremont Street venues. The crowd shifts significantly after 4 AM — this is more local-facing.' },
              ].map(({ q, a }) => (
                <div key={q} className="card-dark p-4">
                  <div className="text-white font-semibold text-sm mb-1">{q}</div>
                  <p className="text-white/60 text-xs leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-4">Timing Your Night Perfectly</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              The most common mistake is arriving at a club too early (10:30–11 PM) and leaving when it's actually getting good (1–2 AM). Vegas clubs don't hit their peak until midnight at the earliest. A well-timed night looks like this:
            </p>
            <div className="space-y-2">
              {[
                { time: '9–10 PM', action: 'Dinner, hotel pre-game, or lounge/bar crawl' },
                { time: '10:30–11 PM', action: 'Arrive at venue #1 — not too early, not missing anything' },
                { time: '12:30–1 AM', action: 'Club is at peak energy — this is the best window' },
                { time: '1:30–2 AM', action: 'Move to venue #2 if doing a two-club night' },
                { time: '3:30–4 AM', action: 'Last round, wrap up, coordinate transport home' },
              ].map(({ time, action }) => (
                <div key={time} className="card-dark p-3 flex gap-4 text-sm">
                  <span className="text-gold-400 font-semibold text-xs w-24 flex-shrink-0">{time}</span>
                  <span className="text-white/65 text-xs">{action}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-dark p-8 text-center">
            <div className="section-eyebrow mb-3">Let Us Plan the Timing</div>
            <h3 className="font-display text-white font-bold text-xl mb-3">Perfect Timing Is Part of What We Do</h3>
            <p className="text-white/55 text-sm mb-6">We coordinate arrival times, transitions, and transportation so your group is at every venue at exactly the right moment.</p>
            <Link href="/contact" className="btn-gold">Get a Free Quote</Link>
          </div>
        </div>
      </article>
    </>
  )
}
