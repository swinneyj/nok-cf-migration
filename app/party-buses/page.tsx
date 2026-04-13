import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDays, CarFront, Phone, ShieldCheck, Sparkles, Users } from 'lucide-react'
import InquiryForm from '@/components/InquiryForm'
import PartyBusPricingCalculator from '@/components/PartyBusPricingCalculator'
import {
  PARTY_BUS_SURCHARGE_RULES_2026,
  PARTY_BUS_VEHICLES,
} from '@/lib/partyBusPricing'

export const metadata: Metadata = {
  title: 'Las Vegas Party Bus Rentals | VIP Group Transportation',
  description:
    'Las Vegas party bus rentals with live hourly pricing, event-date surcharges, and VIP group transportation for clubs, dayclubs, birthdays, and wedding weekends. Call (702) 996-4884.',
  openGraph: {
    title: 'Las Vegas Party Bus Rentals | Nokturnal Lifestyle',
    description:
      'Luxury party buses, sprinters, SUVs, and motorcoach transportation in Las Vegas with event-aware pricing and fast quote turnaround.',
    images: [{ url: '/images/venues/party-bus-hero.jpeg' }],
  },
}

const fleetHighlights = [
  {
    title: 'Nightclub Runs',
    description: 'Perfect for dinner-to-club moves, multi-venue nights, and keeping the whole crew together.',
    icon: Sparkles,
  },
  {
    title: 'Dayclub Transfers',
    description: 'Pre-booked pickups to LIV Beach, Encore Beach Club, Stadium Swim, and more with built-in wait time planning.',
    icon: CalendarDays,
  },
  {
    title: 'Large Group Logistics',
    description: 'Motorcoach and full-size options for weddings, convention groups, airport movements, and event buyouts.',
    icon: Users,
  },
]

const bookingSteps = [
  'Choose the vehicle that fits your group size and vibe.',
  'Pick your date to see holiday and major-event surcharges automatically applied.',
  'Send your route details and we will confirm the final quote, timing, and pickup plan.',
]

const surchargePreview = PARTY_BUS_SURCHARGE_RULES_2026.filter((rule) =>
  ['CES 2026', 'WrestleMania at Allegiant Stadium', 'EDC', 'Formula 1 Race Day'].includes(rule.title)
)

function formatRate(vehicle: (typeof PARTY_BUS_VEHICLES)[number]) {
  if (!vehicle.hourlyRate) return 'Call for quote'
  return `From $${vehicle.hourlyRate}/hr`
}

