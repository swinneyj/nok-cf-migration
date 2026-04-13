import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.nokturnallifestyle.com'
  const now = new Date()

  const routes = [
    { url: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { url: '/bachelor', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/bachelorette', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/party-buses', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/bottle-service', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/nightclubs', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/pool-parties', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/strip-clubs', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/about', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/blog', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/blog/las-vegas-bottle-service-cost', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/blog/best-las-vegas-nightclubs-2026', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/blog/las-vegas-bachelor-party-planning-guide', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/blog/xs-nightclub-vs-hakkasan', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/blog/las-vegas-pool-party-guide', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/blog/las-vegas-party-bus-guide', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/blog/las-vegas-pool-party-outfit-guide', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/blog/las-vegas-nightclub-dress-code', priority: 0.8, changeFrequency: 'monthly' as const },
    // Nightclub venue pages
    { url: '/places/xs-nightclub', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/places/hakkasan', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/places/omnia', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/places/marquee-nightclub', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/places/tao-nightclub', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/places/zouk-nightclub', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/places/liv-nightclub', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/places/drais-nightclub', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/places/jewel-nightclub', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/places/ebc-at-night', priority: 0.7, changeFrequency: 'monthly' as const },
    // Pool party venue pages
    { url: '/places/encore-beach-club', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/places/marquee-dayclub', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/places/omnia-dayclub', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/places/liv-beach-club', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/places/ayu-dayclub', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/places/kassi-beach-club', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/places/liquid-pool-lounge', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/places/stadium-swim', priority: 0.6, changeFrequency: 'monthly' as const },
    // Strip clubs
    { url: '/places/crazy-horse-3', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/places/sapphire', priority: 0.7, changeFrequency: 'monthly' as const },
    // Lounges
    { url: '/lounges', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/places/bottled-blonde', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/places/ghostbar', priority: 0.6, changeFrequency: 'monthly' as const },
    // Service pages
    { url: '/services/club-crawl-las-vegas', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/services/birthday-party-las-vegas', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/services/las-vegas-nightclubs-monday', priority: 0.6, changeFrequency: 'monthly' as const },
  ]

  return routes.map(({ url, priority, changeFrequency }) => ({
    url: `${base}${url}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))
}
