import fs from "node:fs/promises";
import path from "node:path";
import { unstable_cache } from "next/cache";
import { getCachedVenueEvents } from "@/lib/getCachedVenueEvents";
import {
  getCategoryVenueCards,
  poolPartyVenues,
  type CategoryEventsKey,
  type CategoryVenueCard,
} from "@/lib/categoryVenueData";

interface FlyerManifestEntry {
  venueSlug: string;
  eventName: string;
  date: string;
  imagePath: string;
}

export interface CategoryEventItem {
  id: string;
  eventName: string;
  dateKey: string;
  dateString: string;
  timeLabel?: string;
  timeSortKey?: string;
  category: Exclude<CategoryEventsKey, "all">;
  venueSlug: string;
  venueName: string;
  venueLocation: string;
  venueHref: string;
  eventHref: string;
  imagePath: string;
}

const CATEGORY_PRIORITY: Record<Exclude<CategoryEventsKey, "all">, number> = {
  "pool-parties": 0,
  nightclubs: 1,
};

const CATEGORY_DISPLAY_TIMES: Record<
  Exclude<CategoryEventsKey, "all">,
  { timeLabel: string; timeSortKey: string }
> = {
  "pool-parties": {
    timeLabel: "11 AM",
    timeSortKey: "11:00",
  },
  nightclubs: {
    timeLabel: "10:30 PM",
    timeSortKey: "22:30",
  },
};

let flyerManifestPromise: Promise<FlyerManifestEntry[]> | null = null;

export function formatDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function buildTodayDateKey() {
  return formatDateInputValue(new Date());
}

export function parseCategoryEventsDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function buildMonthKeyFromDateKey(dateKey: string) {
  const [year, month] = dateKey.split("-");
  return `${year}-${month}`;
}

function slugify(value: string) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeEventName(value: string) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/\b(guest list|tickets|vip tables|table service)\b/gi, "")
    .replace(/\s*[|•].*$/g, "")
    .trim();
}

function formatMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

async function getFlyerManifest() {
  if (!flyerManifestPromise) {
    flyerManifestPromise = fs
      .readFile(path.join(process.cwd(), "public", "event-flyers", "manifest.json"), "utf8")
      .then((content) => JSON.parse(content) as FlyerManifestEntry[])
      .catch(() => []);
  }

  return flyerManifestPromise;
}

function findBestFlyer(
  manifest: FlyerManifestEntry[],
  venueSlug: string,
  eventName: string,
  dateKey: string
) {
  const targetSlug = slugify(normalizeEventName(eventName));

  const sameDateEntries = manifest.filter(
    (entry) => entry.venueSlug === venueSlug && entry.date === dateKey
  );

  const exactMatch = sameDateEntries.find(
    (entry) => slugify(normalizeEventName(entry.eventName)) === targetSlug
  );
  if (exactMatch) return exactMatch.imagePath;

  const looseMatch = sameDateEntries.find((entry) => {
    const entrySlug = slugify(normalizeEventName(entry.eventName));
    return (
      entrySlug &&
      targetSlug &&
      (entrySlug.includes(targetSlug) || targetSlug.includes(entrySlug))
    );
  });

  return looseMatch?.imagePath;
}

function buildEventHref(venue: CategoryVenueCard, eventName: string, dateKey: string) {
  const params = new URLSearchParams({
    event: slugify(normalizeEventName(eventName)),
    date: dateKey,
  });

  return `${venue.href}?${params.toString()}#event-booking`;
}

export function filterCategoryEventsForWindow(
  events: CategoryEventItem[],
  startDateParam: string,
  days: number
) {
  const safeDays = Number.isFinite(days) && days > 0 ? Math.min(days, 7) : 3;
  const startDate = parseCategoryEventsDateKey(startDateParam);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + safeDays - 1);
  endDate.setHours(23, 59, 59, 999);

  return events.filter((event) => {
    const eventDate = parseCategoryEventsDateKey(event.dateKey);
    return eventDate >= startDate && eventDate <= endDate;
  });
}

async function loadCategoryMonthEvents(category: CategoryEventsKey, monthKey: string) {
  const venues = getCategoryVenueCards(category);
  const manifest = await getFlyerManifest();

  const venueEvents = await Promise.all(
    venues.map(async (venue) => ({
      venue,
      events: await getCachedVenueEvents(venue.venueSlug, monthKey),
    }))
  );

  const items: CategoryEventItem[] = [];

  for (const { venue, events } of venueEvents) {
    for (const event of events) {
      const eventCategory = poolPartyVenues.some((card) => card.venueSlug === venue.venueSlug)
        ? "pool-parties"
        : "nightclubs";
      const displayTime = CATEGORY_DISPLAY_TIMES[eventCategory];

      const imagePath =
        event.flyerImagePath ||
        findBestFlyer(manifest, venue.venueSlug, event.eventName, event.dateKey) ||
        venue.img;

      items.push({
        id: `${venue.venueSlug}:${event.id}:${event.dateKey}`,
        eventName: event.eventName,
        dateKey: event.dateKey,
        dateString: event.dateString,
        timeLabel: displayTime.timeLabel,
        timeSortKey: displayTime.timeSortKey,
        category: eventCategory,
        venueSlug: venue.venueSlug,
        venueName: venue.name,
        venueLocation: venue.venue,
        venueHref: venue.href,
        eventHref: buildEventHref(venue, event.eventName, event.dateKey),
        imagePath,
      });
    }
  }

  return items.sort((a, b) => {
    const dateCompare = a.dateKey.localeCompare(b.dateKey);
    if (dateCompare !== 0) return dateCompare;
    const categoryCompare = CATEGORY_PRIORITY[a.category] - CATEGORY_PRIORITY[b.category];
    if (categoryCompare !== 0) return categoryCompare;
    const timeCompare = (a.timeSortKey || "99:99").localeCompare(b.timeSortKey || "99:99");
    if (timeCompare !== 0) return timeCompare;
    return a.venueName.localeCompare(b.venueName);
  });
}

export async function getCategoryMonthEvents(category: CategoryEventsKey, monthKey: string) {
  const cacheKey = `category-month-events:${category}:${monthKey}`;

  const getCached = unstable_cache(async () => loadCategoryMonthEvents(category, monthKey), [cacheKey], {
    revalidate: 300,
    tags: [`category-events:${category}`, cacheKey],
  });

  return getCached();
}

export async function getCategoryEvents(
  category: CategoryEventsKey,
  startDateParam: string,
  days: number
) {
  const monthKey = buildMonthKeyFromDateKey(startDateParam) || formatMonthKey(new Date());
  const monthEvents = await getCategoryMonthEvents(category, monthKey);
  return filterCategoryEventsForWindow(monthEvents, startDateParam, days);
}
