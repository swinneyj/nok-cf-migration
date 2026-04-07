import Link from 'next/link'
import { Check } from 'lucide-react'

interface PackageCardProps {
  title: string
  price: string
  priceLabel?: string
  image: string
  imageAlt: string
  includes: string[]
  href: string
  badge?: string
  rating?: number
  reviewCount?: number
}

export default function PackageCard({
  title,
  price,
  priceLabel = '/person',
  image,
  imageAlt,
  includes,
  href,
  badge,
  rating = 4.9,
  reviewCount = 47,
}: PackageCardProps) {
  return (
    <div className="card-dark flex flex-col overflow-hidden">
      {/* Image */}
      <div className="pkg-img-wrap relative h-52">
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {badge && (
          <div className="absolute top-3 left-3 bg-gold-500 text-black text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
            {badge}
          </div>
        )}
        {/* Price chip */}
        <div className="absolute bottom-3 right-3 bg-night-900/90 border border-gold-500/30 rounded px-3 py-1.5">
          <span className="text-gold-400 font-display font-bold text-lg">{price}</span>
          <span className="text-white/40 text-xs">{priceLabel}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="stars flex gap-0.5 text-sm">
            {'★'.repeat(5)}
          </div>
          <span className="text-white/40 text-xs">{rating} ({reviewCount} reviews)</span>
        </div>

        <h3 className="font-display text-white font-bold text-lg mb-3 leading-snug">{title}</h3>

        {/* Includes */}
        <ul className="space-y-1.5 mb-5 flex-1">
          {includes.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-white/60">
              <Check size={13} className="text-gold-500 flex-shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex gap-2">
          <Link href={href} className="btn-gold flex-1 text-center text-xs py-3">
            View Package
          </Link>
          <a
            href="tel:+17029964884"
            className="btn-ghost text-xs py-3 px-4"
          >
            Call
          </a>
        </div>
      </div>
    </div>
  )
}
