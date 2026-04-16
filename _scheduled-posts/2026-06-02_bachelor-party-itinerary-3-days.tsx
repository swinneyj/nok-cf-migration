import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Las Vegas Bachelor Party Itinerary: 3 Days, 2 Nights (Detailed Plan)',
  description: 'Complete 3-day bachelor party itinerary for Las Vegas: Thursday arrival through Saturday night. Includes venue recommendations, timing, budget breakdown, and insider tips.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/blog/las-vegas-bachelor-party-itinerary' },
}

export default function BachelorItinerary() {
  const thursday = [
    { time: '4 PM', activity: 'Arrive at hotel (LAS airport to Strip ~20–30 min)', notes: 'Check in, shower, settle into suites. Stay hydrated.' },
    { time: '7 PM', activity: 'Dinner on the Strip or off-Strip (your choice)', notes: 'Casual spot recommended. Not a formal dinner—save appetite for nightlife.' },
    { time: '9 PM', activity: 'First nightclub or lounge', notes: 'Light warm-up. TAO or Drais rooftop works great. Get acclimated to the scene.' },
    { time: '11 PM', activity: 'Head to main nightclub (Hakkasan or Marquee)', notes: 'Peak energy. Book a table if you want bottle service. Skip if budget-conscious.' },
    { time: '2 AM', activity: 'After-hours club or back to hotel', notes: 'First night is easy. Save the heavy drinking for Friday/Saturday.' },
  ]

  const friday = [
    { time: '11 AM–1 PM', activity: 'Wake up, hang out, grab lunch', notes: 'Let everyone sleep in. Light breakfast/lunch, poolside recovery time.' },
    { time: '2 PM', activity: 'Pool party or day club (optional)', notes: 'Encore Beach Club or Marquee Dayclub (10 AM–6 PM). Book table with bottle service or just day-drink.' },
    { time: '6 PM', activity: 'Return to hotel, shower, fresh clothes', notes: 'Critical: Change clothes, shower, recharge before main event.' },
    { time: '7 PM', activity: 'Dinner at a nice restaurant', notes: 'Mizumi, Eataly, or Carnevor. Actual nice dinner—last meal before the blitz.' },
    { time: '9 PM', activity: 'Pre-game at hotel or lounge', notes: 'One hour to build momentum before the clubs. Bottled drinks at hotel are cheaper than clubs.' },
    { time: '10 PM', activity: 'Nightclub #1: XS, Hakkasan, or Omnia', notes: 'Friday is peak night. Reserve a table. This is THE night.' },
    { time: '1 AM', activity: 'Nightclub #2 (club crawl style)', notes: 'Move to a second venue if group energy is high. Marquee or Drais work as second stops.' },
    { time: '3 AM–onward', activity: 'After-hours or back to hotel', notes: 'Some groups do Zouk or gentleman\'s clubs. Others crash. Group decision.' },
  ]

  const saturday = [
    { time: '12 PM–2 PM', activity: 'Brunch (light, late)', notes: 'No sunrise hikes. Mimosa/bloody mary brunch. Stay in Vegas mode.' },
    { time: '3 PM–7 PM', activity: 'Free time: pool, nap, explore downtown', notes: 'Fremont Street for a different vibe. Or just rest at hotel before final night.' },
    { time: '7 PM', activity: 'Casual dinner or early drinks', notes: 'Nothing formal. Keep it light—save appetite/energy for Saturday night.' },
    { time: '9 PM', activity: 'Final nightclub push', notes: 'XS, Omnia, or Zouk. Bottle service not required—good happy hour deals available.' },
    { time: '12 AM–late', activity: 'Continue clubbing or call it a night', notes: 'Some heads home Saturday night, some party til 4 AM. No wrong call—everyone\'s tired.' },
    { time: '11 AM Sunday', activity: 'Sleep in, checkout, flight home', notes: 'You\'ll be destroyed. Accept it.' },
  ]

  return (
    <>
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/blog/bachelor-party-itinerary-3-days/cover.jpg" alt="Las Vegas bachelor party 3 day itinerary" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/blog" className="section-eyebrow hover:text-gold-300 transition-colors">← Blog</Link>
            <span className="text-white/25">·</span>
            <span className="section-eyebrow">Bachelor Party Planning</span>
          </div>
          <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>Las Vegas Bachelor Party Itinerary: 3 Days, 2 Nights (Detailed Plan)</h1>
          <div className="flex items-center gap-4 text-white/40 text-sm">
            <span>June 2, 2026</span>
            <span>·</span>
            <span>12 min read</span>
            <span>·</span>
            <span>By Justin — Nokturnal Lifestyle</span>
          </div>
        </div>
      </section>

      <article className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="card-dark p-6 border-l-4 border-gold-500">
            <p className="text-gold-400 font-semibold text-sm mb-2">This Itinerary</p>
            <p className="text-white/80 text-sm leading-relaxed">
              Thursday arrival (4 PM) → Friday is the main night → Saturday is wind-down. This paces the group so no one's dead by Friday and everyone finishes strong. Includes venue recommendations, timing, budget estimates, and what actually works vs. what looks cool in Instagram photos.
            </p>
          </div>

          <p className="text-white/70 leading-relaxed text-lg">
            A good bachelor party itinerary isn't about maximizing club visits. It's about pacing a group across 3 days so everyone's functional for the main night (Friday) without burning out by Saturday afternoon.
          </p>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-4">Thursday: Arrival & Warmup</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Thursday is a travel day. Most guys arrive in the afternoon. The goal: settle in, eat, do one light bar or lounge, then sleep. Don't blow out Thursday night. Friday is the real party.
            </p>
            <div className="space-y-3">
              {thursday.map(({ time, activity, notes }) => (
                <div key={time} className="card-dark p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-gold-400 font-semibold">{time}</h3>
                  </div>
                  <p className="text-white font-semibold text-sm mb-1">{activity}</p>
                  <p className="text-white/50 text-xs">{notes}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card-dark p-6 bg-green-950/20 border-l-4 border-green-400">
            <h3 className="text-green-300 font-semibold mb-2">✓ Pro Tips for Thursday</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>• <strong>Stay hydrated.</strong> Drink water between every drink. You'll thank me Friday.</li>
              <li>• <strong>Eat actual food.</strong> Not just bar food. Real meal on arrival.</li>
              <li>• <strong>Don't do bottle service Thursday.</strong> One decent bar, maybe bottle service Friday if budget allows.</li>
              <li>• <strong>Get everyone to bed by 2–3 AM.</strong> You need sleep before Friday.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-4">Friday: Main Event</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Friday is the night. Pool party during the day to build momentum, solid dinner, then two nightclub hits. This is where bottle service makes sense. This is the Instagram night.
            </p>
            <div className="space-y-3">
              {friday.map(({ time, activity, notes }) => (
                <div key={time} className="card-dark p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-gold-400 font-semibold">{time}</h3>
                  </div>
                  <p className="text-white font-semibold text-sm mb-1">{activity}</p>
                  <p className="text-white/50 text-xs">{notes}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card-dark p-4 bg-gold-950/20 border-l-4 border-gold-400">
              <h3 className="text-gold-300 font-semibold mb-2">Club Recommendations</h3>
              <ul className="space-y-1 text-white/70 text-sm">
                <li><strong>Tier 1 (Best):</strong> XS, Hakkasan</li>
                <li><strong>Tier 2 (Great):</strong> Omnia, Marquee</li>
                <li><strong>Tier 3 (Solid):</strong> Zouk, Drais</li>
                <li><strong>After-Hours:</strong> Zouk (till 6 AM)</li>
              </ul>
            </div>
            <div className="card-dark p-4 bg-blue-950/20 border-l-4 border-blue-400">
              <h3 className="text-blue-300 font-semibold mb-2">Budget Reality</h3>
              <ul className="space-y-1 text-white/70 text-sm">
                <li><strong>Per person:</strong> $300–$500</li>
                <li><strong>Bottle service:</strong> $1,200–$1,800 group</li>
                <li><strong>Pool party:</strong> $50–$100 per person</li>
                <li><strong>Total for 10:</strong> $3,000–$4,500</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-4">Saturday: Survival & Send-Off</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Saturday is not the main night. Everyone's tired. Goal is a relaxed day, light evening, optional clubbing, then everyone flies home Sunday morning destroyed but happy.
            </p>
            <div className="space-y-3">
              {saturday.map(({ time, activity, notes }) => (
                <div key={time} className="card-dark p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-gold-400 font-semibold">{time}</h3>
                  </div>
                  <p className="text-white font-semibold text-sm mb-1">{activity}</p>
                  <p className="text-white/50 text-xs">{notes}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card-dark p-8 bg-red-950/20 border-l-4 border-red-400">
            <h3 className="text-red-300 font-semibold mb-2">⚠️ Common Mistakes to Avoid</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>• <strong>Over-planning.</strong> Too many activities = nobody has fun. Flexibility is key.</li>
              <li>• <strong>Booking dinners on Friday too early.</strong> 7 PM dinner + 9 PM club = group gets delayed. Move to 6 PM or skip formal dinner.</li>
              <li>• <strong>Hiring strippers without knowing venue policy.</strong> Some hotels prohibit it. Book at a strip club instead.</li>
              <li>• <strong>Assuming everyone wants to club until 4 AM.</strong> Some guys want to chill Thursday/Saturday. That's fine.</li>
              <li>• <strong>Not booking nightclubs in advance.</strong> Walk-ups often get denied or stuck in bad spots. Reserve 48 hours ahead.</li>
            </ul>
          </div>

          <div className="card-dark p-8 text-center">
            <div className="section-eyebrow mb-3">Let Us Handle It</div>
            <h3 className="font-display text-white font-bold text-xl mb-3">We'll Execute This Itinerary for You</h3>
            <p className="text-white/55 text-sm mb-6">
              We book the nightclubs, arrange bottle service, handle logistics, and provide a personal host for your group. You just show up and party.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/bachelor" className="btn-gold">View Bachelor Packages</Link>
              <Link href="/contact" className="btn-ghost">Get a Custom Quote</Link>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <h3 className="text-white font-semibold mb-4">Related Reading</h3>
            <div className="space-y-2">
              <Link href="/blog/bottle-service-cost-las-vegas" className="block card-dark p-3 hover:bg-white/5 transition text-white/70 hover:text-gold-300">
                ← How Much Does Bottle Service Cost?
              </Link>
              <Link href="/blog/las-vegas-nightclub-attire-men" className="block card-dark p-3 hover:bg-white/5 transition text-white/70 hover:text-gold-300">
                ← Las Vegas Nightclub Attire for Men
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}