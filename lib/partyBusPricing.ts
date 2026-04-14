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
  airportFee?: number;
  image: string;
  description: string;
  features: string[];
  pricingNote?: string;
}

export type PartyBusPickupLocation = "strip" | "airport" | "off-strip";

export interface PartyBusSurchargeRule {
  date: string;
  title: string;
  increase: number;
  minimumNote?: string;
}

export const PARTY_BUS_SERVICE_FEE = 25;

export const PARTY_BUS_VEHICLES: PartyBusVehicle[] = [
  {
    slug: "tesla-x-3",
    name: "Tesla X",
    seats: 3,
    recommendedPaxWithLuggage: 3,
    hourlyRate: 66,
    minimumHours: 1,
    minimumCharge: 66,
    bookingFee: 5,
    fuelCharge: 0,
    fuelDiscount: -6.6,
    airportFee: 6,
    image: "/images/venues/party-bus-suv.jpg",
    description: "Best for premium airport-to-hotel and hotel-to-dinner transfers with a polished EV feel.",
    features: ["Tesla Model X", "Low-profile VIP transfers", "Great for couples and small groups"],
  },
  {
    slug: "luxe-ev-suv-4",
    name: "Luxe EV SUV",
    seats: 4,
    recommendedPaxWithLuggage: 3,
    hourlyRate: 70,
    minimumHours: 1,
    minimumCharge: 70,
    bookingFee: 5,
    fuelCharge: 0,
    fuelDiscount: -7,
    airportFee: 6,
    image: "/images/venues/party-bus-suv.jpg",
    description: "A quiet premium SUV option for elevated Strip dinners, hotel moves, and executive-style transportation.",
    features: ["Rivian EV SUV", "Luxury low-key arrival", "Smooth for smaller parties"],
  },
  {
    slug: "luxe-suv-6",
    name: "Luxe SUV",
    seats: 6,
    recommendedPaxWithLuggage: 4,
    hourlyRate: 80,
    minimumHours: 1,
    minimumCharge: 80,
    bookingFee: 5,
    fuelCharge: 5,
    fuelDiscount: -8,
    airportFee: 6,
    image: "/images/venues/party-bus-suv.jpg",
    description: "A more elevated SUV transfer option for VIP dinners, nightlife arrivals, and tighter itineraries.",
    features: ["Cadillac Escalade class", "Luxury SUV transfer", "Works well for 4-6 guests"],
  },
  {
    slug: "limo-sedan-6",
    name: "Limo Sedan 6",
    seats: 6,
    recommendedPaxWithLuggage: 6,
    hourlyRate: 85,
    minimumHours: 1,
    minimumCharge: 85,
    bookingFee: 5,
    fuelCharge: 5,
    fuelDiscount: -8.5,
    airportFee: 6,
    image: "/images/venues/party-bus-suv.jpg",
    description: "Stretch-sedan styling for smaller groups who still want a nightlife-forward arrival.",
    features: ["Lincoln MKT Ultra", "Classic limo feel", "Great for date-night or smaller VIP groups"],
  },
  {
    slug: "limo-sedan-8",
    name: "Limo Sedan 8",
    seats: 8,
    recommendedPaxWithLuggage: 6,
    hourlyRate: 95,
    minimumHours: 1,
    minimumCharge: 95,
    bookingFee: 5,
    fuelCharge: 5,
    fuelDiscount: -9.5,
    airportFee: 6,
    image: "/images/venues/party-bus-suv.jpg",
    description: "A roomier limo sedan option for birthdays, dinner reservations, and classic Las Vegas arrivals.",
    features: ["Lincoln MKT Ultra", "Nightlife-focused styling", "Comfortable for 6-8 guests"],
  },
  {
    slug: "limo-suv-6",
    name: "Limo SUV 6",
    seats: 6,
    recommendedPaxWithLuggage: 6,
    hourlyRate: 90,
    minimumHours: 1,
    minimumCharge: 90,
    bookingFee: 5,
    fuelCharge: 5,
    fuelDiscount: -9,
    airportFee: 6,
    image: "/images/venues/party-bus-suv.jpg",
    description: "SUV transfer with a nightlife look, ideal for dinner, club arrivals, and hotel-to-venue runs.",
    features: ["Suburban/Yukon class", "Luxury SUV transfer", "Best for 4-6 guests with comfort"],
  },
  {
    slug: "limo-suv-8",
    name: "Limo SUV 8",
    seats: 8,
    recommendedPaxWithLuggage: 6,
    hourlyRate: 100,
    minimumHours: 1,
    minimumCharge: 100,
    bookingFee: 5,
    fuelCharge: 5,
    fuelDiscount: -10,
    airportFee: 6,
    image: "/images/venues/party-bus-suv.jpg",
    description: "A larger SUV option that keeps the group together without stepping up to a sprinter.",
    features: ["Suburban/Yukon class", "Smooth nightlife transfers", "Good fit for 6-8 guests"],
  },
  {
    slug: "limo-suv-10",
    name: "Limo SUV 10",
    seats: 10,
    recommendedPaxWithLuggage: 8,
    hourlyRate: 120,
    minimumHours: 1,
    minimumCharge: 120,
    bookingFee: 5,
    fuelCharge: 5,
    fuelDiscount: -12,
    airportFee: 6,
    image: "/images/venues/party-bus-suv.jpg",
    description: "A higher-capacity SUV for birthday groups, wedding guests, and more flexible multi-stop plans.",
    features: ["GMC Yukon class", "Larger small-group option", "Strong fit for 8-10 guests"],
  },
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
    airportFee: 6,
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
    airportFee: 6,
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
    airportFee: 6,
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
    airportFee: 6,
    image: "/images/venues/party-bus-suv.jpg",
    description: "Stretch SUV styling with a more nightlife-first feel for dinner, clubs, and elevated photo-stop itineraries.",
    features: ["Chevrolet/GMC pink Yukon class", "1.5-hour base minimum", "Good for shorter VIP hops"],
  },
  {
    slug: "specialty-limo-pink-12",
    name: "Specialty Limo Pink",
    seats: 12,
    recommendedPaxWithLuggage: 10,
    hourlyRate: 130,
    minimumHours: 1.5,
    minimumCharge: 195,
    bookingFee: 5,
    fuelCharge: 7.5,
    fuelDiscount: -19.5,
    airportFee: 6,
    image: "/images/venues/party-bus-suv.jpg",
    description: "A bachelorette-friendly pink Yukon option that feels more playful while keeping the same practical capacity.",
    features: ["Pink specialty Yukon", "Popular for bachelorette groups", "1.5-hour base minimum"],
  },
  {
    slug: "luxe-van-executive-10",
    name: "Luxe Van Executive",
    seats: 10,
    recommendedPaxWithLuggage: 10,
    hourlyRate: 120,
    minimumHours: 1,
    minimumCharge: 120,
    bookingFee: 5,
    fuelCharge: 6,
    fuelDiscount: -12,
    airportFee: 6,
    image: "/images/venues/party-bus-sprinter.jpg",
    description: "Executive van styling for cleaner corporate, convention, and premium private-group movements.",
    features: ["Transit / Sprinter class", "Executive transfer layout", "Strong for luggage-heavy groups"],
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
    airportFee: 6,
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
    airportFee: 6,
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
  pickupLocation,
}: {
  vehicleSlug: string;
  hours: number;
  date: string;
  pickupLocation: PartyBusPickupLocation;
}) {
  const vehicle = getPartyBusVehicle(vehicleSlug);
  const surchargeRule = getPartyBusSurcharge(date);

  if (pickupLocation === "off-strip") {
    return {
      vehicle,
      surchargeRule,
      pickupLocation,
      effectiveHours: vehicle.minimumHours ?? hours,
      serviceCharge: null,
      fuelCharge: vehicle.fuelCharge ?? 0,
      bookingFee: vehicle.bookingFee ?? 0,
      fuelDiscount: vehicle.fuelDiscount ?? 0,
      airportFee: vehicle.airportFee ?? 0,
      preTaxSubtotal: null,
      surchargeAmount: null,
      exciseTax: null,
      serviceFee: PARTY_BUS_SERVICE_FEE,
      totalEstimate: null,
    };
  }

  if (!vehicle.hourlyRate) {
    return {
      vehicle,
      surchargeRule,
      pickupLocation,
      effectiveHours: vehicle.minimumHours ?? hours,
      serviceCharge: null,
      fuelCharge: vehicle.fuelCharge ?? 0,
      bookingFee: vehicle.bookingFee ?? 0,
      fuelDiscount: vehicle.fuelDiscount ?? 0,
      airportFee: vehicle.airportFee ?? 0,
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
  const airportFee = pickupLocation === "airport" ? vehicle.airportFee ?? 0 : 0;
  const preTaxSubtotal = baseCharge + fuelDiscount + fuelCharge + bookingFee + airportFee;
  const surchargeAmount = preTaxSubtotal * (surchargeRule?.increase ?? 0);
  const exciseTax = (preTaxSubtotal + surchargeAmount) * 0.03;
  const serviceFee = PARTY_BUS_SERVICE_FEE;
  const totalEstimate = preTaxSubtotal + surchargeAmount + exciseTax + serviceFee;

  return {
    vehicle,
    surchargeRule,
    pickupLocation,
    effectiveHours,
    serviceCharge,
    fuelCharge,
    bookingFee,
    fuelDiscount,
    airportFee,
    preTaxSubtotal,
    surchargeAmount,
    exciseTax,
    serviceFee,
    totalEstimate,
  };
}
