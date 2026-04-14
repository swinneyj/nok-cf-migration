import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Las Vegas Nightclub Attire for Men 2026 | What to Wear (Full Guide)',
  description: 'Complete guide to Las Vegas nightclub attire for men — what to wear, what gets you denied, the sneaker question, outfit ideas for every budget, and venue-specific tips.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/blog/las-vegas-nightclub-attire-men' },
  openGraph: {
    title: 'Las Vegas Nightclub Attire for Men 2026 | What to Wear',
    description: 'Full guide to what men should wear at Las Vegas nightclubs — from acceptable sneakers to outfit ideas by budget.',
    images: [{ url: '/blog/las-vegas-nightclub-attire-men/cover.jpg' }],
  },
}

export default function NightclubAttireMen() {
  return (
    <>
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/blog/las-vegas-nightclub-attire-men/cover.jpg" alt="Las Vegas nightclub attire for men 2026 dress code" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/blog" className="section-eyebrow hover:text-gold-300 transition-colors">← Blog</Link>
            <span className="text-white/25">·</span>
            <span className="section-eyebrow">Style Guide</span>
          </div>
          <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
            Las Vegas Nightclub Attire for Men 2026: The Complete Guide
          </h1>
          <div className="flex items-center gap-4 text-white/40 text-sm">
            <span>April 15, 2026</span><span>·</span><span>8 min read</span><span>·</span><span>By Justin — Nokturnal Lifestyle</span>
          </div>
        </div>
      </section>

      <article className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-10">

          <div className="card-dark p-6 border-l-4 border-gold-500">
            <p className="text-gold-400 font-semibold text-sm mb-2">The One Rule That Covers Everything</p>
            <p className="text-white/80 text-sm leading-relaxed">
              Dress like you're going to a <strong className="text-white">nice dinner at a restaurant where you'd be slightly underdressed in jeans</strong>. That mental model gets you through the door at 95% of Vegas nightclubs. When in doubt: dress shoes, dark jeans or slacks, and a fitted collared shirt or crew neck.
            </p>
          </div>

          <p className="text-white/70 leading-relaxed text-lg">
            Men's dress code is where most Las Vegas nightclub denials happen. The rules are stricter than most first-timers expect, and they're enforced even if you have a table reservation. I've seen this ruin bachelor parties at the door. Here's the full guide so it doesn't happen to you.
          </p>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-5">What to Wear: Tier by Budget</h2>
            <div className="space-y-5">
              {[
                {
                  tier: 'Budget-Conscious (Under $100 outfit)',
                  items: [
                    { piece: 'Dark jeans (navy or black)', note: 'No rips, no distressing — clean and fitted' },
                    { piece: 'Plain crew neck tee (fitted)', note: 'Black, white, or navy — no graphics or logos' },
                    { piece: 'Clean white Air Force 1s or similar leather sneaker', note: 'The dressy-sneaker loophole' },
                    { piece: 'Simple watch', note: 'Not required but elevates the look' },
                  ],
                  verdict: 'Gets you in at Marquee, Drai\'s, and most mid-tier clubs. May get questioned at XS.',
                },
                {
                  tier: 'Mid-Range (Under $300 outfit)',
                  items: [
                    { piece: 'Dark chinos or dress jeans', note: 'Well-fitted, no cuff, no distressing' },
                    { piece: 'Button-down shirt (tucked or casual)', note: 'Plain or subtle pattern — no loud prints' },
                    { piece: 'Leather loafers or Chelsea boots', note: 'This is the safest footwear choice' },
                    { piece: 'Simple leather belt', note: 'Matches footwear' },
                  ],
                  verdict: 'Gets you through the door at every major Vegas nightclub without question.',
                },
                {
                  tier: 'Premium (No Budget Constraint)',
                  items: [
                    { piece: 'Tailored trousers or fitted dress pants', note: 'Saint Laurent, Zara premium, BOSS' },
                    { piece: 'Designer or premium brand shirt', note: 'Tom Ford, Ralph Lauren, similar' },
                    { piece: 'Dress shoes (Oxford, Derby, or premium loafer)', note: 'This reads as high-status immediately' },
                    { piece: 'Sport coat or blazer', note: 'Optional — a blazer never gets you denied' },
                  ],
                  verdict: 'VIP treatment from the moment you approach the door. Staff notices.',
                },
              ].map(({ tier, items, verdict }) => (
                <div key={tier} className="card-dark p-5">
                  <h3 className="text-gold-400 font-semibold mb-4">{tier}</h3>
                  <div className="space-y-2 mb-4">
                    {items.map(({ piece, note }) => (
                      <div key={piece} className="flex items-start gap-2 text-sm">
                        <span className="text-gold-400 flex-shrink-0 mt-0.5">✓</span>
                        <div>
                          <span className="text-white font-medium">{piece}</span>
                          <span className="text-white/45 text-xs ml-2">— {note}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gold-500/10 border border-gold-500/20 rounded px-3 py-2 text-xs text-white/70">
                    <span className="text-gold-400 font-semibold">Result: </span>{verdict}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-5">What Never to Wear</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Athletic sneakers (running shoes, basketball shoes, trail shoes)',
                'Shorts — ANY shorts, regardless of brand or style',
                'Tank tops or sleeveless shirts',
                'Flip flops or open-toe sandals',
                'Cargo pants or cargo shorts',
                'Sports jerseys (NFL, NBA, etc.)',
                'Ripped or heavily distressed jeans',
                'Baseball caps or beanies',
                'Gym wear of any kind',
                'Work boots or construction footwear',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm card-dark p-3">
                  <span className="text-red-400 flex-shrink-0">✗</span>
                  <span className="text-white/65 text-xs">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-5">The Sneaker Question (Full Breakdown)</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Sneakers are the #1 grey area in Las Vegas dress codes. Here's the honest breakdown by shoe type:
            </p>
            <div className="space-y-3">
              {[
                { category: 'Almost Always Accepted', color: 'text-green-400', shoes: ['Nike Air Force 1 (all-white, clean)', 'Adidas Superstar (clean)', 'Common Projects', 'Nike Cortez (leather)', 'Veja sneakers', 'Any clean, all-white leather casual sneaker'] },
                { category: 'Club Dependent (Call Ahead)', color: 'text-amber-400', shoes: ['Jordan 1 High (depends on colorway)', 'Yeezy Boost 350', 'New Balance 550', 'Nike Dunks (some colorways)', 'Chunky lifestyle sneakers (Balenciaga Triple S)'] },
                { category: 'Almost Always Denied', color: 'text-red-400', shoes: ['Nike Pegasus, Vomero, React (running)', 'Nike LeBron, KD, Kyrie (basketball)', 'On Running Cloud shoes', 'Hoka (any model)', 'Worn or dirty sneakers of any brand'] },
              ].map(({ category, color, shoes }) => (
                <div key={category} className="card-dark p-4">
                  <div className={`${color} font-semibold text-sm mb-2`}>{category}</div>
                  <div className="flex flex-wrap gap-2">
                    {shoes.map(s => <span key={s} className="text-white/60 text-xs bg-white/5 px-2 py-1 rounded">{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-4">Venue-Specific Strictness</h2>
            <div className="space-y-2">
              {[
                { venue: 'XS Nightclub', level: 'Very Strict', tip: 'Dress shoes or premium leather sneakers only. A fitted button-down is safer than a tee.' },
                { venue: 'Hakkasan', level: 'Strict', tip: 'Similar to XS. The mezzanine sections sometimes have more flexibility than main floor.' },
                { venue: 'Omnia', level: 'Strict', tip: 'Caesars security is consistent. No exceptions for groups with tables.' },
                { venue: 'Marquee', level: 'Moderate', tip: "More lenient on sneakers than Wynn/Caesars properties. Clean Dunks often work here." },
                { venue: "Drai's", level: 'Moderate', tip: 'Most relaxed of the major clubs. Still no shorts, but clean lifestyle sneakers usually pass.' },
                { venue: 'TAO', level: 'Strict', tip: 'Venetian security is formal. Treat this like XS for dress code purposes.' },
                { venue: 'Zouk', level: 'Moderate-Strict', tip: 'Music-forward crowd means slightly more fashion-creative outfits accepted. Still no athletic shoes.' },
              ].map(({ venue, level, tip }) => (
                <div key={venue} className="card-dark p-3 flex items-start gap-4 text-xs">
                  <div className="w-32 flex-shrink-0">
                    <div className="text-white font-semibold">{venue}</div>
                    <div className={`text-xs mt-0.5 ${level === 'Very Strict' || level === 'Strict' ? 'text-red-400' : 'text-amber-400'}`}>{level}</div>
                  </div>
                  <p className="text-white/55">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card-dark p-8 text-center">
            <div className="section-eyebrow mb-3">Never Get Denied</div>
            <h3 className="font-display text-white font-bold text-xl mb-3">Our Host Reviews Your Group's Attire Before Departure</h3>
            <p className="text-white/55 text-sm mb-6">Justin does a quick dress code check before your group leaves the hotel — so no surprises at the door. Included in every package.</p>
            <Link href="/contact" className="btn-gold">Book a Package</Link>
          </div>
        </div>
      </article>
    </>
  )
}
