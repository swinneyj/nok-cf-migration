import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '25 Las Vegas Bachelorette Party Ideas for 2026 (From a Local VIP Host)',
  description: '25 epic Las Vegas bachelorette party ideas — nightclubs, pool parties, male revues, spa days, shooting ranges, Top Golf and more. Organized by vibe and budget.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/blog/las-vegas-bachelorette-party-ideas' },
  openGraph: {
    title: '25 Las Vegas Bachelorette Party Ideas for 2026',
    description: 'The best bachelorette party ideas in Las Vegas — organized by vibe, budget, and group size. From a VIP host with 8+ years of experience.',
    images: [{ url: '/blog/las-vegas-bachelorette-party-ideas/image.jpg' }],
  },
}

const ideas = {
  nightlife: [
    { title: 'VIP Nightclub with Bottle Service', desc: 'Reserve a VIP table at XS, Hakkasan, or Omnia. Champagne waiting at the table, skip the line, personal host to guide the bride all night. The classic Vegas bachelorette move for a reason.', cost: '$$$', groupSize: 'Any' },
    { title: 'Pool Party Dayclub Cabana', desc: 'Spend the afternoon at Encore Beach Club or Marquee Dayclub in a private cabana. Matching bikinis, bottle service, and world-class DJs under the Nevada sun.', cost: '$$$', groupSize: '4–12' },
    { title: 'Club Crawl — 2 Venues in One Night', desc: 'Skip the line at two different nightclubs in the same night. Different music, different vibe, one seamless experience with a host coordinating every move.', cost: '$$', groupSize: 'Any' },
    { title: 'Male Revue Show', desc: 'Magic Mike Live, Chippendales, or Thunder From Down Under. Book VIP seats in advance — front rows sell out fast. Great opener before a nightclub.', cost: '$$', groupSize: 'Any' },
    { title: 'Rooftop Bar Crawl', desc: "Ghostbar at Palms, Drai's rooftop, Foundation Room at House of Blues. Cocktails with views before heading to a nightclub. More relaxed than jumping straight into clubs.", cost: '$$', groupSize: '4–10' },
  ],
  daytime: [
    { title: 'Spa Day at a Resort Spa', desc: 'The Wynn Spa, ARIA Spa, or Encore Spa. Book couples massages and treatments for the whole group in the morning — then transition to pool party or nightclub in the evening.', cost: '$$$', groupSize: '2–8' },
    { title: 'Top Golf', desc: "Three floors of climate-controlled golf bays with food, drinks, and games. You don't need to know how to golf. Perfect 2–3 hour activity before dinner.", cost: '$$', groupSize: '4–16' },
    { title: 'Helicopter Ride Over the Strip', desc: 'A 15-minute helicopter flight over the Las Vegas Strip and Grand Canyon is a bucket list experience. Book at sunset for the most dramatic views.', cost: '$$$', groupSize: '2–6' },
    { title: 'Shooting Range Experience', desc: 'Las Vegas has world-class shooting ranges with full-auto machine guns, sniper rifles, and more. Surprisingly popular for bachelorette parties — unforgettable and fun.', cost: '$$', groupSize: 'Any' },
    { title: 'Las Vegas Food Tour', desc: "Walk the Strip and Fremont Street hitting iconic restaurants and hidden gems. Some operators include cocktail pairings. Great for groups where not everyone drinks.", cost: '$', groupSize: '4–12' },
    { title: 'Drag Brunch at a Vegas Bar', desc: 'Several Vegas venues host drag brunch on weekends — fantastic food, comedy, and performances. A perfect late morning start to a big day.', cost: '$', groupSize: 'Any' },
    { title: 'ATV/Off-Road Desert Tour', desc: 'Head 30 minutes outside Vegas for guided ATV rides through the Mojave Desert. Thrilling, unique, and Instagram gold. Usually available morning only.', cost: '$$', groupSize: 'Any' },
  ],
  food: [
    { title: 'VIP Dinner at a Celebrity Chef Restaurant', desc: "Gordon Ramsay Hell's Kitchen, Guy Fieri's Vegas Kitchen, Nobu. Make reservations 2+ weeks in advance. Most offer private dining rooms for groups.", cost: '$$$', groupSize: 'Any' },
    { title: 'Bottomless Brunch', desc: "Multiple Vegas restaurants offer bottomless mimosa or cocktail brunch. Perfect day-before or morning-of activity. Don't save it for the last day.", cost: '$$', groupSize: 'Any' },
    { title: 'Pool Party Day → Dinner → Club Night', desc: 'The full Vegas sequence. Dayclub from noon to 5pm, back to hotel to freshen up, VIP dinner at 8pm, nightclub at 11pm. Requires planning but worth it.', cost: '$$$', groupSize: 'Any' },
  ],
  experiences: [
    { title: 'Pole Dancing Class', desc: 'Several Vegas studios offer private group pole dancing lessons. No experience needed — it\'s all about the fun. Usually 90 minutes and can be done in the afternoon before going out.', cost: '$', groupSize: '6–15' },
    { title: 'Escape Room', desc: 'Vegas has some of the most elaborate escape rooms in the country. Great 60-minute activity for groups who like to problem-solve together. Book an afternoon slot.', cost: '$', groupSize: '4–10' },
    { title: 'Vegas Speakeasy Bar Crawl', desc: 'Hidden bars, secret entrances, password-protected cocktail lounges. A guided speakeasy tour hits 3–4 hidden gems in one evening. Perfect pre-club activity.', cost: '$', groupSize: '4–12' },
    { title: 'Karaoke Private Room', desc: 'Book a private karaoke room for 2–3 hours. Drinks delivered to the room, no judgment, full song catalog. KAMU at TAO Group is excellent.', cost: '$$', groupSize: '4–20' },
    { title: 'Boat Party on Lake Mead', desc: '45 minutes from Vegas, rent a party boat on Lake Mead. BYO drinks, swimming stops, stunning desert scenery. A completely different experience from the Strip.', cost: '$$', groupSize: '8–20' },
    { title: 'Bachelorette Suite Party', desc: "Book a suite at Wynn, ARIA, or Cosmopolitan. Private party before heading out, champagne setup arranged in advance. The bride's room is the pregame — and sometimes the whole night.", cost: '$$$', groupSize: 'Any' },
    { title: 'Vegas Comedy Show', desc: "Carrot Top, Louie Anderson, Brad Garrett's Comedy Club. A 90-minute show works perfectly between dinner and nightclub. Keeps the group together and laughing.", cost: '$$', groupSize: 'Any' },
    { title: 'Customized Scavenger Hunt', desc: 'Several Vegas tour companies run bachelorette-specific scavenger hunts across the Strip. Teams split up, complete challenges, reunite at a bar. Usually 2–3 hours.', cost: '$', groupSize: '6–20' },
    { title: 'Cirque du Soleil Show', desc: 'O at Bellagio or Mystère at Treasure Island. World-class production that works for mixed-age groups. Book early — good seats go fast.', cost: '$$', groupSize: 'Any' },
    { title: 'Build Your Own Custom Package', desc: "The best bachelorette parties are the ones built around what the bride actually loves — not a generic checklist. Tell us about her and we'll build something completely custom.", cost: 'Custom', groupSize: 'Any' },
  ],
}

