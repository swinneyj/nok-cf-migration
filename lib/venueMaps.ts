export interface VenueMapView {
  id: string;
  label: string;
  imagePath: string;
  alt: string;
}

export interface VenueMapConfig {
  title: string;
  helperText?: string;
  badge?: string;
  isDemo?: boolean;
  views: VenueMapView[];
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
  "encore-beach-club": {
    title: "Encore Beach Club Layout",
    helperText:
      "Use this map to compare table areas before choosing a section. This first version is view-only and ready for future interactive hotspots.",
    views: [
      {
        id: "overview",
        label: "Overview",
        imagePath: "/venue-maps/encore-beach-club-overview.png",
        alt: "Encore Beach Club overview map",
      },
      {
        id: "labeled",
        label: "Labeled Layout",
        imagePath: "/venue-maps/encore-beach-club-labeled.png",
        alt: "Encore Beach Club labeled venue map",
      },
    ],
  },
};

export function getVenueMapConfig(venueSlug: string): VenueMapConfig {
  return VENUE_MAPS[venueSlug] ?? DEMO_LAYOUT;
}
