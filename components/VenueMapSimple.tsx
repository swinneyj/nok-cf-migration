'use client'

import { useState } from 'react'
import { X, Maximize2 } from 'lucide-react'

interface VenueMapSimpleProps {
  mapPath: string
  venueName: string
  mapType: 'interior' | 'table' | 'overview'
}

export default function VenueMapSimple({
  mapPath,
  venueName,
  mapType,
}: VenueMapSimpleProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const mapAlt = `${venueName} ${mapType} map`

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-lg bg-black">
        <img
          src={mapPath}
          alt={mapAlt}
          className="block w-full max-h-[600px] object-contain object-center"
          loading="eager"
        />
      </div>
      <p className="text-white/50 text-sm mt-3 md:hidden text-center">
        Tip: Pinch to zoom on mobile
      </p>

      {/* Fullscreen button */}
      <button
        onClick={() => setIsFullscreen(true)}
        className="mt-3 w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm py-2 rounded transition-colors md:hidden"
      >
        <Maximize2 size={16} />
        View Fullscreen
      </button>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col md:hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-white font-semibold text-sm">{venueName} Floor Plan</h3>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 hover:bg-white/10 rounded transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Map container */}
          <div className="flex flex-1 items-center justify-center overflow-auto bg-black p-4">
            <img
              src={mapPath}
              alt={`${mapAlt} fullscreen`}
              className="max-h-full w-full object-contain object-center"
            />
          </div>
        </div>
      )}
    </div>
  )
}
