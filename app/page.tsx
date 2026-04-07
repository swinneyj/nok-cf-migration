import type { Metadata } from 'next'
import Link from 'next/link'
import { Phone, Star, ChevronRight, Shield, Clock, Award, Users } from 'lucide-react'
import PackageCard from '@/components/PackageCard'
import ReviewCard from '@/components/ReviewCard'
import InquiryForm from '@/components/InquiryForm'

export const metadata: Metadata = {
  title: 'Las Vegas VIP Concierge | Bachelor & Bachelorette Party Packages',
  description:
    'Las Vegas #1 VIP concierge for bachelor & bachelorette parties. Bottle service, nightclub access, party buses & strip clubs — with a personal host. Call (702) 996-4884.',
}

const featuredPackages = [
  {
    title: 'Ultimate Bachelor Package',
    price: '$299',
    priceLabel: '/person',
    image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=600&q=80',
    imageAlt: 'Las Vegas bachelor party nightclub VIP bottle service',
    badge: 'Most Popular',
    includes: [
      'Party bus transportation',
      'VIP nightclub entry (skip the line)',
      'Reserved VIP table',
      'Bottle service included',
      'Personal VIP host all night',
      'Gentleman\'s club access',
    ],
    href: '/bachelor',
    rating: 4.9,
    reviewCount: 89,
  },
  {
    title: 'Bachelorette Glam Package',
    price: '$249',
    priceLabel: '/person',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
    imageAlt: 'Las Vegas bachelorette party VIP experience',
    badge: 'Fan Favorite',
    includes: [
      'Luxury limo from hotel',
      'VIP nightclub entry',
      'Champagne toast included',
      'Reserved VIP table',
      'Personal female-friendly host',
      'Pool party add-on available',
    ],
    href: '/bachelorette',
    rating: 5.0,
    reviewCount: 62,
  },
  {
    title: 'Nightclub VIP Table Package',
    price: '$179',
    priceLabel: '/person',
    image: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=600&q=80',
    imageAlt: 'Las Vegas nightclub VIP table bottle service',
    includes: [
      'Skip-the-line VIP entry',
      'Reserved VIP table',
      'Bottle service (2 bottles)',
      'Personal VIP host',
      'Access to Hakkasan, XS, Omnia & more',
    ],
    href: '/bottle-service',
    rating: 4.8,
    reviewCount: 55,
  },
]

const reviews = [
  {
    name: 'Patrick A.',
    date: 'May 2024',
    location: 'Phoenix, AZ',
    rating: 5,
    text: 'I have been using Nokturnal Lifestyle for over 8 years. Justin has been my main guy. He always takes care of me and my group. Last time was my Bachelor Party and he put in the works for us. Justin\'s customer service is top tier.',
  },
  {
    name: 'Prashanth M.',
    date: 'April 2024',
    location: 'San Jose, CA',
    rating: 5,
    text: 'Justin is the buddy you wish you had in Vegas. From the very first communication I felt a huge weight off my shoulders. We met him at Zouk — got us in through the express lane. My buddies said it was the best weekend ever.',
  },
  {
    name: 'Tam T.',
    date: 'September 2023',
    location: 'Houston, TX',
    rating: 5,
    text: 'Phenomenal experience with Nokturnal Lifestyle. They made sure I was taken care of when I was in Vegas. Answered all my questions and always answered my phone calls and replied to texts on the spot!',
  },
  {
    name: 'Joanne G.',
    date: 'March 2023',
    location: 'Los Angeles, CA',
    rating: 5,
    text: 'Justin is the best. He\'s always super fast and very responsive. I texted him last minute with some changes and he never disappoints. Thanks for being awesome Justin!',
  },
  {
    name: 'Phillip G.',
    date: 'March 2023',
    location: 'Chicago, IL',
    rating: 5,
    text: 'Highly recommend using them for any of your Vegas nightlife needs. Justin and Josh were awesome and delivered above and beyond. Super responsive and attentive — set up a seamless club experience.',
  },
  {
    name: 'Vince D.',
    date: 'December 2022',
    location: 'New York, NY',
    rating: 5,
    text: 'Justin was hands down the most professional host I have ever worked with in Las Vegas. He has connections everywhere and truly cares. He has hit a home run on every Vegas trip I have had.',
  },
]

const stats = [
  { value: '8+', label: 'Years in Business' },
  { value: '5,000+', label: 'Events Hosted' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '200+', label: 'Google Reviews' },
]

const whyUs = [
  {
    icon: Shield,
    title: 'Licensed & Local',
    desc: 'We\'re a legitimate, licensed concierge with real connections — not a booking website.',
  },
  {
    icon: Users,
    title: 'Personal VIP Host',
    desc: 'Justin or one of our team will be with you in person all night. No one-and-done.',
  },
  {
    icon: Award,
    title: 'Exclusive Access',
    desc: 'Skip lines, get the best tables, and access venues others can\'t book.',
  },
  {
    icon: Clock,
    title: 'Last-Minute Friendly',
    desc: 'Already in Vegas? We can book your night in hours, not days.',
  },
]

