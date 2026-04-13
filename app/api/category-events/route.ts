export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
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

interface CategoryEventItem {
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

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function getMonthKeysInRange(startDate: Date, days: number) {
  const keys = new Set<string>();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days - 1);

  const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const endCursor = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  while (cursor <= endCursor) {
    keys.add(formatMonthKey(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return Array.from(keys);
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

async function getCategoryEvents(category: CategoryEventsKey, startDate: Date, days: number) {
  const venues = getCategoryVenueCards(category);
  const monthKeys = getMonthKeysInRange(startDate, days);
  const manifest = await getFlyerManifest();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days - 1);
  endDate.setHours(23, 59, 59, 999);

  const venueEvents = await Promise.all(
    venues.map(async (venue) => {
      const monthlyResults = await Promise.all(
        monthKeys.map((monthKey) => getCachedVenueEvents(venue.venueSlug, monthKey))
      );

      return {
        venue,
        events: monthlyResults.flat(),
      };
    })
  );

  const items: CategoryEventItem[] = [];

  for (const { venue, events } of venueEvents) {
    for (const event of events) {
      const eventDate = parseDateKey(event.dateKey);
      if (eventDate < startDate || eventDate > endDate) continue;

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as CategoryEventsKey | null;
    const startDateParam = searchParams.get("start_date");
    const daysParam = Number(searchParams.get("days") || 3);

    if (category !== "all" && category !== "nightclubs" && category !== "pool-parties") {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    if (!startDateParam || !/^\d{4}-\d{2}-\d{2}$/.test(startDateParam)) {
      return NextResponse.json({ error: "Invalid start_date" }, { status: 400 });
    }

    const startDate = parseDateKey(startDateParam);
    const days = Number.isFinite(daysParam) && daysParam > 0 ? Math.min(daysParam, 7) : 3;
    const events = await getCategoryEvents(category, startDate, days);

    return NextResponse.json(
      {
        events,
        startDate: startDateParam,
        days,
      },
      {
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Category events API error:", error);
    return NextResponse.json({ events: [] }, { status: 200 });
  }
}
