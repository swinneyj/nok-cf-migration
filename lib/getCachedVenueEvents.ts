import { neon } from "@neondatabase/serverless";
import { isBooketingVenue } from "@/lib/booketingClient";
import { parseEventDescription, type EventSection, type ParsedEvent } from "@/lib/calendarParser";
import { filterDisplayEvents } from "@/lib/eventDeduplication";
import { findBestFlyerEntry, type FlyerManifestEntry } from "@/lib/flyerMatching";

type CachedDbEvent = {
  event_id: string;
  venue_id: string;
  event_title: string;
  event_description: string | null;
  start_time: string | Date;
  calendar_id: string | null;
  raw_data: Record<string, any> | null;
};

type CachedDbEventWithSections = CachedDbEvent & {
  sections: EventSection[];
};

type FlyerManifestLoadResult = {
  entries: FlyerManifestEntry[];
  loaded: boolean;
  url?: string;
  status?: number;
  error?: string;
};

type FlyerMatchProbe = {
  eventName: string;
  dateKey: string;
  candidateDateKeys: string[];
  sameVenueCount: number;
  sameDateCounts: Record<string, number>;
  matchedImagePath: string | null;
  matchedSourceUrl: string | null;
};

type FlyerDebugInfo = {
  origin?: string;
  manifestUrl?: string;
  manifestLoaded: boolean;
  manifestStatus?: number;
  manifestError?: string;
  manifestCount: number;
  sameVenueCount: number;
  rawEventCount: number;
  parsedEventCount: number;
  filteredEventCount: number;
  firstEventProbe: FlyerMatchProbe | null;
  firstRawFlyerImagePath: string | null;
  firstFilteredFlyerImagePath: string | null;
};

type ParsedEventsWithDebug = ParsedEvent[] & {
  debugFlyers?: FlyerDebugInfo;
};

const getSql = () => {
  const connectionString = process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error("Missing POSTGRES_URL environment variable");
  }

  return neon(connectionString);
};

export function clearEventCache() {
  console.log('[CACHE] Cleared month data cache');
}

function isWeekdaySectionTitle(value: string) {
  return /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/i.test(
    String(value || "").trim()
  );
}