const venues = [
  'XS Nightclub', 'Hakkasan', 'Omnia', 'Marquee', 'TAO', 'Drai\'s',
  'Zouk', 'Jewel', 'Encore Beach Club', 'Marquee Dayclub', 'Elia Beach Club',
  'Crazy Horse 3', 'Sapphire', 'Spearmint Rhino',
]

const categories = [
  {
    label: 'Bachelor Parties',
    href: '/bachelor',
    img: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&q=80',
    alt: 'Las Vegas bachelor party packages VIP',
  },
  {
    label: 'Bachelorette Parties',
    href: '/bachelorette',
    img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    alt: 'Las Vegas bachelorette party packages',
  },
  {
    label: 'Nightclubs',
    href: '/nightclubs',
    img: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&q=80',
    alt: 'Las Vegas nightclub VIP access bottle service',
  },
  {
    label: 'Pool Parties',
    href: '/pool-parties',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    alt: 'Las Vegas pool party dayclub cabana',
  },
  {
    label: 'Party Buses',
    href: '/bachelor',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    alt: 'Las Vegas party bus luxury transportation',
  },
  {
    label: 'Strip Clubs',
    href: '/strip-clubs',
    img: 'https://images.unsplash.com/photo-1545431781-3e1b506e9a37?w=800&q=80',
    alt: 'Las Vegas strip club VIP access',
  },
]

