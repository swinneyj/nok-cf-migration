"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { EventSection, PricingTier } from "@/lib/calendarParser";
import {
  CalendarDays,
  ChevronDown,
  ImageIcon,
  MapPin,
  Map as MapIcon,
  Sparkles,
  Users,
} from "lucide-react";
import VenueMapModal from "./VenueMapModal";
import { getVenueMapConfig } from "@/lib/venueMaps";

// Helper to extract venue slug from URL path
function getUrlPathSlug(): string {
  if (typeof window === "undefined") return "";
  const pathParts = window.location.pathname.split("/");
  return pathParts[2] || ""; // /places/{slug}
}

type LegacySectionOption = {
  name?: string;
  sectionName?: string;
  title?: string;
  price?: string | number | null;
  minSpend?: string | number | null;
  guests?: string | number | null;
  guestCount?: string | number | null;
  description?: string | null;
  notes?: string | null;
  tiers?: PricingTier[];
};

type StepSection = EventSection | LegacySectionOption;

interface SelectedTablePayload {
  id: string;
  name: string;
  price: number;
  section: string;
  capacity?: number;
  soldOut?: boolean;
}

interface FlyerManifestEntry {
  venueSlug: string;
  venueName?: string;
  eventName: string;
  date: string;
  imagePath: string;
  sourceUrl?: string;
}

interface StepSectionsProps {
  venueName: string;
  venueSlug: string;
  eventName: string;
  eventDate: string;
  pricingNote?: string;
  sections: StepSection[];
  selectedSectionName?: string;
  selectedTableName?: string;
  selectedTablePrice?: number;
  onSelectTable: (table: SelectedTablePayload) => void;
  onBack: () => void;
}

function slugify(value: string) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeEventName(value: string) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/\b(guest list|tickets|vip tables|table service)\b/gi, "")
    .replace(/\s*[|•].*$/g, "")
    .trim();
}

function monthNumber(name: string) {
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  return months.indexOf(name.toLowerCase()) + 1;
}

function getTargetDate(eventDate: string) {
  const match = eventDate.match(
    /([A-Za-z]+day,\s*)?([A-Za-z]+)\s+(\d{1,2}),?\s*(\d{4})/
  );

  if (!match) return "";

  const month = monthNumber(match[2]);
  const day = String(parseInt(match[3], 10)).padStart(2, "0");
  const year = match[4];

  if (!month) return "";

  return `${year}-${String(month).padStart(2, "0")}-${day}`;
}

function scoreFlyerMatch(
  entry: FlyerManifestEntry,
  targetVenueSlug: string,
  targetDate: string,
  targetEventName: string
) {
  let score = 0;

  if (entry.venueSlug === targetVenueSlug) score += 10;

  // Strong date matching: reward exact match, penalize mismatches
  if (entry.date === targetDate) {
    score += 100; // Much higher reward for exact date match
  } else {
    // Calculate days difference and apply penalty
    try {
      const entryDateObj = new Date(entry.date);
      const targetDateObj = new Date(targetDate);
      if (!isNaN(entryDateObj.getTime()) && !isNaN(targetDateObj.getTime())) {
        const daysOff = Math.abs(entryDateObj.getTime() - targetDateObj.getTime()) / (1000 * 60 * 60 * 24);
        // Penalize heavily for date mismatches - prevents old flyers from matching future events
        score -= Math.min(100, daysOff * 3);
      }
    } catch {
      // If date parsing fails, apply a significant penalty
      score -= 50;
    }
  }

  const entrySlug = slugify(normalizeEventName(entry.eventName));
  const targetSlug = slugify(normalizeEventName(targetEventName));

  if (entrySlug === targetSlug) score += 12;
  else if (
    entrySlug &&
    targetSlug &&
    (entrySlug.includes(targetSlug) || targetSlug.includes(entrySlug))
  ) {
    score += 7;
  } else {
    const entryWords = new Set(entrySlug.split("-").filter(Boolean));
    const targetWords = targetSlug.split("-").filter(Boolean);
    const overlap = targetWords.filter((word) => entryWords.has(word)).length;
    score += overlap * 2;
  }

  return score;
}

