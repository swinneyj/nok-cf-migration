'use client'

import { useState, useEffect } from 'react'
import { Phone, MessageCircle, X } from 'lucide-react'

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) setVisible(true)
    }, 4000)
    return () => clearTimeout(timer)
  }, [dismissed])

  if (dismissed) return null

  return (
    <>
      {/* Persistent bottom-right action buttons */}
      <div className="fixed bottom-6 right-5 z-50 flex flex-col gap-3 items-end">
        {/* WhatsApp */}
        <a
          href="https://wa.me/17023494456?text=Hi%2C%20I'd%20like%20to%20inquire%20about%20a%20VIP%20package%20in%20Las%20Vegas"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2"
          aria-label="WhatsApp us"
        >
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-night-800 text-white text-xs px-3 py-1.5 rounded-full border border-gold-500/20 whitespace-nowrap">
            Chat on WhatsApp
          </span>
          <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-black/40 hover:scale-110 transition-transform">
            <MessageCircle size={22} fill="white" stroke="white" />
          </div>
        </a>

        {/* Phone */}
        <a
          href="tel:+17029964884"
          className="group flex items-center gap-2"
          aria-label="Call us"
        >
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-night-800 text-white text-xs px-3 py-1.5 rounded-full border border-gold-500/20 whitespace-nowrap">
            (702) 996-4884
          </span>
          <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center shadow-lg shadow-gold-500/30 hover:scale-110 transition-transform pulse-ring">
            <Phone size={20} fill="#000" stroke="#000" />
          </div>
        </a>
      </div>

      {/* Pop-up nudge banner (shows after 4s, dismissible) */}
      {visible && (
        <div className="fixed bottom-6 left-5 z-50 max-w-xs">
          <div className="card-dark p-4 relative">
            <button
              onClick={() => { setVisible(false); setDismissed(true) }}
              className="absolute top-2 right-2 text-white/30 hover:text-white/70 transition-colors"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
            <p className="text-xs text-gold-400 font-semibold uppercase tracking-widest mb-1">
              Limited Spots This Weekend
            </p>
            <p className="text-sm text-white font-medium mb-3">
              Book your VIP experience before it sells out
            </p>
            <a
              href="tel:+17029964884"
              className="btn-gold text-xs py-2.5 px-4 block text-center"
            >
              Call Now — Free Planning
            </a>
          </div>
        </div>
      )}
    </>
  )
}
