"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ParsedEvent } from "@/lib/calendarParser";
import { getTodayDateKeyInVegas } from "@/lib/calendarDate";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface EventCalendarProps {
  venueName: string;
  venueSlug?: string;
  initialMonth?: string;
  initialEvents?: ParsedEvent[];
  onEventSelected: (event: ParsedEvent) => void;
  selectedEventId?: string;
}

type ParsedEventFromApi = Omit<ParsedEvent, "date"> & {
  date: string | Date;
  dateKey?: string;
};

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

function getDateKeyFromDateString(dateString?: string): string | null {
  if (!dateString) return null;

  const match = dateString.match(
    /^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday),\s+([A-Za-z]+)\s+(\d{1,2}),\s+(20\d{2})$/i
  );

  if (!match) return null;

  const [, , monthName, dayStr, yearStr] = match;

  const monthMap: Record<string, number> = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
  };

  const month = monthMap[monthName.toLowerCase()];
  if (!month) return null;

  return toDateKey(Number(yearStr), month, Number(dayStr));
}

function getDateKeyFromRawDate(value: string | Date): string {
  if (typeof value === "string") {
    const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
    }

    const parsed = new Date(value);
    return toDateKey(
      parsed.getFullYear(),
      parsed.getMonth() + 1,
      parsed.getDate()
    );
  }

  return toDateKey(
    value.getFullYear(),
    value.getMonth() + 1,
    value.getDate()
  );
}

function dateKeyToStableDate(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function normalizeEvent(
  event: ParsedEventFromApi
): ParsedEvent & { dateKey: string } {
  const preferredDateKey =
    getDateKeyFromDateString(event.dateString) ||
    event.dateKey ||
    getDateKeyFromRawDate(event.date);

  return {
    ...event,
    dateKey: preferredDateKey,
    date: dateKeyToStableDate(preferredDateKey),
  };
}

function getRouteCandidatesForVenueSlug(venueSlug: string): string[] {
  const candidates = [`/places/${venueSlug}`];

  if (venueSlug === "hakkasan-nightclub") candidates.push("/places/hakkasan");
  if (venueSlug === "omnia-nightclub") candidates.push("/places/omnia");

  return candidates;
}

export default function EventCalendar({
  venueName,
  venueSlug,
  initialMonth,
  initialEvents = [],
  onEventSelected,
  selectedEventId,
}: EventCalendarProps) {
  const pathname = usePathname();

  const normalizedVenueSlug = useMemo(
    () =>
      venueSlug ||
      venueName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    [venueName, venueSlug]
  );

  const routeCandidates = useMemo(
    () => getRouteCandidatesForVenueSlug(normalizedVenueSlug),
    [normalizedVenueSlug]
  );

  const isActiveVenuePage = useMemo(
    () => routeCandidates.includes(pathname),
    [routeCandidates, pathname]
  );

  const normalizedInitialEvents = useMemo(
    () => initialEvents.map((event) => normalizeEvent(event as ParsedEventFromApi)),
    [initialEvents]
  );

  const [events, setEvents] = useState<Array<ParsedEvent & { dateKey: string }>>(
    normalizedInitialEvents
  );
  const [loading, setLoading] = useState(normalizedInitialEvents.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (initialMonth) {
      const [year, month] = initialMonth.split("-").map(Number);
      return new Date(year, month - 1, 1);
    }
    return new Date();
  });

  const todayVegasKey = useMemo(() => getTodayDateKeyInVegas(), []);
  const didUseInitialMonthRef = useRef(false);

  const monthKey = useMemo(
    () =>
      `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`,
    [currentMonth]
  );

  useEffect(() => {
    let cancelled = false;

    const useInitialEvents =
      !didUseInitialMonthRef.current &&
      initialMonth === monthKey &&
      normalizedInitialEvents.length > 0;

    async function load() {
      if (useInitialEvents) {
        didUseInitialMonthRef.current = true;

        setEvents(
          normalizedInitialEvents.filter((event) => event.dateKey >= todayVegasKey)
        );
        setLoading(false);
        setError(null);
        return;
      }

      // Critical guard:
      // if this calendar is mounted in the background for some other route,
      // do not fire a client fetch.
      if (!isActiveVenuePage) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(
          `/api/calendar/events?venue=${normalizedVenueSlug}&month=${monthKey}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data: ParsedEventFromApi[] = await response.json();

        const normalized = data
          .map(normalizeEvent)
          .filter((event) => event.dateKey >= todayVegasKey);

        if (!cancelled) {
          setEvents(normalized);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load events");
          setEvents([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [
    initialMonth,
    monthKey,
    normalizedVenueSlug,
    normalizedInitialEvents,
    todayVegasKey,
    isActiveVenuePage,
  ]);

  const getEventsForDay = (date: Date) => {
    const dayKey = toDateKey(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );

    return events.filter((event) => event.dateKey === dayKey);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days: Array<number | null> = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const currentMonthKey = toDateKey(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    1
  );

  const todayMonthKey = todayVegasKey.slice(0, 7) + "-01";
  const canGoToPrevMonth = currentMonthKey > todayMonthKey;

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-red-700">
        <p>Error loading events: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="bg-gradient-to-r from-purple-900 to-black p-6 text-white">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <h2 className="text-2xl font-bold">Event Calendar</h2>
          </div>
          <div className="text-sm opacity-90">{venueName}</div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevMonth}
            disabled={!canGoToPrevMonth}
            className={`rounded p-2 transition ${canGoToPrevMonth
                ? "hover:bg-white/10"
                : "cursor-not-allowed opacity-40"
              }`}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-semibold">{monthName}</h3>
          <button
            onClick={handleNextMonth}
            className="rounded p-2 transition hover:bg-white/10"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-2 inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-purple-900"></div>
              <p className="text-gray-600">Loading events...</p>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <Calendar className="mx-auto mb-3 h-12 w-12 opacity-50" />
            <p>No events scheduled for this month</p>
          </div>
        ) : (
          <>
            <div className="mb-4 grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="py-2 text-center font-semibold text-gray-700"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const dayDate = new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                  day
                );

                const dayKey = toDateKey(
                  dayDate.getFullYear(),
                  dayDate.getMonth() + 1,
                  dayDate.getDate()
                );

                const isPastDay = dayKey < todayVegasKey;
                const dayEvents = isPastDay ? [] : getEventsForDay(dayDate);
                const hasEvents = dayEvents.length > 0;

                if (isPastDay) {
                  return <div key={day} className="aspect-square" />;
                }

                return (
                  <div
                    key={day}
                    className={`aspect-square rounded-lg border-2 p-2 transition ${hasEvents
                        ? "cursor-pointer border-purple-900 bg-purple-50 hover:bg-purple-100"
                        : "border-gray-200 bg-white"
                      }`}
                  >
                    <div className="mb-1 text-sm font-semibold text-gray-700">
                      {day}
                    </div>

                    {hasEvents && (
                      <div className="flex flex-col gap-1">
                        {dayEvents.map((event) => (
                          <button
                            key={event.id}
                            onClick={() => onEventSelected(event)}
                            className={`w-full truncate rounded px-2 py-1 text-left text-xs font-medium transition ${selectedEventId === event.id
                                ? "bg-purple-900 text-white"
                                : "bg-purple-200 text-purple-900 hover:bg-purple-300"
                              }`}
                            title={event.eventName}
                          >
                            {event.eventName}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {events.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 text-xs text-gray-600">
          Click on an event to see pricing and make a reservation
        </div>
      )}
    </div>
  );
}