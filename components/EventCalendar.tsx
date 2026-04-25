"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
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

function formatCellLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function addMonthsToMonthKey(monthKey: string, delta: number) {
  const [year, month] = monthKey.split("-").map(Number);
  const next = new Date(year, month - 1, 1);
  next.setMonth(next.getMonth() + delta);
  return formatMonthKey(next);
}

function normalizeLabel(label: string) {
  return label.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
}

function getFlyerSources(imagePath?: string, sourceUrl?: string) {
  const sources = [imagePath?.trim(), sourceUrl?.trim()].filter(
    (source): source is string => Boolean(source)
  );
  const localWebpSource =
    imagePath && imagePath.startsWith("/")
      ? imagePath.replace(/\.(?:jpe?g|png)(?=$|\?)/i, ".webp")
      : "";

  return Array.from(new Set([localWebpSource, ...sources].filter(Boolean)));
}

function isGenericEventName(eventName?: string) {
  const normalized = normalizeLabel(String(eventName || ""));
  return (
    !normalized ||
    normalized === "special guest" ||
    normalized === "guest" ||
    normalized === "tba" ||
    normalized === "to be announced"
  );
}

function selectBestDayEvent(dayEvents: ParsedEvent[], venueLabel: string) {
  if (dayEvents.length === 0) return undefined;
  if (dayEvents.length === 1) return dayEvents[0];

  let bestEvent = dayEvents[0];
  let bestScore = -1;

  for (const event of dayEvents) {
    const flyerSources = getFlyerSources(event.flyerImagePath, event.flyerSourceUrl);
    const hasFlyer = flyerSources.length > 0;
    const cleanedName = formatDesktopEventName(event.eventName, venueLabel);
    const genericNamePenalty = isGenericEventName(cleanedName) ? -25 : 0;

    const score =
      (hasFlyer ? 100 : 0) +
      (event.flyerImagePath?.trim() ? 15 : 0) +
      (event.flyerSourceUrl?.trim() ? 10 : 0) +
      (cleanedName.length > 0 ? 5 : 0) +
      genericNamePenalty;

    if (score > bestScore) {
      bestScore = score;
      bestEvent = event;
    }
  }

  return bestEvent;
}

function formatDesktopEventName(eventName: string, venueLabel: string) {
  const splitName = eventName.split(/\s[-–—]\s/);
  if (splitName.length < 2) return eventName;

  const normalizedVenue = normalizeLabel(venueLabel);
  const suffix = splitName[splitName.length - 1];
  const normalizedSuffix = normalizeLabel(suffix);

  if (!normalizedSuffix.includes(normalizedVenue)) {
    return eventName;
  }

  return splitName.slice(0, -1).join(" - ");
}

function CalendarFlyerImage({
  sources,
  alt,
}: {
  sources: string[];
  alt: string;
}) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const src = sources[sourceIndex] || "";

  useEffect(() => {
    setSourceIndex(0);
  }, [sources.join("|")]);

  if (!src) return null;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 1024px) 148px, (min-width: 768px) 112px, 0px"
      className="object-cover transition duration-300 group-hover:scale-[1.03]"
      onError={() => {
        setSourceIndex((index) => Math.min(index + 1, sources.length));
      }}
    />
  );
}

