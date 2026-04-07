import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Hotels for a Bachelor Party in Las Vegas 2026 (Ranked by a VIP Host)',
  description: 'The best Las Vegas hotels for bachelor parties — Wynn, ARIA, Cosmopolitan, Encore, Bellagio and more. Ranked by nightlife access, room quality, pool, and value.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/blog/best-hotels-bachelor-party-las-vegas' },
  openGraph: {
    title: 'Best Hotels for a Bachelor Party in Las Vegas 2026',
    description: 'Top Las Vegas hotels for bachelor parties ranked by nightlife proximity, room quality, pool access and value.',
    images: [{ url: '/blog/best-hotels-bachelor-party-las-vegas/image.jpg' }],
  },
}

const hotels = [
  {
    rank: 1,
    name: 'Encore at Wynn',
    rating: '10/10',
    priceRange: '$$$$$',
    why: 'XS Nightclub and Encore Beach Club are steps away. The best combination of room quality, pool, and on-property nightlife of any hotel in Las Vegas.',
    pros: ['XS Nightclub literally on property', 'Encore Beach Club — #1 dayclub in Vegas', 'Stunning rooms and suites', 'Wynn service standards are unmatched'],
    cons: ['Most expensive option', 'North end of Strip — require transport to other venues'],
    bestFor: 'Groups who want on-property nightlife and the best overall hotel experience',
    img: '/blog/best-hotels-bachelor-party-las-vegas/image.jpg',
  },
  {
    rank: 2,
    name: 'The Cosmopolitan',
    rating: '9.5/10',
    priceRange: '$$$$',
    why: "Dead center on the Strip with Marquee Nightclub and Marquee Dayclub on property. Some of the most stylish rooms in Vegas and the best location for walking to other venues.",
    pros: ['Marquee Nightclub and Dayclub on property', 'Perfect central Strip location', 'Beautiful rooms with Strip views', 'The Wicked Spoon for great group dining'],
    cons: ['Can be crowded — very popular property', 'Marquee not quite at XS level for nightlife'],
    bestFor: 'Groups who want central location and strong on-property nightlife without Wynn prices',
    img: '/blog/best-hotels-bachelor-party-las-vegas/image.jpg',
  },
  {
    rank: 3,
    name: 'ARIA Resort & Casino',
    rating: '9/10',
    priceRange: '$$$$',
    why: "ARIA's tech-forward rooms are some of the best in Vegas. Jewel Nightclub and Liquid Pool Lounge on property. City Center location means easy access to both Bellagio and Cosmopolitan.",
    pros: ['Beautiful modern rooms with smart room tech', 'Jewel Nightclub on property', 'Liquid Pool Lounge for adults-only pool time', 'Multiple high-end restaurants'],
    cons: ["Jewel Nightclub smaller than XS or Hakkasan", "Not walking distance to north Strip clubs"],
    bestFor: 'Groups who want a high-end hotel experience with mid-Strip access',
    img: '/blog/best-hotels-bachelor-party-las-vegas/image.jpg',
  },
  {
    rank: 4,
    name: 'MGM Grand',
    rating: '8.5/10',
    priceRange: '$$$',
    why: "Hakkasan Nightclub is on property — one of the top 3 clubs in Vegas. MGM Grand has more room variety than most properties, making it easier to fit large groups.",
    pros: ['Hakkasan Nightclub on property', 'Huge property with room for large groups', 'Strong value vs. Wynn/ARIA pricing', 'Multiple pool options'],
    cons: ['Rooms slightly dated compared to newer properties', "Property can feel overwhelming — it's enormous"],
    bestFor: 'Larger groups who want Hakkasan access at a lower per-night cost',
    img: '/blog/best-hotels-bachelor-party-las-vegas/image.jpg',
  },
  {
    rank: 5,
    name: 'Resorts World',
    rating: '8.5/10',
    priceRange: '$$$',
    why: "Newest major casino resort on the Strip. Zouk Nightclub and AYU Dayclub on property. The rooms are brand new and among the most modern in Vegas.",
    pros: ['Brand new rooms — best tech and design', 'Zouk Nightclub and AYU Dayclub on property', 'Multiple hotel brands in one complex (Hilton, Conrad, LXR)', 'Less crowded than mid-Strip properties'],
    cons: ['North Strip — some distance from mid-Strip clubs', 'Still building reputation vs. established properties'],
    bestFor: 'Groups who want the newest hotel experience and access to Zouk',
    img: '/blog/best-hotels-bachelor-party-las-vegas/image.jpg',
  },
  {
    rank: 6,
    name: 'Fontainebleau',
    rating: '8/10',
    priceRange: '$$$$',
    why: "Newest luxury property on the Strip. LIV Nightclub and LIV Beach Club are on property — bringing the legendary Miami brand to Vegas. Best for groups who love the LIV vibe.",
    pros: ['LIV Nightclub and LIV Beach Club on property', 'Brand new — exceptional room quality', 'Unique Miami-inspired aesthetic', 'North Strip location means less traffic congestion'],
    cons: ['New — still establishing its Vegas identity', 'Far from mid-Strip clubs without transport'],
    bestFor: "Groups who specifically want the LIV experience and Miami energy",
    img: '/blog/best-hotels-bachelor-party-las-vegas/image.jpg',
  },
]

