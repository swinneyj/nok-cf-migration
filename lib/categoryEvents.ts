import fs from "node:fs/promises";
import path from "node:path";
import { sql } from "@vercel/postgres";
import {
  getCategoryVenueCards,
  poolPartyVenues,
  type CategoryVenueCard,
  type CategoryEventsKey,
} from "@/lib/categoryVenueData";
import { BOOKETING_VENUE_SLUGS, isBooketingVenue } from "@/lib/booketingClient";
import type { FlyerManifestEntry } from "@/lib/flyerMatching";

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

function buildMonthQueryRange(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  const monthIndex = month - 1;
  const startDate = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0, 0));
  startDate.setUTCDate(startDate.getUTCDate() - 1);

  const endDate = new Date(Date.UTC(year, monthIndex + 1, 1, 0, 0, 0, 0));
  endDate.setUTCDate(endDate.getUTCDate() + 2);

  return {
    startIso: startDate.toISOString(),
    endIso: endDate.toISOString(),
  };
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

  if (!sameDateEntries.length) return undefined;

  let bestEntry: FlyerManifestEntry | undefined;
  let bestScore = 0;

  for (const entry of sameDateEntries) {
    const entrySlug = slugify(normalizeEventName(entry.eventName));
    let score = 0;

    if (entrySlug === targetSlug) {
      score += 30;
    } else if (entrySlug && targetSlug && (entrySlug.includes(targetSlug) || targetSlug.includes(entrySlug))) {
      score += 18;
    }

    const entryWords = new Set(entrySlug.split("-").filter(Boolean));
    const targetWords = targetSlug.split("-").filter(Boolean);
    score += targetWords.filter((word) => entryWords.has(word)).length * 3;
    score += Math.min(6, Math.max(0, entryWords.size - 2));

    if (score > bestScore || (score === bestScore && bestEntry)) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  return bestScore > 0 ? bestEntry?.imagePath : undefined;
}

function resolveCategoryFlyerImagePath(
  manifest: FlyerManifestEntry[],
  venueSlug: string,
  eventName: string,
  dateKey: string,
  rawData: Record<string, any> | undefined,
  fallbackImagePath: string
) {
  const booketingFlyerPath =
    isBooketingVenue(venueSlug) &&
    typeof rawData?.flyerImagePath === "string" &&
    rawData.flyerImagePath.trim()
      ? rawData.flyerImagePath.trim()
      : undefined;
  const manifestFlyerPath = findBestFlyer(manifest, venueSlug, eventName, dateKey);

  return booketingFlyerPath || manifestFlyerPath || fallbackImagePath;
}

function buildEventHref(venue: CategoryVenueCard, eventName: string, dateKey: string) {
  const params = new URLSearchParams({
    event: slugify(normalizeEventName(eventName)),
    date: dateKey,
  });

  return `${venue.href}?${params.toString()}#event-booking`;
}

