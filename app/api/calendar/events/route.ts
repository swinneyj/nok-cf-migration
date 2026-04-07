export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getCachedVenueEvents } from "@/lib/getCachedVenueEvents";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const venue = searchParams.get("venue");
    const month = searchParams.get("month");

    if (!venue) {
      return NextResponse.json(
        { error: "Missing venue parameter" },
        { status: 400 }
      );
    }

    const events = await getCachedVenueEvents(venue, month);

    return NextResponse.json(events, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Calendar API error:", error);
    return NextResponse.json([], { status: 200 });
  }
}