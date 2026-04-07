import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = {
  title: 'Las Vegas 21st Birthday Ideas 2026 | The Ultimate First Legal Night Guide',
  description: 'The best 21st birthday ideas in Las Vegas — nightclubs, bottle service, party buses, pool parties and more. Everything you need for the perfect first legal night.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/blog/las-vegas-21st-birthday-ideas' },
}
export default function Vegas21stBirthday() {
  const ideas = ['VIP nightclub debut — XS, Hakkasan, or Marquee for the full Vegas experience', 'Bottle service at a premiere venue — your first legal night deserves a reserved table', 'Party bus between 2 venues — start with a strip club, end at a nightclub', 'Pool party dayclub in the afternoon, nightclub at night — the full Vegas day', 'Vegas club crawl — see 3 different venues in one night with VIP access to each', 'Shooting range experience in the afternoon + nightclub at night', 'Top Golf + dinner + nightclub — the perfect 21st itinerary', 'Casino floor with comped drinks (you\'re finally legal!) + nightclub after']
  return (
    <>
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/blog/las-vegas-21st-birthday-ideas/image.jpg" alt="Las Vegas 21st birthday ideas 2026 VIP nightclub" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4"><Link href="/blog" className="section-eyebrow hover:text-gold-300 transition-colors">← Blog</Link><span className="text-white/25">·</span><span className="section-eyebrow">Birthday Parties</span></div>
          <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>Las Vegas 21st Birthday Ideas 2026: The Ultimate First Legal Night Guide</h1>
          <div className="flex items-center gap-4 text-white/40 text-sm"><span>May 6, 2026</span><span>·</span><span>7 min read</span><span>·</span><span>By Justin — Nokturnal Lifestyle</span></div>
        </div>
      </section>
      <article className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="card-dark p-6 border-l-4 border-gold-500">
            <p className="text-gold-400 font-semibold text-sm mb-2">The 21st Birthday Standard</p>
            <p className="text-white/80 text-sm leading-relaxed">The classic 21st birthday Vegas experience: <strong className="text-white">party bus from hotel → strip club VIP entry → nightclub VIP table with bottle service.</strong> Most groups do this in about 5–6 hours and it's genuinely unforgettable. From $149/person.</p>
          </div>
          <p className="text-white/70 leading-relaxed text-lg">The 21st birthday in Las Vegas is a rite of passage. You've been watching people come back from Vegas for years — now it's your turn. Here's how to do it right the first time.</p>
          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-5">Top 21st Birthday Ideas in Las Vegas</h2>
            <div className="space-y-3">
              {ideas.map((idea, i) => (
                <div key={idea} className="card-dark p-4 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold text-xs flex-shrink-0">{i + 1}</div>
                  <p className="text-white/70 text-sm">{idea}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-4">21st Birthday Itinerary (Sample)</h2>
            <div className="space-y-2">
              {[
                { time: '4:00 PM', action: 'Arrive in Vegas, check in to hotel, pre-game in the room' },
                { time: '7:00 PM', action: 'First legal casino drinks on the floor — a rite of passage' },
                { time: '8:00 PM', action: 'Dinner at a good Strip restaurant (make a reservation)' },
                { time: '9:30 PM', action: 'Party bus picks up from hotel' },
                { time: '10:00 PM', action: 'Gentleman\'s club — VIP entry, free cover, best seats' },
                { time: '11:30 PM', action: 'Party bus to nightclub' },
                { time: '12:00 AM', action: 'VIP nightclub entry — reserved table, bottle service, birthday acknowledgment from staff' },
                { time: '3:00+ AM', action: 'The birthday person decides when it ends' },
              ].map(({ time, action }) => <div key={time} className="card-dark p-3 flex gap-4 text-xs"><span className="text-gold-400 font-semibold w-16 flex-shrink-0">{time}</span><span className="text-white/65">{action}</span></div>)}
            </div>
          </div>
          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-4">21st Birthday Tips</h2>
            <ul className="space-y-2">
              {['Bring your ID everywhere — you will be carded, even with a table reservation', 'Pace yourself — the night is long and Vegas hits harder than anywhere else', 'Pre-arrange transportation — don\'t rely on Ubers at 2am on a weekend', 'Tell every venue it\'s your 21st — some acknowledge it with extras', 'Book at least 2 weeks in advance — last-minute 21st birthday trips get whatever\'s left'].map(t => <li key={t} className="flex items-start gap-3 text-white/65 text-sm"><span className="text-gold-400 flex-shrink-0">✓</span>{t}</li>)}
            </ul>
          </div>
          <div className="card-dark p-8 text-center">
            <div className="section-eyebrow mb-3">Plan the Perfect 21st</div>
            <h3 className="font-display text-white font-bold text-xl mb-3">Your First Legal Night Deserves the Best</h3>
            <p className="text-white/55 text-sm mb-6">Tell Justin whose 21st it is and your group size. He'll build the perfect first-legal-night itinerary from $149/person.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/services/birthday-party-las-vegas" className="btn-gold">View Birthday Packages</Link>
              <Link href="/contact" className="btn-ghost">Get a Free Quote</Link>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
