import { sql } from "@vercel/postgres";
import fs from "node:fs/promises";
import path from "node:path";
import { getSectionsForEvent } from "@/lib/db/client";
import { parseEventDescription, type ParsedEvent } from "@/lib/calendarParser";
import { filterDisplayEvents } from "@/lib/eventDeduplication";
import {
  fetchBooketingVenueEvents,
  isBooketingVenue,
} from "@/lib/booketingClient";
import {
  normalizeEventName,
  type FlyerManifestEntry,
} from "@/lib/flyerMatching";

let flyerManifestPromise: Promise<FlyerManifestEntry[]> | null = null;

export function clearEventCache() {
  console.log('[CACHE] Cleared month data cache');
}

function isWeekdaySectionTitle(value: string) {
  return /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/i.test(
    String(value || "").trim()
  );
}

function shouldReparseSectionsFromDescription(
  sections: Awaited<ReturnType<typeof getSectionsForEvent>>,
  rawDescription?: string
) {
  if (!sections.length) return false;

  if (sections.some((section) => isWeekdaySectionTitle(section.title))) {
    return true;
  }

  if (
    sections.some((section) =>
      section.tiers.some((tier) => /[•|]/.test(String(tier.name || "")))
    )
  ) {
    return true;
  }

  if (
    sections.length === 1 &&
    typeof rawDescription === "string" &&
    /^\s*[A-Z][A-Z0-9/&' -]{2,}\s*$/m.test(rawDescription)
  ) {
    return true;
  }

  return false;
}

async function getFlyerManifest() {
  if (!flyerManifestPromise) {
    flyerManifestPromise = fs
      .readFile(
        path.join(process.cwd(), "public", "event-flyers", "manifest.json"),
        "utf8"
      )
      .then((content) => JSON.parse(content) as FlyerManifestEntry[])
      .catch(() => []);
  }

  return flyerManifestPromise;
}

function shiftDateKey(dateKey: string, days: number) {
  const date = new Date(`${dateKey}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function buildMonthRange(month: string) {
  const [year, monthNum] = month.split("-");
  const yearNum = parseInt(year, 10);
  const monthIndex = parseInt(monthNum, 10) - 1;

  return {
    startDate: new Date(Date.UTC(yearNum, monthIndex, 1, 0, 0, 0)),
    endDate: new Date(Date.UTC(yearNum, monthIndex + 1, 0, 23, 59, 59)),
  };
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

function scoreFlyerEntry(entry: FlyerManifestEntry, targetSlug: string) {
  const entrySlug = slugify(normalizeEventName(entry.eventName));
  if (!entrySlug || !targetSlug) return 0;

  let score = 0;
  if (entrySlug === targetSlug) {
    score += 30;
  } else if (entrySlug.includes(targetSlug) || targetSlug.includes(entrySlug)) {
    score += 18;
  }

  const entryWords = new Set(entrySlug.split("-").filter(Boolean));
  const targetWords = targetSlug.split("-").filter(Boolean);
  score += targetWords.filter((word) => entryWords.has(word)).length * 3;
  score += Math.min(6, Math.max(0, entryWords.size - 2));

  return score;
}

function findCalendarFlyer(
  manifest: FlyerManifestEntry[],
  venueSlug: string,
  eventName: string,
  dateKey: string
) {
  const targetSlug = slugify(normalizeEventName(eventName));
  const candidateDates = new Set([
    dateKey,
    shiftDateKey(dateKey, -1),
    shiftDateKey(dateKey, 1),
  ]);
  let bestEntry: FlyerManifestEntry | null = null;
  let bestScore = 0;

  for (const entry of manifest) {
    if (entry.venueSlug !== venueSlug || !candidateDates.has(entry.date)) {
      continue;
    }

    const score = scoreFlyerEntry(entry, targetSlug);
    if (score > bestScore) {
      bestEntry = entry;
      bestScore = score;
    }
  }

  return bestScore > 0 ? bestEntry : null;
}

function applyCalendarFlyer(
  event: ParsedEvent,
  flyerManifest: FlyerManifestEntry[],
  venue: string
) {
  const flyerMatch = findCalendarFlyer(
    flyerManifest,
    venue,
    event.eventName,
    event.dateKey
  );

  if (flyerMatch) {
    if (!event.flyerImagePath || event.flyerImagePath.startsWith("/")) {
      event.flyerImagePath = flyerMatch.imagePath;
      event.flyerSourceUrl = event.flyerSourceUrl || flyerMatch.sourceUrl;
    } else {
      event.flyerSourceUrl = flyerMatch.imagePath || event.flyerSourceUrl;
    }
  }

  return event;
}

async function getLiveBooketingEvents(
  venue: string,
  month: string,
  flyerManifest: FlyerManifestEntry[]
) {
  const { startDate, endDate } = buildMonthRange(month);
  const events = await fetchBooketingVenueEvents(venue, startDate, endDate);

  return filterDisplayEvents(
    events
      .filter((event) => event.dateKey.startsWith(month))
      .map((event) => applyCalendarFlyer(event, flyerManifest, venue))
  );
}

async function getMonthEventsFromDB(month: string) {
  // Note: In-memory caching doesn't work reliably in serverless/distributed environment
  // Each request might go to a different process instance, making cache invalidation unreliable
  // Fetch fresh from database every time

  try {
    const [year, monthNum] = month.split("-");
    const yearNum = parseInt(year, 10);
    const monthIndex = parseInt(monthNum, 10) - 1;

    // Query a wider range (previous month through next month) to handle timezone conversions
    // This ensures we get all events that might display in this month when converted to LA time
    const queryStart = new Date(Date.UTC(yearNum, monthIndex - 1, 1, 0, 0, 0));
    const queryEnd = new Date(Date.UTC(yearNum, monthIndex + 2, 1, 0, 0, 0));

    console.log(`[DB-QUERY] Fetching events for ${month}: ${queryStart.toISOString()} to ${queryEnd.toISOString()}`);

    const result = await sql`
      SELECT event_id, venue_id, event_title, event_description, start_time, raw_data
      FROM events
      WHERE start_time >= ${queryStart.toISOString()}
        AND start_time < ${queryEnd.toISOString()}
      ORDER BY venue_id, start_time
    `;

    console.log(`[DB-QUERY] Found ${result.rows.length} total events for month ${month}`);

    // Group by venue
    const eventsByVenue: Record<string, any[]> = {};
    for (const row of result.rows) {
      if (!eventsByVenue[row.venue_id]) {
        eventsByVenue[row.venue_id] = [];
      }
      eventsByVenue[row.venue_id].push(row);
    }

    console.log(`[DB-QUERY] Grouped into ${Object.keys(eventsByVenue).length} venues:`, Object.keys(eventsByVenue));
    return eventsByVenue;
  } catch (error) {
    console.error(`Error fetching month events for ${month}:`, error);
    return {};
  }
}

export async function getCachedVenueEvents(
  venue: string,
  month: string | null
): Promise<ParsedEvent[]> {
  if (!month) {
    return [];
  }

  try {
    console.log(`[API] getCachedVenueEvents called: venue=${venue}, month=${month}`);
    const flyerManifest = await getFlyerManifest();

    if (isBooketingVenue(venue)) {
      try {
        const liveEvents = await getLiveBooketingEvents(venue, month, flyerManifest);
        console.log(`[API] live Booketing events for ${venue}: ${liveEvents.length}`);

        if (liveEvents.length > 0) {
          return liveEvents;
        }
      } catch (error) {
        console.warn(`[API] Live Booketing fallback failed for ${venue} ${month}:`, error);
      }
    }

    const eventsByVenue = await getMonthEventsFromDB(month);
    console.log(`[API] eventsByVenue keys:`, Object.keys(eventsByVenue));
    const venueEvents = eventsByVenue[venue] || [];
    console.log(`[API] venueEvents for ${venue}: ${venueEvents.length} events`);

    // Transform database events to ParsedEvent format with sections/pricing
    const parsedEvents: ParsedEvent[] = [];

    for (const event of venueEvents) {
      const startDate = new Date(event.start_time);
      const rawData =
        event.raw_data && typeof event.raw_data === "object" ? event.raw_data : undefined;

      // Format dates in Las Vegas timezone (America/Los_Angeles)
      const laFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const formattedDate = laFormatter.format(startDate);
      const [monthStr, dayStr, yearStr] = formattedDate.split("/");
      const dateKey = `${yearStr}-${monthStr}-${dayStr}`; // Convert MM/DD/YYYY to YYYY-MM-DD

      // Fetch sections and pricing tiers for this event
      let sections = await getSectionsForEvent(event.event_id);

      // Some older synced rows stored weekday headings like "Thursday" as section titles.
      // Reparse from the raw description at read time so the UI can recover immediately.
      if (
        shouldReparseSectionsFromDescription(
          sections,
          typeof event.event_description === "string" ? event.event_description : undefined
        ) &&
        typeof event.event_description === "string" &&
        event.event_description.trim()
      ) {
        const reparsed = parseEventDescription(
          event.event_description,
          event.event_id,
          event.event_title,
          startDate,
          dateKey
        );
        if (reparsed?.sections.length) {
          sections = reparsed.sections;
        }
      }

      const parsedEvent: ParsedEvent = {
        id: event.event_id,
        eventName: event.event_title,
        date: startDate,
        dateKey,
        dateString: startDate.toLocaleDateString("en-US", {
          timeZone: "America/Los_Angeles",
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
        sections,
        timeLabel:
          typeof rawData?.timeLabel === "string" ? rawData.timeLabel : undefined,
        timeSortKey:
          typeof rawData?.timeSortKey === "string" ? rawData.timeSortKey : undefined,
        flyerImagePath:
          typeof rawData?.flyerImagePath === "string"
            ? rawData.flyerImagePath
            : undefined,
        flyerSourceUrl:
          typeof rawData?.flyerSourceUrl === "string"
            ? rawData.flyerSourceUrl
            : undefined,
        pricingNote:
          typeof rawData?.pricingNote === "string" ? rawData.pricingNote : undefined,
        minimumSpendNote:
          typeof rawData?.minimumSpendNote === "string"
            ? rawData.minimumSpendNote
            : undefined,
      };
      applyCalendarFlyer(parsedEvent, flyerManifest, venue);

      if (parsedEvent.dateKey.startsWith(month)) {
        parsedEvents.push(parsedEvent);
      }
    }

    return filterDisplayEvents(parsedEvents);
  } catch (error) {
    console.error(
      `Error in getCachedVenueEvents for ${venue} ${month}:`,
      error
    );
    return [];
  }
}
