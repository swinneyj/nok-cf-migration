import { sql } from '@vercel/postgres';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { EventSection, ParsedEvent } from '@/lib/calendarParser';

export interface Event {
  id: number;
  event_id: string;
  venue_id: string;
  venue_name: string;
  event_title: string;
  event_description?: string;
  start_time: Date;
  end_time?: Date;
  calendar_id?: string;
  event_url?: string;
  created_at: Date;
  updated_at: Date;
  synced_at: Date;
  raw_data?: Record<string, any>;
}

let schemaEnsured = false;

export async function ensureDatabaseSchema(): Promise<void> {
  if (schemaEnsured) {
    return;
  }

  const schemaPath = path.join(process.cwd(), 'lib', 'db', 'schema.sql');
  const schema = await readFile(schemaPath, 'utf8');
  const statements = schema
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await sql.query(statement);
  }

  schemaEnsured = true;
}

/**
 * Get events for a single venue within a date range
 */
export async function getEventsByVenueAndDateRange(
  venueId: string,
  startDate: Date,
  endDate: Date
): Promise<Event[]> {
  const result = await sql`
    SELECT *
    FROM events
    WHERE venue_id = ${venueId}
      AND start_time >= ${startDate.toISOString()}
      AND start_time < ${endDate.toISOString()}
    ORDER BY start_time ASC
  `;

  return result.rows as Event[];
}

/**
 * Get events for multiple venues within a date range
 */
export async function getEventsByMultipleVenues(
  venueIds: string[],
  startDate: Date,
  endDate: Date
): Promise<Event[]> {
  if (venueIds.length === 0) {
    return [];
  }

  // Query venues with limited concurrency to avoid connection pool exhaustion
  const concurrencyLimit = 3;
  const allEvents: Event[] = [];

  for (let i = 0; i < venueIds.length; i += concurrencyLimit) {
    const batch = venueIds.slice(i, i + concurrencyLimit);
    const eventArrays = await Promise.all(
      batch.map(venueId => getEventsByVenueAndDateRange(venueId, startDate, endDate))
    );
    allEvents.push(...eventArrays.flat());
  }

  return allEvents;
}

/**
 * Insert or update an event (upsert)
 */
export async function insertOrUpdateEvent(
  event: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'synced_at'>
): Promise<void> {
  await sql`
    INSERT INTO events (
      event_id, venue_id, venue_name, event_title, event_description,
      start_time, end_time, calendar_id, event_url, raw_data
    ) VALUES (
      ${event.event_id},
      ${event.venue_id},
      ${event.venue_name},
      ${event.event_title},
      ${event.event_description || null},
      ${event.start_time.toISOString()},
      ${event.end_time ? event.end_time.toISOString() : null},
      ${event.calendar_id || null},
      ${event.event_url || null},
      ${event.raw_data ? JSON.stringify(event.raw_data) : null}
    )
    ON CONFLICT (event_id) DO UPDATE SET
      venue_id = ${event.venue_id},
      venue_name = ${event.venue_name},
      event_title = ${event.event_title},
      event_description = ${event.event_description || null},
      start_time = ${event.start_time.toISOString()},
      end_time = ${event.end_time ? event.end_time.toISOString() : null},
      calendar_id = ${event.calendar_id || null},
      event_url = ${event.event_url || null},
      raw_data = ${event.raw_data ? JSON.stringify(event.raw_data) : null},
      updated_at = CURRENT_TIMESTAMP,
      synced_at = CURRENT_TIMESTAMP
  `;
}

/**
 * Store event sections and pricing tiers
 */
