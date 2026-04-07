import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = {
  title: 'Las Vegas Nightclub Tips for First-Timers 2026 | What to Know Before You Go',
  description: '15 essential Las Vegas nightclub tips for first-timers — what to wear, when to arrive, how to get the best experience, and mistakes that ruin first visits.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/blog/las-vegas-club-tips-first-timers' },
}
export default function ClubTipsFirstTimers() {
  const tips = [
    { n: 1, tip: 'Don\'t arrive before midnight', detail: 'Vegas clubs don\'t hit their stride until midnight at the earliest. Arriving at 10:30pm means you\'re standing in a half-empty room for 90 minutes. Aim for 11:30pm–12am arrival.' },
    { n: 2, tip: 'Dress code is enforced strictly', detail: 'Read the dress code for your specific venue and take it seriously. I\'ve seen people with VIP table reservations turned away at the door for wearing athletic sneakers. When in doubt, overdress.' },
    { n: 3, tip: 'Book your table in advance', detail: 'Walk-up attempts at major clubs on weekends almost never work at peak hours. Either book a table in advance or get on the guestlist — both require pre-arrangement.' },
    { n: 4, tip: 'The guestlist is free entry, not a VIP table', detail: 'Guestlist gets you past the cover charge, not into a reserved section. If you want a table, you need a table reservation, not just a name on the list.' },
    { n: 5, tip: 'Understand how bottle service minimums work', detail: 'When you book a table with a $1,000 minimum, that\'s what you spend on drinks — not a separate charge. The minimum goes toward bottles and mixers. Budget separately for gratuity (20–24%).' },
    { n: 6, tip: 'Pre-arrange your transportation', detail: 'Ubers from the Strip at 2–4am take 20–30 minutes and surge to absurd prices. Book a party bus or limo for the night and coordinate a specific return time.' },
    { n: 7, tip: 'Hydrate constantly', detail: 'Vegas is dry, hot, and alcohol-forward. Drink water between every cocktail. The groups that pace themselves have better nights than the ones who go hard early and fade by midnight.' },
    { n: 8, tip: 'Don\'t try to do too many venues', detail: 'Two clubs max per night. Three venues sounds exciting in theory and feels exhausting in practice. Pick your clubs deliberately and stay longer at each one.' },
    { n: 9, tip: 'Know your group\'s music preference in advance', detail: 'Don\'t book an EDM club if half your group loves hip-hop. Marquee, Drai\'s, and Jewel have better hip-hop programming. XS and Zouk are EDM-dominant. Match the venue to the crowd.' },
    { n: 10, tip: 'Your VIP host is your best asset', detail: 'If you\'re using a concierge, use them fully. Text them about last-minute changes, ask for recommendations, let them handle venue transitions. That\'s what they\'re there for.' },
  ]
  return (
    <>
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/blog/las-vegas-club-tips-first-timers/image.jpg" alt="Las Vegas nightclub tips for first-timers 2026" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4"><Link href="/blog" className="section-eyebrow hover:text-gold-300 transition-colors">← Blog</Link><span className="text-white/25">·</span><span className="section-eyebrow">Nightlife Guide</span></div>
          <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>Las Vegas Nightclub Tips for First-Timers 2026</h1>
          <div className="flex items-center gap-4 text-white/40 text-sm"><span>May 13, 2026</span><span>·</span><span>9 min read</span><span>·</span><span>By Justin — Nokturnal Lifestyle</span></div>
        </div>
      </section>
      <article className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <p className="text-white/70 leading-relaxed text-lg">After 8 years and thousands of groups, I\'ve seen every first-timer mistake in the book. Most are avoidable. Here are the 10 tips that make the biggest difference between a great Vegas nightclub experience and a disappointing one.</p>
          {tips.map(({ n, tip, detail }) => (
            <div key={n} className="card-dark p-5">
              <div className="flex items-start gap-4 mb-2">
                <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold text-sm flex-shrink-0">{n}</div>
                <h3 className="font-display text-white font-bold text-lg">{tip}</h3>
              </div>
              <p className="text-white/60 text-sm leading-relaxed pl-12">{detail}</p>
            </div>
          ))}
          <div className="card-dark p-8 text-center">
            <div className="section-eyebrow mb-3">Skip the Learning Curve</div>
            <h3 className="font-display text-white font-bold text-xl mb-3">Have Someone Who Knows Vegas Handle Everything</h3>
            <p className="text-white/55 text-sm mb-6">Justin\'s done this thousands of times. You get the benefit of 8 years of experience without having to learn any of it the hard way.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/contact" className="btn-gold">Get a Free Quote</Link>
              <a href="tel:+17029964884" className="btn-ghost">Call (702) 996-4884</a>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
