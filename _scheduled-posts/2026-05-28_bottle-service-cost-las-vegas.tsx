import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How Much Does Bottle Service Cost in Las Vegas? 2026 Pricing Guide',
  description: 'Breakdown of Las Vegas bottle service costs: minimums by venue, day, time, and season. Plus insider tips on how to spend less and get better tables.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/blog/bottle-service-cost-las-vegas' },
}

export default function BottleServiceCost() {
  const venueMinimums = [
    { venue: 'XS (Wynn)', weekday: '$500–$800', weekend: '$1,500–$3,000+', note: 'Most expensive. Premium location, A-list crowd.' },
    { venue: 'Hakkasan', weekday: '$400–$700', weekend: '$1,200–$2,500', note: 'High-end, exclusive. Mid-range weekdays.' },
    { venue: 'Omnia', weekday: '$350–$600', weekend: '$1,000–$2,000', note: 'More accessible. Kinetic chandelier attracts mixed crowds.' },
    { venue: 'Marquee', weekday: '$300–$500', weekend: '$800–$1,800', note: 'Good value for premium venue. Less hype than XS.' },
    { venue: 'TAO', weekday: '$250–$450', weekend: '$700–$1,500', note: 'Lower minimums. Still high-energy venue.' },
    { venue: 'Drais', weekday: '$200–$400', weekend: '$600–$1,200', note: 'Rooftop venue. Best for sunset-to-evening crowds.' },
    { venue: 'Zouk', weekday: '$250–$500', weekend: '$800–$1,800', note: 'Newer venue. Competitive pricing to build clientele.' },
  ]

  const costBreakdown = [
    { item: 'Bottle minimum', example: '$1,000 at Hakkasan (10-person table)' },
    { item: 'Gratuity (20–24%)', example: '$200–$240' },
    { item: 'Setup fee (if charged)', example: '$50–$150' },
    { item: 'Per-person markup on drinks', example: '$15–$25 per cocktail' },
    { item: 'Total for a group of 10', example: '$1,450–$1,600+' },
  ]

  return (
    <>
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/blog/bottle-service-cost-las-vegas/cover.jpg" alt="Las Vegas bottle service cost breakdown 2026" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/blog" className="section-eyebrow hover:text-gold-300 transition-colors">← Blog</Link>
            <span className="text-white/25">·</span>
            <span className="section-eyebrow">Bottle Service</span>
          </div>
          <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>How Much Does Bottle Service Cost in Las Vegas? 2026 Pricing Guide</h1>
          <div className="flex items-center gap-4 text-white/40 text-sm">
            <span>May 28, 2026</span>
            <span>·</span>
            <span>9 min read</span>
            <span>·</span>
            <span>By Justin — Nokturnal Lifestyle</span>
          </div>
        </div>
      </section>

      <article className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="card-dark p-6 border-l-4 border-gold-500">
            <p className="text-gold-400 font-semibold text-sm mb-2">Quick Answer</p>
            <p className="text-white/80 text-sm leading-relaxed">
              <strong className="text-white">Weekdays: $250–$800. Weekends: $700–$3,000+.</strong> The price depends on the venue, day of week, and time of night. Most groups at top venues spend <strong>$1,200–$1,800 total</strong> when you include gratuity and drinks. But there are ways to spend significantly less.
            </p>
          </div>

          <p className="text-white/70 leading-relaxed text-lg">
            The short answer isn't enough. Bottle service pricing in Las Vegas is complicated because venues use different pricing models, seasonal adjustments, and table placement tiers. I've booked hundreds of tables for groups. Here's exactly what you'll pay—and how to negotiate.
          </p>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-4">Venue-by-Venue Bottle Minimums (2026)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white/70">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-3 font-semibold text-white">Venue</th>
                    <th className="text-left py-3 px-3 font-semibold text-white">Weekday</th>
                    <th className="text-left py-3 px-3 font-semibold text-white">Weekend</th>
                    <th className="text-left py-3 px-3 font-semibold text-white">Context</th>
                  </tr>
                </thead>
                <tbody>
                  {venueMinimums.map(({ venue, weekday, weekend, note }) => (
                    <tr key={venue} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-3 px-3 text-white font-semibold">{venue}</td>
                      <td className="py-3 px-3">{weekday}</td>
                      <td className="py-3 px-3 text-gold-400">{weekend}</td>
                      <td className="py-3 px-3 text-white/50 text-xs">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-white/50 text-xs mt-4">*Prices vary by table size (10-person vs 20-person), placement (main floor vs mezzanine), and event (DJ residency vs regular night). These are 2026 estimates based on real bookings.</p>
          </div>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-4">The Real Cost: Minimums + Everything Else</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              The "minimum" is just the starting point. Groups often underestimate total spend because they forget gratuity, drink markups, and incidental fees.
            </p>
            <div className="space-y-3">
              {costBreakdown.map(({ item, example }) => (
                <div key={item} className="card-dark p-3 flex justify-between items-center text-sm">
                  <span className="text-white/70">{item}</span>
                  <span className="text-gold-400">{example}</span>
                </div>
              ))}
            </div>
            <p className="text-white/50 text-xs mt-4">For a typical 10-person group booking a mid-range table at a top venue on a Friday night, expect to spend $1,200–$1,600 before anyone orders extra drinks.</p>
          </div>

          <div className="card-dark p-8 bg-blue-950/20 border-l-4 border-blue-400">
            <h3 className="text-blue-300 font-semibold mb-2">💡 Insider Tip</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              When you book directly with a club, you often pay their full posted minimum. When you book through a VIP concierge like us, we negotiate. The difference? <strong>We typically save groups 15–25% on bottle minimums</strong> while still securing premium placement. Why? Venues prefer booked-in-advance groups over walk-ups. We deliver reliable volume.
            </p>
          </div>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-4">Factors That Change the Price</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Day of Week</h3>
                <p className="text-white/70 text-sm">
                  <strong>Monday–Thursday:</strong> Minimums are lowest. Clubs want to fill tables. <strong>Friday:</strong> Prices jump 50–100%. <strong>Saturday:</strong> Peak pricing, often 2–3x weekday rates. <strong>Sunday:</strong> Mid-range pricing (locals night, lower tourism).
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Time of Night</h3>
                <p className="text-white/70 text-sm">
                  Tables reserved for 10 PM–midnight cost more than midnight–3 AM slots. Early evening (9–10 PM) sometimes has lower minimums to fill the room before peak hours.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Special Events</h3>
                <p className="text-white/70 text-sm">
                  DJ residencies, holidays (New Year's, Memorial Day, etc.), and convention weeks spike prices by 50% or more. Avoid if budget is tight.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Table Size & Placement</h3>
                <p className="text-white/70 text-sm">
                  A 10-person table in a side booth is cheaper than a 20-person table on the main floor with sightlines to the stage. Know what you're paying for.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-4">How to Spend Less on Bottle Service</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="card-dark p-4">
                <h3 className="text-green-400 font-semibold mb-3">Money-Saving Moves</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-white/65 text-sm">
                    <span className="text-green-400 flex-shrink-0">✓</span>
                    Book Tuesday–Thursday (30–50% cheaper)
                  </li>
                  <li className="flex items-start gap-2 text-white/65 text-sm">
                    <span className="text-green-400 flex-shrink-0">✓</span>
                    Use a VIP concierge for 15–25% discounts
                  </li>
                  <li className="flex items-start gap-2 text-white/65 text-sm">
                    <span className="text-green-400 flex-shrink-0">✓</span>
                    Book off-peak times (11 PM or later)
                  </li>
                  <li className="flex items-start gap-2 text-white/65 text-sm">
                    <span className="text-green-400 flex-shrink-0">✓</span>
                    Choose smaller venues (TAO, Drais vs XS)
                  </li>
                  <li className="flex items-start gap-2 text-white/65 text-sm">
                    <span className="text-green-400 flex-shrink-0">✓</span>
                    Book a smaller table (10 vs 20 people)
                  </li>
                </ul>
              </div>
              <div className="card-dark p-4">
                <h3 className="text-gold-400 font-semibold mb-3">What NOT to Do</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-white/65 text-sm">
                    <span className="text-red-400 flex-shrink-0">✗</span>
                    Book Friday–Saturday without negotiating
                  </li>
                  <li className="flex items-start gap-2 text-white/65 text-sm">
                    <span className="text-red-400 flex-shrink-0">✗</span>
                    Call the club directly (you pay full price)
                  </li>
                  <li className="flex items-start gap-2 text-white/65 text-sm">
                    <span className="text-red-400 flex-shrink-0">✗</span>
                    Book during peak hours (10 PM–1 AM)
                  </li>
                  <li className="flex items-start gap-2 text-white/65 text-sm">
                    <span className="text-red-400 flex-shrink-0">✗</span>
                    Ignore gratuity costs (can be 20–24%)
                  </li>
                  <li className="flex items-start gap-2 text-white/65 text-sm">
                    <span className="text-red-400 flex-shrink-0">✗</span>
                    Book holidays without prior research
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card-dark p-8 text-center">
            <div className="section-eyebrow mb-3">Get a Real Quote</div>
            <h3 className="font-display text-white font-bold text-xl mb-3">Know Exactly What You'll Pay</h3>
            <p className="text-white/55 text-sm mb-6">
              We provide transparent pricing breakdowns before you commit. No hidden fees. No surprises. Just honest numbers.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/bottle-service" className="btn-gold">View Bottle Service Packages</Link>
              <Link href="/contact" className="btn-ghost">Get a Free Quote</Link>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <h3 className="text-white font-semibold mb-4">Related Reading</h3>
            <div className="space-y-2">
              <Link href="/blog/las-vegas-nightclub-attire-men" className="block card-dark p-3 hover:bg-white/5 transition text-white/70 hover:text-gold-300">
                ← Las Vegas Nightclub Attire for Men 2026
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