function findBestFlyer(
  manifest: FlyerManifestEntry[],
  targetVenueSlug: string,
  eventName: string,
  eventDate: string
) {
  if (!manifest.length) return null;

  const targetDate = getTargetDate(eventDate);

  // Only return flyers with exact date matches
  // This prevents old flyers from showing for future events
  // GitHub Actions will sync new flyers weekly
  const sameDateFlyers = manifest.filter(
    (entry) => entry.venueSlug === targetVenueSlug && entry.date === targetDate
  );

  if (!sameDateFlyers.length) return null;

  const targetSlug = slugify(normalizeEventName(eventName));

  // Prefer exact event name match
  const exactMatch = sameDateFlyers.find(
    (entry) => slugify(normalizeEventName(entry.eventName)) === targetSlug
  );
  if (exactMatch) return exactMatch;

  // Otherwise prefer loose name match (substring overlap)
  const looseMatch = sameDateFlyers.find((entry) => {
    const entrySlug = slugify(normalizeEventName(entry.eventName));
    return (
      entrySlug &&
      targetSlug &&
      (entrySlug.includes(targetSlug) || targetSlug.includes(entrySlug))
    );
  });
  if (looseMatch) return looseMatch;

  // No name match on exact date - return null to show placeholder
  return null;
}

function formatCurrency(value?: string | number | null) {
  if (value === null || value === undefined || value === "") return null;
  const numeric =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/[^\d.]/g, ""));
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return String(value);
  }
  return `$${numeric.toLocaleString()}`;
}