export default function BacheloretteIdeas() {
  return (
    <>
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/blog/las-vegas-bachelorette-party-ideas/image.jpg" alt="Las Vegas bachelorette party ideas 2026" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/blog" className="section-eyebrow hover:text-gold-300 transition-colors">← Blog</Link>
            <span className="text-white/25">·</span>
            <span className="section-eyebrow">Bachelorette Parties</span>
          </div>
          <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
            25 Las Vegas Bachelorette Party Ideas for 2026
          </h1>
          <div className="flex items-center gap-4 text-white/40 text-sm">
            <span>March 22, 2026</span><span>·</span><span>11 min read</span><span>·</span><span>By Justin — Nokturnal Lifestyle</span>
          </div>
        </div>
      </section>

      <article className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-12">

          <div className="card-dark p-6 border-l-4 border-gold-500">
            <p className="text-gold-400 font-semibold text-sm mb-2">How to Use This Guide</p>
            <p className="text-white/75 text-sm leading-relaxed">
              I've organized these ideas by category so you can mix and match based on what the bride actually wants. Most great bachelorette weekends combine 2–3 of these: a daytime activity, a dinner, and a nightlife experience. <strong className="text-white">Cost key: $ = under $100/person · $$ = $100–200/person · $$$ = $200+/person</strong>
            </p>
          </div>

          <p className="text-white/70 leading-relaxed text-lg">
            After 8 years of planning bachelorette parties in Las Vegas, the ones that go wrong usually have one thing in common: they tried to do too much. Pick a vibe, build around it, and leave room for spontaneity. Here are the 25 ideas I recommend most often.
          </p>

          {[
            { label: '🌙 Nightlife Experiences', items: ideas.nightlife },
            { label: '☀️ Daytime Activities', items: ideas.daytime },
            { label: '🍽️ Food & Dining', items: ideas.food },
            { label: '🎉 Unique Experiences', items: ideas.experiences },
          ].map(({ label, items }) => (
            <div key={label}>
              <h2 className="font-display text-white font-bold text-2xl mb-5">{label}</h2>
              <div className="space-y-4">
                {items.map((idea, i) => (
                  <div key={idea.title} className="card-dark p-5">
                    <div className="flex items-start justify-between mb-2 gap-4">
                      <h3 className="font-display text-white font-bold text-lg leading-snug">{idea.title}</h3>
                      <div className="flex gap-2 flex-shrink-0">
                        <span className="text-gold-400 text-xs bg-gold-500/10 px-2 py-1 rounded font-semibold">{idea.cost}</span>
                        <span className="text-white/40 text-xs bg-white/5 px-2 py-1 rounded">{idea.groupSize}</span>
                      </div>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{idea.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div>
            <h2 className="font-display text-white font-bold text-2xl mb-4">How to Pick the Right Combination</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { vibe: 'Party Hard Bride', combo: 'Pool party cabana → VIP dinner → Nightclub bottle service → Male revue (late)' },
                { vibe: 'Low-Key Bride', combo: 'Spa morning → Bottomless brunch → Rooftop bar crawl → Comedy show' },
                { vibe: 'Adventure Bride', combo: 'Helicopter ride → Top Golf → Shooting range → Speakeasy bar crawl' },
              ].map(({ vibe, combo }) => (
                <div key={vibe} className="card-dark p-4">
                  <div className="text-gold-400 font-semibold text-sm mb-2">{vibe}</div>
                  <p className="text-white/60 text-xs leading-relaxed">{combo}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card-dark p-8 text-center">
            <div className="section-eyebrow mb-3">Skip the Planning Stress</div>
            <h3 className="font-display text-white font-bold text-xl mb-3">Tell Us About the Bride — We'll Build the Perfect Weekend</h3>
            <p className="text-white/55 text-sm mb-6">Justin responds within 30 minutes with a custom itinerary tailored to your group's vibe and budget.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/bachelorette" className="btn-gold">View Bachelorette Packages</Link>
              <Link href="/contact" className="btn-ghost">Get a Free Quote</Link>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
