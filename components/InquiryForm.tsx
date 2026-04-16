'use client'

import { useCallback, useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import ReviewProofStrip from '@/components/ReviewProofStrip'
import TurnstileField, { type TurnstileStatus } from '@/components/TurnstileField'

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
  const [turnstileStatus, setTurnstileStatus] = useState<TurnstileStatus>('loading')
  const [turnstileMessage, setTurnstileMessage] = useState('Loading spam protection...')

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
  const handleTurnstileStatusChange = useCallback((status: TurnstileStatus, message?: string | null) => {
    setTurnstileStatus(status)
    setTurnstileMessage(message ?? '')
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
          Our team will respond within 30 minutes during business hours (9am – Midnight, 7 days a week).
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

      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
        <div>
          <label className="block text-white/50 text-xs uppercase tracking-wider mb-1.5">
            Event Type
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setMobilePicker(mobilePicker === 'event_type' ? null : 'event_type')}
              className="form-input w-full text-left flex items-center justify-between"
            >
              {selectedEventTypeLabel}
              <ChevronDown size={16} />
            </button>
            {mobilePicker === 'event_type' && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-night-900 border border-gold-400/20 rounded-lg z-10 max-h-48 overflow-y-auto">
                {eventTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setEventType(option.value)
                      setMobilePicker(null)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gold-400/10 text-white text-sm"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
            <select
              name="event_type"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="absolute inset-0 opacity-0 form-input"
            />
          </div>
        </div>
        {!hideGroupSize && (
          <div>
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-1.5">
              Group Size
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMobilePicker(mobilePicker === 'group_size' ? null : 'group_size')}
                className="form-input w-full text-left flex items-center justify-between"
              >
                {selectedGroupSizeLabel}
                <ChevronDown size={16} />
              </button>
              {mobilePicker === 'group_size' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-night-900 border border-gold-400/20 rounded-lg z-10 max-h-48 overflow-y-auto">
                  {groupSizeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setGroupSize(option.value)
                        setMobilePicker(null)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gold-400/10 text-white text-sm"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
              <select
                name="group_size"
                value={groupSize}
                onChange={(e) => setGroupSize(e.target.value)}
                className="absolute inset-0 opacity-0 form-input"
              />
            </div>
          </div>
        )}
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
        key={turnstileResetKey}
        onTokenChange={handleTurnstileTokenChange}
        onStatusChange={handleTurnstileStatusChange}
      />

      <button
        type="submit"
        disabled={loading || turnstileStatus === 'loading'}
        className="btn-gold w-full text-center py-4 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending...' : 'Get My Free Quote →'}
      </button>

      <p className="text-white/25 text-xs text-center">
        No commitment required · Typically respond in under 30 min
      </p>

      <ReviewProofStrip />
    </form>
  )
}
