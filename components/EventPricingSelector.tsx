"use client";

import { useEffect, useMemo, useState } from "react";
import { ParsedEvent } from "@/lib/calendarParser";
import EventCalendar from "./EventCalendar";
import ReservationForm, { ReservationData } from "./ReservationForm";
import SectionAccordion from "./SectionAccordion";
import { CalendarDays, ImageIcon, MapPin, Ticket, Users } from "lucide-react";

interface EventPricingSelectorProps {
  venueName: string;
  venueSlug: string;
  // initialMonth?: string;
  //initialEvents?: ParsedEvent[];
}

interface SelectedTable {
  id: string;
  name: string;
  price: number;
  section: string;
}

interface FlyerManifestEntry {
  venueSlug: string;
  venueName?: string;
  eventName: string;
  date: string;
  imagePath: string;
  sourceUrl?: string;
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

function normalizeVenueSlug(venueName: string) {
  const v = venueName.toLowerCase();

  if (v.includes("xs")) return "xs-nightclub";
  if (v.includes("omnia")) return "omnia-nightclub";
  if (v.includes("hakkasan")) return "hakkasan-nightclub";
  if (v.includes("jewel")) return "jewel-nightclub";
  if (v.includes("zouk")) return "zouk-nightclub";
  if (v.includes("tao beach")) return "tao-beach";
  if (v.includes("tao")) return "tao-nightclub";
  if (v.includes("marquee dayclub")) return "marquee-dayclub";
  if (v.includes("marquee nightclub")) return "marquee-nightclub";
  if (v.includes("liv beach")) return "liv-beach-club";
  if (v.includes("liv nightclub")) return "liv-nightclub";
  if (v.includes("encore beach")) return "encore-beach-club";
  if (v.includes("ayu")) return "ayu-dayclub";
  if (v.includes("daylight")) return "daylight-beach-club";
  if (v.includes("liquid")) return "liquid-pool-lounge";
  if (v.includes("palm tree")) return "palm-tree-beach-club";
  if (v.includes("kassi")) return "kassi-beach-club";
  if (v.includes("drai")) return "drais-nightclub";

  return slugify(venueName);
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

function getTargetDate(selectedEvent: ParsedEvent | null) {
  if (!selectedEvent) return "";

  if (selectedEvent.dateString) {
    const match = selectedEvent.dateString.match(
      /([A-Za-z]+day,\s*)?([A-Za-z]+)\s+(\d{1,2}),?\s*(\d{4})/
    );

    if (match) {
      const month = monthNumber(match[2]);
      const day = String(parseInt(match[3], 10)).padStart(2, "0");
      const year = match[4];

      if (month > 0) {
        return `${year}-${String(month).padStart(2, "0")}-${day}`;
      }
    }
  }

  if (
    selectedEvent.date instanceof Date &&
    !isNaN(selectedEvent.date.getTime())
  ) {
    return selectedEvent.date.toISOString().slice(0, 10);
  }

  return selectedEvent.dateKey || "";
}

function scoreFlyerMatch(
  entry: FlyerManifestEntry,
  targetVenueSlug: string,
  targetDate: string,
  targetEventName: string
) {
  let score = 0;

  if (entry.venueSlug === targetVenueSlug) score += 10;
  if (entry.date === targetDate) score += 10;

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
  venueName: string,
  selectedEvent: ParsedEvent | null,
  explicitVenueSlug?: string
) {
  if (!selectedEvent || manifest.length === 0) return null;

  const targetVenueSlug = explicitVenueSlug || normalizeVenueSlug(venueName);
  const targetDate = getTargetDate(selectedEvent);
  const targetEventName = selectedEvent.eventName || "";
  const targetSlug = slugify(normalizeEventName(targetEventName));

  const scored = manifest
    .map((entry) => {
      const entrySlug = slugify(normalizeEventName(entry.eventName));
      const sameVenue = entry.venueSlug === targetVenueSlug;
      const sameDate = entry.date === targetDate;
      const exactNameMatch = entrySlug === targetSlug;
      const looseNameMatch =
        !!entrySlug &&
        !!targetSlug &&
        (entrySlug.includes(targetSlug) || targetSlug.includes(entrySlug));

      return {
        entry,
        score: scoreFlyerMatch(
          entry,
          targetVenueSlug,
          targetDate,
          targetEventName
        ),
        sameVenue,
        sameDate,
        exactNameMatch,
        looseNameMatch,
      };
    })
    .filter((item) => item.sameVenue)
    .sort((a, b) => b.score - a.score);

  const exactSameDate = scored.filter(
    (item) => item.sameDate && item.exactNameMatch
  );
  if (exactSameDate.length) return exactSameDate[0].entry;

  const looseSameDate = scored.filter(
    (item) => item.sameDate && (item.looseNameMatch || item.score >= 22)
  );
  if (looseSameDate.length) return looseSameDate[0].entry;

  const exactNameAnyDate = scored.filter((item) => item.exactNameMatch);
  if (exactNameAnyDate.length) return exactNameAnyDate[0].entry;

  const looseNameAnyDate = scored.filter(
    (item) => item.looseNameMatch && item.score >= 18
  );
  if (looseNameAnyDate.length) return looseNameAnyDate[0].entry;

  return null;
}

export default function EventPricingSelector({
  venueName,
  venueSlug,
  //initialMonth,
  // initialEvents = [],
}: EventPricingSelectorProps) {
  const [selectedEvent, setSelectedEvent] = useState<ParsedEvent | null>(null);
  const [numGuys, setNumGuys] = useState(0);
  const [numGirls, setNumGirls] = useState(0);
  const [showSections, setShowSections] = useState(false);
  const [committedGuys, setCommittedGuys] = useState(0);
  const [committedGirls, setCommittedGirls] = useState(0);
  const [selectedTable, setSelectedTable] = useState<SelectedTable | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [flyerManifest, setFlyerManifest] = useState<FlyerManifestEntry[]>([]);
  const [flyerError, setFlyerError] = useState(false);

  const totalGuests = numGuys + numGirls;
  const committedTotalGuests = committedGuys + committedGirls;

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

  const handleEventSelected = (event: ParsedEvent) => {
    setSelectedEvent(event);
    setNumGuys(0);
    setNumGirls(0);
    setShowSections(false);
    setCommittedGuys(0);
    setCommittedGirls(0);
    setSelectedTable(null);
    setOpenSection(null);
  };

  const handleSelectTier = (
    tierId: string,
    tierName: string,
    price: number,
    sectionTitle: string
  ) => {
    setSelectedTable({
      id: tierId,
      name: tierName,
      price,
      section: sectionTitle,
    });
  };

  const handleReservationSubmit = (data: ReservationData) => {
    console.log("Reservation submitted:", data);
  };

  const validSections =
    selectedEvent?.sections.filter(
      (section) => section.tiers && section.tiers.length > 0
    ) ?? [];

  const selectedSummary = useMemo(() => {
    if (!selectedTable) return null;
    return `${selectedTable.section} • ${selectedTable.name}`;
  }, [selectedTable]);

  const flyer = useMemo(
    () => findBestFlyer(flyerManifest, venueName, selectedEvent, venueSlug),
    [flyerManifest, selectedEvent, venueName, venueSlug]
  );

  useEffect(() => {
    if (totalGuests !== 0) return;
    setShowSections(false);
    setSelectedTable(null);
    setOpenSection(null);
    setCommittedGuys(0);
    setCommittedGirls(0);
  }, [totalGuests]);

  return (
    <div className="event-pricing-container w-full space-y-8 pb-12">
      <div>
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Step 1: Select Event
        </h2>
        <EventCalendar
          venueSlug={venueSlug}
          // initialMonth={initialMonth}
          // initialEvents={initialEvents}
          onEventSelected={handleEventSelected}
          selectedEventId={selectedEvent?.id}
        />
      </div>

      {selectedEvent && (
        <div className="scroll-mt-24 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="bg-gradient-to-r from-purple-900 to-black p-6 text-white">
            <h2 className="text-2xl font-bold">STEP 2 TEST - NEW FILE</h2>
            <p className="mt-1 text-purple-200">
              {selectedEvent.eventName} • {selectedEvent.dateString}
            </p>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <span className="text-sm font-medium text-gray-700">Guys</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setNumGuys(Math.max(0, numGuys - 1))}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-lg font-bold text-gray-700 transition hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-lg font-semibold text-gray-900">
                        {numGuys}
                      </span>
                      <button
                        type="button"
                        onClick={() => setNumGuys(numGuys + 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-lg font-bold text-gray-700 transition hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <span className="text-sm font-medium text-gray-700">Girls</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setNumGirls(Math.max(0, numGirls - 1))}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-lg font-bold text-gray-700 transition hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-lg font-semibold text-gray-900">
                        {numGirls}
                      </span>
                      <button
                        type="button"
                        onClick={() => setNumGirls(numGirls + 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-lg font-bold text-gray-700 transition hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-purple-50 px-4 py-3">
                    <span className="text-sm font-medium text-purple-700">Total Guests</span>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-900" />
                      <span className="text-2xl font-bold text-purple-900">
                        {totalGuests}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedEvent.minimumSpendNote && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                  <strong>Note:</strong> {selectedEvent.minimumSpendNote}
                </div>
              )}

              {totalGuests > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setCommittedGuys(numGuys);
                    setCommittedGirls(numGirls);
                    setShowSections(true);
                  }}
                  className="w-full rounded-xl bg-gradient-to-r from-purple-900 to-black px-6 py-4 font-semibold text-white transition hover:from-purple-800 hover:to-gray-900"
                >
                  Continue to sections
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedEvent && showSections && (
        <div className="scroll-mt-24">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Step 3: Select Your Section
          </h2>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
            <div className="order-2 space-y-3 xl:order-1">
              {validSections.map((section) => (
                <SectionAccordion
                  key={section.title}
                  section={section}
                  guestCount={committedTotalGuests}
                  isOpen={openSection === section.title}
                  onToggle={() =>
                    setOpenSection((prev) =>
                      prev === section.title ? null : section.title
                    )
                  }
                  selectedTierId={selectedTable?.id}
                  onSelectTier={handleSelectTier}
                />
              ))}
            </div>

            <aside className="order-1 space-y-4 xl:order-2 xl:sticky xl:top-24">
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {flyer ? (
                  <div className="aspect-[4/5] w-full overflow-hidden bg-black">
                    <img
                      src={flyer.imagePath}
                      alt={`${selectedEvent.eventName} flyer`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[4/5] w-full items-center justify-center bg-gradient-to-br from-black via-purple-950 to-black p-8 text-center text-white">
                    <div>
                      <ImageIcon className="mx-auto h-10 w-10 text-purple-300" />
                      <p className="mt-4 text-lg font-semibold">
                        {selectedEvent.eventName}
                      </p>
                      <p className="mt-2 text-sm text-white/70">
                        {flyerError
                          ? "Manifest could not be loaded yet."
                          : "No flyer match found yet for this event."}
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-br from-black via-purple-950 to-black p-6 text-white">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">
                    {venueName}
                  </p>
                  <h3 className="text-3xl font-bold leading-tight">
                    {selectedEvent.eventName}
                  </h3>
                  <div className="mt-4 space-y-2 text-white/85">
                    <div className="flex items-start gap-2">
                      <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{selectedEvent.dateString}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{venueName}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{committedTotalGuests} total guests</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Your Selection
                    </p>
                    {selectedSummary ? (
                      <div className="mt-2">
                        <p className="font-semibold text-gray-900">
                          {selectedSummary}
                        </p>
                        <p className="mt-1 text-lg font-bold text-purple-900">
                          ${selectedTable?.price.toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-gray-600">
                        Choose a section on the left to continue.
                      </p>
                    )}
                  </div>

                  {flyer?.sourceUrl && (
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start gap-2">
                        <Ticket className="mt-0.5 h-4 w-4 text-purple-900" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Flyer matched
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            This sidebar image was matched automatically from
                            your local Discotech flyer manifest.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedEvent.pricingNote && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                      <strong>Pricing:</strong> {selectedEvent.pricingNote}
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {selectedEvent && selectedTable && (
        <div className="scroll-mt-24 mt-6">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-700">
              Final Step
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
              Submit Your Reservation Request
            </h2>
            <p className="mt-2 max-w-2xl text-gray-600">
              Enter your details below and our VIP host will confirm
              availability, pricing, and next steps.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
            <div className="border-b border-gray-200 bg-gradient-to-r from-purple-900 to-black px-6 py-5 text-white">
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-purple-200">
                    Selected Section
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {selectedTable.section}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-purple-200">
                    Table Option
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {selectedTable.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-purple-200">
                    Guest Count
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {committedTotalGuests} guests
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-purple-200">
                    Minimum Spend
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    ${selectedTable.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-6 md:px-8">
              <ReservationForm
                venueName={venueName}
                eventName={selectedEvent.eventName}
                eventDate={selectedEvent.dateString}
                selectedTable={selectedTable}
                numGuys={committedGuys}
                numGirls={committedGirls}
                totalGuests={committedTotalGuests}
                onSubmit={handleReservationSubmit}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}