export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
  buildMonthKeyFromDateKey,
  getCategoryMonthEvents,
  parseCategoryEventsDateKey,
  searchCategoryEvents,
} from "@/lib/categoryEvents";
import type { CategoryEventsKey } from "@/lib/categoryVenueData";

const CATEGORY_EVENTS_CACHE_CONTROL =
  "public, s-maxage=300, stale-while-revalidate=3600";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as CategoryEventsKey | null;
    const startDateParam = searchParams.get("start_date");
    const query = searchParams.get("query")?.trim() || "";
    const daysParam = Number(searchParams.get("days") || 3);

    if (category !== "all" && category !== "nightclubs" && category !== "pool-parties") {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    if (!startDateParam || !/^\d{4}-\d{2}-\d{2}$/.test(startDateParam)) {
      return NextResponse.json({ error: "Invalid start_date" }, { status: 400 });
    }

    parseCategoryEventsDateKey(startDateParam);
    const monthKey = buildMonthKeyFromDateKey(startDateParam);
    const events = query
      ? await searchCategoryEvents(category, startDateParam, query)
      : await getCategoryMonthEvents(category, monthKey);

    return NextResponse.json(
      {
        events,
        startDate: startDateParam,
        month: monthKey,
        query,
        days: Number.isFinite(daysParam) ? daysParam : 3,
      },
      {
        headers: {
          "Cache-Control": CATEGORY_EVENTS_CACHE_CONTROL,
        },
      }
    );
  } catch (error) {
    console.error("Category events API error:", error);
    return NextResponse.json(
      { events: [] },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}
