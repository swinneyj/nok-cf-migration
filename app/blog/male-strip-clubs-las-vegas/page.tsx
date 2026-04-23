import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Male Strip Clubs & Revues in Las Vegas 2026: The Complete Bachelorette Guide',
  description: 'The complete guide to male strip clubs and revues in Las Vegas — Magic Mike Live, Chippendales, Thunder From Down Under and more. Which is best for your bachelorette party?',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/blog/male-strip-clubs-las-vegas' },
}

const shows = [
  { name: 'Magic Mike Live', venue: 'House of Blues, Mandalay Bay', type: 'Immersive show', duration: '90 min', priceRange: '$50–$125/person', vibe: 'Interactive, theatrical, mix of dancing and audience participation. The most unique male entertainment experience in Vegas.' },
  { name: 'Chippendales', venue: 'Rio Casino', type: 'Classic revue', duration: '75 min', priceRange: '$40–$80/person', vibe: 'The original. High energy, oiled up, classic revue format. VIP front-row packages include a meet-and-greet.' },
  { name: 'Thunder From Down Under', venue: 'Excalibur', type: 'Strip revue', duration: '75 min', priceRange: '$35–$70/person', vibe: 'Australian hunks, very interactive with audience, known for getting bachelorette groups on stage.' },
]

export default function MaleStripClubsLasVegas() {
  return (
    <>
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/blog/male-strip-clubs-las-vegas/cover.jpg" alt="Male strip clubs Las Vegas bachelorette party male revue guide" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/blog" className="section-eyebrow hover:text-gold-300 transition-colors">← Blog</Link>
            <span className="text-white/25">·</span>
            <span className="section-eyebrow">Bachelorette Parties</span>
          </div>
          <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
            Male Strip Clubs & Revues in Las Vegas 2026: The Complete Bachelorette Guide
          </h1>
          <div className="flex items-center gap-4 text-white/40 text-sm">
            <span>April 17, 2026</span><span>·</span><span>8 min read</span><span>·</span><span>By Justin — Nokturnal Lifestyle</span>
          </div>
        </div>
      </section>
      <article className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="card-dark p-6 border-l-4 border-gold-500">
            <p className="text-gold-400 font-semibold text-sm mb-2">Quick Recommendation</p>
            <p className="text-white/80 text-sm leading-relaxed">
              <strong className="text-white">Magic Mike Live</strong> for groups who want a theatrical, unique experience. <strong className="text-white">Chippendales</strong> for the classic strip revue. <strong className="text-white">Thunder From Down Under</strong> for groups who want maximum audience interaction. All three work as a pre-nightclub activity — shows end by 10pm, leaving plenty of time for a club after.
            </p>
          </div>
          <p className="text-white/70 leading-relaxed text-lg">Male entertainment in Las Vegas is a staple of bachelorette party planning. There are more options than most people realize, and the differences between them are significant. Here's everything you need to choose the right one and book it correctly.</p>
          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-5">The Three Major Shows Compared</h2>
            <div className="space-y-5">
              {shows.map(s => (
                <div key={s.name} className="card-dark p-5">
                  <h3 className="font-display text-white font-bold text-xl mb-1">{s.name}</h3>
                  <div className="text-gold-500 text-xs mb-3">{s.venue}</div>
                  <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
                    {[{ l: 'Type', v: s.type }, { l: 'Duration', v: s.duration }, { l: 'Price', v: s.priceRange }].map(({ l, v }) => (
                      <div key={l} className="bg-white/5 rounded p-2"><div className="text-white/35 mb-0.5">{l}</div><div className="text-white font-semibold">{v}</div></div>
                    ))}
                  </div>
                  <p className="text-white/65 text-sm">{s.vibe}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-5">Private Male Entertainers (On the Party Bus)</h2>
            <p className="text-white/70 leading-relaxed mb-4">An alternative to a venue show — hiring a professional male entertainer to perform on your party bus is a popular add-on for bachelorette groups. It's 30–45 minutes of entertainment between hotel and first venue, keeping the energy high during transit.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { t: 'Pros', items: ['Private — just your group', 'Flexible timing — works around your schedule', 'Usually less expensive than front-row show tickets', 'The bus ride becomes part of the entertainment'] },
                { t: 'Cons', items: ['Less production value than a stage show', 'Quality varies — booking through a reputable source matters', 'Limited space on the bus compared to a venue'] },
              ].map(({ t, items }) => (
                <div key={t} className="card-dark p-4">
                  <div className={`font-semibold text-sm mb-2 ${t === 'Pros' ? 'text-green-400' : 'text-red-400'}`}>{t}</div>
                  <ul className="space-y-1">{items.map(i => <li key={i} className="text-white/60 text-xs">· {i}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-4">Booking Tips</h2>
            <ul className="space-y-2">
              {['Book VIP/front-row seats at least 2 weeks in advance — these sell out on weekends', 'Shows typically run 7pm–10pm, perfect before heading to a nightclub', 'Group rates are available for parties of 8+ at most venues — call directly', 'Magic Mike Live requires 21+ for some performances — check the specific show date'].map(t => (
                <li key={t} className="flex items-start gap-3 text-white/65 text-sm"><span className="text-gold-400 flex-shrink-0">✓</span>{t}</li>
              ))}
            </ul>
          </div>
          <div className="card-dark p-8 text-center">
            <div className="section-eyebrow mb-3">Add a Show to Your Package</div>
            <h3 className="font-display text-white font-bold text-xl mb-3">Show + Party Bus + Nightclub — One Package</h3>
            <p className="text-white/55 text-sm mb-6">We coordinate the show tickets, the party bus, and the nightclub VIP table as one seamless bachelorette experience.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/bachelorette" className="btn-gold">View Bachelorette Packages</Link>
              <Link href="/contact" className="btn-ghost">Build a Custom Package</Link>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