function toTitleCase(value: string) {
  return String(value || "")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getSectionName(section: StepSection) {
  if ("title" in section && section.title) return section.title;
  if ("name" in section && section.name) return section.name;
  if ("sectionName" in section && section.sectionName) return section.sectionName;
  return "Section";
}

function normalizeComparableName(value: string) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripVenueSuffixes(value: string) {
  return String(value || "")
    .replace(/\b(nightclub|dayclub|beach club|club|las vegas|encore las vegas)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getDisplaySectionName(
  rawSectionName: string,
  index: number,
  eventName: string,
  venueName: string
) {
  const trimmed = String(rawSectionName || "").trim();

  if (!trimmed) {
    return index === 0 ? "Main" : "Section";
  }

  const normalizedSection = normalizeComparableName(trimmed);
  const normalizedEvent = normalizeComparableName(normalizeEventName(eventName));
  const normalizedVenue = normalizeComparableName(stripVenueSuffixes(venueName));
  const normalizedVenueFull = normalizeComparableName(venueName);

  const looksLikeFallback =
    index === 0 &&
    !!normalizedSection &&
    (
      normalizedSection === normalizedEvent ||
      normalizedSection === normalizedVenue ||
      normalizedSection === normalizedVenueFull ||
      (normalizedEvent && normalizedSection.includes(normalizedEvent)) ||
      (normalizedVenue && normalizedSection.includes(normalizedVenue)) ||
      (normalizedVenueFull && normalizedSection.includes(normalizedVenueFull))
    );

  if (looksLikeFallback) {
    return "Main";
  }

  return toTitleCase(trimmed);
}

function extractCapacityLabel(value: string) {
  const match = String(value || "")
    .trim()
    .match(/^(\d+)\s*(ppl|people|person|persons|guest|guests|pax)$/i);

  if (!match) return null;

  const capacity = Number(match[1]);
  if (!Number.isFinite(capacity) || capacity <= 0) return null;

  return `${capacity} people`;
}

function getTierDisplayName(tier: PricingTier) {
  const capacityLabel = extractCapacityLabel(tier.name);
  if (capacityLabel) return capacityLabel;
  return toTitleCase(tier.name);
}

function shouldShowCapacityPill(tier: PricingTier) {
  if (!Number.isFinite(tier.capacity) || tier.capacity <= 0) {
    return false;
  }

  return !extractCapacityLabel(tier.name);
}

function getSectionDescription(section: StepSection) {
  if ("description" in section && section.description) return section.description;
  if ("notes" in section && section.notes) return section.notes;
  return undefined;
}

function getTiers(section: StepSection): PricingTier[] {
  if (
    Array.isArray((section as EventSection).tiers) &&
    (section as EventSection).tiers.length > 0
  ) {
    return (section as EventSection).tiers;
  }

  if (Array.isArray((section as LegacySectionOption).tiers)) {
    return (section as LegacySectionOption).tiers ?? [];
  }

  const legacyPrice =
    (section as LegacySectionOption).price ??
    (section as LegacySectionOption).minSpend;
  const legacyCapacity =
    (section as LegacySectionOption).guests ??
    (section as LegacySectionOption).guestCount;

  const fallbackPrice =
    typeof legacyPrice === "number"
      ? legacyPrice
      : Number(String(legacyPrice ?? 0).replace(/[^\d.]/g, ""));
  const fallbackCapacity =
    typeof legacyCapacity === "number"
      ? legacyCapacity
      : Number(String(legacyCapacity ?? 0).replace(/[^\d.]/g, ""));

  if (fallbackPrice > 0 || fallbackCapacity > 0) {
    return [
      {
        name: getSectionName(section),
        price: Number.isFinite(fallbackPrice) ? fallbackPrice : 0,
        capacity: Number.isFinite(fallbackCapacity) ? fallbackCapacity : 0,
      },
    ];
  }

  return [];
}

function makeTableId(sectionName: string, tierName: string) {
  return `${sectionName}__${tierName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTierState(tier: PricingTier) {
  if (tier.soldOut) {
    return {
      disabled: true,
      buttonText: "Sold Out",
      message: null as string | null,
    };
  }

  return {
    disabled: false,
    buttonText: "Select",
    message: Number.isFinite(tier.capacity) && tier.capacity > 0
      ? `Best for up to ${tier.capacity} guests`
      : null,
  };
}

export default function StepSections({
  venueName,
  venueSlug,
  eventName,
  eventDate,
  pricingNote,
  sections,
  selectedSectionName,
  selectedTableName,
  selectedTablePrice,
  onSelectTable,
  onBack,
}: StepSectionsProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [flyerManifest, setFlyerManifest] = useState<FlyerManifestEntry[]>([]);
  const [flyerError, setFlyerError] = useState(false);
  const [showStickyFlyer, setShowStickyFlyer] = useState(false);
  const [showVenueMap, setShowVenueMap] = useState(false);
  const stepContainerRef = useRef<HTMLDivElement | null>(null);
  const flyerCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadManifest() {
      try {
        const res = await fetch("/event-flyers/manifest.json", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Manifest not found");
        const data = (await res.json()) as FlyerManifestEntry[];
        if (!cancelled) {
          setFlyerManifest(Array.isArray(data) ? data : []);
          setFlyerError(false);
        }
      } catch {
        if (!cancelled) {
          setFlyerManifest([]);
          setFlyerError(true);
        }
      }
    }

    loadManifest();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedSectionName) return;
    setOpenSection((prev) => prev ?? selectedSectionName);
  }, [selectedSectionName]);

  // Auto-select table from URL parameters
  useEffect(() => {
    if (selectedTableName) return; // Already selected

    // Extract venue slug from URL path
    const pathSlug = getUrlPathSlug();
    if (!pathSlug) return;

    const pendingParams = sessionStorage.getItem(
      `booking_${pathSlug}_pendingParams`
    );
    if (!pendingParams) return;

    try {
      const { section: sectionParam, table: tableParam } = JSON.parse(
        pendingParams
      );
      if (!sectionParam) return; // Need at least section param

      let foundSection = false;
      let foundTable = false;

      // Find matching section and table by slugifying both
      for (const sec of sections) {
        // Handle both EventSection (title) and LegacySectionOption (sectionName/name)
        const sectionName = (sec as any).sectionName || (sec as any).name || (sec as any).title || "";
        const sectionSlug = slugify(sectionName);

        if (sectionSlug === sectionParam) {
          foundSection = true;
          // Open/expand the section
          setOpenSection(sectionName);

          // If we have a table param, try to find and select it
          if (tableParam) {
            const tiers = sec.tiers || [];
            for (const tier of tiers) {
              // Generate table ID the same way StepSections does it
              const tierId = `${sectionName}__${tier.name}`
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");

              if (tierId === tableParam) {
                foundTable = true;
                // Found matching table, select it
                onSelectTable({
                  id: tierId,
                  name: tier.name,
                  price: tier.price,
                  section: sectionName,
                  capacity: tier.capacity,
                  soldOut: tier.soldOut,
                });
                // Clear the params after selecting
                sessionStorage.removeItem(`booking_${pathSlug}_pendingParams`);
                return;
              }
            }
          }

          // Even if table didn't match, we found the section and opened it
          // Clear params if we found section but not table
          if (foundSection && !foundTable && tableParam) {
            sessionStorage.removeItem(`booking_${pathSlug}_pendingParams`);
          }
          return;
        }
      }
    } catch (err) {
      console.error("Error auto-selecting table from URL:", err);
    }
  }, [sections, venueSlug, selectedTableName, onSelectTable]);

  useEffect(() => {
    const updateStickyState = () => {
      if (typeof window === "undefined") return;

      if (window.innerWidth >= 1280) {
        setShowStickyFlyer(false);
        return;
      }

      const stepContainer = stepContainerRef.current;
      const flyerCard = flyerCardRef.current;
      if (!stepContainer || !flyerCard) return;

      const stepRect = stepContainer.getBoundingClientRect();
      const flyerRect = flyerCard.getBoundingClientRect();
      const stickyTop = 72;
      const stickyHeight = 72;
      const activationLine = stickyTop + 16;
      const sectionStillActive = stepRect.bottom > stickyTop + stickyHeight;
      const originalFlyerPassed = flyerRect.bottom < activationLine;
      const shouldShow = sectionStillActive && originalFlyerPassed;

      setShowStickyFlyer((prev) => (prev !== shouldShow ? shouldShow : prev));
    };

    updateStickyState();
    window.addEventListener("scroll", updateStickyState, { passive: true });
    window.addEventListener("resize", updateStickyState);

    return () => {
      window.removeEventListener("scroll", updateStickyState);
      window.removeEventListener("resize", updateStickyState);
    };
  }, [eventName, eventDate, openSection, sections.length]);

  const validSections = useMemo(
    () => sections.filter((section) => getTiers(section).length > 0),
    [sections]
  );

  const flyer = useMemo(
    () => findBestFlyer(flyerManifest, venueSlug, eventName, eventDate),
    [flyerManifest, venueSlug, eventName, eventDate]
  );

  const venueMapConfig = useMemo(() => getVenueMapConfig(venueSlug), [venueSlug]);

  const currentPrice = useMemo(() => {
    if (typeof selectedTablePrice === "number") return selectedTablePrice;

    for (const section of sections) {
      const sectionName = getSectionName(section);
      const tiers = getTiers(section);

      for (const tier of tiers) {
        if (
          selectedTableName === tier.name &&
          (!selectedSectionName || selectedSectionName === sectionName)
        ) {
          return tier.price;
        }
      }
    }

    return null;
  }, [sections, selectedSectionName, selectedTableName, selectedTablePrice]);

  return (
    <div ref={stepContainerRef} className="scroll-mt-24">
      <VenueMapModal
        open={showVenueMap}
        onClose={() => setShowVenueMap(false)}
        venueName={venueName}
        config={venueMapConfig}
        sections={validSections.map((section, index) =>
          getDisplaySectionName(getSectionName(section), index, eventName, venueName)
        )}
        selectedSectionName={selectedSectionName}
      />
      <div
        className={[
          "fixed inset-x-4 top-[72px] z-40 xl:hidden",
          "transition-all duration-300 ease-out",
          showStickyFlyer
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() =>
            flyerCardRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
          className="w-full overflow-hidden rounded-2xl border border-white/10 bg-black/90 shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl"
          aria-label="Jump back to event flyer"
        >
          <div className="flex items-center gap-3 px-3 py-2.5 text-left text-white">
            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white/10 ring-1 ring-white/10">
              {flyer ? (
                <img
                  src={flyer.imagePath}
                  alt={`${eventName} flyer thumbnail`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-fuchsia-600/30 via-purple-700/30 to-black">
                  <ImageIcon className="h-4 w-4 text-white/80" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-none text-white">
                {eventName}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] leading-none text-white/75">
                <span className="inline-flex items-center gap-1 truncate">
                  <CalendarDays className="h-3 w-3" />
                  {eventDate}
                </span>
                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                  <Users className="h-3 w-3" />
                  Select a table
                </span>
              </div>
            </div>

            <div className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-fuchsia-300">
              {venueName.replace(/\s+(Nightclub|Dayclub|Beach Club)$/i, "")}
            </div>
          </div>
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-3xl font-bold text-gray-900">Step 2: Select Your Section</h2>
        <button
          type="button"
          onClick={() => setShowVenueMap(true)}
          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <MapIcon className="h-4 w-4" />
          View Venue Map
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
        <aside className="order-1 space-y-4 xl:order-2 xl:sticky xl:top-24">
          <div
            ref={flyerCardRef}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
          >
            {flyer ? (
              <div className="flex h-[260px] items-center justify-center overflow-hidden bg-black p-2 sm:h-[320px] sm:p-3 xl:block xl:aspect-[4/5] xl:h-auto xl:p-0">
                <img
                  src={flyer.imagePath}
                  alt={`${eventName} flyer`}
                  className="h-full w-full rounded-md object-contain xl:rounded-none xl:object-cover xl:object-top"
                />
              </div>
            ) : (
              <div className="flex h-[260px] w-full items-center justify-center bg-gradient-to-br from-black via-purple-950 to-black p-8 text-center text-white sm:h-[320px] xl:aspect-[4/5] xl:h-auto">
                <div>
                  <ImageIcon className="mx-auto h-10 w-10 text-purple-300" />
                  <p className="mt-4 text-lg font-semibold">{eventName}</p>
                  <p className="mt-2 text-sm text-white/70">
                    {flyerError
                      ? "Manifest could not be loaded yet."
                      : "No flyer match found yet for this event."}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-black via-purple-950 to-black px-5 py-4 text-white sm:px-6 sm:py-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">
                {venueName}
              </p>
              <h3 className="text-3xl font-bold leading-tight">{eventName}</h3>
              <div className="mt-3 space-y-2 text-white/85">
                <div className="flex items-start gap-2">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{eventDate}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{venueName}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Choose a section to continue</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4 sm:p-5">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 text-purple-900" />
                  <div>
                    <p className="font-medium text-gray-900">What to Expect</p>
                    <ul className="mt-1 space-y-1 text-sm text-gray-600">
                      <li>VIP entry through the priority line</li>
                      <li>Dedicated table and premium seating</li>
                      <li>Bottle service with a nightclub experience</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                <strong>Pricing:</strong> All Purchases are subject to ~8.375%
                Tax, ~15% Venue Fee, and ~15% Gratuity
              </div>

              {pricingNote && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                  <strong>Venue Note:</strong> {pricingNote}
                </div>
              )}
            </div>
          </div>
        </aside>

        <div className="order-2 space-y-3 xl:order-1">
          {validSections.length > 0 ? (
            validSections.map((section, index) => {
              const sectionName = getSectionName(section);
              const displaySectionName = getDisplaySectionName(
                sectionName,
                index,
                eventName,
                venueName
              );
              const sectionDescription = getSectionDescription(section);
              const tiers = getTiers(section);
              const isOpen = openSection === sectionName;
              const isSelectedSection = selectedSectionName === sectionName;

              return (
                <div
                  key={sectionName}
                  className="mx-auto w-full max-w-[96%] overflow-hidden rounded-xl border border-slate-200 bg-[#4c63ae] shadow-sm sm:max-w-full"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenSection((prev) =>
                        prev === sectionName ? null : sectionName
                      )
                    }
                    className="flex w-full items-center justify-between px-4 py-4 text-left text-white transition hover:bg-white/5 sm:px-5 sm:py-5"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg font-medium tracking-wide sm:text-xl">
                          {displaySectionName}
                        </span>
                        {isSelectedSection && (
                          <span className="rounded-full bg-fuchsia-100 px-2.5 py-1 text-[11px] font-semibold text-fuchsia-700">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-sm text-white/75">
                        {tiers.length} table option{tiers.length === 1 ? "" : "s"}
                      </p>
                    </div>

                    <ChevronDown
                      className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/10 bg-[#50384a] p-3 sm:p-4">
                      {sectionDescription && (
                        <div className="mb-3 rounded-lg border border-white/10 bg-white/10 p-3 text-sm text-white/85">
                          {sectionDescription}
                        </div>
                      )}

                      <div className="space-y-2.5">
                        {tiers.map((tier) => {
                          const tierId = makeTableId(sectionName, tier.name);
                          const isSelected =
                            selectedTableName === tier.name &&
                            selectedSectionName === sectionName;
                          const tierState = getTierState(tier);

                          return (
                            <div
                              key={tierId}
                              className={`rounded-lg border p-3 sm:p-4 ${
                                isSelected
                                  ? "border-fuchsia-400 bg-white/10 shadow-[0_0_0_1px_rgba(232,121,249,0.5)]"
                                  : "border-white/10 bg-white/5"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-lg font-semibold text-white sm:text-xl">
                                      {extractCapacityLabel(tier.name) ? (
                                        <span className="inline-flex items-center gap-1.5">
                                          <Users className="h-4 w-4" />
                                          {getTierDisplayName(tier)}
                                        </span>
                                      ) : (
                                        getTierDisplayName(tier)
                                      )}
                                    </h3>
                                    {isSelected && (
                                      <span className="rounded-full bg-fuchsia-100 px-2.5 py-1 text-[11px] font-semibold text-fuchsia-700">
                                        Selected
                                      </span>
                                    )}
                                  </div>

                                  <div className="mt-2 flex flex-wrap items-center gap-2">
                                    {shouldShowCapacityPill(tier) && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1 text-xs text-white/90 sm:px-3 sm:text-sm">
                                        <Users className="h-3.5 w-3.5" />
                                        {tier.capacity} people
                                      </span>
                                    )}

                                    {tier.soldOut && (
                                      <span className="rounded-full bg-red-500/20 px-2.5 py-1 text-xs font-medium text-red-200 sm:px-3 sm:text-sm">
                                        Sold Out
                                      </span>
                                    )}
                                  </div>

                                  {tierState.message && (
                                    <p className="mt-2 text-sm text-white/75">
                                      {tierState.message}
                                    </p>
                                  )}
                                </div>

                                <div className="shrink-0 text-right">
                                  <p className="text-[11px] uppercase tracking-wide text-white/65 sm:text-sm">
                                    Minimum Spend
                                  </p>
                                  <p className="text-3xl font-bold leading-none text-white sm:text-4xl">
                                    {formatCurrency(tier.price)}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-3 flex justify-end">
                                <button
                                  type="button"
                                  disabled={tierState.disabled}
                                  onClick={() =>
                                    onSelectTable({
                                      id: tierId,
                                      name: tier.name,
                                      price: tier.price,
                                      section: displaySectionName,
                                      capacity: tier.capacity,
                                      soldOut: !!tier.soldOut,
                                    })
                                  }
                                  className={[
                                    "min-w-[124px] rounded-md px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95 sm:min-w-[140px] sm:px-5 sm:py-3",
                                    tierState.disabled
                                      ? "cursor-not-allowed bg-white/10 text-white/40"
                                      : isSelected
                                        ? "bg-fuchsia-700 text-white"
                                        : "bg-fuchsia-500 text-white hover:bg-fuchsia-400",
                                  ].join(" ")}
                                >
                                  {isSelected && !tierState.disabled
                                    ? "Selected"
                                    : tierState.buttonText}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-700">
                Pricing is being updated for this event. You can still submit a
                request after choosing your section.
              </p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-base font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Change Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
