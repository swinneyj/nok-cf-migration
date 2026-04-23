import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = {
  title: 'Las Vegas All-Inclusive Party Packages 2026 | What\'s Actually Included',
  description: 'What do Las Vegas all-inclusive party packages actually include? Honest breakdown of what\'s covered, what\'s not, and how to get the best deal. From a VIP concierge.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/blog/las-vegas-all-inclusive-packages' },
}
export default function AllInclusivePackages() {
  const whatsIncluded = ['VIP nightclub entry (no cover charge)', 'Reserved VIP table for your group', 'Bottle service at the table (specific bottles per minimum)', 'Party bus transportation (round trip from hotel)', 'Personal VIP host for the duration of the event', 'Strip club VIP entry with free entry (no cover)']
  const whatsNotIncluded = ['Hotel accommodation (separate booking)', 'Flights to Las Vegas', 'Gratuity on bottle service (20–24% standard)', 'Additional bottles beyond the package minimum', 'Private dances at strip clubs', 'Food at venues (unless specified)']
  return (
    <>
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/blog/las-vegas-all-inclusive-packages/cover.jpg" alt="Las Vegas all-inclusive party packages what is included 2026" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4"><Link href="/blog" className="section-eyebrow hover:text-gold-300 transition-colors">← Blog</Link><span className="text-white/25">·</span><span className="section-eyebrow">Packages</span></div>
          <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>Las Vegas All-Inclusive Party Packages: What's Actually Included</h1>
          <div className="flex items-center gap-4 text-white/40 text-sm"><span>April 24, 2026</span><span>·</span><span>7 min read</span><span>·</span><span>By Justin — Nokturnal Lifestyle</span></div>
        </div>
      </section>
      <article className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="card-dark p-6 border-l-4 border-gold-500">
            <p className="text-gold-400 font-semibold text-sm mb-2">The Honest Truth</p>
            <p className="text-white/80 text-sm leading-relaxed">No Las Vegas nightlife package is truly "all-inclusive" in the hotel-resort sense. What the term really means: <strong className="text-white">a bundled package that covers your main nightlife expenses — entry, transportation, table, and host — for one fixed per-person price.</strong> Everything else is still paid separately.</p>
          </div>
          <p className="text-white/70 leading-relaxed text-lg">The phrase "all-inclusive Las Vegas party package" gets searched thousands of times per month. Most people are looking for one thing: a single price that covers their whole night without surprises. Here's what that actually looks like in practice.</p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h2 className="font-display text-white font-bold text-xl mb-4 text-green-400">✓ What's Included</h2>
              <ul className="space-y-2">{whatsIncluded.map(i => <li key={i} className="flex items-start gap-2 text-white/65 text-sm"><span className="text-green-400 flex-shrink-0">✓</span>{i}</li>)}</ul>
            </div>
            <div>
              <h2 className="font-display text-white font-bold text-xl mb-4 text-red-400">✗ What's NOT Included</h2>
              <ul className="space-y-2">{whatsNotIncluded.map(i => <li key={i} className="flex items-start gap-2 text-white/65 text-sm"><span className="text-red-400 flex-shrink-0">✗</span>{i}</li>)}</ul>
            </div>
          </div>
          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-5">Our Package Pricing (Per Person)</h2>
            <div className="space-y-3">
              {[
                { name: 'Nightclub VIP (1 venue)', price: 'From $179/person', includes: 'Entry, VIP table, 2 bottles, personal host' },
                { name: 'Bachelor Classic (club + strip club)', price: 'From $149/person', includes: 'Entry both venues, VIP strip club, nightclub table, host' },
                { name: 'Ultimate Bachelor (party bus + 2 venues)', price: 'From $299/person', includes: 'Party bus, strip club, nightclub, bottles, host all night' },
                { name: 'All-Weekend Package', price: 'From $449/person', includes: 'Pool party cabana, dinner, nightclub, strip club, 2 nights host' },
              ].map(pkg => (
                <div key={pkg.name} className="card-dark p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm">{pkg.name}</div>
                    <div className="text-white/50 text-xs mt-0.5">{pkg.includes}</div>
                  </div>
                  <div className="text-gold-400 font-display font-bold text-lg flex-shrink-0">{pkg.price}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-4">The Gratuity Question</h2>
            <p className="text-white/70 leading-relaxed">Gratuity is the most common surprise expense in Las Vegas nightlife packages. Standard gratuity at major venues is 20–24% and is typically mandatory — not optional. On a $1,000 table minimum that's $200–$240 on top. Any package quote you receive should include an estimate of gratuity or clearly state it's separate. We always include this in our upfront pricing so there are no surprises on the night.</p>
          </div>
          <div className="card-dark p-8 text-center">
            <div className="section-eyebrow mb-3">Get an All-In Quote</div>
            <h3 className="font-display text-white font-bold text-xl mb-3">One Price. No Surprises. Everything Included.</h3>
            <p className="text-white/55 text-sm mb-6">When Justin gives you a quote, it's the real total — including estimated gratuity. No hidden fees added on the night.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/contact" className="btn-gold">Get a Free Quote</Link>
              <Link href="/bachelor" className="btn-ghost">View Bachelor Packages</Link>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
