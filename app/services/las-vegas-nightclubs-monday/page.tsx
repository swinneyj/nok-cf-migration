import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Las Vegas Nightclubs Open on Monday 2026 | Best Monday Night Out',
  description: 'Which Las Vegas nightclubs are open on Monday? XS, Hakkasan, and more are open Mondays — often with the same top DJs at lower minimums. Updated for 2026.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/services/las-vegas-nightclubs-monday' },
  openGraph: {
    title: 'Las Vegas Nightclubs Open on Monday 2026',
    description: 'Which Las Vegas clubs are open Monday? Full list with hours, DJs, and insider tips for the best Monday night out.',
    images: [{ url: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=1200&q=80' }],
  },
}

const mondayClubs = [
  { name: 'XS Nightclub', hotel: 'Encore at Wynn', open: '✓ Open Mondays', note: 'Select Monday dates only — check lineup. When open, same world-class experience as weekends at significantly lower minimums.', min: '$500–$1,200 (vs $1,000–$3,000+ weekends)' },
  { name: 'Hakkasan', hotel: 'MGM Grand', open: '✓ Select Mondays', note: 'Hakkasan occasionally programs Monday nights for major DJ events or holiday weekends. Check their calendar.', min: 'Lower than weekend pricing' },
  { name: "Drai's After Hours", hotel: 'The Cromwell', open: '✓ Open Monday nights', note: "Drai's has an after-hours component that runs later than most venues. Monday nights are popular with locals and industry workers.", min: 'Varies by event' },
  { name: 'Chateau Nightclub', hotel: 'Paris Las Vegas', open: '✓ Open most Mondays', note: 'One of the more consistent Monday night venues on the Strip. Good option if the bigger clubs are closed.', min: 'Lower minimums than big clubs' },
]

const whyMonday = [
  { title: 'Lower Cover Charges', desc: 'Most Vegas clubs waive or significantly reduce cover on weeknights. Even major clubs like XS often run free guestlist on Mondays.' },
  { title: 'Lower Table Minimums', desc: 'Monday table minimums can be 40–60% lower than Friday/Saturday. Same venue, same experience, better value.' },
  { title: 'Less Crowded', desc: 'Smaller crowds mean better service, shorter waits at the bar, and more attention from your server.' },
  { title: 'Same DJ Talent', desc: 'Many top residency DJs play midweek dates. XS on a Monday with the right act can rival a Saturday night.' },
]

export default function NightclubsMondayPage() {
  return (
    <>
      <section className="relative page-hero overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=1600&q=85" alt="Las Vegas nightclubs open Monday 2026" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
          <div className="max-w-3xl">
            <div className="section-eyebrow mb-4">Nightlife Guide</div>
            <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)' }}>
              Las Vegas Nightclubs Open on Monday (2026)
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
              Staying in Vegas through Monday? Good news — some of the best nightclubs in the city are open, and Monday nights often deliver the same experience at significantly lower prices.
            </p>
            <Link href="/contact" className="btn-gold">Check Monday Availability</Link>
          </div>
        </div>
      </section>

      <article className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-12">

          <div className="card-dark p-6 border-l-4 border-gold-500">
            <p className="text-gold-400 font-semibold text-sm mb-2">The Monday Secret</p>
            <p className="text-white/80 text-sm leading-relaxed">
              Monday is actually one of the best nights to go out in Las Vegas for value. Table minimums drop significantly, covers are often waived, and the clubs that are open are still running quality programming. If you have flexibility in your schedule, Monday can be the smartest night to hit a major venue.
            </p>
          </div>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-5">Which Las Vegas Clubs Are Open Monday?</h2>
            <div className="space-y-4">
              {mondayClubs.map(club => (
                <div key={club.name} className="card-dark p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-display text-white font-bold text-lg">{club.name}</h3>
                      <div className="text-gold-500 text-xs">{club.hotel}</div>
                    </div>
                    <span className="text-green-400 text-xs font-semibold bg-green-400/10 px-2 py-1 rounded flex-shrink-0 ml-4">{club.open}</span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed mb-2">{club.note}</p>
                  <div className="text-gold-400 text-xs font-semibold">{club.min}</div>
                </div>
              ))}
            </div>
            <div className="card-dark p-5 mt-4 border border-amber-500/20">
              <p className="text-amber-400 text-sm font-semibold mb-1">⚠️ Always Verify Before You Go</p>
              <p className="text-white/60 text-sm">Club schedules change week to week based on DJ bookings and events. Call us before your Monday night out — we'll confirm exactly which venues are open and whether there's a good act playing.</p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-5">Why Monday Night in Vegas is Underrated</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {whyMonday.map(({ title, desc }) => (
                <div key={title} className="card-dark p-5">
                  <div className="text-gold-400 font-semibold text-sm mb-2">{title}</div>
                  <p className="text-white/60 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-5">Best Strategy for a Monday Night Out</h2>
            <div className="space-y-3">
              {[
                { step: '1', action: 'Check the DJ lineup', detail: 'Monday nights are only worth it if there\'s a quality act. Ask us — we know the weekly lineups at every major venue.' },
                { step: '2', action: 'Start later', detail: 'Monday crowds build slower. Aim for 11:30 PM arrival rather than 10 PM. Clubs hit their stride around midnight.' },
                { step: '3', action: 'Use the guestlist', detail: 'Monday guestlists are often free or deeply discounted — even at XS. We get your group on the list automatically.' },
                { step: '4', action: 'Consider a table', detail: 'Monday table minimums can be low enough that a VIP table actually makes sense even for smaller groups. Call us for current pricing.' },
              ].map(({ step, action, detail }) => (
                <div key={step} className="card-dark p-4 flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold text-sm flex-shrink-0">{step}</div>
                  <div>
                    <div className="text-white font-semibold text-sm mb-1">{action}</div>
                    <div className="text-white/55 text-xs">{detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-dark p-8 text-center">
            <div className="section-eyebrow mb-3">In Vegas on a Monday?</div>
            <h3 className="font-display text-white font-bold text-xl mb-3">We'll Tell You Exactly What's Worth Hitting</h3>
            <p className="text-white/55 text-sm mb-6">Justin tracks weekly club schedules and DJ lineups. Call or text us for same-day Monday night recommendations and booking.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/contact" className="btn-gold">Get Monday Recommendations</Link>
              <a href="tel:+17029964884" className="btn-ghost">Call (702) 996-4884</a>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