export default function EventCalendar({
  venueSlug,
  onEventSelected,
  selectedEventId,
}: Props) {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const eventParam = searchParams.get("event");

  const [events, setEvents] = useState<ParsedEvent[]>([]);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(2026, 3, 1));
  const [loading, setLoading] = useState(false);
  const [hasSearchedForEvent, setHasSearchedForEvent] = useState(false);
  const [maxSearchMonth, setMaxSearchMonth] = useState<Date | null>(null);
  const [monthHasBeenLoaded, setMonthHasBeenLoaded] = useState(false);
  const [isDesktopCalendarView, setIsDesktopCalendarView] = useState(false);

  // Track if we've already applied the initial dateParam
  const dateParamAppliedRef = useRef(false);
  const monthCacheRef = useRef(new Map<string, ParsedEvent[]>());
  const inflightRequestsRef = useRef(new Map<string, Promise<ParsedEvent[]>>());
  const activeRequestIdRef = useRef(0);

  const monthKey = useMemo(() => formatMonthKey(visibleMonth), [visibleMonth]);
  const venueLabel = useMemo(() => formatVenueLabel(venueSlug), [venueSlug]);

  const today = new Date();
  const todayKey = formatDateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const currentMonthKey = formatMonthKey(today);
  const canGoToPrevMonth = monthKey > currentMonthKey;

  const fetchMonthEvents = async (targetMonthKey: string) => {
    const cacheKey = `${venueSlug}:${targetMonthKey}`;
    const cached = monthCacheRef.current.get(cacheKey);
    if (cached) {
      return cached;
    }

    const inflight = inflightRequestsRef.current.get(cacheKey);
    if (inflight) {
      return inflight;
    }

    const request = fetch(
      `/api/calendar/events?venue=${venueSlug}&month=${targetMonthKey}`
    )
      .then(async (res) => {
        const data = await res.json();
        const nextEvents = Array.isArray(data) ? data : data.events || [];
        monthCacheRef.current.set(cacheKey, nextEvents);
        return nextEvents;
      })
      .finally(() => {
        inflightRequestsRef.current.delete(cacheKey);
      });

    inflightRequestsRef.current.set(cacheKey, request);
    return request;
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const updateCalendarMode = () => {
      setIsDesktopCalendarView(mediaQuery.matches);
    };

    updateCalendarMode();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateCalendarMode);
      return () => mediaQuery.removeEventListener("change", updateCalendarMode);
    }

    mediaQuery.addListener(updateCalendarMode);
    return () => mediaQuery.removeListener(updateCalendarMode);
  }, []);

  // Apply URL dateParam only once on initial load, then let manual navigation work freely
  useEffect(() => {
    if (dateParamAppliedRef.current) {
      return; // Already applied, don't interfere with manual month navigation
    }

    if (!dateParam || !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      return;
    }

    const [year, month] = dateParam.split("-").map(Number);
    const targetMonth = new Date(year, month - 1, 1);

    setVisibleMonth(targetMonth);
    setHasSearchedForEvent(true);
    setMaxSearchMonth(null);
    dateParamAppliedRef.current = true;
  }, [dateParam]); // Only depend on dateParam, NOT monthKey

  // Auto-adjust month based on URL parameters (only on initial load)
  useEffect(() => {
    if (!hasSearchedForEvent && events.length > 0) {
      if (dateParam) {
        setHasSearchedForEvent(true);
        return;
      }

      // Only search if we have an event param and haven't found it in current month
      if (eventParam) {
        const foundEvent = events.some(e => {
          const eventSlug = e.eventName
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
          const dateMatches = !dateParam || e.dateKey === dateParam;
          return eventSlug === eventParam && dateMatches;
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
  }, [dateParam, eventParam, hasSearchedForEvent, visibleMonth, maxSearchMonth, events]);

  useEffect(() => {
    let cancelled = false;
    const requestId = ++activeRequestIdRef.current;

    async function fetchEvents() {
      try {
        const cacheKey = `${venueSlug}:${monthKey}`;
        const cachedEvents = monthCacheRef.current.get(cacheKey);

        if (cachedEvents) {
          if (!cancelled && requestId === activeRequestIdRef.current) {
            setEvents(cachedEvents);
            setMonthHasBeenLoaded(true);
            setLoading(false);
          }
          return;
        }

        setLoading(true);

        const nextEvents = await fetchMonthEvents(monthKey);

        if (!cancelled && requestId === activeRequestIdRef.current) {
          setEvents(nextEvents);
          setMonthHasBeenLoaded(true);

          // Only mark as searched if we actually got results or if no event param
          if (nextEvents.length === 0 && hasSearchedForEvent === false) {
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
  }, [venueSlug, monthKey, hasSearchedForEvent, eventParam, monthHasBeenLoaded]);

  useEffect(() => {
    const nextMonthKey = addMonthsToMonthKey(monthKey, 1);
    const cacheKey = `${venueSlug}:${nextMonthKey}`;
    if (monthCacheRef.current.has(cacheKey) || inflightRequestsRef.current.has(cacheKey)) {
      return;
    }

    void fetchMonthEvents(nextMonthKey).catch((error) => {
      console.warn("Error prefetching next calendar month:", error);
    });
  }, [monthKey, venueSlug]);

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
      const parsedParams = JSON.parse(pendingParams) as {
        event?: string;
        date?: string;
      };
      const eventParam = parsedParams.event;
      const pendingDate =
        parsedParams.date && /^\d{4}-\d{2}-\d{2}$/.test(parsedParams.date)
          ? parsedParams.date
          : null;
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
        const dateMatches = !pendingDate || e.dateKey === pendingDate;
        return eventSlug === eventParam && dateMatches;
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
    if (canGoToPrevMonth) {
      setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }
  };

  const goToNextMonth = () => {
    setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const renderMobileCell = (
    day: number,
    isPastDate: boolean,
    dayEvents: ParsedEvent[],
    isToday: boolean
  ) => {
    const hasEvents = dayEvents.length > 0;

    return (
      <div className="relative h-full">
        <div
          className={`relative z-10 text-sm font-semibold ${
            isPastDate ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {day}
        </div>
      </div>
    );
  };

  const renderDesktopCell = (
    dateKey: string,
    day: number,
    dayEvents: ParsedEvent[],
    isPastDate: boolean,
    isToday: boolean,
    isSelectedDay: boolean
  ) => {
    const hasEvents = dayEvents.length > 0;
    const primaryEvent = selectBestDayEvent(dayEvents, venueLabel) ?? dayEvents[0];
    const cellDate = new Date(`${dateKey}T12:00:00`);
    const cellLabel = formatCellLabel(cellDate);
    const flyerSources = getFlyerSources(
      primaryEvent?.flyerImagePath,
      primaryEvent?.flyerSourceUrl
    );
    const hasFlyer = flyerSources.length > 0;
    const desktopEventName = primaryEvent?.eventName
      ? formatDesktopEventName(primaryEvent.eventName, venueLabel)
      : "";

    if (!primaryEvent) {
      return (
        <button
          type="button"
          className="group relative flex aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-100 bg-gray-100/80 text-left text-gray-400 opacity-70 transition"
        >
          <div className="absolute inset-0 bg-gray-50" />
          <div className="relative z-10 flex h-full w-full flex-col justify-between p-2">
            <div className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold tracking-[0.14em] text-gray-700">
              {cellLabel}
            </div>
            <div className="text-sm font-semibold">{day}</div>
          </div>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => {
          if (hasEvents) {
            onEventSelected(primaryEvent);
          }
        }}
        className={`group relative flex aspect-square w-full overflow-hidden rounded-lg border-2 text-left transition ${
          isSelectedDay
            ? "border-purple-300 ring-2 ring-purple-300"
            : isToday
            ? "border-purple-800 ring-2 ring-purple-300"
            : hasEvents
              ? "cursor-pointer border-purple-700 bg-purple-950 hover:border-purple-500 hover:shadow-lg"
              : "border-gray-100 bg-gray-100/80 text-gray-400 opacity-70"
        }`}
      >
        {hasEvents && hasFlyer ? (
          <>
            <CalendarFlyerImage
              sources={flyerSources}
              alt={`${primaryEvent.eventName} flyer`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </>
        ) : (
          <div
            className={`absolute inset-0 ${
              hasEvents
                ? "bg-gradient-to-br from-purple-100 via-white to-purple-50"
                : isPastDate
                  ? "bg-gray-50"
                  : "bg-gray-50"
            }`}
          />
        )}

        <div className="relative z-10 flex h-full w-full flex-col justify-between p-2">
          <div className="flex items-start justify-between gap-2">
            <div className={`rounded-full px-2 py-1 text-[10px] font-semibold tracking-[0.14em] ${
              hasEvents && hasFlyer
                ? "bg-black/40 text-white backdrop-blur-sm"
                : "bg-white/80 text-gray-700"
            }`}>
              {cellLabel}
            </div>

            {dayEvents.length > 1 && (
              <div className="rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                +{dayEvents.length - 1}
              </div>
            )}
          </div>

          <div>
            <div className={`text-sm font-semibold ${hasEvents && hasFlyer ? "text-white/90" : "text-gray-700"}`}>
              {day}
            </div>
            {hasEvents ? (
              <div className="mt-1">
                <div className={`text-[11px] font-medium ${hasEvents && hasFlyer ? "text-white/80" : "text-gray-500"}`}>
                  {primaryEvent.timeLabel || "Event"}
                </div>
                <div className={`line-clamp-2 text-sm font-bold leading-tight ${hasEvents && hasFlyer ? "text-white" : "text-gray-800"}`}>
                  {desktopEventName || primaryEvent.eventName}
                </div>
              </div>
            ) : (
              null
            )}
          </div>
        </div>
      </button>
    );
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
            disabled={!canGoToPrevMonth}
            className={`rounded-md px-3 py-2 text-xl transition ${
              canGoToPrevMonth
                ? "text-white/80 hover:bg-white/10 hover:text-white"
                : "text-white/30 cursor-not-allowed"
            }`}
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
          className={`animate-fade-in transition-all duration-200 ease-out ${
            loading && monthHasBeenLoaded ? "opacity-90" : ""
          }`}
          aria-busy={loading}
        >
          {loading && !monthHasBeenLoaded ? (
            <CalendarSkeleton />
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {calendarCells.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square w-full" />;
                }

                const dateKey = formatDateKey(year, monthIndex, day);
                const isPastDate = dateKey < todayKey;
                const dayEvents = isPastDate ? [] : (eventsByDate[dateKey] || []);
                const isToday = dateKey === todayKey;
                const isSelectedDay = dayEvents.some((event) => event.id === selectedEventId);

                return (
                  <div key={dateKey} className="aspect-square w-full">
                    {isDesktopCalendarView
                      ? renderDesktopCell(dateKey, day, dayEvents, isPastDate, isToday, isSelectedDay)
                      : (
                        <div
                          onClick={() => {
                            if (dayEvents.length > 0) onEventSelected(dayEvents[0]);
                          }}
                          className={`h-full w-full rounded-lg border-2 p-2 transition ${
                            isSelectedDay
                              ? "border-purple-300 ring-2 ring-purple-300 bg-purple-50"
                            : isToday
                              ? "border-purple-800 ring-2 ring-purple-300 bg-white"
                              : dayEvents.length > 0
                                ? "cursor-pointer border-purple-700 bg-purple-50 hover:bg-purple-100"
                                : "border-gray-100 bg-gray-100/80 opacity-60"
                          }`}
                        >
                          {renderMobileCell(day, isPastDate, dayEvents, isToday)}
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