function shouldReparseSectionsFromDescription(
  sections: EventSection[],
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

function hasUsableSections(value: unknown): value is ParsedEvent["sections"] {
  return (
    Array.isArray(value) &&
    value.some(
      (section) =>
        section &&
        typeof section === "object" &&
        Array.isArray((section as { tiers?: unknown[] }).tiers) &&
        (section as { tiers: unknown[] }).tiers.length > 0
    )
  );
}

const flyerManifestCache = new Map<string, FlyerManifestLoadResult>();

function isFlyerManifestEntry(entry: unknown): entry is FlyerManifestEntry {
  return (
    Boolean(entry) &&
    typeof entry === "object" &&
    typeof (entry as FlyerManifestEntry).venueSlug === "string" &&
    typeof (entry as FlyerManifestEntry).eventName === "string" &&
    typeof (entry as FlyerManifestEntry).date === "string" &&
    typeof (entry as FlyerManifestEntry).imagePath === "string"
  );
}

async function getFlyerManifest(origin?: string): Promise<FlyerManifestLoadResult> {
  if (!origin) {
    return {
      entries: [],
      loaded: false,
      error: "Missing request origin",
    };
  }

  try {
    const manifestUrl = new URL("/event-flyers/manifest.json", origin).toString();
    const cached = flyerManifestCache.get(manifestUrl);
    if (cached) {
      return cached;
    }

    const response = await fetch(manifestUrl, {
      headers: { accept: "application/json" },
      cache: "force-cache",
    });

    if (!response.ok) {
      const result = {
        entries: [],
        loaded: false,
        url: manifestUrl,
        status: response.status,
        error: `Manifest request failed with status ${response.status}`,
      };
      flyerManifestCache.set(manifestUrl, result);
      return result;
    }

    const parsed: unknown = await response.json();
    const result = {
      entries: Array.isArray(parsed) ? parsed.filter(isFlyerManifestEntry) : [],
      loaded: true,
      url: manifestUrl,
      status: response.status,
    };

    flyerManifestCache.set(manifestUrl, result);
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    console.warn("[FLYERS] Unable to load flyer manifest:", error);
    return {
      entries: [],
      loaded: false,
      error: message,
    };
  }
}

function addDaysToDateKey(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);

  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function getCandidateDateKeys(dateKey: string) {
  return [dateKey, addDaysToDateKey(dateKey, -1), addDaysToDateKey(dateKey, 1)];
}

function findEventFlyer(
  manifest: FlyerManifestEntry[],
  venue: string,
  eventName: string,
  dateKey: string
) {
  const candidateDateKeys = getCandidateDateKeys(dateKey);

  for (const candidateDateKey of candidateDateKeys) {
    const match = findBestFlyerEntry(manifest, venue, eventName, candidateDateKey);
    if (match) {
      return match;
    }
  }

  return null;
}

function buildFlyerMatchProbe(
  manifest: FlyerManifestEntry[],
  venue: string,
  eventName: string,
  dateKey: string,
  matchedFlyer: FlyerManifestEntry | null
): FlyerMatchProbe {
  const candidateDateKeys = getCandidateDateKeys(dateKey);
  const sameDateCounts = candidateDateKeys.reduce<Record<string, number>>(
    (counts, candidateDateKey) => {
      counts[candidateDateKey] = manifest.filter(
        (entry) => entry.venueSlug === venue && entry.date === candidateDateKey
      ).length;
      return counts;
    },
    {}
  );

  return {
    eventName,
    dateKey,
    candidateDateKeys,
    sameVenueCount: manifest.filter((entry) => entry.venueSlug === venue).length,
    sameDateCounts,
    matchedImagePath: matchedFlyer?.imagePath ?? null,
    matchedSourceUrl: matchedFlyer?.sourceUrl ?? null,
  };
}

async function getVenueEventsWithSectionsFromDB(
  venue: string,
  month: string
): Promise<CachedDbEventWithSections[]> {
  try {
    const sql = getSql();
    const [year, monthNum] = month.split("-");
    const yearNum = parseInt(year, 10);
    const monthIndex = parseInt(monthNum, 10) - 1;

    const queryStart = new Date(Date.UTC(yearNum, monthIndex - 1, 1, 0, 0, 0));
    const queryEnd = new Date(Date.UTC(yearNum, monthIndex + 2, 1, 0, 0, 0));

    console.log(`[DB-QUERY] Fetching events for venue=${venue}, month=${month}: ${queryStart.toISOString()} to ${queryEnd.toISOString()}`);

    const events = await sql`
      SELECT event_id, venue_id, event_title, event_description, start_time, calendar_id, raw_data
      FROM events
      WHERE venue_id = ${venue}
        AND start_time >= ${queryStart.toISOString()}
        AND start_time < ${queryEnd.toISOString()}
      ORDER BY start_time
    ` as CachedDbEvent[];

    console.log(`[DB-QUERY] Found ${events.length} events for venue=${venue}, month=${month}`);

    if (!events.length) {
      return [];
    }

    const eventIds = events.map((event) => String(event.event_id));

    const sections = await sql`
      SELECT id, event_id, section_title, section_description, section_order
      FROM event_sections
      WHERE event_id = ANY(${eventIds})
      ORDER BY event_id, section_order ASC
    ` as Array<{
      id: number;
      event_id: string;
      section_title: string;
      section_description: string | null;
      section_order: number;
    }>;

    const sectionIds = sections.map((section) => Number(section.id));

    let tiers: Array<{
      section_id: number;
      tier_name: string;
      price: number | null;
      capacity: number | null;
      sold_out: boolean | null;
      tier_order: number;
    }> = [];

    if (sectionIds.length) {
      tiers = await sql`
        SELECT section_id, tier_name, price, capacity, sold_out, tier_order
        FROM pricing_tiers
        WHERE section_id = ANY(${sectionIds})
        ORDER BY section_id, tier_order ASC
      ` as typeof tiers;
    }

    const tiersBySectionId = new Map<number, EventSection["tiers"]>();

    for (const tier of tiers) {
      const sectionId = Number(tier.section_id);
      const list = tiersBySectionId.get(sectionId) ?? [];

      list.push({
        name: tier.tier_name,
        price: tier.price ?? 0,
        capacity: tier.capacity ?? 0,
        soldOut: Boolean(tier.sold_out),
      });

      tiersBySectionId.set(sectionId, list);
    }

    const sectionsByEventId = new Map<string, EventSection[]>();

    for (const section of sections) {
      const eventId = String(section.event_id);
      const sectionId = Number(section.id);
      const list = sectionsByEventId.get(eventId) ?? [];

      list.push({
        title: section.section_title,
        description: section.section_description ?? undefined,
        tiers: tiersBySectionId.get(sectionId) ?? [],
      });

      sectionsByEventId.set(eventId, list);
    }

    return events.map((event) => ({
      ...event,
      sections: sectionsByEventId.get(String(event.event_id)) ?? [],
    }));
  } catch (error) {
    console.error(`Error fetching venue events for ${venue} ${month}:`, error);
    return [];
  }
}

export async function getCachedVenueEvents(
  venue: string,
  month: string | null,
  origin?: string,
  options: { debugFlyers?: boolean } = {}
): Promise<ParsedEventsWithDebug> {
  if (!month) {
    return [];
  }

  try {
    console.log(`[API] getCachedVenueEvents called: venue=${venue}, month=${month}`);
    const [venueEvents, flyerManifestResult] = await Promise.all([
      getVenueEventsWithSectionsFromDB(venue, month),
      getFlyerManifest(origin),
    ]);
    console.log(`[API] venueEvents for ${venue}: ${venueEvents.length} events`);

    const parsedEvents: ParsedEvent[] = [];
    let firstEventProbe: FlyerMatchProbe | null = null;

    for (const event of venueEvents) {
      const startDate = new Date(event.start_time);
      const rawData =
        event.raw_data && typeof event.raw_data === "object" ? event.raw_data : undefined;
      const source: ParsedEvent["source"] =
        rawData?.syncSource === "google" || rawData?.source === "google"
          ? "google"
          : rawData?.syncSource === "booketing" || rawData?.source === "booketing"
            ? "booketing"
            : event.calendar_id === "booketing"
              ? "booketing"
              : "google";

      const laFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const formattedDate = laFormatter.format(startDate);
      const [monthStr, dayStr, yearStr] = formattedDate.split("/");
      const dateKey = `${yearStr}-${monthStr}-${dayStr}`;

      let sections = event.sections;
      const rawDescription =
        typeof event.event_description === "string" ? event.event_description : undefined;

      if (!sections.length && hasUsableSections(rawData?.sections)) {
        sections = rawData.sections;
      }

      if (rawDescription && rawDescription.trim() && isBooketingVenue(venue)) {
        const reparsed = parseEventDescription(
          rawDescription,
          String(event.event_id),
          String(event.event_title),
          startDate,
          dateKey
        );
        if (reparsed?.sections.length) {
          sections = reparsed.sections;
        }
      } else if (
        shouldReparseSectionsFromDescription(sections, rawDescription) &&
        rawDescription &&
        rawDescription.trim()
      ) {
        const reparsed = parseEventDescription(
          rawDescription,
          String(event.event_id),
          String(event.event_title),
          startDate,
          dateKey
        );
        if (reparsed?.sections.length) {
          sections = reparsed.sections;
        }
      }

      const matchedFlyer = findEventFlyer(
        flyerManifestResult.entries,
        venue,
        String(event.event_title),
        dateKey
      );

      if (!firstEventProbe) {
        firstEventProbe = buildFlyerMatchProbe(
          flyerManifestResult.entries,
          venue,
          String(event.event_title),
          dateKey,
          matchedFlyer
        );
      }

      const parsedEvent: ParsedEvent = {
        id: String(event.event_id),
        eventName: String(event.event_title),
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
        source,
        rawDescription:
          typeof rawData?.rawDescription === "string"
            ? rawData.rawDescription
            : undefined,
        flyerImagePath:
          typeof rawData?.flyerImagePath === "string" && rawData.flyerImagePath.trim()
            ? rawData.flyerImagePath
            : matchedFlyer?.imagePath,
        flyerSourceUrl:
          typeof rawData?.flyerSourceUrl === "string" && rawData.flyerSourceUrl.trim()
            ? rawData.flyerSourceUrl
            : matchedFlyer?.sourceUrl,
        pricingNote:
          typeof rawData?.pricingNote === "string" ? rawData.pricingNote : undefined,
        minimumSpendNote:
          typeof rawData?.minimumSpendNote === "string"
            ? rawData.minimumSpendNote
            : undefined,
      };

      if (parsedEvent.dateKey.startsWith(month)) {
        parsedEvents.push(parsedEvent);
      }
    }

    const filteredEvents = filterDisplayEvents(parsedEvents) as ParsedEventsWithDebug;

    if (options.debugFlyers) {
      filteredEvents.debugFlyers = {
        origin,
        manifestUrl: flyerManifestResult.url,
        manifestLoaded: flyerManifestResult.loaded,
        manifestStatus: flyerManifestResult.status,
        manifestError: flyerManifestResult.error,
        manifestCount: flyerManifestResult.entries.length,
        sameVenueCount: flyerManifestResult.entries.filter((entry) => entry.venueSlug === venue)
          .length,
        rawEventCount: venueEvents.length,
        parsedEventCount: parsedEvents.length,
        filteredEventCount: filteredEvents.length,
        firstEventProbe,
        firstRawFlyerImagePath: parsedEvents[0]?.flyerImagePath ?? null,
        firstFilteredFlyerImagePath: filteredEvents[0]?.flyerImagePath ?? null,
      };
    }

    return filteredEvents;
  } catch (error) {
    console.error(
      `Error in getCachedVenueEvents for ${venue} ${month}:`,
      error
    );
    return [];
  }
}
