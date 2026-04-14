"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, CalendarIcon, ChevronRight, Loader2 } from "lucide-react";
import type { CategoryEventsKey } from "@/lib/categoryVenueData";

interface CategoryEventItem {
  id: string;
  eventName: string;
  dateKey: string;
  dateString: string;
  timeLabel?: string;
  timeSortKey?: string;
  category: Exclude<CategoryEventsKey, "all">;
  venueSlug: string;
  venueName: string;
  venueLocation: string;
  venueHref: string;
  eventHref: string;
  imagePath: string;
}

interface Props {
  category: CategoryEventsKey;
  title: string;
  description: string;
  anchorId: string;
  allowCategorySwitching?: boolean;
  initialDate?: string;
  initialEvents?: CategoryEventItem[];
}

function buildTodayDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildMonthKeyFromDateKey(dateKey: string) {
  const [year, month] = dateKey.split("-");
  return `${year}-${month}`;
}

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function filterEventsForWindow(events: CategoryEventItem[], startDateParam: string, days = 3) {
  const safeDays = Number.isFinite(days) && days > 0 ? Math.min(days, 7) : 3;
  const startDate = parseDateKey(startDateParam);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + safeDays - 1);
  endDate.setHours(23, 59, 59, 999);

  return events.filter((event) => {
    const eventDate = parseDateKey(event.dateKey);
    return eventDate >= startDate && eventDate <= endDate;
  });
}

