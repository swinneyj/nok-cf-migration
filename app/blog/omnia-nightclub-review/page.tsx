import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = {
  title: 'Omnia Nightclub Las Vegas Review 2026: Is It Worth It?',
  description: 'Honest Omnia Nightclub review — table quality, DJs, kinetic chandelier, pricing, crowd, and whether it\'s worth booking for your group in 2026. From a VIP host.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/blog/omnia-nightclub-review' },
}
export default function OmniaReview() {
  const pros = ['Kinetic chandelier is genuinely spectacular — nothing else like it in Vegas', 'Rooftop terrace with Strip views is a unique feature no other mega-club offers', 'Caesars Palace location — central Strip, easy access', 'Three distinct areas so your group can move around', 'Consistently books top-tier DJ residencies']
  const cons = ['Can feel touristy — high percentage of first-time Vegas visitors', 'Main floor tables mid-venue don\'t have great sightlines', 'Caesars security is strict — dress code enforced firmly', 'Parking and approach can be chaotic on peak nights']
  return (
    <>
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/blog/omnia-nightclub-review/cover.jpg" alt="Omnia Nightclub Caesars Palace Las Vegas review 2026" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4"><Link href="/blog" className="section-eyebrow hover:text-gold-300 transition-colors">← Blog</Link><span className="text-white/25">·</span><span className="section-eyebrow">Venue Reviews</span></div>
          <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>Omnia Nightclub Las Vegas Review 2026: Is It Worth It?</h1>
          <div className="flex items-center gap-4 text-white/40 text-sm"><span>April 22, 2026</span><span>·</span><span>7 min read</span><span>·</span><span>By Justin — Nokturnal Lifestyle</span></div>
        </div>
      </section>
      <article className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="card-dark p-6 border-l-4 border-gold-500">
            <p className="text-gold-400 font-semibold text-sm mb-2">Verdict</p>
            <p className="text-white/80 text-sm leading-relaxed"><strong className="text-white">8.5/10 — Yes, it's worth it</strong> for first-time Vegas visitors and groups who want the most visually dramatic nightclub experience on the Strip. The kinetic chandelier alone is worth going once. Long-time Vegas regulars may prefer XS or Hakkasan for repeat visits.</p>
          </div>
          <p className="text-white/70 leading-relaxed text-lg">Omnia at Caesars Palace has been a fixture of Las Vegas nightlife since 2015. After hundreds of group bookings there, I have a clear picture of exactly who it's right for and who should go elsewhere. Here's the honest review.</p>
          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-4">The Kinetic Chandelier — Worth the Hype?</h2>
            <p className="text-white/70 leading-relaxed mb-4">Yes, unequivocally. The chandelier descends from the ceiling, pulses with light synchronized to the music, and moves in ways that feel genuinely alien. The first time you see it happen, every single person in your group will stop what they're doing and stare. It's the most dramatic single production element in Las Vegas nightlife and it's not close. If you've never been to Omnia, this alone is worth the visit.</p>
          </div>
          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-4">Table Quality & Placement</h2>
            <p className="text-white/70 leading-relaxed mb-4">This is where Omnia has more variance than XS or Hakkasan. The best tables are on the main floor mezzanine level with clear chandelier views — these are genuinely excellent. Mid-venue main floor tables can feel disconnected. The rooftop is a different vibe — quieter, great views, but separate from the main show. When we book Omnia, we push for mezzanine placement specifically.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="card-dark p-5">
              <h3 className="text-green-400 font-semibold mb-3">✓ Pros</h3>
              <ul className="space-y-2">{pros.map(p => <li key={p} className="text-white/65 text-xs flex items-start gap-2"><span className="text-green-400 flex-shrink-0">+</span>{p}</li>)}</ul>
            </div>
            <div className="card-dark p-5">
              <h3 className="text-red-400 font-semibold mb-3">✗ Cons</h3>
              <ul className="space-y-2">{cons.map(c => <li key={c} className="text-white/65 text-xs flex items-start gap-2"><span className="text-red-400 flex-shrink-0">−</span>{c}</li>)}</ul>
            </div>
          </div>
          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-4">Who Should Book Omnia</h2>
            <div className="space-y-2">
              {[
                { who: 'First-time Vegas visitors', book: true, reason: 'The chandelier experience is bucket-list Vegas nightlife. Do it at least once.' },
                { who: 'Groups who care about production value', book: true, reason: 'Best light show on the Strip. If you\'re into music production and spectacle, this is your club.' },
                { who: 'Groups visiting for a rooftop experience', book: true, reason: 'The rooftop terrace is unique — no other Vegas mega-club has this feature.' },
                { who: 'Vegas regulars on repeat visits', book: false, reason: 'XS or Hakkasan offer more consistent experience for groups who\'ve already done Omnia.' },
                { who: 'Groups who want the most exclusive feel', book: false, reason: 'XS at Wynn has a more polished, premium atmosphere for high-end groups.' },
              ].map(({ who, book, reason }) => (
                <div key={who} className="card-dark p-3 flex items-start gap-3 text-xs">
                  <span className={book ? 'text-green-400' : 'text-red-400'}>{book ? '✓' : '✗'}</span>
                  <div><span className="text-white font-semibold">{who}: </span><span className="text-white/55">{reason}</span></div>
                </div>
              ))}
            </div>
          </div>
          <div className="card-dark p-8 text-center">
            <div className="section-eyebrow mb-3">Book Omnia</div>
            <h3 className="font-display text-white font-bold text-xl mb-3">Reserve the Best Table in the House</h3>
            <p className="text-white/55 text-sm mb-6">Justin books mezzanine placement with chandelier views — not whatever's available. That's the difference.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/places/omnia-nightclub" className="btn-gold">View Omnia Details</Link>
              <Link href="/contact" className="btn-ghost">Get a Free Quote</Link>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
