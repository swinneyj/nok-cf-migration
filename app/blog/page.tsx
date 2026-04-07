import type { Metadata } from 'next'
import Link from 'next/link'
import { posts } from './generated-posts'

export const metadata: Metadata = {
  title: 'Las Vegas Nightlife Blog | VIP Tips, Venue Guides & Party Planning',
  description:
    'Expert Las Vegas nightlife guides from Nokturnal Lifestyle Concierge. Bottle service prices, club comparisons, bachelor party tips, pool party guides and more.',
  alternates: { canonical: 'https://www.nokturnallifestyle.com/blog' },
}

export default function BlogPage() {
  return (
    <>
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="section-eyebrow mb-4">The Nokturnal Blog</div>
          <h1 className="font-display text-white font-bold mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Las Vegas Nightlife Guides
          </h1>
          <p className="text-white/55 text-lg">
            Expert advice from 8+ years of planning Vegas nightlife. Venue breakdowns, pricing guides,
            and insider tips you won't find anywhere else.
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card-dark flex flex-col sm:flex-row overflow-hidden group"
            >
              <div className="sm:w-64 flex-shrink-0 h-48 sm:h-auto overflow-hidden">
                <img
                  src={post.image}
                  alt={post.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <span className="section-eyebrow text-[10px]">{post.category}</span>
                  <span className="text-white/25 text-xs">·</span>
                  <span className="text-white/35 text-xs">{post.date}</span>
                  <span className="text-white/25 text-xs">·</span>
                  <span className="text-white/35 text-xs">{post.readTime}</span>
                </div>
                <h2 className="font-display text-white font-bold text-lg leading-snug mb-3 group-hover:text-gold-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-white/50 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                <div className="mt-4 text-gold-400 text-xs font-semibold uppercase tracking-wider">
                  Read Article →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-xl mx-auto card-dark p-10">
          <div className="section-eyebrow mb-3">Skip the Research</div>
          <h2 className="font-display text-white font-bold text-2xl mb-4">
            Just tell us what you want — we'll handle it.
          </h2>
          <p className="text-white/50 text-sm mb-6">
            Justin has done this thousands of times. One call and your entire night is planned.
          </p>
          <Link href="/contact" className="btn-gold">Get a Free Quote</Link>
        </div>
      </section>
    </>
  )
}