function formatDayHeading(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function buildDefaultDate() {
  return buildTodayDateKey();
}

export default function CategoryEventsBrowser({
  category,
  title,
  description,
  anchorId,
  allowCategorySwitching = false,
  initialDate,
  initialEvents = [],
}: Props) {
  const [activeCategory, setActiveCategory] = useState<CategoryEventsKey>(category);
  const seededDate = initialDate || buildDefaultDate();
  const [selectedDate, setSelectedDate] = useState(seededDate);
  const [activeDate, setActiveDate] = useState(seededDate);
  const [monthEvents, setMonthEvents] = useState<CategoryEventItem[]>(initialEvents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const hydratedRef = useRef(false);
  const monthCacheRef = useRef<Map<string, CategoryEventItem[]>>(
    new Map([[`${category}:${buildMonthKeyFromDateKey(seededDate)}`, initialEvents]])
  );

  const openDatePicker = () => {
    const input = dateInputRef.current;
    if (!input) return;

    input.focus();
    if (typeof input.showPicker === "function") {
      input.showPicker();
    }
  };

  useEffect(() => {
    setActiveCategory(category);
  }, [category]);

  useEffect(() => {
    const activeMonth = buildMonthKeyFromDateKey(activeDate);
    const cacheKey = `${activeCategory}:${activeMonth}`;

    if (!hydratedRef.current) {
      hydratedRef.current = true;
      const sameSeed =
        activeCategory === category &&
        cacheKey === `${category}:${buildMonthKeyFromDateKey(seededDate)}` &&
        initialEvents.length > 0;

      if (sameSeed) {
        setMonthEvents(initialEvents);
        return;
      }
    }

    const cachedMonthEvents = monthCacheRef.current.get(cacheKey);
    if (cachedMonthEvents) {
      setMonthEvents(cachedMonthEvents);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    async function loadEvents() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/category-events?category=${activeCategory}&start_date=${activeDate}&days=3`,
          { cache: "default" }
        );

        if (!response.ok) {
          throw new Error("Could not load events right now.");
        }

        const data = await response.json();
        if (!cancelled) {
          const nextEvents = Array.isArray(data.events) ? data.events : [];
          monthCacheRef.current.set(cacheKey, nextEvents);
          setMonthEvents(nextEvents);
        }
      } catch (err) {
        if (!cancelled) {
          setMonthEvents([]);
          setError(err instanceof Error ? err.message : "Could not load events.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      cancelled = true;
    };
  }, [activeCategory, activeDate]);

  const groupedEvents = useMemo(() => {
    const visibleEvents = filterEventsForWindow(monthEvents, activeDate, 3);
    const grouped = new Map<string, CategoryEventItem[]>();

    for (const event of visibleEvents) {
      const bucket = grouped.get(event.dateKey) ?? [];
      bucket.push(event);
      grouped.set(event.dateKey, bucket);
    }

    return Array.from(grouped.entries());
  }, [activeDate, monthEvents]);

  return (
    <section id={anchorId} className="px-4 py-20 scroll-mt-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="section-eyebrow mb-3">View Events</div>
            <h2 className="font-display text-3xl font-bold text-white">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/55">{description}</p>
            {allowCategorySwitching ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  { key: "all", label: "All Events" },
                  { key: "nightclubs", label: "Nightclubs" },
                  { key: "pool-parties", label: "Pool Parties" },
                ].map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setActiveCategory(option.key as CategoryEventsKey)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                      activeCategory === option.key
                        ? "border-gold-500/50 bg-gold-500/10 text-gold-300"
                        : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-4">
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-400 sm:text-xs">
              Select Date
            </label>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <div className="relative min-w-0 sm:min-w-[220px]">
                <input
                  ref={dateInputRef}
                  type="date"
                  value={selectedDate}
                  onChange={(event) => {
                    const nextDate = event.target.value;
                    setSelectedDate(nextDate);
                    setActiveDate(nextDate);
                  }}
                  className="w-full min-w-0 rounded-xl border border-white/10 bg-night-800 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-gold-500/50 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={openDatePicker}
                  aria-label="Open date picker"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/45 hover:text-gold-400 transition-colors"
                >
                  <CalendarIcon className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={openDatePicker}
                className="btn-gold whitespace-nowrap px-5 py-3 text-sm"
              >
                Choose Date
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6">
          {loading ? (
            <div className="flex min-h-[240px] items-center justify-center">
              <div className="flex items-center gap-3 text-white/70">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading events...
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <div className="max-w-md text-center">
                <p className="text-lg font-semibold text-white">Couldn&apos;t load events</p>
                <p className="mt-2 text-sm text-white/55">{error}</p>
              </div>
            </div>
          ) : groupedEvents.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <div className="max-w-md text-center">
                <p className="text-lg font-semibold text-white">No events found</p>
                <p className="mt-2 text-sm text-white/55">
                  Try another date to see what&apos;s happening across these venues.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              {groupedEvents.map(([dateKey, dayEvents]) => (
                <div key={dateKey}>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-500/20 bg-gold-500/10 text-gold-400">
                      <CalendarDays className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{formatDayHeading(dateKey)}</h3>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                        {dayEvents.length} event{dayEvents.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {dayEvents.map((event) => {
                      return (
                        <Link
                          key={event.id}
                          href={event.eventHref}
                          className="group flex overflow-hidden rounded-[20px] border border-white/10 bg-night-800/85 transition hover:border-gold-500/30 hover:bg-night-800"
                        >
                          <div className="h-[116px] w-[100px] shrink-0 overflow-hidden sm:h-[132px] sm:w-[180px] lg:h-[140px] lg:w-[190px]">
                            <img
                              src={event.imagePath}
                              alt={`${event.eventName} flyer`}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>

                          <div className="flex min-w-0 flex-1 items-center justify-between gap-4 p-4 sm:gap-6 sm:p-6">
                            <div className="min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <p className="line-clamp-2 text-lg font-bold leading-tight text-white sm:text-2xl">
                                  {event.eventName}
                                </p>
                                {event.timeLabel ? (
                                  <div className="shrink-0 rounded-full border border-gold-500/20 bg-gold-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-300 sm:text-[11px]">
                                    {event.timeLabel}
                                  </div>
                                ) : null}
                              </div>
                              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                                <p className="text-sm text-gold-400">{event.venueName}</p>
                                {allowCategorySwitching && activeCategory === "all" ? (
                                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
                                    {event.category === "nightclubs" ? "Nightclub" : "Pool Party"}
                                  </span>
                                ) : null}
                              </div>
                              <p className="mt-1 text-sm text-white/50">{event.venueLocation}</p>
                            </div>

                            <div className="hidden shrink-0 items-center gap-3 sm:flex">
                              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                                View Details
                              </div>
                              <ChevronRight className="h-5 w-5 text-gold-400 transition-transform group-hover:translate-x-1" />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
