"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ParsedEvent } from "@/lib/calendarParser";
import { findBestFlyerEntry, type FlyerManifestEntry } from "@/lib/flyerMatching";

interface Props {
  venueSlug: string;
  onEventSelected: (event: ParsedEvent) => void;
  selectedEventId?: string;
}

function getUrlPathSlug(): string {
  if (typeof window === "undefined") return "";
  const pathParts = window.location.pathname.split("/");
  return pathParts[2] || "";
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
  const directSources = [imagePath?.trim(), sourceUrl?.trim()].filter(
    (source): source is string => Boolean(source)
  );

  return Array.from(new Set(directSources));
}

function addDaysToDateKey(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);

  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function findCalendarFlyer(
  manifest: FlyerManifestEntry[],
  venueSlug: string,
  eventName: string,
  dateKey: string
) {
  const candidateDateKeys = [
    dateKey,
    addDaysToDateKey(dateKey, -1),
    addDaysToDateKey(dateKey, 1),
  ];

  for (const candidateDateKey of candidateDateKeys) {
    const match = findBestFlyerEntry(manifest, venueSlug, eventName, candidateDateKey);
    if (match) return match;
  }

  return null;
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

function selectBestDayEvent(
  dayEvents: ParsedEvent[],
  venueLabel: string,
  venueSlug: string,
  flyerManifest: FlyerManifestEntry[]
) {
  if (dayEvents.length === 0) return undefined;
  if (dayEvents.length === 1) return dayEvents[0];

  let bestEvent = dayEvents[0];
  let bestScore = -1;

  for (const event of dayEvents) {
    const manifestFlyer = findCalendarFlyer(
      flyerManifest,
      venueSlug,
      event.eventName,
      event.dateKey
    );
    const flyerSources = getFlyerSources(
      event.flyerImagePath || manifestFlyer?.imagePath,
      event.flyerSourceUrl || manifestFlyer?.sourceUrl
    );
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
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
      onError={() => {
        setSourceIndex((index) =>
          index < sources.length - 1 ? index + 1 : index
        );
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
  const [flyerManifest, setFlyerManifest] = useState<FlyerManifestEntry[]>([]);

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

  useEffect(() => {
    let cancelled = false;

    async function loadFlyerManifest() {
      try {
        const response = await fetch("/event-flyers/manifest.json", {
          cache: "force-cache",
        });

        if (!response.ok) {
          throw new Error(`Flyer manifest request failed: ${response.status}`);
        }

        const data = await response.json();

        if (!cancelled) {
          setFlyerManifest(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.warn("Error loading calendar flyer manifest:", error);
        if (!cancelled) {
          setFlyerManifest([]);
        }
      }
    }

    loadFlyerManifest();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (dateParamAppliedRef.current) return;

    if (!dateParam || !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      return;
    }

    const [year, month] = dateParam.split("-").map(Number);
    const targetMonth = new Date(year, month - 1, 1);

    setVisibleMonth(targetMonth);
    setHasSearchedForEvent(true);
    setMaxSearchMonth(null);
    dateParamAppliedRef.current = true;
  }, [dateParam]);

  useEffect(() => {
    if (!hasSearchedForEvent && events.length > 0) {
      if (dateParam) {
        setHasSearchedForEvent(true);
        return;
      }

      if (eventParam) {
        const foundEvent = events.some((event) => {
          const eventSlug = event.eventName
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
          const dateMatches = !dateParam || event.dateKey === dateParam;
          return eventSlug === eventParam && dateMatches;
        });

        if (!foundEvent) {
          const nextMonth = new Date(visibleMonth);
          nextMonth.setMonth(nextMonth.getMonth() + 1);

          if (!maxSearchMonth) {
            const maxMonth = new Date(visibleMonth);
            maxMonth.setMonth(maxMonth.getMonth() + 6);
            setMaxSearchMonth(maxMonth);
          }

          if (!maxSearchMonth || nextMonth <= maxSearchMonth) {
            setVisibleMonth(nextMonth);
          } else {
            setHasSearchedForEvent(true);
          }
        } else {
          setHasSearchedForEvent(true);
        }
      } else {
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

          if (nextEvents.length === 0 && hasSearchedForEvent === false) {
            if (!eventParam) {
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
  }, [venueSlug, monthKey, hasSearchedForEvent, eventParam]);

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

  useEffect(() => {
    if (events.length === 0 || selectedEventId) return;

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
      const pendingEventParam = parsedParams.event;
      const pendingDate =
        parsedParams.date && /^\d{4}-\d{2}-\d{2}$/.test(parsedParams.date)
          ? parsedParams.date
          : null;
      if (!pendingEventParam) return;

      const matchingEvent = events.find((event) => {
        const eventSlug = event.eventName
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");
        const dateMatches = !pendingDate || event.dateKey === pendingDate;
        return eventSlug === pendingEventParam && dateMatches;
      });

      if (matchingEvent) {
        onEventSelected(matchingEvent);
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
  const firstDayOfWeek = (new Date(year, monthIndex, 1).getDay() + 6) % 7;

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
    dayEvents: ParsedEvent[]
  ) => {
    const visibleDots = dayEvents.slice(0, 3);
    const overflowCount = Math.max(0, dayEvents.length - visibleDots.length);

    return (
      <div className="relative flex h-full flex-col">
        <div
          className={`relative z-10 text-sm font-semibold ${
            isPastDate ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {day}
        </div>
        {dayEvents.length > 0 ? (
          <div className="mt-auto flex items-center gap-1">
            {visibleDots.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={(clickEvent) => {
                  clickEvent.stopPropagation();
                  onEventSelected(event);
                }}
                aria-label={`Select ${event.eventName}`}
                className="h-2 w-2 rounded-full bg-purple-400 transition hover:scale-125 hover:bg-purple-600"
              />
            ))}
            {overflowCount > 0 ? (
              <span className="text-[10px] font-semibold text-purple-700">+{overflowCount}</span>
            ) : null}
          </div>
        ) : null}
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
    const primaryEvent =
      selectBestDayEvent(dayEvents, venueLabel, venueSlug, flyerManifest) ?? dayEvents[0];
    const cellDate = new Date(`${dateKey}T12:00:00`);
    const cellLabel = formatCellLabel(cellDate);
    const manifestFlyer = primaryEvent
      ? findCalendarFlyer(
          flyerManifest,
          venueSlug,
          primaryEvent.eventName,
          primaryEvent.dateKey
        )
      : null;
    const flyerSources = getFlyerSources(
      primaryEvent?.flyerImagePath || manifestFlyer?.imagePath,
      primaryEvent?.flyerSourceUrl || manifestFlyer?.sourceUrl
    );
    const hasFlyer = flyerSources.length > 0;
    const desktopEventName = primaryEvent?.eventName
      ? formatDesktopEventName(primaryEvent.eventName, venueLabel)
      : "";

    if (!primaryEvent) {
      return (
        <div className="relative flex aspect-square w-full overflow-hidden rounded-lg border border-gray-100 bg-gray-50 text-left text-gray-400 opacity-70">
          <div className="relative z-10 flex h-full w-full flex-col justify-between p-2">
            <div className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold tracking-[0.14em] text-gray-500">
              {cellLabel}
            </div>
            <div className="text-sm font-semibold">{day}</div>
          </div>
        </div>
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/15" />
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
            <div
              className={`rounded-full px-2 py-1 text-[10px] font-semibold tracking-[0.14em] ${
                hasEvents && hasFlyer
                  ? "bg-black/40 text-white backdrop-blur-sm"
                  : "bg-white/80 text-gray-700"
              }`}
            >
              {cellLabel}
            </div>

            {dayEvents.length > 1 ? (
              <div className="rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                +{dayEvents.length - 1}
              </div>
            ) : null}
          </div>

          <div>
            <div
              className={`text-sm font-semibold ${
                hasEvents && hasFlyer ? "text-white/90" : "text-gray-700"
              }`}
            >
              {day}
            </div>
            <div className="mt-1">
              <div
                className={`text-[11px] font-medium ${
                  hasEvents && hasFlyer ? "text-white/80" : "text-gray-500"
                }`}
              >
                {primaryEvent.timeLabel || "Event"}
              </div>
              <div
                className={`line-clamp-2 text-sm font-bold leading-tight ${
                  hasEvents && hasFlyer ? "text-white" : "text-gray-800"
                }`}
              >
                {desktopEventName || primaryEvent.eventName}
              </div>
            </div>
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
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => (
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
                const dayEvents = isPastDate ? [] : eventsByDate[dateKey] || [];
                const isToday = dateKey === todayKey;
                const isSelectedDay = dayEvents.some((event) => event.id === selectedEventId);

                return (
                  <div key={dateKey} className="aspect-square w-full">
                    {isDesktopCalendarView ? (
                      renderDesktopCell(dateKey, day, dayEvents, isPastDate, isToday, isSelectedDay)
                    ) : (
                      <div
                        onClick={() => {
                          if (dayEvents.length > 0) onEventSelected(dayEvents[0]);
                        }}
                        className={`h-full w-full rounded-lg border-2 p-2 transition ${
                          isSelectedDay
                            ? "border-purple-300 bg-purple-50 ring-2 ring-purple-300"
                            : isToday
                              ? "border-purple-800 bg-white ring-2 ring-purple-300"
                              : dayEvents.length > 0
                                ? "cursor-pointer border-purple-700 bg-purple-50 hover:bg-purple-100"
                                : "border-gray-100 bg-gray-100/80 opacity-60"
                        }`}
                      >
                        {renderMobileCell(day, isPastDate, dayEvents)}
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