export async function storeSectionsForEvent(
  eventId: string,
  sections: EventSection[]
): Promise<void> {
  try {
    // Delete existing sections for this event (CASCADE deletes tiers)
    await sql`DELETE FROM event_sections WHERE event_id = ${eventId}`;

    // Insert each section and its tiers
    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
      const section = sections[sectionIndex];
      
      // Insert section
      const sectionResult = await sql`
        INSERT INTO event_sections (event_id, section_title, section_description, section_order)
        VALUES (${eventId}, ${section.title}, ${section.description || null}, ${sectionIndex})
        RETURNING id
      `;
      
      const sectionId = (sectionResult.rows[0] as any).id;

      // Insert pricing tiers for this section
      for (let tierIndex = 0; tierIndex < section.tiers.length; tierIndex++) {
        const tier = section.tiers[tierIndex];
        
        await sql`
          INSERT INTO pricing_tiers (section_id, tier_name, price, capacity, sold_out, tier_order)
          VALUES (${sectionId}, ${tier.name}, ${tier.price || null}, ${tier.capacity || null}, ${tier.soldOut || false}, ${tierIndex})
        `;
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[DB] Error storing sections for event ${eventId}:`, errorMessage);
    throw error;
  }
}

/**
 * Get sections and pricing tiers for an event
 */
export async function getSectionsForEvent(eventId: string): Promise<EventSection[]> {
  try {
    const sectionResult = await sql`
      SELECT id, section_title, section_description, section_order
      FROM event_sections
      WHERE event_id = ${eventId}
      ORDER BY section_order ASC
    `;

    console.log(`[DB] getSectionsForEvent("${eventId}") - found ${sectionResult.rows.length} sections`);

    const sections: EventSection[] = [];

    for (const sectionRow of sectionResult.rows) {
      const tierResult = await sql`
        SELECT tier_name, price, capacity, sold_out
        FROM pricing_tiers
        WHERE section_id = ${(sectionRow as any).id}
        ORDER BY tier_order ASC
      `;

      sections.push({
        title: (sectionRow as any).section_title,
        description: (sectionRow as any).section_description,
        tiers: tierResult.rows.map(row => ({
          name: (row as any).tier_name,
          price: (row as any).price,
          capacity: (row as any).capacity,
          soldOut: (row as any).sold_out,
        })),
      });
    }

    return sections;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[DB] Error getting sections for event ${eventId}:`, errorMessage);
    return [];
  }
}

/**
 * Update sync status for a venue
 */
export async function updateSyncStatus(
  venueId: string,
  success: boolean,
  eventCount?: number,
  error?: string
): Promise<void> {
  await sql`
    INSERT INTO sync_status (venue_id, last_sync, last_sync_status, last_error)
    VALUES (
      ${venueId},
      CURRENT_TIMESTAMP,
      ${success ? 'SUCCESS' : 'FAILED'},
      ${error || null}
    )
    ON CONFLICT (venue_id) DO UPDATE SET
      last_sync = CURRENT_TIMESTAMP,
      last_sync_status = ${success ? 'SUCCESS' : 'FAILED'},
      sync_count = COALESCE(sync_status.sync_count, 0) + 1,
      last_error = ${error || null}
  `;
}

/**
 * Delete events older than the specified date
 */
export async function deleteOldEvents(beforeDate: Date): Promise<number> {
  const result = await sql`
    DELETE FROM events
    WHERE start_time < ${beforeDate.toISOString()}
  `;

  return result.rowCount || 0;
}

export async function deleteEventsForVenueOutsideIds(
  venueId: string,
  startDate: Date,
  endDate: Date,
  retainEventIds: string[]
): Promise<number> {
  if (retainEventIds.length === 0) {
    const result = await sql`
      DELETE FROM events
      WHERE venue_id = ${venueId}
        AND start_time >= ${startDate.toISOString()}
        AND start_time < ${endDate.toISOString()}
    `;

    return result.rowCount || 0;
  }

  const result = await sql.query(
    `
      DELETE FROM events
      WHERE venue_id = $1
        AND start_time >= $2
        AND start_time < $3
        AND NOT (event_id = ANY($4::text[]))
    `,
    [
      venueId,
      startDate.toISOString(),
      endDate.toISOString(),
      retainEventIds,
    ]
  );

  return result.rowCount || 0;
}

/**
 * Get sync status for a venue
 */
export async function getSyncStatus(venueId: string) {
  const result = await sql`
    SELECT * FROM sync_status WHERE venue_id = ${venueId}
  `;

  return result.rows[0] || null;
}
