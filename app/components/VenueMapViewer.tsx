'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface VenueMapViewerProps {
  mapPath: string;
  venueName: string;
  mapType?: 'interior' | 'table' | 'overview';
}

/**
 * Responsive Venue Map Viewer
 * - Desktop: Full size image, fits screen naturally
 * - Mobile: Starts zoomed out to see entire map, allows pinch-zoom and pan
 */
export const VenueMapViewer: React.FC<VenueMapViewerProps> = ({
  mapPath,
  venueName,
  mapType = 'interior',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle pinch zoom on mobile
  const handleWheel = (e: React.WheelEvent) => {
    if (!isMobile) return;

    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(1, Math.min(3, scale * delta));
    setScale(newScale);
  };

  // Handle touch pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch zoom - handled by browser/library
      return;
    }
    setIsPanning(true);
    setStartPos({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPanning || !isMobile || scale === 1) return;

    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - startPos.x,
      y: touch.clientY - startPos.y,
    });
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
  };

  // Reset zoom on double tap
  const handleDoubleTap = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="w-full">
      {/* Map Container */}
      <div
        ref={containerRef}
        className={`
          relative w-full overflow-hidden rounded-lg bg-gray-900
          ${isMobile ? 'aspect-square md:aspect-auto' : 'aspect-video'}
        `}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`
            w-full h-full flex items-center justify-center transition-transform
            ${isMobile && scale > 1 ? 'cursor-grab active:cursor-grabbing' : ''}
          `}
          style={
            isMobile && scale > 1
              ? {
                  transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                  transformOrigin: 'center',
                  transition: isPanning ? 'none' : 'transform 0.2s ease-out',
                }
              : { transform: `scale(${scale})`, transformOrigin: 'center' }
          }
        >
          <Image
            src={mapPath}
            alt={`${venueName} ${mapType} map`}
            fill
            className="object-contain"
            quality={90}
            priority
            sizes="
              (max-width: 640px) 100vw,
              (max-width: 1024px) 100vw,
              1200px
            "
          />
        </div>

        {/* Mobile Controls */}
        {isMobile && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity">
              {scale === 1 && (
                <div className="text-sm bg-black bg-opacity-50 px-3 py-2 rounded">
                  Scroll to zoom • Drag to pan
                </div>
              )}
            </div>
          </div>
        )}

        {/* Zoom Controls for Mobile */}
        {isMobile && (
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
            <button
              onClick={() => setScale(Math.min(3, scale + 0.5))}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Zoom in"
            >
              <span className="text-lg font-bold">+</span>
            </button>
            <button
              onClick={() => setScale(Math.max(1, scale - 0.5))}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Zoom out"
            >
              <span className="text-lg font-bold">−</span>
            </button>
            {scale > 1 && (
              <button
                onClick={handleDoubleTap}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors text-xs font-bold"
                aria-label="Reset zoom"
                title="Reset zoom"
              >
                ⤢
              </button>
            )}
          </div>
        )}
      </div>

      {/* Info Text */}
      <div className="mt-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          {venueName} - {mapType.charAt(0).toUpperCase() + mapType.slice(1)} View
        </h3>
        {isMobile && scale > 1 && (
          <span className="text-sm text-gray-600">
            {Math.round(scale * 100)}%
          </span>
        )}
      </div>

      {/* Instructions for Mobile */}
      {isMobile && (
        <p className="mt-2 text-sm text-gray-600 md:hidden">
          {scale === 1
            ? '📱 Scroll to zoom, then drag to explore'
            : '👆 Drag to pan • Double-tap to reset'}
        </p>
      )}
    </div>
  );
};

export default VenueMapViewer;