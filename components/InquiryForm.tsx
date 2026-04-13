'use client'

import { useState } from 'react'

interface InquiryFormProps {
  defaultPackage?: string
  compact?: boolean
}

export default function InquiryForm({ defaultPackage = '', compact = false }: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      const res = await fetch('https://formspree.io/f/mvzvobod', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      })
      if (res.ok) {
        setSubmitted(true)
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
          <select name="event_type" defaultValue={defaultPackage} className="form-input">
            <option value="">Select a package...</option>
            <option value="bachelor">Bachelor Party</option>
            <option value="bachelorette">Bachelorette Party</option>
            <option value="birthday">Birthday Celebration</option>
            <option value="bottle">Bottle Service</option>
            <option value="nightclub">Nightclub Package</option>
            <option value="pool">Pool Party / Dayclub</option>
            <option value="partybus">Party Bus / Transportation</option>
            <option value="strip">Strip Club Package</option>
            <option value="custom">Custom Package</option>
          </select>
        </div>
        <div>
          <label className="block text-white/50 text-xs uppercase tracking-wider mb-1.5">
            Group Size
          </label>
          <select name="group_size" className="form-input">
            <option value="">How many people?</option>
            <option value="2-4">2–4 people</option>
            <option value="5-8">5–8 people</option>
            <option value="9-15">9–15 people</option>
            <option value="16-25">16–25 people</option>
            <option value="25+">25+ people</option>
          </select>
        </div>
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

      <button
        type="submit"
        disabled={loading}
        className="btn-gold w-full text-center py-4 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending...' : 'Get My Free Quote →'}
      </button>

      <p className="text-white/25 text-xs text-center">
        No commitment required · Typically respond in under 30 min
      </p>
    </form>
  )
}