function sortCategoryEventItems(items: CategoryEventItem[]) {
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
  const venueBySlug = new Map(venues.map((venue) => [venue.venueSlug, venue]));
  const venueIds = venues.map((venue) => venue.venueSlug);
  const manifest = await getFlyerManifest();
  const { startIso, endIso } = buildMonthQueryRange(monthKey);

  if (venueIds.length === 0) {
    return [];
  }

  const result = await sql.query(
    `
      SELECT event_id, venue_id, event_title, start_time, raw_data
      FROM events
      WHERE venue_id = ANY($1::text[])
        AND start_time >= $2
        AND start_time < $3
        AND NOT (venue_id = ANY($4::text[]) AND calendar_id IS DISTINCT FROM 'booketing')
      ORDER BY start_time ASC, venue_id ASC
    `,
    [venueIds, startIso, endIso, BOOKETING_VENUE_SLUGS]
  );

  const items: CategoryEventItem[] = [];
  for (const row of result.rows) {
    const venue = venueBySlug.get(String((row as any).venue_id));
    if (!venue) continue;

    const startTime = new Date((row as any).start_time);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(startTime);
    const [monthStr, dayStr, yearStr] = formattedDate.split("/");
    const dateKey = `${yearStr}-${monthStr}-${dayStr}`;

    if (!dateKey.startsWith(monthKey)) {
      continue;
    }

    const eventName = String((row as any).event_title || "");
    const rawData =
      (row as any).raw_data && typeof (row as any).raw_data === "object"
        ? ((row as any).raw_data as Record<string, any>)
        : undefined;
    const eventCategory = poolPartyVenues.some((card) => card.venueSlug === venue.venueSlug)
      ? "pool-parties"
      : "nightclubs";
    const displayTime = CATEGORY_DISPLAY_TIMES[eventCategory];
    const imagePath = resolveCategoryFlyerImagePath(
      manifest,
      venue.venueSlug,
      eventName,
      dateKey,
      rawData,
      venue.img
    );

    items.push({
      id: `${venue.venueSlug}:${(row as any).event_id}:${dateKey}`,
      eventName,
      dateKey,
      dateString: startTime.toLocaleDateString("en-US", {
        timeZone: "America/Los_Angeles",
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      timeLabel: displayTime.timeLabel,
      timeSortKey: displayTime.timeSortKey,
      category: eventCategory,
      venueSlug: venue.venueSlug,
      venueName: venue.name,
      venueLocation: venue.venue,
      venueHref: venue.href,
      eventHref: buildEventHref(venue, eventName, dateKey),
      imagePath,
    });
  }

  return sortCategoryEventItems(items);
}

export async function getCategoryMonthEvents(category: CategoryEventsKey, monthKey: string) {
  return loadCategoryMonthEvents(category, monthKey);
}

export async function searchCategoryEvents(
  category: CategoryEventsKey,
  _startDateParam: string,
  query: string
) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }

  const venues = getCategoryVenueCards(category);
  const venueBySlug = new Map(venues.map((venue) => [venue.venueSlug, venue]));
  const venueIds = venues.map((venue) => venue.venueSlug);
  const manifest = await getFlyerManifest();
  const startDate = parseCategoryEventsDateKey(buildTodayDateKey());

  const result = await sql.query(
    `
      SELECT event_id, venue_id, event_title, start_time, raw_data
      FROM events
      WHERE venue_id = ANY($1::text[])
        AND start_time >= $2
        AND event_title ILIKE $3
        AND NOT (venue_id = ANY($4::text[]) AND calendar_id IS DISTINCT FROM 'booketing')
      ORDER BY start_time ASC, venue_id ASC
    `,
    [venueIds, startDate.toISOString(), `%${trimmedQuery}%`, BOOKETING_VENUE_SLUGS]
  );

  const items: CategoryEventItem[] = [];

  for (const row of result.rows) {
    const venue = venueBySlug.get(String((row as any).venue_id));
    if (!venue) continue;

    const startTime = new Date((row as any).start_time);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(startTime);
    const [monthStr, dayStr, yearStr] = formattedDate.split("/");
    const dateKey = `${yearStr}-${monthStr}-${dayStr}`;
    const eventName = String((row as any).event_title || "");
    const rawData =
      (row as any).raw_data && typeof (row as any).raw_data === "object"
        ? ((row as any).raw_data as Record<string, any>)
        : undefined;
    const eventCategory = poolPartyVenues.some((card) => card.venueSlug === venue.venueSlug)
      ? "pool-parties"
      : "nightclubs";
    const displayTime = CATEGORY_DISPLAY_TIMES[eventCategory];
    const imagePath = resolveCategoryFlyerImagePath(
      manifest,
      venue.venueSlug,
      eventName,
      dateKey,
      rawData,
      venue.img
    );

    items.push({
      id: `${venue.venueSlug}:${(row as any).event_id}:${dateKey}`,
      eventName,
      dateKey,
      dateString: startTime.toLocaleDateString("en-US", {
        timeZone: "America/Los_Angeles",
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      timeLabel: displayTime.timeLabel,
      timeSortKey: displayTime.timeSortKey,
      category: eventCategory,
      venueSlug: venue.venueSlug,
      venueName: venue.name,
      venueLocation: venue.venue,
      venueHref: venue.href,
      eventHref: buildEventHref(venue, eventName, dateKey),
      imagePath,
    });
  }

  return sortCategoryEventItems(items);
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
