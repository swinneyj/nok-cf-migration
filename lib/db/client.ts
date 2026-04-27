import { neon } from '@neondatabase/serverless';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { EventSection } from '@/lib/calendarParser';

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

type QueryRow = Record<string, any>;

let schemaEnsured = false;

const getSql = () => {
  const connectionString = process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error('Missing POSTGRES_URL environment variable');
  }

  return neon(connectionString);
};

export async function ensureDatabaseSchema(): Promise<void> {
  if (schemaEnsured) {
    return;
  }

  const sql = getSql();
  const schemaPath = path.join(process.cwd(), 'lib', 'db', 'schema.sql');
  const schema = await readFile(schemaPath, 'utf8');
  const statements = schema
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await sql.query(statement, []);
  }

  schemaEnsured = true;
}

export async function getEventsByVenueAndDateRange(
  venueId: string,
  startDate: Date,
  endDate: Date
): Promise<Event[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT *
    FROM events
    WHERE venue_id = ${venueId}
      AND start_time >= ${startDate.toISOString()}
      AND start_time < ${endDate.toISOString()}
    ORDER BY start_time ASC
  `;

  return rows as Event[];
}

export async function getEventByEventId(eventId: string): Promise<Event | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT *
    FROM events
    WHERE event_id = ${eventId}
    LIMIT 1
  `;

  return (rows[0] as Event | undefined) ?? null;
}

export async function getEventsByMultipleVenues(
  venueIds: string[],
  startDate: Date,
  endDate: Date
): Promise<Event[]> {
  if (venueIds.length === 0) {
    return [];
  }

  const concurrencyLimit = 3;
  const allEvents: Event[] = [];

  for (let i = 0; i < venueIds.length; i += concurrencyLimit) {
    const batch = venueIds.slice(i, i + concurrencyLimit);
    const eventArrays = await Promise.all(
      batch.map((venueId) => getEventsByVenueAndDateRange(venueId, startDate, endDate))
    );
    allEvents.push(...eventArrays.flat());
  }

  return allEvents;
}

export async function insertOrUpdateEvent(
  event: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'synced_at'>
): Promise<void> {
  const sql = getSql();

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

export async function storeSectionsForEvent(
  eventId: string,
  sections: EventSection[]
): Promise<void> {
  const sql = getSql();

  try {
    await sql`DELETE FROM event_sections WHERE event_id = ${eventId}`;

    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
      const section = sections[sectionIndex];
      const sectionRows = await sql`
        INSERT INTO event_sections (event_id, section_title, section_description, section_order)
        VALUES (${eventId}, ${section.title}, ${section.description || null}, ${sectionIndex})
        RETURNING id
      `;

      const sectionId = (sectionRows[0] as QueryRow | undefined)?.id;

      if (!sectionId) {
        throw new Error(`Failed to insert section for event ${eventId}`);
      }

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

export async function getSectionsForEvent(eventId: string): Promise<EventSection[]> {
  const sql = getSql();

  try {
    const sectionRows = await sql`
      SELECT id, section_title, section_description, section_order
      FROM event_sections
      WHERE event_id = ${eventId}
      ORDER BY section_order ASC
    `;

    console.log(`[DB] getSectionsForEvent("${eventId}") - found ${sectionRows.length} sections`);

    const sections: EventSection[] = [];

    for (const sectionRow of sectionRows as QueryRow[]) {
      const tierRows = await sql`
        SELECT tier_name, price, capacity, sold_out
        FROM pricing_tiers
        WHERE section_id = ${sectionRow.id}
        ORDER BY tier_order ASC
      `;

      sections.push({
        title: sectionRow.section_title,
        description: sectionRow.section_description,
        tiers: (tierRows as QueryRow[]).map((row) => ({
          name: row.tier_name,
          price: row.price,
          capacity: row.capacity,
          soldOut: row.sold_out,
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

export async function updateSyncStatus(
  venueId: string,
  success: boolean,
  eventCount?: number,
  error?: string
): Promise<void> {
  const sql = getSql();

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

export async function deleteOldEvents(beforeDate: Date): Promise<number> {
  const sql = getSql();
  const rows = await sql`
    DELETE FROM events
    WHERE start_time < ${beforeDate.toISOString()}
    RETURNING id
  `;

  return rows.length;
}

export async function deleteEventsForVenueOutsideIds(
  venueId: string,
  startDate: Date,
  endDate: Date,
  retainEventIds: string[]
): Promise<number> {
  const sql = getSql();

  if (retainEventIds.length === 0) {
    const rows = await sql`
      DELETE FROM events
      WHERE venue_id = ${venueId}
        AND start_time >= ${startDate.toISOString()}
        AND start_time < ${endDate.toISOString()}
      RETURNING id
    `;

    return rows.length;
  }

  const rows = await sql.query(
    `
      DELETE FROM events
      WHERE venue_id = $1
        AND start_time >= $2
        AND start_time < $3
        AND NOT (event_id = ANY($4::text[]))
      RETURNING id
    `,
    [venueId, startDate.toISOString(), endDate.toISOString(), retainEventIds]
  );

  return rows.length;
}

export async function getSyncStatus(venueId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM sync_status WHERE venue_id = ${venueId}
  `;

  return rows[0] || null;
}