export default function PartyBusesPage() {
  return (
    <>
      <section className="relative page-hero overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/venues/party-bus-hero.jpeg"
            alt="Las Vegas luxury party bus on the Strip"
            className="h-full w-full object-cover object-center"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="section-eyebrow mb-4">Party Buses</div>
            <h1
              className="mb-5 font-display font-bold text-white"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
            >
              Las Vegas Party Bus Rentals That Match the Rest of the Weekend
            </h1>
            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-white/72">
              Luxury transportation for nightclubs, dayclubs, birthdays, bachelor and bachelorette
              weekends, weddings, and convention groups. We built the estimator below using
              Presidential&apos;s current rate sheet plus your 2026 holiday and event surcharge calendar.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#pricing" className="btn-gold">
                Check Pricing
              </Link>
              <Link href="#reserve" className="btn-ghost">
                Build My Quote
              </Link>
              <a href="tel:+17029964884" className="btn-ghost flex items-center gap-2">
                <Phone size={14} /> (702) 996-4884
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gold-500/10 bg-night-900/90 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {fleetHighlights.map(({ title, description, icon: Icon }) => (
            <div key={title} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-gold-500/25 bg-gold-500/10">
                <Icon size={18} className="text-gold-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/58">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <div className="section-eyebrow mb-3">Fleet Options</div>
            <h2 className="font-display text-3xl font-bold text-white">Choose the Right Vehicle</h2>
            <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-white/52">
              These cards now reflect the cleaned rate-sheet data you sent over, including minimums,
              booking fee behavior, fuel line items, and the event-date adjustments layered in below.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {PARTY_BUS_VEHICLES.map((vehicle) => (
              <article key={vehicle.slug} className="card-dark overflow-hidden">
                <div className="relative h-56">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="h-full w-full object-cover object-center"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                    <div>
                      <div className="mb-2 inline-flex items-center rounded-full border border-gold-500/25 bg-gold-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-300">
                        {vehicle.seats} max · {vehicle.recommendedPaxWithLuggage} with luggage
                      </div>
                      <h3 className="font-display text-2xl font-bold text-white">{vehicle.name}</h3>
                    </div>
                    <div className="rounded-xl border border-gold-500/25 bg-night-900/85 px-3 py-2 text-right">
                      <div className="text-lg font-bold text-gold-300">{formatRate(vehicle)}</div>
                      <div className="text-[11px] uppercase tracking-[0.16em] text-white/35">
                        {vehicle.minimumHours ? `${vehicle.minimumHours} hr min` : 'Custom'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  <p className="text-sm leading-relaxed text-white/60">{vehicle.description}</p>

                  <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">Rate Sheet Base</div>
                      <div className="mt-1 font-medium text-white">
                        {vehicle.minimumCharge ? `$${vehicle.minimumCharge} minimum` : 'Custom quote'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">Best For</div>
                      <div className="mt-1 font-medium text-white">
                        {vehicle.seats <= 12 ? 'VIP transfers' : vehicle.seats <= 25 ? 'Party nights' : 'Large groups'}
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2 text-sm text-white/62">
                    {vehicle.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <ShieldCheck size={14} className="mt-0.5 flex-shrink-0 text-gold-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {vehicle.pricingNote ? (
                    <p className="rounded-xl border border-gold-500/15 bg-gold-500/5 px-4 py-3 text-sm leading-relaxed text-white/58">
                      {vehicle.pricingNote}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-night-800/45 px-4 py-20 scroll-mt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-12">
          <PartyBusPricingCalculator />

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="card-dark p-6 lg:p-8">
              <div className="section-eyebrow mb-3">How It Works</div>
              <h2 className="font-display text-2xl font-bold text-white">A Cleaner Booking Flow for Transportation</h2>
              <div className="mt-6 space-y-4">
                {bookingSteps.map((step, index) => (
                  <div key={step} className="flex gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gold-500/25 bg-gold-500/10 text-sm font-semibold text-gold-300">
                      {index + 1}
                    </div>
                    <p className="pt-1 text-sm leading-relaxed text-white/60">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-dark p-6 lg:p-8">
              <div className="section-eyebrow mb-3">2026 Date Rules</div>
              <h2 className="font-display text-2xl font-bold text-white">Major Event Surcharges We Already Apply</h2>
              <div className="mt-6 space-y-3">
                {surchargePreview.map((rule) => (
                  <div key={rule.date} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">{rule.title}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.16em] text-white/35">{rule.date}</div>
                      </div>
                      <div className="rounded-full border border-gold-500/25 bg-gold-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold-300">
                        +{Math.round(rule.increase * 100)}%
                      </div>
                    </div>
                    {rule.minimumNote ? (
                      <p className="mt-3 text-sm leading-relaxed text-white/55">{rule.minimumNote}</p>
                    ) : null}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-white/35">
                This pricing logic currently uses the surcharge workbook snapshot you provided. If the vendor
                publishes a fresh calendar later, we can update the rules without redesigning the page.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="reserve" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="section-eyebrow mb-4">Reserve Now</div>
            <h2 className="mb-4 font-display text-3xl font-bold text-white">
              Tell Us the Vehicle, Date, and Route. We&apos;ll Handle the Rest.
            </h2>
            <p className="mb-6 max-w-xl leading-relaxed text-white/60">
              Use the estimate above to sanity-check budget, then send the details here. We&apos;ll confirm
              pickup timing, routing, wait-and-return logic, and any venue or event-specific minimums.
            </p>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="mb-2 flex items-center gap-2 text-white">
                  <CarFront size={16} className="text-gold-400" />
                  <span className="font-medium">What to include</span>
                </div>
                <p className="text-sm leading-relaxed text-white/55">
                  Hotel pickup, venue stops, whether you need return service, and how many people are in the
                  group. If it&apos;s tied to EDC, Formula 1, WrestleMania, or another major event, say that too.
                </p>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="mb-2 flex items-center gap-2 text-white">
                  <ShieldCheck size={16} className="text-gold-400" />
                  <span className="font-medium">What happens next</span>
                </div>
                <p className="text-sm leading-relaxed text-white/55">
                  We&apos;ll respond with the best-fit vehicle, the final price with route-specific adjustments,
                  and a clean game plan for your group.
                </p>
              </div>
            </div>
          </div>

          <div className="card-dark p-8">
            <InquiryForm defaultPackage="partybus" />
          </div>
        </div>
      </section>
    </>
  )
}
