export interface VenueMapView {
  id: string;
  label: string;
  imagePath: string;
  alt: string;
  pages?: Array<{
    imagePath: string;
    alt: string;
  }>;
}

export interface VenueMapConfig {
  title: string;
  helperText?: string;
  badge?: string;
  isDemo?: boolean;
  views: VenueMapView[];
}

export type VenueMapType = "interior" | "table" | "overview";

export interface VenueMapEntry {
  path: string;
  type: VenueMapType;
  label: string;
}

const DEMO_LAYOUT: VenueMapConfig = {
  title: "Venue Layout",
  helperText:
    "This is a temporary layout preview so you can test the modal experience before venue-specific maps are added.",
  badge: "Demo Preview",
  isDemo: true,
  views: [
    {
      id: "demo-layout",
      label: "Layout Preview",
      imagePath: "/venue-maps/demo-layout.png",
      alt: "Sample venue layout preview",
    },
  ],
};

const VENUE_MAPS: Record<string, VenueMapConfig> = {
  "ayu-dayclub": {
    title: "AYU Dayclub Layout",
    views: [
      {
        id: "floor-main",
        label: "Floor Plan",
        imagePath: "/venue-maps/ayu-dayclub/ayu-dayclub_01_floor-main.jpg",
        alt: "AYU Dayclub floor plan",
      },
    ],
  },
  "ebc-at-night": {
    title: "EBC at Night Layout",
    views: [
      {
        id: "floor-main",
        label: "Floor Plan",
        imagePath: "/venue-maps/ebc-at-night/ebc-at-night_01_floor-main.jpg",
        alt: "EBC at Night floor plan",
      },
    ],
  },
  "encore-beach-club": {
    title: "Encore Beach Club Layout",
    helperText:
      "Use this map to compare table areas before choosing a section. This first version is view-only and ready for future interactive hotspots.",
    views: [
      {
        id: "table-map",
        label: "Table Map",
        imagePath: "/venue-maps/encore-beach-club/encore-beach-club_01_table-map.jpg",
        alt: "Encore Beach Club table seating map",
      },
      {
        id: "overview",
        label: "Overview",
        imagePath: "/venue-maps/encore-beach-club/encore-beach-club_02_overview.png",
        alt: "Encore Beach Club overview map",
      },
    ],
  },
  hakkasan: {
    title: "Hakkasan Layout",
    helperText:
      "A PDF floor plan exists for Hakkasan, but the page display currently supports image files only.",
    views: [],
  },
  "jewel-nightclub": {
    title: "Jewel Nightclub Layout",
    views: [
      {
        id: "floor-main",
        label: "Main Floor",
        imagePath: "/venue-maps/jewel-nightclub/jewel-nightclub_01_floor-main.jpg",
        alt: "Jewel Nightclub main floor plan",
      },
      {
        id: "floor-mezzanine",
        label: "Mezzanine",
        imagePath: "/venue-maps/jewel-nightclub/jewel-nightclub_02_floor-mezzanine.jpg",
        alt: "Jewel Nightclub mezzanine floor plan",
      },
    ],
  },
  "liquid-pool-lounge": {
    title: "Liquid Pool Lounge Layout",
    views: [
      {
        id: "floor-main",
        label: "Floor Plan",
        imagePath: "/venue-maps/liquid-pool-lounge/liquid-pool-lounge_01_floor-main.jpg",
        alt: "Liquid Pool Lounge floor plan",
      },
    ],
  },
  "liv-beach-club": {
    title: "LIV Beach Club Layout",
    views: [
      {
        id: "interior",
        label: "Interior View",
        imagePath: "/venue-maps/liv-beach-club/interior.png",
        alt: "LIV Beach Club interior map",
      },
    ],
  },
  "liv-nightclub": {
    title: "LIV Nightclub Layout",
    views: [
      {
        id: "interior",
        label: "Interior View",
        imagePath: "/venue-maps/liv-nightclub/liv-nightclub_01_interior.jpg",
        alt: "LIV Nightclub interior",
      },
      {
        id: "table-map",
        label: "Table Map",
        imagePath: "/venue-maps/liv-nightclub/liv-nightclub_02_table-map.jpg",
        alt: "LIV Nightclub table seating map",
      },
      {
        id: "overview",
        label: "Overview",
        imagePath: "/venue-maps/liv-nightclub/liv-nightclub_03_overview.png",
        alt: "LIV Nightclub overview map",
      },
    ],
  },
  "marquee-dayclub": {
    title: "Marquee Dayclub Layout",
    views: [
      {
        id: "interior",
        label: "Interior View",
        imagePath: "/venue-maps/marquee-dayclub/marquee-dayclub_01_interior.jpg",
        alt: "Marquee Dayclub interior",
      },
      {
        id: "floor-main",
        label: "Floor Plan",
        imagePath: "/venue-maps/marquee-dayclub/marquee-dayclub_02_floor-main.jpg",
        alt: "Marquee Dayclub floor plan",
      },
    ],
  },
  "marquee-nightclub": {
    title: "Marquee Nightclub Layout",
    views: [
      {
        id: "interior",
        label: "Interior View",
        imagePath: "/venue-maps/marquee-nightclub/marquee-nightclub_01_interior.jpg",
        alt: "Marquee Nightclub interior",
      },
      {
        id: "floor-main",
        label: "Floor Plan",
        imagePath: "/venue-maps/marquee-nightclub/marquee-nightclub_02_floor-main.jpg",
        alt: "Marquee Nightclub floor plan",
      },
    ],
  },
  omnia: {
    title: "Omnia Nightclub Layout",
    views: [
      {
        id: "floor-main",
        label: "Main Floor",
        imagePath: "/venue-maps/omnia/omnia_01_floor-main.jpg",
        alt: "Omnia Nightclub main floor plan",
      },
      {
        id: "floor-secondary",
        label: "Secondary Floor",
        imagePath: "/venue-maps/omnia/omnia_02_floor-secondary.jpg",
        alt: "Omnia Nightclub secondary floor plan",
      },
      {
        id: "floor-vip",
        label: "VIP Section",
        imagePath: "/venue-maps/omnia/omnia_03_floor-vip.jpg",
        alt: "Omnia Nightclub VIP section",
      },
      {
        id: "floor-mezzanine",
        label: "Mezzanine",
        imagePath: "/venue-maps/omnia/omnia_04_floor-mezzanine.jpg",
        alt: "Omnia Nightclub mezzanine level",
      },
      {
        id: "table-map",
        label: "Table Map",
        imagePath: "/venue-maps/omnia/omnia_05_table-map.jpg",
        alt: "Omnia Nightclub table seating map",
      },
      {
        id: "floor-main-detailed",
        label: "Detailed Main Floor",
        imagePath: "/venue-maps/omnia/omnia_06_floor-main-detailed.jpg",
        alt: "Omnia Nightclub detailed main floor plan",
      },
    ],
  },
  "omnia-dayclub": {
    title: "Omnia Dayclub Layout",
    views: [
      {
        id: "interior",
        label: "Interior View",
        imagePath: "/venue-maps/omnia-dayclub/omnia-dayclub_01_interior.jpg",
        alt: "Omnia Dayclub interior",
      },
      {
        id: "interior-alt",
        label: "Interior View 2",
        imagePath: "/venue-maps/omnia-dayclub/omnia-dayclub_02_interior-alt.jpg",
        alt: "Omnia Dayclub alternate interior view",
      },
    ],
  },
  "tao-beach": {
    title: "TAO Beach Layout",
    views: [
      {
        id: "overview",
        label: "Venue Layout",
        imagePath: "/venue-maps/tao-beach/las-vegas-tao-contact-promoter-v0-wg9dwr7j7cqc1.webp",
        alt: "TAO Beach venue layout",
      },
    ],
  },
  "tao-nightclub": {
    title: "TAO Nightclub Layout",
    views: [
      {
        id: "floor-main",
        label: "Floor Plan",
        imagePath: "/venue-maps/tao-nightclub/tao-nightclub_01_floor-main.jpg",
        alt: "TAO Nightclub floor plan",
      },
    ],
  },
  "xs-nightclub": {
    title: "XS Nightclub Layout",
    views: [
      {
        id: "interior",
        label: "Interior View",
        imagePath: "/venue-maps/xs-nightclub/xs-nightclub_01_interior.jpg",
        alt: "XS Nightclub interior",
      },
      {
        id: "overview-exterior",
        label: "Exterior Map",
        imagePath: "/venue-maps/xs-nightclub/xs-nightclub_02_overview-exterior.png",
        alt: "XS Nightclub exterior map",
      },
    ],
  },
  "zouk-nightclub": {
    title: "Zouk Nightclub Layout",
    views: [
      {
        id: "floor-main",
        label: "Floor Plan",
        imagePath: "/venue-maps/zouk-nightclub/zouk-nightclub_01_floor-main.jpg",
        alt: "Zouk Nightclub floor plan",
      },
    ],
  },
};

const VENUE_MAP_ALIASES: Record<string, string> = {
  "hakkasan-nightclub": "hakkasan",
  "omnia-nightclub": "omnia",
};

export function resolveVenueMapSlug(venueSlug: string): string {
  return VENUE_MAP_ALIASES[venueSlug] ?? venueSlug;
}

export function getVenueMapConfig(venueSlug: string): VenueMapConfig {
  return VENUE_MAPS[resolveVenueMapSlug(venueSlug)] ?? DEMO_LAYOUT;
}

export function getFallbackVenueMapConfig(): VenueMapConfig {
  return DEMO_LAYOUT;
}

function mapViewIdToType(viewId: string): VenueMapType {
  if (viewId.includes("table")) return "table";
  if (viewId.includes("overview")) return "overview";
  return "interior";
}

export function getVenueMaps(venueSlug: string): VenueMapEntry[] {
  const config = VENUE_MAPS[resolveVenueMapSlug(venueSlug)];

  if (!config) {
    return [];
  }

  return config.views.map((view) => ({
    path: view.imagePath,
    type: mapViewIdToType(view.id),
    label: view.label,
  }));
}
