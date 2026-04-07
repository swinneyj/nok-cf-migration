import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = {
  title: 'Las Vegas Pool Party Season 2026: When Do Dayclubs Open & Close?',
  description: 'When does Las Vegas pool party season start and end? Opening dates, best months, and what to expect at Encore Beach Club, Marquee, AYU and more in 2026.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/blog/las-vegas-pool-party-season' },
}
export default function PoolPartySeason() {
  return (
    <>
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/blog/las-vegas-pool-party-season/cover.jpg" alt="Las Vegas pool party season 2026 when do dayclubs open" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4"><Link href="/blog" className="section-eyebrow hover:text-gold-300 transition-colors">← Blog</Link><span className="text-white/25">·</span><span className="section-eyebrow">Pool Parties</span></div>
          <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>Las Vegas Pool Party Season 2026: When Do Dayclubs Open & Close?</h1>
          <div className="flex items-center gap-4 text-white/40 text-sm"><span>May 1, 2026</span><span>·</span><span>6 min read</span><span>·</span><span>By Justin — Nokturnal Lifestyle</span></div>
        </div>
      </section>
      <article className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="card-dark p-6 border-l-4 border-gold-500">
            <p className="text-gold-400 font-semibold text-sm mb-2">Season Summary</p>
            <p className="text-white/80 text-sm leading-relaxed"><strong className="text-white">Peak season: May through September.</strong> Most major dayclubs open in late April and close in October. The best months are May, June, and September — warm enough for pool parties without July/August extreme heat. Some venues (Stadium Swim at Circa) operate year-round.</p>
          </div>
          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-5">Month-by-Month Breakdown</h2>
            <div className="space-y-3">
              {[
                { month: 'January–March', status: 'Closed', desc: 'Almost all outdoor dayclubs are closed. Stadium Swim at Circa remains open for sports events.', rating: 0 },
                { month: 'April', status: 'Opening', desc: 'Marquee Dayclub and AYU typically open in April. EBC and others may start late April. Weather is mild — good if you\'re sensitive to heat.', rating: 3 },
                { month: 'May', status: 'Peak', desc: 'All major dayclubs open. Perfect weather — mid-80s, sunshine without extreme heat. Best DJ bookings of the season start here.', rating: 5 },
                { month: 'June', status: 'Peak', desc: 'Hottest pool party month for programming. Temperature climbs to high 90s — bring sunscreen and pace yourself on drinks.', rating: 5 },
                { month: 'July–August', status: 'Hot season', desc: '105°F+ regularly. Great if you love the heat. Crowds are thinner than May/June because many visitors choose cooler months. Hydration is critical.', rating: 4 },
                { month: 'September', status: 'Late peak', desc: 'Temperature drops back to high 90s. Great balance of good weather, solid programming, and slightly smaller crowds than peak summer.', rating: 5 },
                { month: 'October', status: 'Closing', desc: 'Most dayclubs close mid-to-late October. Weather is beautiful — low 80s. EBC and others may run special closing weekend events.', rating: 3 },
                { month: 'November–December', status: 'Closed', desc: 'Outdoor dayclubs closed. Some indoor venues run heated pool experiences but these are exceptions.', rating: 0 },
              ].map(({ month, status, desc, rating }) => (
                <div key={month} className="card-dark p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-28 flex-shrink-0"><div className="text-white font-semibold text-sm">{month}</div><div className={`text-xs mt-0.5 ${status === 'Peak' || status === 'Late peak' ? 'text-green-400' : status === 'Opening' || status === 'Closing' || status === 'Hot season' ? 'text-amber-400' : 'text-white/35'}`}>{status}</div></div>
                    <div className="flex gap-1">{Array.from({ length: 5 }).map((_, i) => <div key={i} className={`w-2 h-2 rounded-full ${i < rating ? 'bg-gold-400' : 'bg-white/10'}`} />)}</div>
                  </div>
                  <p className="text-white/60 text-xs pl-28">{desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-4">Best Months for Specific Groups</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { group: 'Bachelor/Bachelorette parties', rec: 'May or September', reason: 'Perfect weather + best DJ programming without peak summer crowds' },
                { group: 'Heat-sensitive groups', rec: 'April or October', reason: 'Cooler temperatures, less intense sun, still operational' },
                { group: 'Groups who want the liveliest atmosphere', rec: 'June', reason: 'Peak energy, best programming, biggest crowds' },
                { group: 'Budget-conscious groups', rec: 'July or August', reason: 'Lower demand means better table availability and sometimes lower minimums' },
              ].map(({ group, rec, reason }) => (
                <div key={group} className="card-dark p-4">
                  <div className="text-white font-semibold text-sm mb-1">{group}</div>
                  <div className="text-gold-400 text-xs font-semibold mb-1">→ Best: {rec}</div>
                  <div className="text-white/50 text-xs">{reason}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card-dark p-8 text-center">
            <div className="section-eyebrow mb-3">Book Before It Sells Out</div>
            <h3 className="font-display text-white font-bold text-xl mb-3">Peak Season Cabanas Sell Out 3–4 Weeks in Advance</h3>
            <p className="text-white/55 text-sm mb-6">Tell Justin your dates and preferred venue — he'll confirm availability and hold the spot while you finalize your group.</p>
            <Link href="/pool-parties" className="btn-gold">View Pool Party Packages</Link>
          </div>
        </div>
      </article>
    </>
  )
}
