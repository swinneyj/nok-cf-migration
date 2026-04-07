import type { Metadata } from 'next'
import Link from 'next/link'
import { Phone } from 'lucide-react'
import ReviewCard from '@/components/ReviewCard'

export const metadata: Metadata = {
  title: 'About Nokturnal Lifestyle | Las Vegas VIP Concierge Since 2016',
  description:
    'Meet Justin and the Nokturnal Lifestyle team. 8+ years, 5,000+ events, 200+ five-star reviews. Las Vegas\'s most trusted VIP concierge service.',
}

const milestones = [
  { year: '2016', label: 'Founded', desc: 'Justin started Nokturnal with a simple mission: give everyone the best Vegas experience possible.' },
  { year: '2018', label: '1,000 Events', desc: 'Grew to a full team. Expanded to cover nightclubs, pool parties, strip clubs, and party buses.' },
  { year: '2021', label: '100+ Reviews', desc: 'Crossed 100 five-star reviews. Recognized as a top concierge by Yelp and Google.' },
  { year: '2024', label: '5,000+ Nights', desc: 'Over 5,000 events hosted. 200+ Google reviews. Still personally led by Justin.' },
]

const reviews = [
  {
    name: 'Jeff F.',
    date: 'September 2021',
    location: 'Miami, FL',
    rating: 5,
    text: 'He treats you like a long-time friend that only has the best intentions for you. That\'s what it\'s about — not a business transaction. If you want a stress-free, good vibes-only service, Nokturnal is unparalleled.',
  },
  {
    name: 'Justin M.',
    date: 'January 2022',
    location: 'Denver, CO',
    rating: 5,
    text: 'Worked with Justin from Nokturnal over the last few months helping make the bachelor party I planned a major success. Super responsive and I would recommend 10 out of 10 times!',
  },
  {
    name: 'Marvin K.',
    date: 'November 2021',
    location: 'Atlanta, GA',
    rating: 5,
    text: 'These guys always hook it up whether I\'m reaching out ahead of time or last minute. Skip the line, get the best deals, and have the best time!',
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="relative pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="section-eyebrow mb-4">About Us</div>
          <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            The Story Behind Nokturnal Lifestyle
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            We're not a booking website. We're a team of real people with real connections, built
            over 8+ years living and working Las Vegas nightlife.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="section-eyebrow mb-4">Our Story</div>
            <h2 className="font-display text-white font-bold text-3xl mb-5">
              Started by Justin.<br />
              <span className="text-gold-shimmer">Built on Trust.</span>
            </h2>
            <div className="space-y-4 text-white/60 leading-relaxed text-sm">
              <p>
                Nokturnal Lifestyle was founded in 2016 by Justin, a Las Vegas local who saw a gap
                in the market: most "concierge" services were just websites that took bookings and
                disappeared. His clients never knew who they were dealing with, or if someone would
                actually show up.
              </p>
              <p>
                Justin built Nokturnal differently — on the premise that a VIP concierge should
                actually be there with you. Every package includes a personal host (usually Justin
                himself or his brother Josh) who meets you at your hotel, escorts you through VIP
                entry, and stays with you all night.
              </p>
              <p>
                8 years later, 5,000+ events, and 200+ five-star reviews — the mission hasn't
                changed. Just more connections, more venues, and more ways to make your night
                unforgettable.
              </p>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80"
              alt="Nokturnal Lifestyle concierge team Las Vegas"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night-900/60 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <div className="stat-number text-3xl">5,000+</div>
              <div className="text-white/60 text-xs uppercase tracking-wider">Events Hosted</div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 bg-night-800/40">
        <div className="max-w-4xl mx-auto">
          <div className="section-eyebrow text-center mb-10">Milestones</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map(({ year, label, desc }) => (
              <div key={year} className="card-dark p-5">
                <div className="text-gold-400 font-display font-bold text-2xl mb-1">{year}</div>
                <div className="text-white font-semibold text-sm mb-2">{label}</div>
                <div className="text-white/45 text-xs leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="section-eyebrow mb-3">What People Say</div>
            <h2 className="font-display text-white font-bold text-2xl">Straight From Our Clients</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {reviews.map((r) => <ReviewCard key={r.name} {...r} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-night-800/50 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="gold-line mx-auto w-20 mb-8" />
          <h2 className="font-display text-white font-bold text-3xl mb-4">
            Ready to experience the Nokturnal difference?
          </h2>
          <p className="text-white/50 mb-8">
            Call Justin directly or fill out our inquiry form. We'll have a custom itinerary ready
            for you within the hour.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn-gold">Plan My Experience</Link>
            <a href="tel:+17029964884" className="btn-ghost flex items-center gap-2">
              <Phone size={14} /> (702) 996-4884
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
