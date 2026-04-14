'use client'

import { useCallback, useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import ReviewProofStrip from '@/components/ReviewProofStrip'
import TurnstileField from '@/components/TurnstileField'

interface InquiryFormProps {
  defaultPackage?: string
  compact?: boolean
  hideGroupSize?: boolean
}

export default function InquiryForm({
  defaultPackage = '',
  compact = false,
  hideGroupSize = false,
}: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [eventType, setEventType] = useState(defaultPackage)
  const [groupSize, setGroupSize] = useState('')
  const [mobilePicker, setMobilePicker] = useState<'event_type' | 'group_size' | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileResetKey, setTurnstileResetKey] = useState(0)

  const eventTypeOptions = [
    { value: '', label: 'Select a package...' },
    { value: 'bachelor', label: 'Bachelor Party' },
    { value: 'bachelorette', label: 'Bachelorette Party' },
    { value: 'birthday', label: 'Birthday Celebration' },
    { value: 'bottle', label: 'Bottle Service' },
    { value: 'nightclub', label: 'Nightclub Package' },
    { value: 'pool', label: 'Pool Party / Dayclub' },
    { value: 'partybus', label: 'Party Bus / Transportation' },
    { value: 'strip', label: 'Strip Club Package' },
    { value: 'custom', label: 'Custom Package' },
  ]

  const groupSizeOptions = [
    { value: '', label: 'How many people?' },
    { value: '2-4', label: '2–4 people' },
    { value: '5-8', label: '5–8 people' },
    { value: '9-15', label: '9–15 people' },
    { value: '16-25', label: '16–25 people' },
    { value: '25+', label: '25+ people' },
  ]

  const selectedEventTypeLabel = eventTypeOptions.find((option) => option.value === eventType)?.label ?? 'Select a package...'
  const selectedGroupSizeLabel = groupSizeOptions.find((option) => option.value === groupSize)?.label ?? 'How many people?'
  const handleTurnstileTokenChange = useCallback((token: string | null) => {
    setTurnstileToken(token)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (!turnstileToken) {
        alert('Please complete the spam protection check.')
        setLoading(false)
        return
      }

      const formData = new FormData(e.currentTarget)
      const payload = Object.fromEntries(formData.entries())
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          event_type: eventType,
          group_size: groupSize,
          turnstileToken,
        }),
      })
      if (res.ok) {
        setSubmitted(true)
        setTurnstileResetKey((current) => current + 1)
        setTurnstileToken(null)
      } else {
        alert('Something went wrong. Please call us at (702) 996-4884.')
      }
    } catch {
      alert('Something went wrong. Please call us at (702) 996-4884.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-gold-400 text-4xl mb-4">✓</div>
        <h3 className="font-display text-white text-xl font-bold mb-2">We'll be in touch shortly!</h3>
        <p className="text-white/50 text-sm">
          Justin usually responds within 30 minutes during business hours.
          For urgent requests, call{' '}
          <a href="tel:+17029964884" className="text-gold-400 hover:underline">(702) 996-4884</a>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="event_type" value={eventType} />
      {hideGroupSize ? <input type="hidden" name="group_size" value={groupSize} /> : null}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
        <div>
          <label className="block text-white/50 text-xs uppercase tracking-wider mb-1.5">
            Your Name *
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="John Smith"
            className="form-input"
          />
        </div>
        <div>
          <label className="block text-white/50 text-xs uppercase tracking-wider mb-1.5">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            required
            placeholder="(555) 000-0000"
            className="form-input"
          />
        </div>
      </div>

      <div>
        <label className="block text-white/50 text-xs uppercase tracking-wider mb-1.5">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          required
          placeholder="john@email.com"
          className="form-input"
        />
      </div>

      <div className={`grid gap-4 ${compact || hideGroupSize ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
        <div>
          <label className="block text-white/50 text-xs uppercase tracking-wider mb-1.5">
            Event Type
          </label>
          <button
            type="button"
            onClick={() => setMobilePicker('event_type')}
            className="form-input flex items-center justify-between text-left md:hidden"
          >
            <span className="truncate pr-3">{selectedEventTypeLabel}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-white/55" />
          </button>
          <select
            value={eventType}
            onChange={(event) => setEventType(event.target.value)}
            className="form-input hidden md:block"
          >
            {eventTypeOptions.map((option) => (
              <option key={option.value || 'placeholder'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {!hideGroupSize ? (
          <div>
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-1.5">
              Group Size
            </label>
            <button
              type="button"
              onClick={() => setMobilePicker('group_size')}
              className="form-input flex items-center justify-between text-left md:hidden"
            >
              <span>{selectedGroupSizeLabel}</span>
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
        ) : null}
      </div>

      <div>
        <label className="block text-white/50 text-xs uppercase tracking-wider mb-1.5">
          Event Date
        </label>
        <input
          type="date"
          name="event_date"
          className="form-input"
        />
      </div>

      {!compact && (
        <div>
          <label className="block text-white/50 text-xs uppercase tracking-wider mb-1.5">
            Tell us about your vision
          </label>
          <textarea
            name="message"
            rows={4}
            placeholder="What are you looking for? Any specific venues, activities, or requests?"
            className="form-input resize-none"
          />
        </div>
      )}

      <TurnstileField
        onTokenChange={handleTurnstileTokenChange}
        resetKey={turnstileResetKey}
      />

      <button
        type="submit"
        disabled={loading || !turnstileToken}
        className="btn-gold w-full text-center py-4 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending...' : 'Get My Free Quote →'}
      </button>

      <div className="flex justify-center">
        <ReviewProofStrip compact centered />
      </div>

      <p className="text-white/25 text-xs text-center">
        No commitment required · Typically respond in under 30 min
      </p>

      {mobilePicker ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-3 md:hidden">
          <div className="flex max-h-[min(80vh,680px)] w-full max-w-sm flex-col overflow-hidden rounded-[24px] border border-white/10 bg-night-900 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  {mobilePicker === 'event_type' ? 'Choose Event Type' : 'Choose Group Size'}
                </p>
                <p className="mt-1 text-xs text-white/45">Tap one option to update the form.</p>
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
              {(mobilePicker === 'event_type' ? eventTypeOptions : groupSizeOptions).map((option) => {
                const isActive =
                  mobilePicker === 'event_type' ? option.value === eventType : option.value === groupSize

                return (
                  <button
                    key={`${mobilePicker}-${option.value || 'placeholder'}`}
                    type="button"
                    onClick={() => {
                      if (mobilePicker === 'event_type') {
                        setEventType(option.value)
                      } else {
                        setGroupSize(option.value)
                      }
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
              })}
            </div>
          </div>
        </div>
      ) : null}
    </form>
  )
}
