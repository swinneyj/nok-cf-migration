'use client';

import React from 'react';
import Image from 'next/image';

interface VenueMapSimpleProps {
  mapPath: string;
  venueName: string;
  mapType?: 'interior' | 'table' | 'overview';
}

/**
 * Lightweight Responsive Venue Map Component
 * No state management - just pure responsive CSS
 * Mobile: Fits in viewport, allows native browser zoom (pinch)
 * Desktop: Optimal size with proper aspect ratio
 */
export const VenueMapSimple: React.FC<VenueMapSimpleProps> = ({
  mapPath,
  venueName,
  mapType = 'interior',
}) => {
  return (
    <div className="w-full space-y-3">
      {/* Map Container - Responsive with proper aspect ratio */}
      <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden">
        {/* Mobile: Square aspect ratio (fits small screens) */}
        {/* Desktop: 16:9 aspect ratio (better for wide screens) */}
        <div className="aspect-square md:aspect-video lg:aspect-auto lg:max-h-[600px]">
          <Image
            src={mapPath}
            alt={`${venueName} ${mapType} map`}
            fill
            className="object-contain object-center"
            quality={90}
            priority
            sizes="
              (max-width: 640px) 100vw,
              (max-width: 1024px) 90vw,
              1000px
            "
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">
          {venueName}
          <span className="text-gray-500 text-sm font-normal ml-2">
            {mapType.charAt(0).toUpperCase() + mapType.slice(1)} View
          </span>
        </h3>

        {/* Mobile-specific instructions */}
        <p className="text-sm text-gray-600 md:hidden">
          💡 Tip: Use two fingers to zoom and explore different areas of the map
        </p>
      </div>
    </div>
  );
};

export default VenueMapSimple;