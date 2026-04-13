'use client'

import { useMemo, useState } from 'react'
import {
  PARTY_BUS_VEHICLES,
  calculatePartyBusEstimate,
} from '@/lib/partyBusPricing'

function buildDefaultDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function PartyBusPricingCalculator() {
  const pricedVehicles = PARTY_BUS_VEHICLES.filter((vehicle) => vehicle.hourlyRate)
  const [vehicleSlug, setVehicleSlug] = useState(pricedVehicles[0]?.slug ?? '')
  const [hours, setHours] = useState('2')
  const [date, setDate] = useState(buildDefaultDate)

  const estimate = useMemo(
    () =>
      calculatePartyBusEstimate({
        vehicleSlug,
        hours: Math.max(Number(hours) || 0, 0),
        date,
      }),
    [vehicleSlug, hours, date]
  )

  return (
    <div className="card-dark p-6 lg:p-8">
      <div className="section-eyebrow mb-3">Price Estimator</div>
      <h3 className="font-display text-2xl font-bold text-white">Estimate Your Transportation</h3>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
        This estimate uses the Presidential rate sheet you shared: service minimum, built-in discount,
        fuel line, booking fee, Nevada excise tax, and 2026 holiday or event uplifts from your surcharge
        calendar. Final quotes can still change if routing or venue minimums apply.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Vehicle</label>
          <select
            value={vehicleSlug}
            onChange={(event) => setVehicleSlug(event.target.value)}
            className="form-input"
          >
            {pricedVehicles.map((vehicle) => (
              <option key={vehicle.slug} value={vehicle.slug}>
                {vehicle.name} · up to {vehicle.seats}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Hours</label>
          <select value={hours} onChange={(event) => setHours(event.target.value)} className="form-input">
            {Array.from({ length: 12 }).map((_, index) => {
              const value = String(index + 1)
              return (
                <option key={value} value={value}>
                  {value} hour{value === '1' ? '' : 's'}
                </option>
              )
            })}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Event Date</label>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-white">{estimate.vehicle.name}</p>
              <p className="mt-1 text-sm text-gold-400">
                up to {estimate.vehicle.seats} passengers · recommended {estimate.vehicle.recommendedPaxWithLuggage} with luggage · {estimate.vehicle.hourlyRate ? `${formatCurrency(estimate.vehicle.hourlyRate)}/hr` : 'Call for pricing'}
              </p>
            </div>
            <div className="rounded-full border border-gold-500/20 bg-gold-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold-300">
              {estimate.vehicle.minimumHours ? `${estimate.vehicle.minimumHours} hr minimum` : 'Custom minimum'}
            </div>
          </div>

          <div className="mt-5 space-y-3 text-sm text-white/65">
            <div className="flex items-center justify-between gap-4">
              <span>Billable hours</span>
              <span className="font-semibold text-white">{estimate.effectiveHours}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Service charge</span>
              <span className="font-semibold text-white">{formatCurrency(estimate.serviceCharge ?? 0)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Rate-sheet discount</span>
              <span className="font-semibold text-white">{formatCurrency(estimate.fuelDiscount ?? 0)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Fuel line</span>
              <span className="font-semibold text-white">{formatCurrency(estimate.fuelCharge ?? 0)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Booking fee</span>
              <span className="font-semibold text-white">{formatCurrency(estimate.bookingFee ?? 0)}</span>
            </div>
            {estimate.surchargeRule ? (
              <div className="rounded-xl border border-gold-500/20 bg-gold-500/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-gold-300">Date Adjustment</p>
                <p className="mt-2 text-white">
                  {estimate.surchargeRule.title} adds {Math.round(estimate.surchargeRule.increase * 100)}%
                </p>
                {estimate.surchargeRule.minimumNote ? (
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{estimate.surchargeRule.minimumNote}</p>
                ) : null}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-night-900/35 p-4 text-white/55">
                No special event uplift is applied to this date.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gold-500/15 bg-night-900/70 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-gold-300">Estimated Total</p>
          {estimate.totalEstimate ? (
            <>
              <p className="mt-3 font-display text-4xl font-bold text-white">
                {formatCurrency(estimate.totalEstimate)}
              </p>
              <div className="mt-5 space-y-2 text-sm text-white/60">
                <div className="flex items-center justify-between gap-4">
                  <span>Estimated base fare</span>
                  <span>{formatCurrency(estimate.preTaxSubtotal ?? 0)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Date surcharge</span>
                  <span>{formatCurrency(estimate.surchargeAmount ?? 0)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Nevada excise tax</span>
                  <span>{formatCurrency(estimate.exciseTax ?? 0)}</span>
                </div>
              </div>
              <p className="mt-5 text-xs leading-relaxed text-white/35">
                Estimate excludes gratuity, parking, airport-specific charges, venue-specific fees, and any
                routing requirements outside standard service.
              </p>
            </>
          ) : (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/55">
              Pricing for this vehicle is quote-based. Use the form below and we&apos;ll price it manually.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
