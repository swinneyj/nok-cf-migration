"use client";

import { useEffect, useMemo, useState } from "react";
import { ParsedEvent } from "@/lib/calendarParser";

interface Props {
  venueSlug: string;
  onEventSelected: (event: ParsedEvent) => void;
  selectedEventId?: string;
}

// Helper to extract venue slug from URL path
function getUrlPathSlug(): string {
  if (typeof window === "undefined") return "";
  const pathParts = window.location.pathname.split("/");
  return pathParts[2] || ""; // /places/{slug}
}

function formatMonthKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function formatDateKey(year: number, monthIndex: number, day: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function monthLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatVenueLabel(venueSlug: string) {
  const words = venueSlug.split("-").filter(Boolean);

  return words
    .map((word) => {
      const lower = word.toLowerCase();
      if (lower === "xs") return "XS";
      if (lower === "ebc") return "EBC";
      if (lower === "omnia") return "Omnia";
      if (lower === "tao") return "Tao";
      if (lower === "ayu") return "Ayu";
      if (lower === "hakkasan") return "Hakkasan";
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function CalendarSkeleton() {
  return (
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: 35 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square w-full animate-pulse rounded-lg border border-gray-200 bg-gray-100"
        />
      ))}
    </div>
  );
}

export default function EventCalendar({
  venueSlug,
  onEventSelected,
  selectedEventId,
}: Props) {
  const [events, setEvents] = useState<ParsedEvent[]>([]);
  const [visibleMonth, setVisibleMonth] = useState(new Date(2026, 3, 1));
  const [loading, setLoading] = useState(false);
  const [hasSearchedForEvent, setHasSearchedForEvent] = useState(false);
  const [maxSearchMonth, setMaxSearchMonth] = useState<Date | null>(null);
  const [monthHasBeenLoaded, setMonthHasBeenLoaded] = useState(false);

  const monthKey = useMemo(() => formatMonthKey(visibleMonth), [visibleMonth]);
  const venueLabel = useMemo(() => formatVenueLabel(venueSlug), [venueSlug]);

  const today = new Date();
  const todayKey = formatDateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  // Auto-adjust month based on URL parameters (only on initial load)
  useEffect(() => {
    if (typeof window !== "undefined" && !hasSearchedForEvent && events.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const eventParam = params.get("event");
      
      // Only search if we have an event param and haven't found it in current month
      if (eventParam) {
        const foundEvent = events.some(e => {
          const eventSlug = e.eventName
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
          return eventSlug === eventParam;
        });
        
        if (!foundEvent) {
          // Event not found in current month, try next month
          // but only if we haven't reached the max search month
          const nextMonth = new Date(visibleMonth);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          
          // Set max search as 6 months ahead to prevent infinite searching
          if (!maxSearchMonth) {
            const maxMonth = new Date(visibleMonth);
            maxMonth.setMonth(maxMonth.getMonth() + 6);
            setMaxSearchMonth(maxMonth);
          }
          
          // Only advance if we haven't exceeded the search limit
          if (!maxSearchMonth || nextMonth <= maxSearchMonth) {
            setVisibleMonth(nextMonth);
          } else {
            // Reached max search, stop trying
            setHasSearchedForEvent(true);
          }
        } else {
          // Found the event, stop searching
          setHasSearchedForEvent(true);
        }
      } else {
        // No event param, so no need to search
        setHasSearchedForEvent(true);
      }
    }
  }, [hasSearchedForEvent, visibleMonth, maxSearchMonth, events]);

  useEffect(() => {
    let cancelled = false;

    async function fetchEvents() {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/calendar/events?venue=${venueSlug}&month=${monthKey}`
        );
        const data = await res.json();
        const nextEvents = Array.isArray(data) ? data : data.events || [];

        if (!cancelled) {
          setEvents(nextEvents);
          setMonthHasBeenLoaded(true);
          
          // Only mark as searched if we actually got results or if no event param
          if (nextEvents.length === 0 && hasSearchedForEvent === false) {
            const params = new URLSearchParams(window.location.search);
            const eventParam = params.get("event");
            if (!eventParam) {
              // No search needed, no events expected
              setHasSearchedForEvent(true);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        if (!cancelled) {
          setEvents([]);
          setMonthHasBeenLoaded(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchEvents();

    return () => {
      cancelled = true;
    };
  }, [venueSlug, monthKey, hasSearchedForEvent]);

  // Auto-select event from URL parameters
  useEffect(() => {
    if (events.length === 0 || selectedEventId) return;

    // Extract venue slug from URL path
    const pathSlug = getUrlPathSlug();
    if (!pathSlug) return;

    const pendingParams = sessionStorage.getItem(
      `booking_${pathSlug}_pendingParams`
    );
    if (!pendingParams) return;

    try {
      const { event: eventParam } = JSON.parse(pendingParams);
      if (!eventParam) return;

      // Try to find an event matching the event param (slug format)
      // Since we don't have access to the original slug generation, we'll match by eventName
      const matchingEvent = events.find((e) => {
        const eventSlug = e.eventName
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");
        return eventSlug === eventParam;
      });

      if (matchingEvent) {
        onEventSelected(matchingEvent);
        // Don't clear params yet - we still need section/table for StepSections
        // Only clear event param, keep section/table for later
      }
    } catch (err) {
      console.error("Error auto-selecting event from URL:", err);
    }
  }, [events, venueSlug, selectedEventId, onEventSelected]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, ParsedEvent[]> = {};
    for (const event of events) {
      if (!map[event.dateKey]) map[event.dateKey] = [];
      map[event.dateKey].push(event);
    }
    return map;
  }, [events]);

  const year = visibleMonth.getFullYear();
  const monthIndex = visibleMonth.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();

  const calendarCells = [
    ...Array.from({ length: firstDayOfWeek }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const goToPrevMonth = () => {
    setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-purple-900 to-black px-5 py-4 text-white">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-bold">Event Calendar</h3>
          <p className="text-sm text-white/80">{venueLabel}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={goToPrevMonth}
            className="rounded-md px-3 py-2 text-xl text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            ‹
          </button>

          <div className="text-center text-2xl font-semibold">
            {monthLabel(visibleMonth)}
          </div>

          <button
            type="button"
            onClick={goToNextMonth}
            className="rounded-md px-3 py-2 text-xl text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            ›
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="mb-3 grid grid-cols-7 gap-2 text-center text-sm font-semibold text-gray-600">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>

        <div
          key={monthKey}
          className="animate-fade-in transition-all duration-200 ease-out"
        >
          {loading ? (
            <CalendarSkeleton />
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {calendarCells.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square w-full" />;
                }

                const dateKey = formatDateKey(year, monthIndex, day);
                const isPastDate = dateKey < todayKey;
                const dayEvents = eventsByDate[dateKey] || [];
                const hasEvents = dayEvents.length > 0 && !isPastDate;
                const isToday = dateKey === todayKey;

                // Hide past dates completely
                if (isPastDate) {
                  return <div key={dateKey} className="aspect-square w-full" />;
                }

                return (
                  <div
                    key={dateKey}
                    onClick={() => {
                      if (hasEvents) onEventSelected(dayEvents[0]);
                    }}
                    className={`aspect-square w-full rounded-lg border-2 p-2 transition ${
                      isToday
                        ? "border-purple-800 ring-2 ring-purple-300 bg-purple-50"
                        : hasEvents
                          ? "cursor-pointer border-purple-700 bg-purple-50 hover:bg-purple-100"
                          : "border-gray-100 bg-gray-50"
                    }`}
                  >
                    <div className="text-sm font-semibold text-gray-700">{day}</div>

                    {hasEvents && (
                      <div className="mt-2 flex flex-wrap items-center gap-1">
                        {dayEvents.slice(0, 3).map((event) => {
                          const isSelected = selectedEventId === event.id;

                          return (
                            <button
                              key={event.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEventSelected(event);
                              }}
                              className={`h-2.5 w-2.5 rounded-full transition ${
                                isSelected
                                  ? "bg-purple-900 ring-2 ring-purple-300"
                                  : "bg-purple-400 hover:bg-purple-500"
                              }`}
                            />
                          );
                        })}

                        {dayEvents.length > 3 && (
                          <span className="ml-1 text-[10px] font-semibold text-purple-700">
                            +{dayEvents.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-4 border-t border-gray-200 pt-4 text-sm text-gray-600">
          Click an event to see pricing and continue the reservation flow.
        </div>
      </div>
    </div>
  );
}
