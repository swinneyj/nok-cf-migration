/**
 * Client for fetching events from Google Calendar using OAuth
 * This should be called from Next.js API routes, not directly from the frontend
 */

import { google } from "googleapis";
import { ParsedEvent, parseEventDescription } from "./calendarParser";
import { dedupeParsedEvents } from "./eventDeduplication";
import { setOAuthCredentialsFromRefreshToken } from "./googleOAuthClient";

const isProduction = process.env.NODE_ENV === "production";

function debugLog(message: string, data?: unknown) {
  if (isProduction) return;

  if (typeof data === "undefined") {
    console.log(message);
    return;
  }

  console.log(message, data);
}

// Calendar IDs mapping for each venue
export const CALENDAR_IDS: Record<string, string> = {
  "xs-nightclub": process.env.GOOGLE_CALENDAR_ID_XS_NIGHTCLUB || "",
  "zouk-nightclub": process.env.GOOGLE_CALENDAR_ID_ZOUK_NIGHTCLUB || "",
  "omnia-nightclub": process.env.GOOGLE_CALENDAR_ID_OMNIA_NIGHTCLUB || "",
  "tao-nightclub": process.env.GOOGLE_CALENDAR_ID_TAO_NIGHTCLUB || "",
  "marquee-nightclub": process.env.GOOGLE_CALENDAR_ID_MARQUEE_NIGHTCLUB || "",
  "liv-nightclub": process.env.GOOGLE_CALENDAR_ID_LIV_NIGHTCLUB || "",
  "hakkasan-nightclub": process.env.GOOGLE_CALENDAR_ID_HAKKASAN_NIGHTCLUB || "",
  "drais-nightclub": process.env.GOOGLE_CALENDAR_ID_DRAIS_NIGHTCLUB || "",
  "jewel-nightclub": process.env.GOOGLE_CALENDAR_ID_JEWEL_NIGHTCLUB || "",
  "ebc-at-night": process.env.GOOGLE_CALENDAR_ID_EBC_AT_NIGHT || "",
  "encore-beach-club": process.env.GOOGLE_CALENDAR_ID_ENCORE_BEACH_CLUB || "",
  "marquee-dayclub": process.env.GOOGLE_CALENDAR_ID_MARQUEE_DAYCLUB || "",
  "omnia-dayclub": process.env.GOOGLE_CALENDAR_ID_OMNIA_DAYCLUB || "",
  "liv-beach-club": process.env.GOOGLE_CALENDAR_ID_LIV_BEACH_CLUB || "",
  "ayu-dayclub": process.env.GOOGLE_CALENDAR_ID_AYU_DAYCLUB || "",
  "kassi-beach-club": process.env.GOOGLE_CALENDAR_ID_KASSI_BEACH_CLUB || "",
  "liquid-pool-lounge": process.env.GOOGLE_CALENDAR_ID_LIQUID_POOL_LOUNGE || "",
  "stadium-swim": process.env.GOOGLE_CALENDAR_ID_STADIUM_SWIM || "",
  "bottled-blonde": process.env.GOOGLE_CALENDAR_ID_BOTTLED_BLONDE || "",
  "ghostbar": process.env.GOOGLE_CALENDAR_ID_GHOSTBAR || "",
  "crazy-horse-3": process.env.GOOGLE_CALENDAR_ID_CRAZY_HORSE_3 || "",
  "sapphire": process.env.GOOGLE_CALENDAR_ID_SAPPHIRE || "",
  "palm-tree-beach-club": process.env.GOOGLE_CALENDAR_ID_PALM_TREE_BEACH_CLUB || "",
  "tao-beach": process.env.GOOGLE_CALENDAR_ID_TAO_BEACH || "",
};

interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  start?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  recurrence?: string[];
  recurringEventId?: string;
}

interface GoogleCalendarResponse {
  items?: GoogleCalendarEvent[];
}

function formatTimeParts(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return {
    timeLabel: `${displayHour}${minutes ? `:${String(minutes).padStart(2, "0")}` : ""} ${period}`,
    timeSortKey: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
  };
}

const WEEKDAY_INDEX: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

function getEventDateKeyFromGoogle(event: GoogleCalendarEvent): string | null {
  if (event.start?.date) {
    return event.start.date;
  }

  if (event.start?.dateTime) {
    const timeZone =
      event.start.timeZone ||
      event.end?.timeZone ||
      "America/Los_Angeles";

    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    return formatter.format(new Date(event.start.dateTime));
  }

  return null;
}

function getDescriptionDateParts(description: string): {
  dateKey: string | null;
  weekdayIndex: number | null;
} {
  const cleaned = description.replace(/<[^>]*>/g, " ");

  const match = cleaned.match(
    /\b(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday),\s+([A-Za-z]+)\s+(\d{1,2}),\s+(20\d{2})\b/i
  );

  if (!match) {
    return {
      dateKey: null,
      weekdayIndex: null,
    };
  }

  const [, weekdayName, monthName, dayStr, yearStr] = match;

  const monthMap: Record<string, string> = {
    january: "01",
    february: "02",
    march: "03",
    april: "04",
    may: "05",
    june: "06",
    july: "07",
    august: "08",
    september: "09",
    october: "10",
    november: "11",
    december: "12",
  };

  const month = monthMap[monthName.toLowerCase()];
  if (!month) {
    return {
      dateKey: null,
      weekdayIndex: null,
    };
  }

  const day = String(parseInt(dayStr, 10)).padStart(2, "0");

  return {
    dateKey: `${yearStr}-${month}-${day}`,
    weekdayIndex: WEEKDAY_INDEX[weekdayName.toLowerCase()] ?? null,
  };
}

