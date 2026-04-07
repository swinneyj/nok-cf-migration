import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = {
  title: 'Las Vegas New Year\'s Eve 2026 Packages | VIP Nightclub & Party Guide',
  description: 'Las Vegas New Year\'s Eve VIP packages — nightclubs, pool parties, countdown events and what to expect. Prices, tips, and how to book before it sells out.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/blog/las-vegas-nye-packages' },
}
export default function NYEPackages() {
  return (
    <>
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/blog/las-vegas-nye-packages/image.jpg" alt="Las Vegas New Year's Eve 2026 VIP packages nightclub" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4"><Link href="/blog" className="section-eyebrow hover:text-gold-300 transition-colors">← Blog</Link><span className="text-white/25">·</span><span className="section-eyebrow">Events</span></div>
          <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>Las Vegas New Year's Eve Packages 2026: VIP Guide</h1>
          <div className="flex items-center gap-4 text-white/40 text-sm"><span>May 8, 2026</span><span>·</span><span>8 min read</span><span>·</span><span>By Justin — Nokturnal Lifestyle</span></div>
        </div>
      </section>
      <article className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="card-dark p-6 border-l-4 border-gold-500">
            <p className="text-gold-400 font-semibold text-sm mb-2">Book Early — NYE is the Busiest Night of the Year</p>
            <p className="text-white/80 text-sm leading-relaxed">Las Vegas New Year's Eve is the highest-demand night of the year. Table minimums are 2–4x normal weekend rates. The best tables at XS, Hakkasan, and Omnia sell out by October. If NYE is on your radar, reach out now — not in December.</p>
          </div>
          <p className="text-white/70 leading-relaxed text-lg">New Year's Eve in Las Vegas is a genuinely spectacular experience — the Strip fireworks, the energy across every venue, and the scale of celebration are unlike anything else in the world. But it requires planning months in advance to do it right.</p>
          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-5">NYE Pricing vs. Normal Weekend</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gold-500/20">{['Venue', 'Normal Weekend Min.', 'NYE Min.', 'Premium'].map(h => <th key={h} className="text-left py-3 pr-4 text-gold-400 font-semibold text-xs uppercase tracking-wider">{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    { venue: 'XS Nightclub', normal: '$1,000–$3,000', nye: '$3,000–$10,000+', premium: '3–4x' },
                    { venue: 'Hakkasan', normal: '$800–$2,500', nye: '$2,500–$8,000+', premium: '3x' },
                    { venue: 'Omnia', normal: '$900–$2,500', nye: '$2,500–$8,000+', premium: '3x' },
                    { venue: "Drai's", normal: '$350–$1,800', nye: '$1,500–$5,000+', premium: '3–4x' },
                  ].map((r, i) => <tr key={r.venue} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}><td className="py-3 pr-4 text-white font-semibold text-xs">{r.venue}</td><td className="py-3 pr-4 text-white/60 text-xs">{r.normal}</td><td className="py-3 pr-4 text-white/60 text-xs">{r.nye}</td><td className="py-3 text-gold-400 text-xs font-semibold">{r.premium}</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-5">What to Expect on NYE</h2>
            <div className="space-y-3">
              {[
                { time: '7–9 PM', event: 'Pre-event dinner — most restaurants are fully booked, reserve months ahead' },
                { time: '9–10 PM', event: 'Party bus or transport to venue — Strip traffic is completely gridlocked by 9pm' },
                { time: '10 PM–12 AM', event: 'Club is filling up — best DJs start their sets around 10:30' },
                { time: '12:00 AM', event: 'Midnight countdown — Champagne toast at your table, fireworks visible from rooftop venues' },
                { time: '12–4 AM', event: 'The party continues — NYE clubs run until 4+ AM, often with extended programming' },
              ].map(({ time, event }) => (
                <div key={time} className="card-dark p-3 flex gap-4 text-sm">
                  <span className="text-gold-400 font-semibold text-xs w-20 flex-shrink-0">{time}</span>
                  <span className="text-white/65 text-xs">{event}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-4">Tips for NYE in Las Vegas</h2>
            <ul className="space-y-2">
              {['Book table and hotel by October at the latest', 'Pre-book transportation — no Ubers available on the Strip at midnight', 'Consider a rooftop venue (Drai\'s, Omnia terrace) to see the Strip fireworks', 'Dress code is strictly enforced on NYE — even more so than regular weekends', 'Budget 3–4x your normal Vegas nightlife spend for NYE'].map(t => (
                <li key={t} className="flex items-start gap-3 text-white/65 text-sm"><span className="text-gold-400 flex-shrink-0">✓</span>{t}</li>
              ))}
            </ul>
          </div>
          <div className="card-dark p-8 text-center">
            <div className="section-eyebrow mb-3">Book Your NYE Table Now</div>
            <h3 className="font-display text-white font-bold text-xl mb-3">The Best NYE Tables Are Gone by November</h3>
            <p className="text-white/55 text-sm mb-6">Reach out to Justin now with your group size and preferred venue. We'll hold a table and send you a full quote.</p>
            <Link href="/contact" className="btn-gold">Inquire About NYE Packages</Link>
          </div>
        </div>
      </article>
    </>
  )
}
