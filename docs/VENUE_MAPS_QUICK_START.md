# Venue Maps - Quick Start Guide

## What You Get

✅ Responsive venue maps for desktop & mobile  
✅ Two implementation options (simple CSS or advanced interactive)  
✅ Mobile-optimized for small screens  
✅ Built with Next.js 14 & Tailwind CSS  
✅ No extra dependencies needed  
✅ Touch-friendly zoom & pan

## The Problem You Had

- Maps too large on mobile
- Users have to pan around to see entire map
- Poor mobile viewing experience

## The Solution

**Mobile:** Maps fit in viewport, users can pinch-zoom and explore  
**Desktop:** Maps display at natural size, zoom controls hidden

## Files Included

| File | Purpose | Complexity |
|------|---------|------------|
| `VenueMapSimple.tsx` | Lightweight responsive component | ⭐ Easy |
| `VenueMapViewer.tsx` | Interactive with zoom controls | ⭐⭐ Medium |
| `VenueMapGallery.tsx` | Display multiple maps together | ⭐⭐ Medium |
| `IMPLEMENTATION_GUIDE.md` | Detailed setup instructions | Reference |
| `venue-maps.css` | Optional custom styling | Optional |

## Quick Setup (5 minutes)

### Step 1: Components Already Added
All components are in `app/components/`

### Step 2: Update Your Venue Page
```tsx
import VenueMapSimple from '@/components/VenueMapSimple';

export default function VenuePage() {
  return (
    <VenueMapSimple
      mapPath="/venue-maps/liv-nightclub/interior.png"
      venueName="LIV Nightclub"
      mapType="interior"
    />
  );
}
```

### Step 3: Done! 🎉
Map is now responsive and works on mobile/desktop.

## Which Component Should You Use?

### Use `VenueMapSimple` if:
- ✅ You want the simplest solution
- ✅ You're happy with native browser zoom
- ✅ You want minimal code
- ✅ You're concerned about bundle size

### Use `VenueMapViewer` if:
- ✅ You want explicit zoom buttons on mobile
- ✅ Users have complained about zoom behavior
- ✅ You want fine control over zoom limits
- ✅ You want pan while zoomed

### Use `VenueMapGallery` if:
- ✅ You have multiple maps (interior, table, overview)
- ✅ You want a nice tab interface on mobile
- ✅ You want all maps visible on desktop

## Mobile Experience

**Portrait (mobile):**
- Square aspect ratio fits in viewport
- No horizontal scroll
- Users can pinch-zoom and drag

**Landscape (mobile):**
- Still optimized for viewing
- Proper aspect ratio maintained
- Easy to interact with

**Tablet (768px+):**
- Better use of extra screen space
- 16:9 aspect ratio
- Still fits in viewport

**Desktop (1024px+):**
- Natural aspect ratio
- Max height constraint (600px)
- Optimal viewing experience

## Next Steps

1. **Ensure images are in place** → `public/venue-maps/[venue]/[type].png`
2. **Update venue pages** → Import and use component
3. **Test on mobile** → Check pinch-zoom and pan
4. **Optimize images** → Compress if needed
5. **Deploy** → Push to production

For detailed info, see `VENUE_MAPS_IMPLEMENTATION_GUIDE.md`
