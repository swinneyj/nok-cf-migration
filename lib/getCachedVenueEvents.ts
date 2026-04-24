import { sql } from "@vercel/postgres";
import { getSectionsForEvent } from "@/lib/db/client";
import { isBooketingVenue } from "@/lib/booketingClient";
import { parseEventDescription, type ParsedEvent } from "@/lib/calendarParser";
import { filterDisplayEvents } from "@/lib/eventDeduplication";

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
      SELECT event_id, venue_id, event_title, event_description, start_time, calendar_id, raw_data
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
      const source: ParsedEvent["source"] =
        rawData?.syncSource === "google" || rawData?.source === "google"
          ? "google"
          : rawData?.syncSource === "booketing" || rawData?.source === "booketing"
            ? "booketing"
            : event.calendar_id === "booketing"
              ? "booketing"
              : "google";

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
      const rawDescription =
        typeof event.event_description === "string" ? event.event_description : undefined;

      // Booketing-backed venues should always trust the Google description first at read time,
      // so an empty or stale stored section set doesn't wipe out pricing on the page.
      if (rawDescription && rawDescription.trim() && isBooketingVenue(venue)) {
        const reparsed = parseEventDescription(
          rawDescription,
          event.event_id,
          event.event_title,
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
