import { getCategoryVenueCards, type CategoryEventsKey } from '@/lib/categoryVenueData';
import { fetchVenueEvents, CALENDAR_IDS } from '@/lib/googleCalendarClient';
import { fetchBooketingVenueEvents, isBooketingVenue } from '@/lib/booketingClient';
import { parseEventDescription, type ParsedEvent } from '@/lib/calendarParser';
import {
  filterDisplayEvents,
} from '@/lib/eventDeduplication';
import { google } from 'googleapis';
import { setOAuthCredentialsFromRefreshToken } from '@/lib/googleOAuthClient';
import {
  ensureDatabaseSchema,
  deleteEventsForVenueOutsideIds,
  deleteOldEvents,
  insertOrUpdateEvent,
  updateSyncStatus,
  storeSectionsForEvent,
} from './client';

interface SyncResult {
  category: string;
  venuesProcessed: number;
  eventsInserted: number;
  errorCount: number;
  errors: Array<{ venue: string; error: string }>;
  debug?: {
    venueSlug: string;
    calendarId: string;
    eventsFound: number;
  }[];
}

const EXCLUDED_SYNC_VENUES = new Set([
  'kassi-beach-club',
]);

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function getVenueNameBySlug(venueSlug: string) {
  const all = getCategoryVenueCards('all');
  return all.find((venue) => venue.venueSlug === venueSlug)?.name ?? venueSlug;
}

function shouldSkipVenueSync(venueSlug: string) {
  return EXCLUDED_SYNC_VENUES.has(venueSlug);
}

