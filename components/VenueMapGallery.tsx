'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface VenueMap {
  type: 'interior' | 'table' | 'overview';
  path: string;
  label: string;
}

interface VenueMapGalleryProps {
  venueName: string;
  maps: VenueMap[];
}

/**
 * Venue Map Gallery - Display multiple map views
 * Mobile: Single map with tab navigation
 * Desktop: Multiple maps in grid layout
 */
export const VenueMapGallery: React.FC<VenueMapGalleryProps> = ({
  venueName,
  maps,
}) => {
  const [activeMapType, setActiveMapType] = useState<'interior' | 'table' | 'overview'>(
    maps[0]?.type || 'interior'
  );

  const activeMap = maps.find((m) => m.type === activeMapType);

  return (
    <div className="w-full space-y-4">
      {/* Map Type Tabs/Buttons */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 md:border-0 pb-4 md:pb-0">
        {maps.map((map) => (
          <button
            key={map.type}
            onClick={() => setActiveMapType(map.type)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-200
              md:mb-4
              ${
                activeMapType === map.type
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {map.label}
          </button>
        ))}
      </div>

      {/* Mobile: Single Map View */}
      <div className="md:hidden">
        {activeMap && (
          <div className="space-y-3">
            <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={activeMap.path}
                alt={`${venueName} ${activeMap.type} map`}
                fill
                className="object-contain"
                quality={90}
                priority
                sizes="100vw"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                💡 <span className="font-medium">Mobile Tip:</span> Use two fingers to zoom and
                explore the {activeMap.label.toLowerCase()} map
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Desktop: Grid Layout */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-8">
        {maps.map((map) => (
          <div key={map.type} className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">{map.label}</h3>
            <div className="relative w-full aspect-auto max-h-96 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={map.path}
                alt={`${venueName} ${map.type} map`}
                fill
                className="object-contain"
                quality={90}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <p className="text-sm text-gray-600">
              {map.type === 'interior' && '🏢 Shows the main interior layout and sections'}
              {map.type === 'table' && '🎯 Table seating chart and numbered sections'}
              {map.type === 'overview' && '🗺️ Overall venue layout and areas'}
            </p>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {maps.length === 0 && (
        <div className="w-full bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No venue maps available for {venueName}</p>
        </div>
      )}
    </div>
  );
};

export default VenueMapGallery;