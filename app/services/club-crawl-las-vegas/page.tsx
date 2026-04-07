import type { Metadata } from 'next'
import Link from 'next/link'
import InquiryForm from '@/components/InquiryForm'

export const metadata: Metadata = {
  title: 'Las Vegas Club Crawl | VIP Nightclub Crawl Packages 2026',
  description: 'Las Vegas VIP club crawl packages — visit 2-3 top nightclubs in one night with skip-the-line access, no cover charges, and a personal host. From $99/person. Call (702) 996-4884.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/services/club-crawl-las-vegas' },
  openGraph: {
    title: 'Las Vegas Club Crawl | VIP Nightclub Crawl 2026',
    description: 'VIP access to 2-3 Las Vegas nightclubs in one night — no cover, skip the line, personal host. From $99/person.',
    images: [{ url: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=1200&q=80' }],
  },
}

const crawlRoutes = [
  {
    name: 'The Strip Classic',
    stops: ['TAO Nightclub (Venetian)', "Drai's Nightclub (Cromwell)", 'XS Nightclub (Encore)'],
    duration: '4–5 hours',
    vibe: 'Mix of hip-hop and EDM, perfect for first-timers',
    price: 'From $149/person',
  },
  {
    name: 'The MGM Run',
    stops: ['Hakkasan (MGM Grand)', 'Jewel (ARIA)', 'Zouk (Resorts World)'],
    duration: '4–5 hours',
    vibe: 'Three of Vegas\'s biggest venues, epic for large groups',
    price: 'From $179/person',
  },
  {
    name: 'The Hip-Hop Crawl',
    stops: ["Drai's Nightclub", 'Marquee (Cosmopolitan)', 'Custom 3rd stop'],
    duration: '4–5 hours',
    vibe: 'Hip-hop and R&B focused — best for groups who love that sound',
    price: 'From $159/person',
  },
  {
    name: 'Custom Crawl',
    stops: ['Your choice of 2–3 venues', 'Built around your group\'s preferences', 'Justin handles all logistics'],
    duration: 'Flexible',
    vibe: 'Fully customized to your group\'s music taste and vibe',
    price: 'Custom quote',
  },
]

export default function ClubCrawlPage() {
  return (
    <>
      <section className="relative page-hero overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=1600&q=85" alt="Las Vegas club crawl VIP nightclub packages 2026" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
          <div className="max-w-3xl">
            <div className="section-eyebrow mb-4">Club Crawls</div>
            <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
              Las Vegas VIP Club Crawl
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
              Experience 2–3 of Las Vegas's best nightclubs in one epic night. Skip every line, pay no cover, and have a personal VIP host coordinate everything between venues.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#routes" className="btn-gold">See Club Crawl Routes</Link>
              <a href="tel:+17029964884" className="btn-ghost flex items-center gap-2">📞 (702) 996-4884</a>
            </div>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 px-4 bg-night-800/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="section-eyebrow mb-3">What's Included</div>
            <h2 className="font-display text-white font-bold text-2xl">Every Club Crawl Includes</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: '🎟', title: 'No Cover Charges', desc: 'Zero entry fees at every venue on the crawl' },
              { icon: '⚡', title: 'Skip Every Line', desc: 'VIP entry — straight past the queue at each stop' },
              { icon: '👤', title: 'Personal Host', desc: 'Justin or team coordinates every transition between clubs' },
              { icon: '🚌', title: 'Party Bus Option', desc: 'Add party bus transportation between venues' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card-dark p-5 text-center">
                <div className="text-3xl mb-3">{icon}</div>
                <div className="text-white font-semibold text-sm mb-1">{title}</div>
                <div className="text-white/45 text-xs">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Routes */}
      <section id="routes" className="py-16 px-4 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="section-eyebrow mb-3">Packages</div>
            <h2 className="font-display text-white font-bold text-2xl">Club Crawl Routes</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {crawlRoutes.map((route) => (
              <div key={route.name} className="card-dark p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-display text-white font-bold text-lg">{route.name}</h3>
                  <span className="text-gold-400 font-bold text-sm">{route.price}</span>
                </div>
                <div className="space-y-2 mb-4">
                  {route.stops.map((stop, i) => (
                    <div key={stop} className="flex items-center gap-2 text-sm text-white/70">
                      <span className="w-5 h-5 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 text-xs flex-shrink-0">{i + 1}</span>
                      {stop}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-white/40 mb-4">
                  <span>⏱ {route.duration}</span>
                </div>
                <div className="bg-gold-500/10 border border-gold-500/20 rounded px-3 py-2 text-xs text-white/70 mb-4">
                  {route.vibe}
                </div>
                <Link href="/contact" className="btn-gold text-xs py-2.5 block text-center">Book This Route</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-night-800/40">
        <div className="max-w-3xl mx-auto">
          <div className="section-eyebrow mb-4 text-center">FAQ</div>
          <h2 className="font-display text-white font-bold text-2xl text-center mb-8">Club Crawl Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'How many venues do you visit on a club crawl?', a: 'Typically 2–3 venues per night. Three is the sweet spot — enough variety without rushing through each experience. We recommend 1–1.5 hours minimum at each venue.' },
              { q: 'Is party bus transportation included?', a: 'Party bus is an optional add-on to any club crawl. It\'s popular because it keeps the group together between venues and adds to the experience. Without a bus, we coordinate Ubers or you can walk if venues are close.' },
              { q: 'What\'s the difference between a club crawl and a VIP table booking?', a: 'A VIP table at one venue means you stay there all night with reserved seating and bottle service. A club crawl means moving between venues with priority entry but no reserved table — you experience more clubs but less "settled" at each one. We can also combine both: VIP table at one anchor club, crawl to one or two others.' },
              { q: 'Can we customize the venues on our crawl?', a: 'Absolutely. Tell us your music preferences, group size, and any venues you specifically want to hit — we\'ll build the route around that.' },
              { q: 'Do we pay cover at each venue?', a: 'No cover charges at any stop on your crawl. That\'s the primary benefit — in Las Vegas, cover charges at top clubs can run $40–$60 per person per venue. On a 3-club crawl, that\'s $120–$180 per person in covers alone, often more than the crawl package itself.' },
            ].map(({ q, a }) => (
              <div key={q} className="card-dark p-5">
                <h3 className="text-white font-semibold text-sm mb-2">{q}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <div className="section-eyebrow mb-4">Book Your Crawl</div>
            <h2 className="font-display text-white font-bold text-3xl mb-4">Plan Your Night Across Vegas</h2>
            <p className="text-white/60 leading-relaxed mb-6">Tell us your dates, group size, and music preference — Justin will put together the perfect route and handle every booking.</p>
            <ul className="check-list">
              <li>No cover charges at any venue</li>
              <li>Skip every line</li>
              <li>Personal host coordinates all logistics</li>
              <li>Party bus add-on available</li>
            </ul>
          </div>
          <div className="card-dark p-8">
            <InquiryForm defaultPackage="nightclub" />
          </div>
        </div>
      </section>
    </>
  )
}
