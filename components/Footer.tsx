import Link from 'next/link'
import { Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react'

const packageLinks = [
  { label: 'Bachelor Parties', href: '/bachelor' },
  { label: 'Bachelorette Parties', href: '/bachelorette' },
  { label: 'Birthday Parties', href: '/services/birthday-party-las-vegas' },
  { label: 'Bottle Service', href: '/bottle-service' },
  { label: 'Nightclubs', href: '/nightclubs' },
  { label: 'Pool Parties', href: '/pool-parties' },
  { label: 'Party Buses', href: '/party-buses' },
  { label: 'Strip Clubs', href: '/strip-clubs' },
  { label: 'Lounges', href: '/lounges' },
]

const venueLinks = [
  'XS Nightclub', 'Hakkasan', 'Omnia', 'Marquee', 'TAO Nightclub',
  "Drai's", 'Zouk', 'LIV Nightclub', 'Jewel', 'Encore Beach Club',
  'Marquee Dayclub', 'Omnia Dayclub', 'LIV Beach Club', 'AYU Dayclub',
]

export default function Footer() {
  return (
    <footer className="bg-night-800 border-t border-gold-500/10">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="font-display text-white font-bold text-xl mb-1">Nokturnal</div>
            <div className="text-gold-500 text-[9px] tracking-[0.3em] uppercase font-semibold mb-4">
              Lifestyle Concierge
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Las Vegas' premier VIP concierge service. We've been curating unforgettable
              nightlife experiences for over 8 years.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: 'https://instagram.com/nokturnallifestyle', label: 'Instagram' },
                { icon: Facebook, href: 'https://facebook.com/nokturnallifestyle', label: 'Facebook' },
                { icon: Twitter, href: 'https://twitter.com/nokturnallife', label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-gold-500/20 flex items-center justify-center text-white/40 hover:text-gold-400 hover:border-gold-500/50 transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Packages */}
          <div>
            <h3 className="section-eyebrow mb-5">Packages</h3>
            <ul className="space-y-2.5">
              {packageLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-gold-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Venues */}
          <div>
            <h3 className="section-eyebrow mb-5">Top Venues</h3>
            <ul className="space-y-2.5">
              {venueLinks.map((venue) => (
                <li key={venue}>
                  <span className="text-white/50 text-sm">{venue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="section-eyebrow mb-5">Get in Touch</h3>
            <div className="space-y-4">
              <a
                href="tel:+17029964884"
                className="flex items-center gap-3 text-white/60 hover:text-gold-400 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center group-hover:border-gold-500/50 transition-colors">
                  <Phone size={13} className="text-gold-500" />
                </div>
                <span className="text-sm">(702) 996-4884</span>
              </a>
              <a
                href="mailto:sales@nokturnallifestyle.com"
                className="flex items-center gap-3 text-white/60 hover:text-gold-400 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center group-hover:border-gold-500/50 transition-colors">
                  <Mail size={13} className="text-gold-500" />
                </div>
                <span className="text-sm">sales@nokturnallifestyle.com</span>
              </a>
              <div className="pt-2">
                <div className="text-white/30 text-xs mb-1">Based in Las Vegas, NV</div>
                <div className="text-white/30 text-xs">Available 7 days · 9am – Midnight</div>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/contact" className="btn-gold text-xs py-3 px-6 block text-center">
                Plan My Experience
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} Nokturnal Lifestyle Concierge. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Contact'].map((label) => (
              <Link
                key={label}
                href={`/${label.toLowerCase().replace(/ /g, '-')}`}
                className="text-white/25 hover:text-white/50 text-xs transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
