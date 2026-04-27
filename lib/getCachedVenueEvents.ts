import { neon } from "@neondatabase/serverless";
import { isBooketingVenue } from "@/lib/booketingClient";
import { parseEventDescription, type EventSection, type ParsedEvent } from "@/lib/calendarParser";
import { filterDisplayEvents } from "@/lib/eventDeduplication";

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
  month: string | null
): Promise<ParsedEvent[]> {
  if (!month) {
    return [];
  }

  try {
    console.log(`[API] getCachedVenueEvents called: venue=${venue}, month=${month}`);
    const venueEvents = await getVenueEventsWithSectionsFromDB(venue, month);
    console.log(`[API] venueEvents for ${venue}: ${venueEvents.length} events`);

    const parsedEvents: ParsedEvent[] = [];

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
