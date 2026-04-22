import reviewLibrary from '@/data/reviews/venueReviewLibrary.json'

export interface VenueReview {
  id: string
  name: string
  date: string
  location: string
  rating: number
  text: string
  source?: string
  venueSlugs?: string[]
  matchedTerms?: string[]
  categoryTags?: string[]
  priority?: number
}

interface VenueFallbackProfile {
  keywordBonuses?: Array<{ pattern: RegExp; score: number }>
}

const venueCategoryMap: Record<string, string[]> = {
  'xs-nightclub': ['nightclub'],
  'hakkasan-nightclub': ['nightclub'],
  'omnia': ['nightclub'],
  'omnia-nightclub': ['nightclub'],
  'marquee-nightclub': ['nightclub'],
  'tao-nightclub': ['nightclub'],
  'zouk-nightclub': ['nightclub'],
  'liv-nightclub': ['nightclub'],
  'drais-nightclub': ['nightclub'],
  'jewel-nightclub': ['nightclub'],
  'ebc-at-night': ['nightclub'],
  'surrender-nightclub': ['nightclub'],
  'encore-beach-club': ['dayclub'],
  'marquee-dayclub': ['dayclub'],
  'omnia-dayclub': ['dayclub'],
  'liv-beach-club': ['dayclub'],
  'ayu-dayclub': ['dayclub'],
  'elia-beach-club': ['dayclub'],
  'drais-beach-club': ['dayclub'],
  'wet-republic': ['dayclub'],
  'tao-beach': ['dayclub'],
  sapphire: ['stripclub'],
  'crazy-horse-3': ['stripclub'],
  palomino: ['stripclub'],
  'little-darlings': ['stripclub'],
  hustler: ['stripclub'],
  'hustler-club': ['stripclub'],
  spearmint: ['stripclub'],
  'spearmint-rhino': ['stripclub'],
}

const reviews = reviewLibrary as VenueReview[]

const venueSlugAliases: Record<string, string> = {
  omnia: 'omnia-nightclub',
  hakkasan: 'hakkasan-nightclub',
}

const venueFallbackProfiles: Record<string, VenueFallbackProfile> = {
  'omnia-nightclub': {
    keywordBonuses: [
      { pattern: /\bVIP table\b/i, score: 70 },
      { pattern: /\bsaved us .* money\b/i, score: 60 },
      { pattern: /\bdrinks\b/i, score: 30 },
      { pattern: /\bhost\b/i, score: 20 },
      { pattern: /\bclubs?\b/i, score: 15 },
    ],
  },
  'hakkasan-nightclub': {
    keywordBonuses: [
      { pattern: /\bHakkasan\b/i, score: 120 },
      { pattern: /\bgroup\b/i, score: 35 },
      { pattern: /\b10 or more\b/i, score: 40 },
      { pattern: /\bgot in no problem\b/i, score: 35 },
      { pattern: /\bguest list\b/i, score: 30 },
      { pattern: /\bVIP table\b/i, score: 55 },
    ],
  },
  'marquee-nightclub': {
    keywordBonuses: [
      { pattern: /\bMarquee\b/i, score: 120 },
      { pattern: /\bbottle service\b/i, score: 50 },
      { pattern: /\bmet us at both venues\b/i, score: 35 },
      { pattern: /\bclub\b/i, score: 20 },
    ],
  },
  'tao-nightclub': {
    keywordBonuses: [
      { pattern: /\bTAO\b/i, score: 120 },
      { pattern: /\bnightclub\b/i, score: 35 },
      { pattern: /\ball of our events\b/i, score: 20 },
      { pattern: /\bweekend\b/i, score: 10 },
    ],
  },
  'zouk-nightclub': {
    keywordBonuses: [
      { pattern: /\bZouk\b/i, score: 120 },
      { pattern: /\bexpress lane\b/i, score: 45 },
      { pattern: /\bbest weekend ever\b/i, score: 30 },
      { pattern: /\bbachelor party\b/i, score: 20 },
    ],
  },
  'encore-beach-club': {
    keywordBonuses: [
      { pattern: /\bEncore Beach Club\b/i, score: 120 },
      { pattern: /\bcabana\b/i, score: 40 },
      { pattern: /\bday party\b/i, score: 30 },
      { pattern: /\bpool\b/i, score: 25 },
    ],
  },
  'drais-nightclub': {
    keywordBonuses: [
      { pattern: /\brooftop\b/i, score: 35 },
      { pattern: /\bhip hop\b/i, score: 30 },
      { pattern: /\bnightclub\b/i, score: 25 },
      { pattern: /\bVIP table\b/i, score: 35 },
    ],
  },
  'liv-nightclub': {
    keywordBonuses: [
      { pattern: /\bnightclub\b/i, score: 30 },
      { pattern: /\bVIP\b/i, score: 20 },
      { pattern: /\btable\b/i, score: 20 },
      { pattern: /\bgroup\b/i, score: 15 },
    ],
  },
}

function normalizeVenueSlug(venueSlug: string) {
  return venueSlugAliases[venueSlug] ?? venueSlug
}

function getReviewScore(review: VenueReview, venueSlug: string) {
  const normalizedVenueSlug = normalizeVenueSlug(venueSlug)
  let score = review.priority ?? 0
  const reviewText = review.text ?? ''

  if (review.venueSlugs?.includes(normalizedVenueSlug)) {
    score += 1000
  }

  const categories = venueCategoryMap[normalizedVenueSlug] ?? ['general']
  if (review.categoryTags?.some((tag) => categories.includes(tag))) {
    score += 100
  }

  if (review.categoryTags?.includes('general')) {
    score += 10
  }

  const fallbackProfile = venueFallbackProfiles[normalizedVenueSlug]
  if (fallbackProfile?.keywordBonuses) {
    for (const bonus of fallbackProfile.keywordBonuses) {
      if (bonus.pattern.test(reviewText)) {
        score += bonus.score
      }
    }
  }

  return score
}

export function getVenueReviews(venueSlug: string, limit = 3) {
  return [...reviews]
    .sort((a, b) => getReviewScore(b, venueSlug) - getReviewScore(a, venueSlug))
    .slice(0, limit)
}

export function hasExactVenueReviews(venueSlug: string) {
  const normalizedVenueSlug = normalizeVenueSlug(venueSlug)
  return reviews.some((review) => review.venueSlugs?.includes(normalizedVenueSlug))
}

export function getExactVenueReviewCount(venueSlug: string) {
  const normalizedVenueSlug = normalizeVenueSlug(venueSlug)
  return reviews.filter((review) => review.venueSlugs?.includes(normalizedVenueSlug)).length
}
