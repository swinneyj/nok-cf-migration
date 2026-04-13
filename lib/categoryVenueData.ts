export type CategoryEventsKey = "all" | "nightclubs" | "pool-parties";

export interface CategoryVenueCard {
  name: string;
  venue: string;
  desc: string;
  img: string;
  alt: string;
  href: string;
  venueSlug: string;
  badge?: string | null;
}

export const nightclubVenues: CategoryVenueCard[] = [
  { name: "XS Nightclub", venue: "Encore at Wynn", desc: "#1 in Las Vegas. World-class DJs, iconic outdoor pool area, Wynn-level service.", img: "/images/venues/xs-nightclub.jpg", alt: "XS Nightclub Las Vegas VIP table", href: "/places/xs-nightclub", venueSlug: "xs-nightclub" },
  { name: "Hakkasan", venue: "MGM Grand", desc: "80,000 sq ft, six rooms. Vegas's largest nightclub — best for groups who want variety.", img: "/images/venues/hakkasan.jpg", alt: "Hakkasan Las Vegas VIP", href: "/places/hakkasan-nightclub", venueSlug: "hakkasan-nightclub" },
  { name: "Omnia", venue: "Caesars Palace", desc: "Iconic kinetic chandelier, rooftop terrace — the best production show in Las Vegas nightlife.", img: "/images/venues/omnia.jpg", alt: "Omnia Caesars Palace Las Vegas VIP", href: "/places/omnia-nightclub", venueSlug: "omnia-nightclub" },
  { name: "Marquee Nightclub", venue: "The Cosmopolitan", desc: "Rooftop bungalows with private pools, Boombox Room hip-hop, central Strip location.", img: "/images/venues/marquee-nightclub.jpg", alt: "Marquee nightclub Las Vegas VIP", href: "/places/marquee-nightclub", venueSlug: "marquee-nightclub" },
  { name: "TAO Nightclub", venue: "Venetian", desc: "A-list celebrity venue, 40-foot Strip terrace, 8 private skyboxes, stunning décor.", img: "/images/venues/tao-nightclub.jpg", alt: "TAO nightclub Venetian Las Vegas VIP", href: "/places/tao-nightclub", venueSlug: "tao-nightclub" },
  { name: "Zouk Nightclub", venue: "Resorts World", desc: "Vegas's most technologically advanced nightclub. Best sound system, tech house focus.", img: "/images/venues/zouk.jpg", alt: "Zouk Resorts World Las Vegas VIP", href: "/places/zouk-nightclub", venueSlug: "zouk-nightclub" },
  { name: "LIV Nightclub", venue: "Fontainebleau", desc: "Legendary Miami club brings its celebrity programming and energy to the Las Vegas Strip.", img: "/images/venues/liv-nightclub.jpg", alt: "LIV Nightclub Fontainebleau Las Vegas VIP", href: "/places/liv-nightclub", venueSlug: "liv-nightclub" },
  { name: "Drai's Nightclub", venue: "The Cromwell", desc: "Only rooftop nightclub on the Strip. Best hip-hop programming in Las Vegas, epic views.", img: "/images/venues/drais.jpg", alt: "Drai's rooftop Las Vegas VIP", href: "/places/drais-nightclub", venueSlug: "drais-nightclub" },
  { name: "Jewel Nightclub", venue: "ARIA", desc: "Intimate 24,000 sq ft. LED Grand Staircase, private skyboxes — best small-group luxury.", img: "/images/venues/jewel.jpg", alt: "Jewel nightclub ARIA Las Vegas VIP", href: "/places/jewel-nightclub", venueSlug: "jewel-nightclub" },
  { name: "EBC at Night", venue: "Encore at Wynn", desc: "Encore Beach Club as an open-air nightclub. The world's best outdoor nightclub experience.", img: "/images/venues/ebc-at-night.jpg", alt: "EBC at Night Las Vegas outdoor nightclub VIP", href: "/places/ebc-at-night", venueSlug: "ebc-at-night" },
];

