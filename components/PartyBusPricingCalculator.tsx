'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import {
  PARTY_BUS_VEHICLES,
  type PartyBusPickupLocation,
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

function getVehicleOptionLabel(name: string, seats: number) {
  const shortenedName = name
    .replace('Ultra Luxury Party Bus', 'Party Bus')
    .replace('Executive Coach', 'Coach')
    .replace('Sprinter Limo', 'Sprinter')
    .replace('Limo SUV', 'SUV')

  return `${shortenedName} · up to ${seats}`
}

const groupSizeOptions = [
  { value: '', label: 'How many people?', min: 0, max: Infinity },
  { value: '2-4', label: '2–4 people', min: 2, max: 4 },
  { value: '5-8', label: '5–8 people', min: 5, max: 8 },
  { value: '9-15', label: '9–15 people', min: 9, max: 15 },
  { value: '16-25', label: '16–25 people', min: 16, max: 25 },
  { value: '25+', label: '25+ people', min: 26, max: Infinity },
] as const

const pickupLocationOptions = [
  { value: 'strip', label: 'Las Vegas Strip / major casino' },
  { value: 'airport', label: 'Harry Reid Airport (LAS)' },
  { value: 'off-strip', label: 'Off-strip / custom quote' },
] as const

type MobilePickerType = 'group_size' | 'pickup_location' | 'vehicle' | 'hours' | null