function getTimeSortKey(date: Date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes()
  ).padStart(2, '0')}`;
}

function buildParsedSyncEvent(
  eventId: string,
  eventTitle: string,
  eventDescription: string,
  startTime: Date,
  dateKey: string
): ParsedEvent {
  const parsed = parseEventDescription(
    eventDescription,
    eventId,
    eventTitle,
    startTime,
    dateKey,
    undefined,
    getTimeSortKey(startTime)
  );

  if (parsed) {
    return parsed;
  }

  return {
    id: eventId,
    eventName: eventTitle,
    date: startTime,
    dateKey,
    dateString: startTime.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    timeSortKey: getTimeSortKey(startTime),
    sections: [],
  };
}

function dedupeGoogleSyncEvents<T extends {
  id?: string | null;
  summary?: string | null;
  description?: string | null;
  start?: { dateTime?: string | null; date?: string | null };
}>(
  events: T[]
) {
  const getSyncWinnerKey = (event: ParsedEvent) => `${event.id}::${event.dateKey}`;

  const syncCandidates = events.map((event) => {
    const startTime = event.start?.dateTime
      ? new Date(event.start.dateTime)
      : event.start?.date
      ? new Date(event.start.date)
      : new Date();

    const eventId = event.id || '';
    const eventTitle = event.summary || 'Untitled Event';
    const eventDescription = event.description || '';
    const dateKey = startTime.toISOString().split('T')[0];
    const parsedEvent = buildParsedSyncEvent(
      eventId,
      eventTitle,
      eventDescription,
      startTime,
      dateKey
    );

    return {
      raw: event,
      startTime,
      parsedEvent,
    };
  });

  const winners = new Set(
    filterDisplayEvents(syncCandidates.map((candidate) => candidate.parsedEvent)).map(
      getSyncWinnerKey
    )
  );

  return syncCandidates
    .filter((candidate) => winners.has(getSyncWinnerKey(candidate.parsedEvent)))
    .map((candidate) => candidate.raw);
}

export async function syncCategoryVenueEvents(
  categoryId: CategoryEventsKey,
  monthsAhead: number = 6
): Promise<SyncResult> {
  const result: SyncResult = {
    category: categoryId,
    venuesProcessed: 0,
    eventsInserted: 0,
    errorCount: 0,
    errors: [],
    debug: [],
  };

  try {
    await ensureDatabaseSchema();

    console.log(`[SYNC] Starting sync for category: ${categoryId}`);
    const venues = getCategoryVenueCards(categoryId);
    console.log(`[SYNC] Found ${venues.length} venues for category ${categoryId}`);

    const now = new Date();
    // Sync from today forward (no past events)
    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0); // Start of today
    const endDate = addMonths(startDate, monthsAhead);
    console.log(`[SYNC] Date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);

    const auth = await setOAuthCredentialsFromRefreshToken();
    const calendar = google.calendar({ version: 'v3', auth });

    for (const venue of venues) {
      if (shouldSkipVenueSync(venue.venueSlug)) {
        console.log(`[SYNC] Skipping ${venue.name} (${venue.venueSlug}): excluded from sync`);
        continue;
      }

      result.venuesProcessed++;

      try {
        // Some venues use Booketing instead of Google Calendar
        if (isBooketingVenue(venue.venueSlug)) {
          console.log(`[SYNC-VENUE] ${venue.name} (${venue.venueSlug}): Using Booketing API`);

          const booketingEvents = await fetchBooketingVenueEvents(venue.venueSlug, startDate, endDate);
          console.log(`[SYNC] ${venue.name}: Found ${booketingEvents.length} events from Booketing`);

          result.debug?.push({
            venueSlug: venue.venueSlug,
            calendarId: 'booketing-api',
            eventsFound: booketingEvents.length,
          });

          // Insert each Booketing event into database
          for (const event of booketingEvents) {
            await insertOrUpdateEvent({
              event_id: event.id || '',
              venue_id: venue.venueSlug,
              venue_name: venue.name,
              event_title: event.eventName || 'Untitled Event',
              event_description: event.pricingNote || '',
              start_time: event.date,
              end_time: undefined,
              calendar_id: 'booketing',
              event_url: undefined,
              raw_data: event,
            });

            await storeSectionsForEvent(event.id || '', event.sections || []);

            result.eventsInserted++;
          }

          const deletedCount = await deleteEventsForVenueOutsideIds(
            venue.venueSlug,
            startDate,
            endDate,
            booketingEvents.map((event) => event.id || '').filter(Boolean)
          );
          if (deletedCount > 0) {
            console.log(
              `[SYNC] ${venue.name}: Deleted ${deletedCount} stale future events after Booketing sync`
            );
          }

          await updateSyncStatus(venue.venueSlug, true, booketingEvents.length);
        } else {
          // Google Calendar venues
          const calendarId = CALENDAR_IDS[venue.venueSlug];
          console.log(`[SYNC-VENUE] ${venue.name} (${venue.venueSlug}): calendarId=${calendarId ? 'FOUND' : 'NOT_FOUND'}`);

          if (!calendarId) {
            throw new Error(`No calendar ID found for venue: ${venue.venueSlug}`);
          }

          // Fetch all events with pagination
          const events = [];
          let pageToken: string | undefined;
          let pageCount = 0;

          do {
            const response = await calendar.events.list({
              calendarId,
              timeMin: startDate.toISOString(),
              timeMax: endDate.toISOString(),
              orderBy: 'startTime',
              singleEvents: true,
              maxResults: 250,
              pageToken: pageToken,
            });

            const pageEvents = response.data.items || [];
            events.push(...pageEvents);
            pageCount++;
            pageToken = response.data.nextPageToken || undefined;
            console.log(`[SYNC] ${venue.name}: Page ${pageCount} returned ${pageEvents.length} events (total so far: ${events.length})`);
          } while (pageToken);

          console.log(`[SYNC] ${venue.name}: Found ${events.length} events across ${pageCount} pages`);

          const dedupedEvents = dedupeGoogleSyncEvents(events);
          if (dedupedEvents.length !== events.length) {
            console.log(
              `[SYNC] ${venue.name}: Deduped Google events from ${events.length} to ${dedupedEvents.length}`
            );
          }

          result.debug?.push({
            venueSlug: venue.venueSlug,
            calendarId,
            eventsFound: dedupedEvents.length,
          });

          // Insert each event into database
          for (const event of dedupedEvents) {
            const startTime = event.start?.dateTime
              ? new Date(event.start.dateTime)
              : event.start?.date
              ? new Date(event.start.date)
              : new Date();

            const endTime = event.end?.dateTime
              ? new Date(event.end.dateTime)
              : event.end?.date
              ? new Date(event.end.date)
              : undefined;

            const eventId = event.id || '';
            const eventTitle = event.summary || 'Untitled Event';
            const eventDescription = event.description || '';

            // Insert/update the base event
            await insertOrUpdateEvent({
              event_id: eventId,
              venue_id: venue.venueSlug,
              venue_name: venue.name,
              event_title: eventTitle,
              event_description: eventDescription,
              start_time: startTime,
              end_time: endTime,
              calendar_id: calendarId,
              event_url: event.htmlLink || undefined,
              raw_data: event,
            });

            // Parse event description to extract sections and pricing
            const dateKey = startTime.toISOString().split('T')[0]; // YYYY-MM-DD
            const parsedEvent = parseEventDescription(
              eventDescription,
              eventId,
              eventTitle,
              startTime,
              dateKey
            );

            // Store sections and pricing tiers
            if (parsedEvent && parsedEvent.sections.length > 0) {
              await storeSectionsForEvent(eventId, parsedEvent.sections);
              console.log(`[SYNC] ${venue.name} - ${eventTitle}: Stored ${parsedEvent.sections.length} sections`);
            } else {
              console.log(`[SYNC] ${venue.name} - ${eventTitle}: No sections/pricing found in description`);
            }

            result.eventsInserted++;
          }

          const deletedCount = await deleteEventsForVenueOutsideIds(
            venue.venueSlug,
            startDate,
            endDate,
            dedupedEvents.map((event) => event.id || '').filter(Boolean)
          );
          if (deletedCount > 0) {
            console.log(
              `[SYNC] ${venue.name}: Deleted ${deletedCount} stale future events after Google sync`
            );
          }

          await updateSyncStatus(venue.venueSlug, true, events.length);
        }
      } catch (error) {
        result.errorCount++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[SYNC] Error for ${venue.name}:`, errorMessage);
        result.errors.push({
          venue: venue.name,
          error: errorMessage,
        });

        try {
          await updateSyncStatus(venue.venueSlug, false, 0, errorMessage);
        } catch (statusError) {
          console.error(`[SYNC] Failed to update sync status for ${venue.venueSlug}:`, statusError);
        }
      }
    }
  } catch (error) {
    result.errorCount++;
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[SYNC] Fatal error:`, errorMessage);
    result.errors.push({
      venue: 'CATEGORY_FETCH',
      error: errorMessage,
    });
  }

  return result;
}