export const poolPartyVenues: CategoryVenueCard[] = [
  { name: "Encore Beach Club", venue: "Encore at Wynn", desc: "The gold standard of Las Vegas dayclubs. World-class DJs, private bungalows with plunge pools, Wynn service.", img: "/images/venues/encore-beach-club.jpg", alt: "Encore Beach Club Las Vegas VIP cabana dayclub", href: "/places/encore-beach-club", venueSlug: "encore-beach-club", badge: "#1 Rated" },
  { name: "Marquee Dayclub", venue: "The Cosmopolitan", desc: "Infinity-edge pools, rooftop bungalows with Strip views, strong hip-hop and EDM programming.", img: "/images/venues/marquee-dayclub.jpg", alt: "Marquee Dayclub Las Vegas pool party VIP", href: "/places/marquee-dayclub", venueSlug: "marquee-dayclub", badge: "Fan Favorite" },
  { name: "Tao Beach", venue: "The Venetian", desc: "Asian-inspired luxury poolside experience with multiple pool levels, premium cabanas, and world-class DJ programming.", img: "/images/venues/tao-beach.jpg", alt: "Tao Beach Las Vegas VIP cabana dayclub Venetian", href: "/places/tao-beach", venueSlug: "tao-beach", badge: "Premium" },
  { name: "Omnia Dayclub", venue: "Caesars Palace", desc: "Brand new dayclub from Hakkasan Group. Omnia-level production brought to the Las Vegas pool scene.", img: "/images/venues/omnia-dayclub.jpg", alt: "Omnia Dayclub Caesars Palace Las Vegas VIP", href: "/places/omnia-dayclub", venueSlug: "omnia-dayclub", badge: "New" },
  { name: "LIV Beach Club", venue: "Fontainebleau", desc: "The iconic Miami brand brings its poolside energy to Las Vegas. Multi-level complex, hip-hop driven.", img: "/images/venues/liv-beach-club.jpg", alt: "LIV Beach Club Fontainebleau Las Vegas VIP", href: "/places/liv-beach-club", venueSlug: "liv-beach-club", badge: "New" },
  { name: "AYU Dayclub", venue: "Resorts World", desc: "Multi-pool outdoor complex with world-class DJ programming. More accessible pricing than EBC.", img: "/images/venues/ayu.jpg", alt: "AYU Dayclub Resorts World Las Vegas VIP cabana", href: "/places/ayu-dayclub", venueSlug: "ayu-dayclub", badge: null },
  { name: "Palm Tree Beach Club", venue: "Las Vegas Strip", desc: "Mediterranean-inspired aesthetic, deep house programming, sophisticated alternative to mega-dayclubs.", img: "/images/venues/palm-tree.jpg", alt: "Palm Tree Beach Club Las Vegas pool party VIP", href: "/places/palm-tree-beach-club", venueSlug: "palm-tree-beach-club", badge: "New" },
  { name: "Kassi Beach Club", venue: "Las Vegas Strip", desc: "Mediterranean-inspired aesthetic, deep house programming, sophisticated alternative to mega-dayclubs.", img: "/images/venues/kassi.jpg", alt: "Kassi Beach Club Las Vegas pool party VIP", href: "/places/kassi-beach-club", venueSlug: "kassi-beach-club", badge: "New" },
  { name: "Liquid Pool Lounge", venue: "ARIA Resort", desc: "Adults-only boutique pool. Only 8 VIP cabanas, private dipping pools — the most exclusive dayclub in Vegas.", img: "/images/venues/liquid.jpg", alt: "Liquid Pool Lounge ARIA Las Vegas VIP cabana", href: "/places/liquid-pool-lounge", venueSlug: "liquid-pool-lounge", badge: "Adults Only" },
  { name: "Stadium Swim", venue: "Circa Resort", desc: "Five-story amphitheater pool with a 143-foot LED screen. Watch the game from the pool — uniquely Vegas.", img: "/images/venues/stadium-swim.jpg", alt: "Stadium Swim Circa Las Vegas pool party VIP", href: "/places/stadium-swim", venueSlug: "stadium-swim", badge: null },
];

export function getCategoryVenueCards(category: CategoryEventsKey) {
  if (category === "nightclubs") return nightclubVenues;
  if (category === "pool-parties") return poolPartyVenues;
  return [...nightclubVenues, ...poolPartyVenues];
}