function dateKeyToLocalNoon(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function getEventStartDetails(event: GoogleCalendarEvent, fallbackDateKey: string) {
  if (event.start?.dateTime) {
    const startDate = new Date(event.start.dateTime);
    if (!Number.isNaN(startDate.getTime())) {
      return formatTimeParts(startDate);
    }
  }

  const fallbackDate = dateKeyToLocalNoon(fallbackDateKey);
  return {
    timeLabel: undefined,
    timeSortKey: `${String(fallbackDate.getHours()).padStart(2, "0")}:${String(fallbackDate.getMinutes()).padStart(2, "0")}`,
  };
}

function dateToKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function correctShiftedRecurringDate(
  googleDateKey: string | null,
  descriptionWeekdayIndex: number | null
): string | null {
  if (!googleDateKey || descriptionWeekdayIndex === null) {
    return googleDateKey;
  }

  const googleDate = dateKeyToLocalNoon(googleDateKey);
  const googleWeekday = googleDate.getDay();

  if (googleWeekday === descriptionWeekdayIndex) {
    return googleDateKey;
  }

  const previousDay = new Date(googleDate);
  previousDay.setDate(previousDay.getDate() - 1);

  if (previousDay.getDay() === descriptionWeekdayIndex) {
    return dateToKey(previousDay);
  }

  const nextDay = new Date(googleDate);
  nextDay.setDate(nextDay.getDate() + 1);

  if (nextDay.getDay() === descriptionWeekdayIndex) {
    return dateToKey(nextDay);
  }

  return googleDateKey;
}

/**
 * Fetch events from Google Calendar for a specific venue
 */
export async function fetchVenueEvents(
  venueSlug: string,
  startDate?: Date,
  endDate?: Date
): Promise<ParsedEvent[]> {
  const calendarId = CALENDAR_IDS[venueSlug];

  if (!calendarId) {
    debugLog("fetchVenueEvents: missing calendar ID", { venueSlug });
    return [];
  }

  if (!process.env.GOOGLE_REFRESH_TOKEN) {
    throw new Error("Missing GOOGLE_REFRESH_TOKEN");
  }

  const start = startDate || new Date();
  const end =
    endDate || new Date(start.getTime() + 90 * 24 * 60 * 60 * 1000);

  const timeMin = start.toISOString();
  const timeMax = end.toISOString();

  debugLog("fetchVenueEvents", {
    venueSlug,
    calendarId,
    start: timeMin,
    end: timeMax,
  });

  try {
    const auth = await setOAuthCredentialsFromRefreshToken();
    const calendar = google.calendar({ version: "v3", auth });

    const response = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      orderBy: "startTime",
      singleEvents: true,
      maxResults: 100,
    });

    debugLog(
      "google items",
      (response.data.items || []).map((item) => ({
        summary: item.summary,
        start: item.start?.dateTime || item.start?.date,
        recurringEventId: item.recurringEventId,
        hasDescription: !!item.description,
      }))
    );

    const data = response.data as GoogleCalendarResponse;
    const parsedEvents: ParsedEvent[] = [];

    for (const event of data.items || []) {
      const description = event.description || "";

      const googleDateKey = getEventDateKeyFromGoogle(event);
      const { dateKey: descriptionDateKey, weekdayIndex } =
        getDescriptionDateParts(description);

      let finalDateKey: string | null = googleDateKey;

      // Only fall back to description date if Google gave us nothing usable.
      if (!finalDateKey && descriptionDateKey) {
        finalDateKey = descriptionDateKey;
      }

      debugLog("date resolution", {
        summary: event.summary,
        googleDateKey,
        descriptionDateKey,
        finalDateKey,
      });

      if (!finalDateKey) continue;

      const eventDate = dateKeyToLocalNoon(finalDateKey);
      const { timeLabel, timeSortKey } = getEventStartDetails(event, finalDateKey);

      const parsed = parseEventDescription(
        description,
        event.id,
        event.summary || "Untitled Event",
        eventDate,
        finalDateKey,
        timeLabel,
        timeSortKey
      );

      if (parsed && parsed.sections.length > 0) {
        parsedEvents.push({
          ...parsed,
          source: "google",
          rawDescription: description,
        });
        continue;
      }

      parsedEvents.push({
        id: event.id,
        eventName: event.summary || "Untitled Event",
        date: eventDate,
        dateKey: finalDateKey,
        dateString: eventDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        timeLabel,
        timeSortKey,
        sections: [],
        source: "google",
        rawDescription: description,
      });
    }

    debugLog(
      "parsed events",
      parsedEvents.map((event) => ({
        eventName: event.eventName,
        dateKey: event.dateKey,
        dateString: event.dateString,
        sectionCount: event.sections.length,
      }))
    );

    if (parsedEvents.length === 0) {
      debugLog("No events found for this venue/time range", {
        venueSlug,
        timeMin,
        timeMax,
      });
      return [];
    }

    const dedupedEvents = dedupeParsedEvents(parsedEvents);
    if (dedupedEvents.length !== parsedEvents.length) {
      debugLog("deduped parsed events", {
        venueSlug,
        before: parsedEvents.length,
        after: dedupedEvents.length,
      });
    }

    return dedupedEvents;
  } catch (error) {
    if (isProduction) {
      console.error("Error fetching calendar events with OAuth.", {
        venueSlug,
        hasCalendarId: Boolean(calendarId),
      });
    } else {
      console.error("Error fetching calendar events with OAuth:", error);
    }
    throw error;
  }
}

/**
 * Format a parsed event for display in the UI
 */
export function formatEventForUI(event: ParsedEvent) {
  return {
    id: event.id,
    eventName: event.eventName,
    date: event.date,
    dateKey: event.dateKey,
    dateFormatted: event.date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    sections: event.sections,
  };
}