export default function PartyBusPricingCalculator() {
  const pricedVehicles = PARTY_BUS_VEHICLES.filter((vehicle) => vehicle.hourlyRate)
  const [groupSize, setGroupSize] = useState('')
  const [pickupLocation, setPickupLocation] = useState<PartyBusPickupLocation>('strip')
  const [vehicleSlug, setVehicleSlug] = useState(pricedVehicles[0]?.slug ?? '')
  const [hours, setHours] = useState('1')
  const [date, setDate] = useState(buildDefaultDate)
  const [mobilePicker, setMobilePicker] = useState<MobilePickerType>(null)

  const selectedGroupSize = groupSizeOptions.find((option) => option.value === groupSize) ?? groupSizeOptions[0]
  const selectedPickupLocation =
    pickupLocationOptions.find((option) => option.value === pickupLocation) ?? pickupLocationOptions[0]
  const filteredVehicles = useMemo(() => {
    if (!groupSize) return pricedVehicles
    return pricedVehicles.filter(
      (vehicle) =>
        vehicle.recommendedPaxWithLuggage >= selectedGroupSize.min &&
        vehicle.seats >= selectedGroupSize.min &&
        vehicle.seats <= selectedGroupSize.max + 6
    )
  }, [groupSize, pricedVehicles, selectedGroupSize.max, selectedGroupSize.min])

  const selectedVehicle = filteredVehicles.find((vehicle) => vehicle.slug === vehicleSlug) ?? filteredVehicles[0] ?? pricedVehicles[0]
  const hourOptions = ['1', '2', '3', 'custom'] as const
  const isCustomHours = hours === 'custom'

  const canChooseVehicle = Boolean(groupSize)

  const estimate = useMemo(
    () =>
      calculatePartyBusEstimate({
        vehicleSlug: selectedVehicle?.slug ?? vehicleSlug,
        hours: Math.max(Number(hours) || 0, 0),
        date,
        pickupLocation,
      }),
    [selectedVehicle?.slug, vehicleSlug, hours, date, pickupLocation]
  )

  const mobilePickerTitle =
    mobilePicker === 'group_size'
      ? 'Choose Group Size'
      : mobilePicker === 'pickup_location'
        ? 'Choose Pickup Location'
      : mobilePicker === 'vehicle'
        ? 'Choose Vehicle'
        : 'Choose Hours'

  useEffect(() => {
    if (!selectedVehicle) return
    if (selectedVehicle.slug !== vehicleSlug) {
      setVehicleSlug(selectedVehicle.slug)
    }
  }, [selectedVehicle, vehicleSlug])

  return (
    <div className="card-dark p-6 lg:p-8">
      <div className="section-eyebrow mb-3">Price Estimator</div>
      <h3 className="font-display text-2xl font-bold text-white">Estimate Your Transportation</h3>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
        This estimate uses the Presidential rate sheet you shared along with the 2026 holiday and event
        surcharge calendar. Final quotes can still change if routing or venue minimums apply.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-5">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Group Size</label>
          <button
            type="button"
            onClick={() => setMobilePicker('group_size')}
            className="form-input flex items-center justify-between text-left md:hidden"
          >
            <span>{selectedGroupSize.label}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-white/55" />
          </button>
          <select
            value={groupSize}
            onChange={(event) => setGroupSize(event.target.value)}
            className="form-input hidden md:block"
          >
            {groupSizeOptions.map((option) => (
              <option key={option.value || 'placeholder'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Pickup Location</label>
          <button
            type="button"
            onClick={() => setMobilePicker('pickup_location')}
            className="form-input flex items-center justify-between text-left md:hidden"
          >
            <span className="truncate pr-3">{selectedPickupLocation.label}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-white/55" />
          </button>
          <select
            value={pickupLocation}
            onChange={(event) => setPickupLocation(event.target.value as PartyBusPickupLocation)}
            className="form-input hidden md:block"
          >
            {pickupLocationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Vehicle</label>
          <button
            type="button"
            onClick={() => {
              if (canChooseVehicle) setMobilePicker('vehicle')
            }}
            disabled={!canChooseVehicle}
            className="form-input flex items-center justify-between text-left disabled:cursor-not-allowed disabled:opacity-50 md:hidden"
          >
            <span className="truncate pr-3">
              {canChooseVehicle
                ? getVehicleOptionLabel(selectedVehicle.name, selectedVehicle.seats)
                : 'Choose group size first'}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-white/55" />
          </button>
          <select
            value={vehicleSlug}
            onChange={(event) => setVehicleSlug(event.target.value)}
            className="form-input hidden md:block disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canChooseVehicle}
          >
            {!canChooseVehicle ? (
              <option value="">Choose group size first</option>
            ) : null}
            {filteredVehicles.map((vehicle) => (
              <option key={vehicle.slug} value={vehicle.slug}>
                {getVehicleOptionLabel(vehicle.name, vehicle.seats)}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs leading-relaxed text-white/40">
            {canChooseVehicle
              ? `Showing ${filteredVehicles.length} vehicle option${filteredVehicles.length === 1 ? '' : 's'} for this group size.`
              : 'Choose group size first to narrow the vehicle list.'}
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Hours</label>
          <button
            type="button"
            onClick={() => setMobilePicker('hours')}
            className="form-input flex items-center justify-between text-left md:hidden"
          >
            <span>{isCustomHours ? '4+ hours · custom quote' : `${hours} hour${hours === '1' ? '' : 's'}`}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-white/55" />
          </button>
          <select value={hours} onChange={(event) => setHours(event.target.value)} className="form-input hidden md:block">
            {hourOptions.map((value) => (
              <option key={value} value={value}>
                {value === 'custom' ? '4+ hours · custom quote' : `${value} hour${value === '1' ? '' : 's'}`}
              </option>
            ))}
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

      {mobilePicker ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-3 md:hidden">
          <div className="flex max-h-[min(80vh,680px)] w-full max-w-sm flex-col overflow-hidden rounded-[24px] border border-white/10 bg-night-900 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-white">{mobilePickerTitle}</p>
                <p className="mt-1 text-xs text-white/45">Tap one option to update the estimate.</p>
              </div>
              <button
                type="button"
                onClick={() => setMobilePicker(null)}
                className="rounded-full border border-white/10 p-2 text-white/55 transition hover:text-white"
                aria-label="Close picker"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-3">
              {mobilePicker === 'group_size'
                ? groupSizeOptions.map((option) => {
                    const isActive = option.value === groupSize
                    return (
                      <button
                        key={option.value || 'placeholder'}
                        type="button"
                        onClick={() => {
                          setGroupSize(option.value)
                          setMobilePicker(null)
                        }}
                        className={`mb-2 flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                          isActive
                            ? 'border-gold-500/40 bg-gold-500/10'
                            : 'border-white/10 bg-white/[0.03]'
                        }`}
                      >
                        <span className="text-base font-semibold text-white">{option.label}</span>
                        {isActive ? <Check className="h-5 w-5 shrink-0 text-gold-300" /> : null}
                      </button>
                    )
                  })
                : mobilePicker === 'pickup_location'
                ? pickupLocationOptions.map((option) => {
                    const isActive = option.value === pickupLocation
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setPickupLocation(option.value)
                          setMobilePicker(null)
                        }}
                        className={`mb-2 flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                          isActive
                            ? 'border-gold-500/40 bg-gold-500/10'
                            : 'border-white/10 bg-white/[0.03]'
                        }`}
                      >
                        <span className="text-base font-semibold text-white">{option.label}</span>
                        {isActive ? <Check className="h-5 w-5 shrink-0 text-gold-300" /> : null}
                      </button>
                    )
                  })
                : mobilePicker === 'vehicle'
                ? filteredVehicles.map((vehicle) => {
                    const isActive = vehicle.slug === vehicleSlug
                    return (
                      <button
                        key={vehicle.slug}
                        type="button"
                        onClick={() => {
                          setVehicleSlug(vehicle.slug)
                          setMobilePicker(null)
                        }}
                        className={`mb-2 flex w-full items-start justify-between rounded-2xl border px-4 py-4 text-left transition ${
                          isActive
                            ? 'border-gold-500/40 bg-gold-500/10'
                            : 'border-white/10 bg-white/[0.03]'
                        }`}
                      >
                        <div>
                          <div className="text-base font-semibold text-white">{vehicle.name}</div>
                          <div className="mt-1 text-sm text-gold-400">Up to {vehicle.seats} passengers</div>
                        </div>
                        {isActive ? <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" /> : null}
                      </button>
                    )
                  })
                : hourOptions.map((value) => {
                    const isActive = value === hours
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setHours(value)
                          setMobilePicker(null)
                        }}
                        className={`mb-2 flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                          isActive
                            ? 'border-gold-500/40 bg-gold-500/10'
                            : 'border-white/10 bg-white/[0.03]'
                        }`}
                      >
                        <span className="text-base font-semibold text-white">
                          {value === 'custom' ? '4+ hours · custom quote' : `${value} hour${value === '1' ? '' : 's'}`}
                        </span>
                        {isActive ? <Check className="h-5 w-5 shrink-0 text-gold-300" /> : null}
                      </button>
                    )
                  })}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-6">
        <div className="rounded-2xl border border-gold-500/15 bg-night-900/70 p-5 sm:p-6">
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

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <div className="flex items-center justify-between gap-4 text-sm text-white/65">
                <span>Billable hours</span>
                <span className="font-semibold text-white">{isCustomHours ? 'Custom' : estimate.effectiveHours}</span>
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.18em] text-gold-300">Estimated Total</p>
              {!isCustomHours && estimate.totalEstimate ? (
                <>
                  <p className="mt-3 font-display text-4xl font-bold text-white">
                    {formatCurrency(estimate.totalEstimate)}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">
                    {pickupLocation === 'airport'
                      ? 'Airport pricing is applied for this estimate, including the LAS-specific rate adjustment.'
                      : 'This is the customer-facing estimate for the selected vehicle, hours, and date.'}
                  </p>
                </>
              ) : (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/55">
                  {pickupLocation === 'off-strip'
                    ? 'Off-strip pickups need custom routing review. Use the quote form below and we’ll confirm the cleanest price.'
                    : isCustomHours
                    ? 'For 4+ hours, tell us your route and timing below and we’ll confirm the cleanest custom quote.'
                    : 'Pricing for this vehicle is quote-based. Use the form below and we’ll price it manually.'}
                </div>
              )}
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
            <div className="lg:col-span-2">
              <p className="text-xs leading-relaxed text-white/35">
                Estimate excludes gratuity, parking, airport-specific charges, venue-specific fees, and any
                routing requirements outside standard service.
              </p>
              <Link href="#reserve" className="btn-gold mt-6 inline-flex w-full items-center justify-center sm:w-auto">
                Continue to Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