const tips = [
  { tip: 'Book rooms in the same hotel', detail: "Having everyone in the same property eliminates the coordination nightmare of pre-gaming across different hotels. Book a suite for the bachelor and standard rooms for the group." },
  { tip: 'Ask about group room blocks', detail: "Most major hotels offer group rates if you're booking 5+ rooms. Call the hotel directly (not through a booking site) and ask for their group sales department." },
  { tip: 'Check which clubs are on property first', detail: "If you know you want to hit XS, book Encore. If Hakkasan is your spot, MGM Grand makes more sense. Matching the hotel to your nightclub plan saves time and transportation costs." },
  { tip: 'Book at least 3 weeks out for weekends', detail: "Las Vegas fills up fast on weekends, especially May through October. Premium rooms and suites go first. Book early for better selection." },
]

export default function BestHotelsBachelorParty() {
  return (
    <>
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/blog/best-hotels-bachelor-party-las-vegas/image.jpg" alt="Best Las Vegas hotels for bachelor party 2026" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/blog" className="section-eyebrow hover:text-gold-300 transition-colors">← Blog</Link>
            <span className="text-white/25">·</span>
            <span className="section-eyebrow">Bachelor Parties</span>
          </div>
          <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
            Best Hotels for a Bachelor Party in Las Vegas 2026
          </h1>
          <div className="flex items-center gap-4 text-white/40 text-sm">
            <span>March 15, 2026</span><span>·</span><span>9 min read</span><span>·</span><span>By Justin — Nokturnal Lifestyle</span>
          </div>
        </div>
      </section>

      <article className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-10">

          <div className="card-dark p-6 border-l-4 border-gold-500">
            <p className="text-gold-400 font-semibold text-sm mb-2">The #1 Hotel Tip</p>
            <p className="text-white/80 text-sm leading-relaxed">
              <strong className="text-white">Match the hotel to your nightclub plan.</strong> Every top Vegas hotel has a nightclub on or near property. If you know where you're going out, base the hotel choice on that — it eliminates transportation between hotel and venue and keeps the group together all night.
            </p>
          </div>

          <p className="text-white/70 leading-relaxed text-lg">
            I've helped groups stay at every major property in Las Vegas. Here's my honest ranking based on what actually matters for a bachelor party: nightlife access, room quality, pool situation, group-friendliness, and value.
          </p>

          <div className="space-y-6">
            {hotels.map((hotel) => (
              <div key={hotel.name} className="card-dark overflow-hidden">
                <div className="h-40 overflow-hidden relative">
                  <img src={hotel.img} alt={`${hotel.name} Las Vegas bachelor party hotel`} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-r from-night-900/90 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center">
                        <span className="text-gold-400 font-bold text-sm">#{hotel.rank}</span>
                      </div>
                      <div>
                        <div className="font-display text-white font-bold text-xl">{hotel.name}</div>
                        <div className="flex gap-3">
                          <span className="text-gold-400 text-xs">{hotel.rating}</span>
                          <span className="text-white/40 text-xs">{hotel.priceRange}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-white/70 text-sm leading-relaxed mb-4">{hotel.why}</p>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-green-400 text-xs font-semibold mb-1.5">Pros</div>
                      <ul className="space-y-1">
                        {hotel.pros.map(p => <li key={p} className="text-white/60 text-xs flex items-start gap-1.5"><span className="text-green-400 flex-shrink-0">+</span>{p}</li>)}
                      </ul>
                    </div>
                    <div>
                      <div className="text-red-400 text-xs font-semibold mb-1.5">Cons</div>
                      <ul className="space-y-1">
                        {hotel.cons.map(c => <li key={c} className="text-white/60 text-xs flex items-start gap-1.5"><span className="text-red-400 flex-shrink-0">−</span>{c}</li>)}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gold-500/10 border border-gold-500/20 rounded px-3 py-2 text-xs">
                    <span className="text-gold-400 font-semibold">Best for: </span>
                    <span className="text-white/70">{hotel.bestFor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-5">Hotel Booking Tips for Bachelor Groups</h2>
            <div className="space-y-4">
              {tips.map(({ tip, detail }) => (
                <div key={tip} className="card-dark p-4">
                  <div className="text-gold-400 font-semibold text-sm mb-1">{tip}</div>
                  <p className="text-white/60 text-xs leading-relaxed">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card-dark p-8 text-center">
            <div className="section-eyebrow mb-3">Let Us Handle It All</div>
            <h3 className="font-display text-white font-bold text-xl mb-3">Hotel + Nightclub + Party Bus — One Package</h3>
            <p className="text-white/55 text-sm mb-6">Tell Justin your dates and budget. He'll recommend the right hotel based on your nightclub plans and put together the full weekend package.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/bachelor" className="btn-gold">View Bachelor Packages</Link>
              <Link href="/contact" className="btn-ghost">Get a Free Quote</Link>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
