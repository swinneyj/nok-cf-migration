'use client'

import { useState } from 'react'
import { ExternalLink, Star, X } from 'lucide-react'

interface ReviewProofStripProps {
  centered?: boolean
  compact?: boolean
  className?: string
}

const basePillClassName =
  'inline-flex items-center justify-center rounded-full border border-gold-500/20 bg-night-900/60 px-4 py-2 text-xs font-medium text-white/80 transition-colors hover:border-gold-400/35 hover:text-white'

const featuredReviews = [
  {
    quote:
      "Justin's customer service is top tier. He always takes care of me and my group in Vegas.",
    attribution: 'Patrick A. · Yelp',
  },
  {
    quote:
      'Phenomenal experience. They answered all my questions and replied to texts on the spot.',
    attribution: 'Tam T. · Google',
  },
  {
    quote:
      'Super responsive and attentive. They set up a seamless club experience from start to finish.',
    attribution: 'Phillip G. · Yelp',
  },
]

export default function ReviewProofStrip({
  centered = false,
  compact = false,
  className = '',
}: ReviewProofStripProps) {
  const [isOpen, setIsOpen] = useState(false)

  const buttonClassName = `${basePillClassName} ${compact ? 'px-3 py-1.5 text-[11px]' : ''}`.trim()

  return (
    <>
      <div
        className={`flex flex-wrap gap-3 ${centered ? 'justify-center' : ''} ${compact ? 'gap-2' : ''} ${className}`.trim()}
      >
        <button type="button" onClick={() => setIsOpen(true)} className={buttonClassName}>
          4.9 Yelp Rating
        </button>
        <button type="button" onClick={() => setIsOpen(true)} className={buttonClassName}>
          200+ Google Reviews
        </button>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4">
          <div className="relative max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-[28px] border border-gold-500/20 bg-night-900 shadow-[0_28px_80px_rgba(0,0,0,0.55)]">
            <div className="border-b border-white/10 bg-gradient-to-r from-night-900 via-night-900 to-gold-500/5 px-6 py-5 sm:px-8">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-5 top-5 rounded-full border border-white/10 p-2 text-white/60 transition hover:border-white/20 hover:text-white"
                aria-label="Close reviews"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="section-eyebrow mb-3">Trusted by Vegas Guests</div>
              <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
                Real Reviews, Not Just Badges
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
                Nokturnal Lifestyle has built its reputation on fast communication, real in-person hosting,
                and smooth VIP experiences across Las Vegas nightlife and daylife.
              </p>
            </div>

            <div className="max-h-[calc(85vh-120px)] overflow-y-auto px-6 py-6 sm:px-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gold-500/20 bg-gold-500/5 p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4 text-gold-400" />
                    <span className="text-sm font-semibold text-white">Yelp</span>
                  </div>
                  <div className="font-display text-3xl font-bold text-white">4.9</div>
                  <p className="mt-1 text-sm text-white/50">Consistently high-rated service on Yelp</p>
                </div>

                <div className="rounded-2xl border border-gold-500/20 bg-gold-500/5 p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4 text-gold-400" />
                    <span className="text-sm font-semibold text-white">Google</span>
                  </div>
                  <div className="font-display text-3xl font-bold text-white">200+</div>
                  <p className="mt-1 text-sm text-white/50">Verified Google reviews from real guests</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {featuredReviews.map((review) => (
                  <div
                    key={review.attribution}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="mb-3 text-gold-400">★★★★★</div>
                    <p className="text-sm leading-relaxed text-white/80">&ldquo;{review.quote}&rdquo;</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/35">
                      {review.attribution}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://www.yelp.com/biz/nokturnal-lifestyle-las-vegas-2"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost flex items-center justify-center gap-2 text-sm"
                >
                  Read on Yelp
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href="https://share.google/M5ybGfWgTTxWOSW9Y"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-gold flex items-center justify-center gap-2 text-sm"
                >
                  Read on Google
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
