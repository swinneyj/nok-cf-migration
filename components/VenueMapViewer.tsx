'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { X, Maximize2 } from 'lucide-react'

interface VenueMapViewerProps {
  mapPath: string
  venueName: string
  mapType: 'interior' | 'table' | 'overview'
}

export default function VenueMapViewer({
  mapPath,
  venueName,
  mapType,
}: VenueMapViewerProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkOrientation = () => {
      setIsMobile(window.innerWidth < 768)
      setIsLandscape(window.innerWidth > window.innerHeight)
    }

    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)

    return () => {
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [])

  const handleZoom = (direction: 'in' | 'out') => {
    setScale((prev) => {
      const newScale = direction === 'in' ? prev + 0.2 : prev - 0.2
      return Math.max(1, Math.min(3, newScale))
    })
  }

  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale === 1) return
    setIsPanning(true)
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || scale === 1) return
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    })
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    handleZoom(e.deltaY > 0 ? 'out' : 'in')
  }

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="aspect-square md:aspect-video lg:aspect-auto lg:max-h-[600px] relative bg-black rounded-lg overflow-hidden cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="w-full h-full transition-transform"
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            transformOrigin: 'center',
          }}
        >
          <Image
            src={mapPath}
            alt={`${venueName} ${mapType} map`}
            fill
            className="object-contain object-center pointer-events-none"
            quality={90}
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1000px"
          />
        </div>
      </div>

      {/* Controls - Show on mobile only */}
      {isMobile && scale > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2 md:hidden">
          <button
            onClick={() => handleZoom('out')}
            className="bg-gold-400 hover:bg-gold-300 text-black px-3 py-1 rounded text-sm font-semibold transition-colors"
          >
            −
          </button>
          <span className="text-white/70 text-sm min-w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => handleZoom('in')}
            className="bg-gold-400 hover:bg-gold-300 text-black px-3 py-1 rounded text-sm font-semibold transition-colors"
          >
            +
          </button>
        </div>
      )}

      {isMobile && (
        <div className="mt-2 md:hidden space-y-2">
          <button
            onClick={handleReset}
            className="w-full bg-white/10 hover:bg-white/20 text-white text-sm py-2 rounded transition-colors"
          >
            Reset Zoom
          </button>
        </div>
      )}

      <p className="text-white/50 text-sm mt-3 md:hidden text-center">
        {scale > 1 ? 'Drag to move around • Tap reset to zoom out' : 'Pinch or use + button to zoom'}
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
          <div className="flex-1 overflow-hidden relative">
            <div
              className="w-full h-full cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              <div
                className="w-full h-full transition-transform"
                style={{
                  transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                  transformOrigin: 'center',
                }}
              >
                <Image
                  src={mapPath}
                  alt={`${venueName} ${mapType} map fullscreen`}
                  fill
                  className="object-contain object-center pointer-events-none"
                  quality={95}
                  priority
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="border-t border-white/10 p-4 space-y-3">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handleZoom('out')}
                className="bg-gold-400 hover:bg-gold-300 text-black px-4 py-2 rounded text-sm font-semibold transition-colors"
              >
                −
              </button>
              <span className="text-white/70 text-sm min-w-16 text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => handleZoom('in')}
                className="bg-gold-400 hover:bg-gold-300 text-black px-4 py-2 rounded text-sm font-semibold transition-colors"
              >
                +
              </button>
            </div>
            <button
              onClick={handleReset}
              className="w-full bg-white/10 hover:bg-white/20 text-white text-sm py-2 rounded transition-colors"
            >
              Reset Zoom
            </button>
          </div>
        </div>
      )}
    </div>
  )
}