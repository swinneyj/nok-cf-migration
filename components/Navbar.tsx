'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, Menu, X, ChevronDown } from 'lucide-react'

const navLinks = [
  { label: 'Events', href: '/events' },
  {
    label: 'Nightclubs',
    href: '/nightclubs',
    children: [
      { label: 'XS Nightclub', href: '/places/xs-nightclub' },
      { label: 'Hakkasan', href: '/places/hakkasan-nightclub' },
      { label: 'Omnia', href: '/places/omnia-nightclub' },
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
      { label: 'Tao Beach', href: '/places/tao-beach' },
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
    label: 'More',
    href: '#',
    children: [
      { label: 'Strip Clubs', href: '/strip-clubs' },
      { label: 'Lounges', href: '/lounges' },
      { label: 'Party Buses', href: '/party-buses' },
      { label: 'Club Crawl', href: '/services/club-crawl-las-vegas' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!mobileOpen) {
      setOpenMobileSection(null)
    }
  }, [mobileOpen])

  const mobilePrimaryLinks = navLinks.filter((link) =>
    ['Events', 'Contact'].includes(link.label)
  )

  const mobileAccordionLinks = navLinks.filter((link) =>
    ['Nightclubs', 'Pool Parties', 'Packages', 'More'].includes(link.label)
  )

  const mobileSecondaryLinks = navLinks.filter((link) =>
    ['Blog'].includes(link.label)
  )

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
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <div className="flex items-center">
                      <Link
                        href={link.href}
                        scroll={true}
                        className="whitespace-nowrap px-3 py-2 text-sm text-white/80 hover:text-white transition-colors font-medium xl:px-4"
                      >
                        {link.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenDropdown((current) => (current === link.label ? null : link.label))
                        }
                        aria-label={`Toggle ${link.label} menu`}
                        aria-expanded={openDropdown === link.label}
                        className="py-2 pr-3 pl-0.5 text-white/70 hover:text-white transition-colors xl:pr-4"
                      >
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''
                            }`}
                        />
                      </button>
                    </div>
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
                    className="whitespace-nowrap px-3 py-2 text-sm text-white/80 hover:text-white transition-colors font-medium xl:px-4"
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
          <nav className="flex flex-col gap-3 pb-8">
            <div className="space-y-2 border-b border-white/5 pb-5">
              {mobilePrimaryLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  scroll={true}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-xl border px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] transition ${
                    link.label === 'Events'
                      ? 'border-gold-500/30 bg-gold-500 text-black shadow-[0_8px_24px_rgba(214,158,15,0.2)]'
                      : 'border-white/10 bg-white/5 text-white/85 hover:border-gold-500/20 hover:text-white'
                  }`}
                >
                  {link.label === 'Events' ? 'View Events' : link.label}
                </Link>
              ))}
            </div>

            <div className="space-y-3">
              {mobileAccordionLinks.map((link) => (
                <div key={link.label} className="rounded-2xl border border-white/8 bg-white/[0.03]">
                  <div className="flex items-center justify-between px-4 py-3.5">
                    <Link
                      href={link.href}
                      scroll={true}
                      onClick={() => setMobileOpen(false)}
                      className="section-eyebrow hover:text-gold-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                    {link.children ? (
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMobileSection((current) => (current === link.label ? null : link.label))
                        }
                        aria-label={`Toggle ${link.label}`}
                        aria-expanded={openMobileSection === link.label}
                        className="rounded-full border border-white/10 p-2 text-white/70 hover:border-gold-500/30 hover:text-white transition-colors"
                      >
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${openMobileSection === link.label ? 'rotate-180' : ''}`}
                        />
                      </button>
                    ) : null}
                  </div>

                  {link.children && openMobileSection === link.label ? (
                    <div className="border-t border-white/8 px-4 pb-4 pt-2">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          prefetch={false}
                          scroll={true}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-gold-500/10 hover:text-white"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="space-y-1 border-t border-white/5 pt-3">
              {mobileSecondaryLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  scroll={true}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-white/65 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
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
