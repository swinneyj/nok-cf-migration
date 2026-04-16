import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'XS vs Hakkasan vs Omnia: Which Las Vegas Club is Best? 2026 Comparison',
  description: 'Detailed comparison: XS (Wynn), Hakkasan, and Omnia nightclubs in Las Vegas. Pricing, crowd, vibe, table placement, DJs, and which is best for your group.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/blog/xs-hakkasan-omnia-comparison' },
}

export default function ClubComparison() {
  const clubs = [
    {
      name: 'XS (Wynn)',
      pricing: '$500–$800 (weekday), $1,500–$3,000+ (weekend)',
      crowd: 'Affluent, A-list adjacent, business travelers, celebrities',
      vibe: 'Polished, exclusive, high-energy. Main floor is state-of-the-art.',
      tables: 'Exceptional. Premium placement on main floor feels VIP.',
      music: 'Top-tier residencies. Consistently the best DJs.',
      pros: ['Best sound system in Vegas', 'Most exclusive crowd', 'Best table placement options', 'Wynn location (central, easy access)', 'Highest chance of celebrity sightings'],
      cons: ['Most expensive', 'Can feel stuffy/uptight', 'Younger crowds get intimidated', 'Main floor is loud (hard to talk)', 'Weekends nearly impossible without booking ahead'],
    },
    {
      name: 'Hakkasan',
      pricing: '$400–$700 (weekday), $1,200–$2,500 (weekend)',
      crowd: 'Mixed: tourists, locals, bottle-service groups, professionals',
      vibe: 'Asian-fusion aesthetic, energetic, less formal than XS. Multiple levels.',
      tables: 'Good variety. Main floor tables solid. Upper level quieter.',
      music: 'Excellent residencies. DJs are world-class but less hype than XS.',
      pros: ['Better pricing than XS', 'Multiple levels = different vibes', 'Consistently good energy', 'Mgm location (accessible)', 'Less pretentious than XS', 'Great for group flexibility'],
      cons: ['Main floor can feel crowded', 'Not as exclusive as XS', 'Parking is chaotic', 'Bathroom lines are brutal', 'Doesn\'t have the "wow" factor of newer clubs'],
    },
    {
      name: 'Omnia',
      pricing: '$350–$600 (weekday), $1,000–$2,000 (weekend)',
      crowd: 'First-time Vegas visitors, bachelor/bachelorette groups, mid-range spenders',
      vibe: 'Spectacular production (kinetic chandelier), accessible energy, Instagram-worthy',
      tables: 'Mezzanine level tables excellent. Main floor mid-venue weaker.',
      music: 'Good DJs. Less exclusive residencies than XS/Hakkasan.',
      pros: ['Kinetic chandelier is unreal', 'Most affordable of the three', 'Rooftop terrace unique vibe', 'Great for bachelor/bachelorette parties', 'Less intimidating than XS'],
      cons: ['Can feel touristy', 'Chandelier crowds slow down the dance floor', 'Caesars parking is expensive', 'Dress code strictly enforced', 'Not as premium an experience as XS'],
    },
  ]

  const scoreCard = [
    { category: 'Sound System', xs: '10/10', hakkasan: '8.5/10', omnia: '8/10' },
    { category: 'Crowd Quality', xs: '9.5/10', hakkasan: '8/10', omnia: '7/10' },
    { category: 'Table Experience', xs: '9.5/10', hakkasan: '8/10', omnia: '8.5/10' },
    { category: 'DJ Residencies', xs: '10/10', hakkasan: '9/10', omnia: '7.5/10' },
    { category: 'Value for Money', xs: '6/10', hakkasan: '8/10', omnia: '8.5/10' },
    { category: 'Vibe/Energy', xs: '9/10', hakkasan: '8.5/10', omnia: '8/10' },
    { category: 'Ease of Booking', xs: '6/10', hakkasan: '7.5/10', omnia: '8/10' },
    { category: 'Best for Groups', xs: '7/10', hakkasan: '8.5/10', omnia: '9/10' },
  ]

  return (
    <>
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/blog/xs-hakkasan-omnia-comparison/cover.jpg" alt="XS vs Hakkasan vs Omnia nightclub comparison Las Vegas" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/blog" className="section-eyebrow hover:text-gold-300 transition-colors">← Blog</Link>
            <span className="text-white/25">·</span>
            <span className="section-eyebrow">Nightclub Guides</span>
          </div>
          <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>XS vs Hakkasan vs Omnia: Which Las Vegas Club is Best? 2026 Comparison</h1>
          <div className="flex items-center gap-4 text-white/40 text-sm">
            <span>June 4, 2026</span>
            <span>·</span>
            <span>11 min read</span>
            <span>·</span>
            <span>By Justin — Nokturnal Lifestyle</span>
          </div>
        </div>
      </section>

      <article className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="card-dark p-6 border-l-4 border-gold-500">
            <p className="text-gold-400 font-semibold text-sm mb-2">Quick Take</p>
            <p className="text-white/80 text-sm leading-relaxed">
              <strong>XS:</strong> Best experience, most expensive. <strong>Hakkasan:</strong> Best balance of quality + price. <strong>Omnia:</strong> Best value, most accessible. The right choice depends on your budget and vibe preference—not quality alone.
            </p>
          </div>

          <p className="text-white/70 leading-relaxed text-lg">
            I've booked hundreds of tables at these three venues. XS, Hakkasan, and Omnia are the top tier of Las Vegas nightlife. But they're different experiences at different price points. Here's what you're actually getting at each.
          </p>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-4">Head-to-Head Breakdown</h2>
            <div className="space-y-8">
              {clubs.map(({ name, pricing, crowd, vibe, tables, music, pros, cons }) => (
                <div key={name} className="card-dark p-6">
                  <h3 className="font-display text-white font-bold text-xl mb-4">{name}</h3>
                  <div className="grid sm:grid-cols-2 gap-3 mb-6 pb-6 border-b border-white/10">
                    <div>
                      <p className="text-white/50 text-xs font-semibold mb-1">PRICING</p>
                      <p className="text-gold-400 text-sm">{pricing}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs font-semibold mb-1">CROWD</p>
                      <p className="text-white/70 text-sm">{crowd}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs font-semibold mb-1">VIBE</p>
                      <p className="text-white/70 text-sm">{vibe}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs font-semibold mb-1">TABLES</p>
                      <p className="text-white/70 text-sm">{tables}</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-green-400 font-semibold text-sm mb-2">✓ Best For</h4>
                      <ul className="space-y-1">
                        {pros.map(p => (
                          <li key={p} className="text-white/65 text-xs flex items-start gap-2">
                            <span className="text-green-400 flex-shrink-0">+</span>{p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-red-400 font-semibold text-sm mb-2">✗ Drawbacks</h4>
                      <ul className="space-y-1">
                        {cons.map(c => (
                          <li key={c} className="text-white/65 text-xs flex items-start gap-2">
                            <span className="text-red-400 flex-shrink-0">−</span>{c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-4">Scorecard: By Category</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white/70">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-3 font-semibold text-white">Category</th>
                    <th className="text-center py-3 px-3 font-semibold text-gold-400">XS</th>
                    <th className="text-center py-3 px-3 font-semibold text-gold-400">Hakkasan</th>
                    <th className="text-center py-3 px-3 font-semibold text-gold-400">Omnia</th>
                  </tr>
                </thead>
                <tbody>
                  {scoreCard.map(({ category, xs, hakkasan, omnia }) => (
                    <tr key={category} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-3 px-3 text-white font-semibold text-sm">{category}</td>
                      <td className="text-center py-3 px-3">{xs}</td>
                      <td className="text-center py-3 px-3">{hakkasan}</td>
                      <td className="text-center py-3 px-3">{omnia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-4">Which One Should You Book?</h2>
            <div className="space-y-4">
              <div className="card-dark p-5 bg-gold-950/20 border-l-4 border-gold-400">
                <h3 className="text-white font-semibold mb-2">Choose XS If...</h3>
                <ul className="space-y-1 text-white/70 text-sm">
                  <li>✓ You want the absolute best nightclub experience in Vegas</li>
                  <li>✓ Your group is high-end spenders (bachelor, corporate event, celebration)</li>
                  <li>✓ You want A-list energy and the chance to see celebrities</li>
                  <li>✓ Sound quality and production are priority #1</li>
                </ul>
              </div>

              <div className="card-dark p-5 bg-blue-950/20 border-l-4 border-blue-400">
                <h3 className="text-white font-semibold mb-2">Choose Hakkasan If...</h3>
                <ul className="space-y-1 text-white/70 text-sm">
                  <li>✓ You want quality without breaking the bank</li>
                  <li>✓ Your group is mixed (some want to dance, some want to chill)</li>
                  <li>✓ You're returning to Vegas and want a trusted venue</li>
                  <li>✓ You want consistent excellence without excessive hype</li>
                </ul>
              </div>

              <div className="card-dark p-5 bg-green-950/20 border-l-4 border-green-400">
                <h3 className="text-white font-semibold mb-2">Choose Omnia If...</h3>
                <ul className="space-y-1 text-white/70 text-sm">
                  <li>✓ First-time Vegas visitors who want the iconic experience</li>
                  <li>✓ Bachelor/bachelorette parties (it's the vibe)</li>
                  <li>✓ Budget is a concern (it's 20–30% cheaper than XS)</li>
                  <li>✓ You want Instagram-worthy (kinetic chandelier is unreal)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card-dark p-8 bg-purple-950/20 border-l-4 border-purple-400">
            <h3 className="text-purple-300 font-semibold mb-2">💡 The Real Difference</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              All three are genuinely excellent clubs. The difference isn't quality—it's exclusivity and audience. XS attracts money and hype. Hakkasan attracts sophisticated travelers. Omnia attracts bachelor parties and first-timers. Pick based on who you want to party with, not which has the "best" reputation.
            </p>
            <p className="text-white/70 text-sm">
              The real insight: I rarely recommend one over the other. Instead, I book the club that fits your group's vibe and budget. That's how we get the best experience—not chasing the club with the best reviews.
            </p>
          </div>

          <div className="card-dark p-8 text-center">
            <div className="section-eyebrow mb-3">Not Sure Which One?</div>
            <h3 className="font-display text-white font-bold text-xl mb-3">We'll Recommend the Perfect Club for Your Group</h3>
            <p className="text-white/55 text-sm mb-6">
              We book all three and know exactly which is best for your specific group, budget, and vibe.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/nightclubs" className="btn-gold">Explore All Venues</Link>
              <Link href="/contact" className="btn-ghost">Get a Recommendation</Link>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <h3 className="text-white font-semibold mb-4">Related Reading</h3>
            <div className="space-y-2">
              <Link href="/blog/bottle-service-cost-las-vegas" className="block card-dark p-3 hover:bg-white/5 transition text-white/70 hover:text-gold-300">
                ← How Much Does Bottle Service Cost?
              </Link>
              <Link href="/blog/las-vegas-bachelor-party-itinerary" className="block card-dark p-3 hover:bg-white/5 transition text-white/70 hover:text-gold-300">
                ← 3-Day Bachelor Party Itinerary
              </Link>
              <Link href="/blog/omnia-nightclub-review" className="block card-dark p-3 hover:bg-white/5 transition text-white/70 hover:text-gold-300">
                ← Omnia Nightclub Review: Is It Worth It?
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}