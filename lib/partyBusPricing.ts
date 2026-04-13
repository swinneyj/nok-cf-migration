export interface PartyBusVehicle {
  slug: string;
  name: string;
  seats: number;
  recommendedPaxWithLuggage: number;
  hourlyRate?: number;
  minimumHours?: number;
  minimumCharge?: number;
  bookingFee?: number;
  fuelCharge?: number;
  fuelDiscount?: number;
  image: string;
  description: string;
  features: string[];
  pricingNote?: string;
}

export interface PartyBusSurchargeRule {
  date: string;
  title: string;
  increase: number;
  minimumNote?: string;
}

export const PARTY_BUS_SERVICE_FEE = 25;

export const PARTY_BUS_VEHICLES: PartyBusVehicle[] = [
  {
    slug: "sprinter-limo-6",
    name: "Sprinter Limo 6",
    seats: 6,
    recommendedPaxWithLuggage: 6,
    hourlyRate: 110,
    minimumHours: 1,
    minimumCharge: 110,
    bookingFee: 5,
    fuelCharge: 6,
    fuelDiscount: -11,
    image: "/images/venues/party-bus-sprinter.jpg",
    description: "Best for intimate VIP transfers with a lounge-style interior and a polished Strip-ready look.",
    features: ["Mercedes limo sprinter", "Complimentary water", "Great for dinner-to-club runs"],
  },
  {
    slug: "sprinter-limo-9",
    name: "Sprinter Limo 9",
    seats: 12,
    recommendedPaxWithLuggage: 9,
    hourlyRate: 120,
    minimumHours: 1,
    minimumCharge: 120,
    bookingFee: 5,
    fuelCharge: 6,
    fuelDiscount: -12,
    image: "/images/venues/party-bus-sprinter.jpg",
    description: "A strong fit for medium groups who want private transportation without stepping up to a full party bus.",
    features: ["Mercedes limo sprinter", "Complimentary water", "Ideal for birthdays and club crawls"],
  },
  {
    slug: "sprinter-limo-12",
    name: "Sprinter Limo 12",
    seats: 12,
    recommendedPaxWithLuggage: 12,
    hourlyRate: 130,
    minimumHours: 1,
    minimumCharge: 130,
    bookingFee: 5,
    fuelCharge: 6,
    fuelDiscount: -13,
    image: "/images/venues/party-bus-sprinter.jpg",
    description: "Comfortable for larger friend groups that want everyone together between hotels, dinners, and venues.",
    features: ["Mercedes limo sprinter", "Complimentary water", "Popular for bachelor and bachelorette groups"],
  },
  {
    slug: "limo-suv-12",
    name: "Limo SUV 12",
    seats: 12,
    recommendedPaxWithLuggage: 10,
    hourlyRate: 130,
    minimumHours: 1.5,
    minimumCharge: 195,
    bookingFee: 5,
    fuelCharge: 7.5,
    fuelDiscount: -19.5,
    image: "/images/venues/party-bus-suv.jpg",
    description: "Stretch SUV styling with a more nightlife-first feel for dinner, clubs, and elevated photo-stop itineraries.",
    features: ["Chevrolet/GMC pink Yukon class", "1.5-hour base minimum", "Good for shorter VIP hops"],
  },
  {
    slug: "ultra-party-bus-25",
    name: "Ultra Luxury Party Bus",
    seats: 25,
    recommendedPaxWithLuggage: 20,
    hourlyRate: 170,
    minimumHours: 2,
    minimumCharge: 340,
    bookingFee: 5,
    fuelCharge: 12,
    fuelDiscount: -34,
    image: "/images/venues/party-bus-hero.jpeg",
    description: "The flagship group option for full pregame energy, multi-stop nights, wedding weekends, and high-volume celebrations.",
    features: ["Ford limo bus", "Complimentary water", "Best fit for the biggest nightlife groups"],
    pricingNote: "2-hour minimum. Presidential sheet reflects a $12 fuel line and $5 booking fee before tax.",
  },
  {
    slug: "executive-coach-31",
    name: "Executive Coach 31",
    seats: 31,
    recommendedPaxWithLuggage: 25,
    hourlyRate: 125,
    minimumHours: 2,
    minimumCharge: 250,
    bookingFee: 5,
    fuelCharge: 10,
    fuelDiscount: -25,
    image: "/images/venues/party-bus-motorcoach.jpg",
    description: "Best for larger weddings, convention groups, golf outings, and structured event transportation where capacity matters most.",
    features: ["Executive coach format", "Large group logistics", "Best for airport and venue coordination"],
    pricingNote: "2-hour minimum based on the Presidential rate sheet you supplied.",
  },
];

