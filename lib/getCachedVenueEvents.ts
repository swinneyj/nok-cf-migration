import { unstable_cache } from "next/cache";
import { fetchVenueEvents } from "@/lib/googleCalendarClient";

export async function getCachedVenueEvents(
  venue: string,
  month: string | null
) {
  const cacheKey = `venue-events:${venue}:${month ?? "all"}`;

  const getCached = unstable_cache(
    async () => {
      let startDate: Date | undefined;
      let endDate: Date | undefined;

      if (month) {
        const [year, monthNum] = month.split("-");
        if (year && monthNum) {
          const yearNum = parseInt(year, 10);
          const monthIndex = parseInt(monthNum, 10) - 1;

          // Fetch padded range to avoid late-night Vegas UTC rollover issues
          startDate = new Date(Date.UTC(yearNum, monthIndex, 1, 0, 0, 0, 0));
          startDate.setUTCDate(startDate.getUTCDate() - 1);

          endDate = new Date(Date.UTC(yearNum, monthIndex + 1, 1, 0, 0, 0, 0));
          endDate.setUTCDate(endDate.getUTCDate() + 2);
        }
      }

      let events = await fetchVenueEvents(venue, startDate, endDate);

      if (month) {
        events = events.filter((event) => event.dateKey?.startsWith(month));
      }

      return events;
    },
    [cacheKey],
    {
      revalidate: 300, // 5 minutes
      tags: [`venue-events:${venue}`, `venue-events:${venue}:${month ?? "all"}`],
    }
  );

  return getCached();
}