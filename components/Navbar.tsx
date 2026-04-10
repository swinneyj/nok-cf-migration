'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, Menu, X, ChevronDown } from 'lucide-react'

const navLinks = [
  {
    label: 'Packages',
    href: '#',
    children: [
      { label: 'Bachelor Parties', href: '/bachelor' },
      { label: 'Bachelorette Parties', href: '/bachelorette' },
      { label: 'Birthday Parties', href: '/services/birthday-party-las-vegas' },
      { label: 'Bottle Service', href: '/bottle-service' },
      { label: 'Club Crawl', href: '/services/club-crawl-las-vegas' },
    ],
  },
  {
    label: 'Nightclubs',
    href: '/nightclubs',
    children: [
      { label: 'XS Nightclub', href: '/places/xs-nightclub' },
      { label: 'Hakkasan', href: '/places/hakkasan' },
      { label: 'Omnia', href: '/places/omnia' },
      { label: 'Marquee Nightclub', href: '/places/marquee-nightclub' },
      { label: 'TAO Nightclub', href: '/places/tao-nightclub' },
      { label: 'Zouk', href: '/places/zouk-nightclub' },
      { label: 'LIV Nightclub', href: '/places/liv-nightclub' },
      { label: "Drai's Nightclub", href: '/places/drais-nightclub' },
      { label: 'Jewel Nightclub', href: '/places/jewel-nightclub' },
      { label: 'EBC at Night', href: '/places/ebc-at-night' },
    ],
  },
  {
    label: 'Pool Parties',
    href: '/pool-parties',
    children: [
      { label: 'Encore Beach Club', href: '/places/encore-beach-club' },
      { label: 'Marquee Dayclub', href: '/places/marquee-dayclub' },
      { label: 'Omnia Dayclub', href: '/places/omnia-dayclub' },
      { label: 'LIV Beach Club', href: '/places/liv-beach-club' },
      { label: 'AYU Dayclub', href: '/places/ayu-dayclub' },
      { label: 'Palm Tree Beach Club', href: '/places/palm-tree-beach-club' },
      { label: 'Kassi Beach Club', href: '/places/kassi-beach-club' },
      { label: 'Liquid Pool Lounge', href: '/places/liquid-pool-lounge' },
      { label: 'Stadium Swim', href: '/places/stadium-swim' },
    ],
  },
  {
    label: 'More',
    href: '#',
    children: [
      { label: 'Strip Clubs', href: '/strip-clubs' },
      { label: 'Lounges', href: '/lounges' },
      { label: 'Party Buses', href: '/bachelor' },
      { label: 'Club Crawl', href: '/services/club-crawl-las-vegas' },
    ],
  },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'navbar-blur bg-night-900/90 border-b border-gold-500/10 py-3'
          : 'bg-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full border border-gold-500/40 flex items-center justify-center bg-gold-500/10 group-hover:border-gold-400 transition-colors">
                <span className="text-gold-400 font-display font-bold text-sm">N</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-display text-white font-bold text-base leading-tight tracking-wide">
                  Nokturnal
                </div>
                <div className="text-gold-500 text-[9px] tracking-[0.3em] uppercase font-sans font-semibold">
                  Lifestyle Concierge
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className="flex items-center gap-1 px-4 py-2 text-sm text-white/80 hover:text-white transition-colors font-medium">
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''
                          }`}
                      />
                    </button>
                    {openDropdown === link.label && (
                      <div className="absolute top-full left-0 pt-2">
                        <div className="bg-night-800 border border-gold-500/15 rounded-lg py-2 min-w-[200px] shadow-2xl">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              prefetch={false}
                              scroll={true}
                              className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-gold-500/10 transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    scroll={true}
                    className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="tel:+17029964884"
                className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors text-sm font-semibold"
              >
                <Phone size={15} />
                (702) 996-4884
              </a>
              <Link href="/contact" className="btn-gold text-xs py-2.5 px-5">
                Book Now
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-white"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        <div
          className="absolute inset-0 bg-night-900/95 navbar-blur"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-screen w-80 bg-night-800 border-l border-gold-500/10 pt-20 px-6 transition-transform duration-300 overflow-y-auto ${mobileOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <nav className="flex flex-col gap-1 pb-8">
            {navLinks.map((link) => (
              <div key={link.label}>
                {link.children ? (
                  <>
                    <div className="section-eyebrow pt-4 pb-2">{link.label}</div>
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        prefetch={false}
                        scroll={true}
                        onClick={() => setMobileOpen(false)}
                        className="block py-2.5 pl-3 text-white/70 hover:text-white transition-colors text-sm border-l border-gold-500/20 hover:border-gold-500 mb-1"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    scroll={true}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-white/80 hover:text-white transition-colors font-medium border-b border-white/5"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-8 space-y-3">
            <a
              href="tel:+17029964884"
              className="flex items-center gap-2 text-gold-400 font-semibold"
            >
              <Phone size={16} /> (702) 996-4884
            </a>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="btn-gold block text-center"
            >
              Book Your Experience
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