export const PARTY_BUS_SURCHARGE_RULES_2026: PartyBusSurchargeRule[] = [
  { date: "2026-01-01", title: "Holiday (NYD)", increase: 0.1 },
  { date: "2026-01-02", title: "Holiday Weekend", increase: 0.1 },
  { date: "2026-01-03", title: "Holiday Weekend", increase: 0.1 },
  { date: "2026-01-05", title: "CES 2026", increase: 0.3, minimumNote: "4 days / 12 hours minimum" },
  { date: "2026-01-06", title: "CES 2026", increase: 0.3, minimumNote: "4 days / 12 hours minimum" },
  { date: "2026-01-07", title: "CES 2026", increase: 0.3, minimumNote: "4 days / 12 hours minimum" },
  { date: "2026-01-08", title: "CES 2026", increase: 0.3, minimumNote: "4 days / 12 hours minimum" },
  { date: "2026-01-09", title: "CES 2026", increase: 0.3, minimumNote: "4 days / 12 hours minimum" },
  { date: "2026-01-19", title: "World of Concrete / SHOT Show", increase: 0.2 },
  { date: "2026-01-20", title: "World of Concrete / SHOT Show", increase: 0.2 },
  { date: "2026-01-21", title: "World of Concrete / SHOT Show", increase: 0.2 },
  { date: "2026-01-22", title: "World of Concrete / SHOT Show", increase: 0.2 },
  { date: "2026-01-23", title: "World of Concrete / SHOT Show", increase: 0.2 },
  { date: "2026-02-06", title: "Super Bowl Weekend", increase: 0.2 },
  { date: "2026-02-07", title: "Super Bowl Weekend", increase: 0.2 },
  { date: "2026-02-08", title: "Super Bowl Weekend", increase: 0.2 },
  {
    date: "2026-02-28",
    title: "Rugby League Las Vegas",
    increase: 0.2,
    minimumNote: "Allegiant events require 4-hour roundtrip bookings as wait-and-return.",
  },
  { date: "2026-03-03", title: "CONEXPO-CON/AGG", increase: 0.2 },
  { date: "2026-03-04", title: "CONEXPO-CON/AGG", increase: 0.2 },
  { date: "2026-03-05", title: "CONEXPO-CON/AGG", increase: 0.2 },
  { date: "2026-03-06", title: "CONEXPO-CON/AGG", increase: 0.2 },
  { date: "2026-03-07", title: "CONEXPO-CON/AGG", increase: 0.2 },
  {
    date: "2026-03-15",
    title: "NASCAR",
    increase: 0.2,
    minimumNote: "8-hour minimum to Motor Speedway as wait-and-return.",
  },
  { date: "2026-04-03", title: "College Crown", increase: 0.2 },
  { date: "2026-04-04", title: "College Crown", increase: 0.2 },
  { date: "2026-04-05", title: "College Crown", increase: 0.2 },
  {
    date: "2026-04-17",
    title: "WrestleMania at Allegiant Stadium",
    increase: 0.2,
    minimumNote: "Allegiant events require 4-hour roundtrip bookings as wait-and-return.",
  },
  {
    date: "2026-04-18",
    title: "WrestleMania at Allegiant Stadium",
    increase: 0.2,
    minimumNote: "Allegiant events require 4-hour roundtrip bookings as wait-and-return.",
  },
  {
    date: "2026-04-19",
    title: "WrestleMania at Allegiant Stadium",
    increase: 0.2,
    minimumNote: "Allegiant events require 4-hour roundtrip bookings as wait-and-return.",
  },
  {
    date: "2026-05-15",
    title: "EDC",
    increase: 0.2,
    minimumNote: "8-hour minimum for Speedway roundtrips or 4-hour drop-off only bookings.",
  },
  {
    date: "2026-05-16",
    title: "EDC",
    increase: 0.2,
    minimumNote: "8-hour minimum for Speedway roundtrips or 4-hour drop-off only bookings.",
  },
  {
    date: "2026-05-17",
    title: "EDC",
    increase: 0.2,
    minimumNote: "8-hour minimum for Speedway roundtrips or 4-hour drop-off only bookings.",
  },
  {
    date: "2026-05-18",
    title: "EDC",
    increase: 0.2,
    minimumNote: "8-hour minimum for Speedway roundtrips or 4-hour drop-off only bookings.",
  },
  {
    date: "2026-11-18",
    title: "Formula 1",
    increase: 0.3,
    minimumNote: "Airport arrivals have special minimums. F1-related trips may require extended service.",
  },
  {
    date: "2026-11-19",
    title: "Formula 1",
    increase: 0.3,
    minimumNote: "Airport arrivals have special minimums. F1-related trips may require extended service.",
  },
  {
    date: "2026-11-20",
    title: "Formula 1",
    increase: 0.3,
    minimumNote: "Airport arrivals have special minimums. F1-related trips may require extended service.",
  },
  {
    date: "2026-11-21",
    title: "Formula 1 Race Day",
    increase: 0.3,
    minimumNote: "Race day can require up to an 8-hour minimum for F1-related service.",
  },
  {
    date: "2026-11-22",
    title: "Formula 1",
    increase: 0.3,
    minimumNote: "Airport arrivals have special minimums. F1-related trips may require extended service.",
  },
];

