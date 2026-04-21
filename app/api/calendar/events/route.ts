export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getCachedVenueEvents } from "@/lib/getCachedVenueEvents";
import { CALENDAR_IDS } from "@/lib/googleCalendarClient";

const ALLOWED_VENUES = new Set(Object.keys(CALENDAR_IDS));
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const venue = searchParams.get("venue")?.trim();
    const month = searchParams.get("month")?.trim() || null;

    if (!venue) {
      return NextResponse.json(
        { error: "Missing venue parameter" },
        { status: 400 }
      );
    }

    if (!ALLOWED_VENUES.has(venue)) {
      return NextResponse.json(
        { error: "Invalid venue parameter" },
        { status: 400 }
      );
    }

    if (month && !MONTH_PATTERN.test(month)) {
      return NextResponse.json(
        { error: "Invalid month parameter. Expected YYYY-MM." },
        { status: 400 }
      );
    }

    console.log(`[CALENDAR-API] Fetching events for venue=${venue}, month=${month}`);
    const events = await getCachedVenueEvents(venue, month);
    console.log(`[CALENDAR-API] Got ${events.length} events from getCachedVenueEvents`);

    return NextResponse.json(events, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[CALENDAR-API] Error:", errorMessage, error);
    return NextResponse.json([], { status: 200 });
  }
}