export default function HomePage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=1800&q=85"
            alt="Las Vegas VIP nightlife"
            className="w-full h-full object-cover object-center"
          />
          <div className="hero-overlay absolute inset-0" />
          {/* Subtle gold vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 40%, rgba(8,8,16,0.6) 100%)',
            }}
          />
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24">
          <div className="section-eyebrow mb-6 animate-fade-in">
            Las Vegas · VIP Concierge · Est. 2016
          </div>

          <h1 className="font-display font-bold text-white leading-tight mb-6"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', lineHeight: 1.05 }}>
            Vegas Done Right.{' '}
            <span className="text-gold-shimmer">Every Single Night.</span>
          </h1>

          <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Personal VIP hosts · Skip-the-line access · Bottle service · Party buses ·
            Bachelor &amp; bachelorette packages. Over 5,000 unforgettable nights and counting.
          </p>

          {/* Social proof bar */}
          <div className="flex items-center justify-center gap-4 mb-10 flex-wrap">
            <div className="flex items-center gap-2 bg-night-900/60 border border-gold-500/20 rounded-full px-4 py-2">
              <div className="stars text-xs">★★★★★</div>
              <span className="text-white/80 text-xs font-medium">4.9 · 200+ Reviews</span>
            </div>
            <div className="flex items-center gap-2 bg-night-900/60 border border-gold-500/20 rounded-full px-4 py-2">
              <span className="text-gold-400 text-xs">✓</span>
              <span className="text-white/80 text-xs font-medium">Licensed & Local</span>
            </div>
            <div className="flex items-center gap-2 bg-night-900/60 border border-gold-500/20 rounded-full px-4 py-2">
              <span className="text-gold-400 text-xs">✓</span>
              <span className="text-white/80 text-xs font-medium">8+ Years in Business</span>
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-gold text-sm px-10 py-4">
              Plan My Vegas Experience
            </Link>
            <a href="tel:+17029964884" className="btn-ghost text-sm px-10 py-4 flex items-center justify-center gap-2">
              <Phone size={15} />
              (702) 996-4884
            </a>
          </div>

          {/* Scroll cue */}
          <div className="mt-16 flex flex-col items-center gap-2 text-white/30 text-xs">
            <span>Scroll to explore</span>
            <div className="w-px h-10 bg-gradient-to-b from-gold-500/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────── */}
      <section className="bg-night-800 border-y border-gold-500/10">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="stat-number">{value}</div>
              <div className="text-white/40 text-xs uppercase tracking-widest mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORY TILES ───────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-eyebrow mb-3">What We Do</div>
            <h2 className="font-display text-white font-bold" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
              Choose Your Experience
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.href + cat.label}
                href={cat.href}
                className="group relative rounded-xl overflow-hidden h-48 md:h-60"
              >
                <img
                  src={cat.img}
                  alt={cat.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night-900/90 via-night-900/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <div className="font-display text-white font-bold text-lg leading-tight">
                    {cat.label}
                  </div>
                  <div className="flex items-center gap-1 text-gold-400 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    View packages <ChevronRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PACKAGES ────────────────────────── */}
      <section className="py-20 px-4 bg-night-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-eyebrow mb-3">Packages</div>
            <h2 className="font-display text-white font-bold mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
              Most Popular VIP Packages
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-sm">
              All packages include a personal VIP host, skip-the-line access, and can be fully
              customized to your group's needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {featuredPackages.map((pkg) => (
              <PackageCard key={pkg.title} {...pkg} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/contact" className="btn-ghost">
              Build a Custom Package →
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY NOKTURNAL ────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Image stack */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden h-[500px]">
                <img
                  src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80"
                  alt="VIP concierge Las Vegas nightlife"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night-900/60 to-transparent" />
              </div>
              {/* Floating trust card */}
              <div className="absolute -bottom-6 -right-6 card-dark p-5 max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <div className="stars text-base">★★★★★</div>
                  <span className="text-white/60 text-sm">4.9 / 5.0</span>
                </div>
                <p className="text-white/70 text-xs italic leading-relaxed">
                  "Justin is the best host in Vegas. He's been my go-to for 8 years."
                </p>
                <div className="text-white/40 text-xs mt-2">— Patrick A., Phoenix AZ</div>
              </div>
            </div>

            {/* Right: Copy */}
            <div>
              <div className="section-eyebrow mb-4">Why Choose Us</div>
              <h2 className="font-display text-white font-bold mb-6" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>
                Not a Website.<br />
                <span className="text-gold-shimmer">A Real Person. In Person.</span>
              </h2>
              <p className="text-white/60 leading-relaxed mb-8">
                Most booking sites take your money and disappear. Nokturnal Lifestyle is different —
                Justin and his team are physically with you all night, making sure everything goes
                perfectly. Over 8 years, 5,000+ events, and 200+ five-star reviews.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
                {whyUs.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-gold-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm mb-1">{title}</div>
                      <div className="text-white/45 text-xs leading-relaxed">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 flex-wrap">
                <Link href="/about" className="btn-gold">
                  Meet the Team
                </Link>
                <a href="tel:+17029964884" className="btn-ghost flex items-center gap-2">
                  <Phone size={14} /> Call Justin
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VENUES ───────────────────────────────────── */}
      <section className="py-16 px-4 bg-night-800/30 border-y border-gold-500/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="section-eyebrow mb-2">Connections</div>
            <h2 className="font-display text-white font-bold text-xl">
              We Work With Las Vegas's Best Venues
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {venues.map((venue) => (
              <span key={venue} className="venue-badge">
                {venue}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ──────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-eyebrow mb-3">Testimonials</div>
            <h2 className="font-display text-white font-bold" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
              200+ Five-Star Reviews
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((r) => (
              <ReviewCard key={r.name} {...r} />
            ))}
          </div>
        </div>
      </section>

      {/* ── INQUIRY SECTION ──────────────────────────── */}
      <section className="py-20 px-4 bg-night-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Copy */}
            <div>
              <div className="section-eyebrow mb-4">Ready to Book?</div>
              <h2 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
                Get Your Free,{' '}
                <span className="text-gold-shimmer">No-Obligation Quote</span>
              </h2>
              <p className="text-white/60 leading-relaxed mb-8">
                Tell us about your group and what you're looking for. Justin will personally reach
                out within 30 minutes to build your perfect Las Vegas experience.
              </p>

              <ul className="check-list">
                <li>No booking fees or hidden charges</li>
                <li>Fully customizable packages</li>
                <li>Personal host included in every package</li>
                <li>Price-match guarantee vs. online booking</li>
                <li>Last-minute availability — already in Vegas? We've got you</li>
              </ul>

              <div className="mt-8 p-5 rounded-xl border border-gold-500/15 bg-gold-500/5">
                <div className="flex items-center gap-3 mb-2">
                  <Phone size={18} className="text-gold-400" />
                  <span className="text-white font-semibold">Prefer to call?</span>
                </div>
                <a href="tel:+17029964884" className="text-gold-400 text-xl font-display font-bold hover:text-gold-300 transition-colors">
                  (702) 996-4884
                </a>
                <div className="text-white/30 text-xs mt-1">Available 7 days · 9am – Midnight</div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="card-dark p-8">
              <h3 className="font-display text-white font-bold text-xl mb-6">
                Request a Free Quote
              </h3>
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA BANNER ─────────────────────────── */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=1400&q=80"
            alt="Las Vegas nightlife VIP"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-night-900/85" />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(212,160,23,0.08) 0%, transparent 60%)',
            }}
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="gold-line mb-8 mx-auto w-24" />
          <h2 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Your best night in Vegas starts with one call.
          </h2>
          <p className="text-white/60 mb-10 text-lg">
            Don't leave your experience to chance. Let us handle every detail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-gold text-sm px-12 py-4">
              Plan My Experience Now
            </Link>
            <a href="tel:+17029964884" className="btn-ghost text-sm px-12 py-4 flex items-center justify-center gap-2">
              <Phone size={15} />
              (702) 996-4884
            </a>
          </div>
          <div className="gold-line mt-8 mx-auto w-24" />
        </div>
      </section>
    </>
  )
}