export async function syncVenuesBySlug(
  venueSlugs: string[],
  monthsAhead: number = 6
): Promise<{
  venuesProcessed: number;
  eventsInserted: number;
  oldEventsDeleted: number;
  errorCount: number;
  errors: Array<{ venue: string; error: string }>;
  debug: Array<{ venueSlug: string; calendarId: string; eventsFound: number }>;
}> {
  await ensureDatabaseSchema();

  const now = new Date();
  const startDate = new Date(now);
  startDate.setHours(0, 0, 0, 0);
  const endDate = addMonths(startDate, monthsAhead);

  const result = {
    venuesProcessed: 0,
    eventsInserted: 0,
    oldEventsDeleted: 0,
    errorCount: 0,
    errors: [] as Array<{ venue: string; error: string }>,
    debug: [] as Array<{ venueSlug: string; calendarId: string; eventsFound: number }>,
  };

  const auth = await setOAuthCredentialsFromRefreshToken();
  const calendar = google.calendar({ version: 'v3', auth });

  for (const venueSlug of venueSlugs) {
    if (shouldSkipVenueSync(venueSlug)) {
      console.log(`[SYNC] Skipping ${getVenueNameBySlug(venueSlug)} (${venueSlug}): excluded from sync`);
      continue;
    }

    result.venuesProcessed++;

    const venueName = getVenueNameBySlug(venueSlug);

    try {
      if (isBooketingVenue(venueSlug)) {
        console.log(`[SYNC-VENUE] ${venueName} (${venueSlug}): Using Booketing API`);
        const booketingEvents = await fetchBooketingVenueEvents(venueSlug, startDate, endDate);

        result.debug.push({
          venueSlug,
          calendarId: 'booketing-api',
          eventsFound: booketingEvents.length,
        });

        for (const event of booketingEvents) {
          await insertOrUpdateEvent({
            event_id: event.id || '',
            venue_id: venueSlug,
            venue_name: venueName,
            event_title: event.eventName || 'Untitled Event',
            event_description: event.pricingNote || '',
            start_time: event.date,
            end_time: undefined,
            calendar_id: 'booketing',
            event_url: undefined,
            raw_data: event,
          });

          await storeSectionsForEvent(event.id || '', event.sections || []);
          result.eventsInserted++;
        }

        const deletedCount = await deleteEventsForVenueOutsideIds(
          venueSlug,
          startDate,
          endDate,
          booketingEvents.map((event) => event.id || '').filter(Boolean)
        );
        if (deletedCount > 0) {
          console.log(
            `[SYNC] ${venueName}: Deleted ${deletedCount} stale future events after Booketing sync`
          );
        }

        await updateSyncStatus(venueSlug, true, booketingEvents.length);
        continue;
      }

      const calendarId = CALENDAR_IDS[venueSlug];
      if (!calendarId) {
        throw new Error(`No calendar ID found for venue: ${venueSlug}`);
      }

      const events = [];
      let pageToken: string | undefined;
      let pageCount = 0;

      do {
        const response = await calendar.events.list({
          calendarId,
          timeMin: startDate.toISOString(),
          timeMax: endDate.toISOString(),
          orderBy: 'startTime',
          singleEvents: true,
          maxResults: 250,
          pageToken: pageToken,
        });

        const pageEvents = response.data.items || [];
        events.push(...pageEvents);
        pageCount++;
        pageToken = response.data.nextPageToken || undefined;
        console.log(
          `[SYNC] ${venueName}: Page ${pageCount} returned ${pageEvents.length} events (total so far: ${events.length})`
        );
      } while (pageToken);

      const dedupedEvents = dedupeGoogleSyncEvents(events);
      if (dedupedEvents.length !== events.length) {
        console.log(
          `[SYNC] ${venueName}: Deduped Google events from ${events.length} to ${dedupedEvents.length}`
        );
      }

      result.debug.push({
        venueSlug,
        calendarId,
        eventsFound: dedupedEvents.length,
      });

      for (const event of dedupedEvents) {
        const startTime = event.start?.dateTime
          ? new Date(event.start.dateTime)
          : event.start?.date
          ? new Date(event.start.date)
          : new Date();

        const endTime = event.end?.dateTime
          ? new Date(event.end.dateTime)
          : event.end?.date
          ? new Date(event.end.date)
          : undefined;

        const eventId = event.id || '';
        const eventTitle = event.summary || 'Untitled Event';
        const eventDescription = event.description || '';

        await insertOrUpdateEvent({
          event_id: eventId,
          venue_id: venueSlug,
          venue_name: venueName,
          event_title: eventTitle,
          event_description: eventDescription,
          start_time: startTime,
          end_time: endTime,
          calendar_id: calendarId,
          event_url: event.htmlLink || undefined,
          raw_data: event,
        });

        const dateKey = startTime.toISOString().split('T')[0];
        const parsedEvent = parseEventDescription(eventDescription, eventId, eventTitle, startTime, dateKey);

        if (parsedEvent && parsedEvent.sections.length > 0) {
          await storeSectionsForEvent(eventId, parsedEvent.sections);
        }

        result.eventsInserted++;
      }

      const deletedCount = await deleteEventsForVenueOutsideIds(
        venueSlug,
        startDate,
        endDate,
        dedupedEvents.map((event) => event.id || '').filter(Boolean)
      );
      if (deletedCount > 0) {
        console.log(
          `[SYNC] ${venueName}: Deleted ${deletedCount} stale future events after Google sync`
        );
      }

      await updateSyncStatus(venueSlug, true, events.length);
    } catch (error) {
      result.errorCount++;
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[SYNC] Error for ${venueName}:`, errorMessage);
      result.errors.push({ venue: venueName, error: errorMessage });

      try {
        await updateSyncStatus(venueSlug, false, 0, errorMessage);
      } catch (statusError) {
        console.error(`[SYNC] Failed to update sync status for ${venueSlug}:`, statusError);
      }
    }
  }

  result.oldEventsDeleted = await deleteOldEvents(startDate);
  console.log(`[SYNC] Deleted ${result.oldEventsDeleted} past events before ${startDate.toISOString()}`);

  return result;
}

export async function scheduledEventSync(monthsAhead: number = 6): Promise<{
  totalVenues: number;
  totalEvents: number;
  oldEventsDeleted: number;
  totalErrors: number;
  results: SyncResult[];
}> {
  const categories: CategoryEventsKey[] = [
    'nightclubs',
    'pool-parties',
  ];

  const allResults: SyncResult[] = [];
  let totalEvents = 0;
  let totalVenues = 0;
  let totalErrors = 0;
  let oldEventsDeleted = 0;

  for (const category of categories) {
    const result = await syncCategoryVenueEvents(category, monthsAhead);
    allResults.push(result);
    totalVenues += result.venuesProcessed;
    totalEvents += result.eventsInserted;
    totalErrors += result.errorCount;
  }

  const pruneBefore = new Date();
  pruneBefore.setHours(0, 0, 0, 0);
  oldEventsDeleted = await deleteOldEvents(pruneBefore);
  console.log(`[SYNC] Deleted ${oldEventsDeleted} past events before ${pruneBefore.toISOString()}`);

  return {
    totalVenues,
    totalEvents,
    oldEventsDeleted,
    totalErrors,
    results: allResults,
  };
}