export function getPartyBusVehicle(slug: string) {
  return PARTY_BUS_VEHICLES.find((vehicle) => vehicle.slug === slug) ?? PARTY_BUS_VEHICLES[0];
}

export function getPartyBusSurcharge(date: string) {
  return PARTY_BUS_SURCHARGE_RULES_2026.find((entry) => entry.date === date) ?? null;
}

export function extractRequiredHours(note?: string, fallback = 0) {
  if (!note) return fallback;
  const matches = Array.from(note.matchAll(/(\d+(?:\.\d+)?)\s*(?:hour|hr)/gi));
  const hours = matches.map((match) => Number(match[1])).filter((value) => Number.isFinite(value));
  return hours.length > 0 ? Math.max(...hours) : fallback;
}

export function calculatePartyBusEstimate({
  vehicleSlug,
  hours,
  date,
}: {
  vehicleSlug: string;
  hours: number;
  date: string;
}) {
  const vehicle = getPartyBusVehicle(vehicleSlug);
  const surchargeRule = getPartyBusSurcharge(date);

  if (!vehicle.hourlyRate) {
    return {
      vehicle,
      surchargeRule,
      effectiveHours: vehicle.minimumHours ?? hours,
      serviceCharge: null,
      fuelCharge: vehicle.fuelCharge ?? 0,
      bookingFee: vehicle.bookingFee ?? 0,
      fuelDiscount: vehicle.fuelDiscount ?? 0,
      preTaxSubtotal: null,
      surchargeAmount: null,
      exciseTax: null,
      serviceFee: PARTY_BUS_SERVICE_FEE,
      totalEstimate: null,
    };
  }

  const ruleMinimum = extractRequiredHours(surchargeRule?.minimumNote, 0);
  const effectiveHours = Math.max(hours, vehicle.minimumHours ?? 0, ruleMinimum);
  const serviceCharge = effectiveHours * vehicle.hourlyRate;
  const minimumCharge = vehicle.minimumCharge ?? serviceCharge;
  const baseCharge = Math.max(serviceCharge, minimumCharge);
  const fuelDiscount = vehicle.fuelDiscount ?? 0;
  const fuelCharge = vehicle.fuelCharge ?? 0;
  const bookingFee = vehicle.bookingFee ?? 0;
  const preTaxSubtotal = baseCharge + fuelDiscount + fuelCharge + bookingFee;
  const surchargeAmount = preTaxSubtotal * (surchargeRule?.increase ?? 0);
  const exciseTax = (preTaxSubtotal + surchargeAmount) * 0.03;
  const serviceFee = PARTY_BUS_SERVICE_FEE;
  const totalEstimate = preTaxSubtotal + surchargeAmount + exciseTax + serviceFee;

  return {
    vehicle,
    surchargeRule,
    effectiveHours,
    serviceCharge,
    fuelCharge,
    bookingFee,
    fuelDiscount,
    preTaxSubtotal,
    surchargeAmount,
    exciseTax,
    serviceFee,
    totalEstimate,
  };
}
