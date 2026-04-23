"use client";

import ReservationForm, { ReservationData } from "@/components/ReservationForm";
import ShareButton from "./ShareButton";
import type { ParsedEvent } from "@/lib/calendarParser";
import type { SelectedTable } from "./types";

interface StepReviewProps {
  venueName: string;
  venueSlug: string;
  event: ParsedEvent;
  selectedTable: SelectedTable;
  onBack: () => void;
  onSubmit?: (data: ReservationData) => void;
}

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((word) => {
      // Skip short words
      if (["of", "and", "the", "in", "at", "by", "for"].includes(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export default function StepReview({
  venueName,
  venueSlug,
  event,
  selectedTable,
  onBack,
  onSubmit,
}: StepReviewProps) {
  const displaySectionName = toTitleCase(selectedTable.section);

  return (
    <section className="rounded-[28px] bg-[#a3a3a3] p-3 sm:p-4">
      <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
        <div className="bg-gradient-to-r from-[#61208f] via-[#2f0a4f] to-black px-5 py-5 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-200">
            Step 3
          </p>
          <h2 className="mt-1 text-[2rem] font-bold leading-none text-white">
            Complete Reservation
          </h2>
          <p className="mt-2 text-base text-white/80">
            {event.eventName} • {event.dateString} • {venueName}
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-5 rounded-2xl border border-fuchsia-200 bg-fuchsia-50 p-4 sm:p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Selected Section</p>
                <p className="text-2xl font-bold text-fuchsia-900">
                  {displaySectionName}
                </p>
              </div>

              <div className="md:text-right">
                <p className="text-sm text-gray-500">Minimum Spend</p>
                <p className="text-2xl font-bold text-fuchsia-900">
                  ${selectedTable.price.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Table Option</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedTable.name}
                </p>
              </div>

              {typeof selectedTable.capacity === "number" && selectedTable.capacity > 0 && (
                <div className="md:text-right">
                  <p className="text-sm text-gray-500">Recommended Capacity</p>
                  <p className="text-lg font-semibold text-gray-900">
                    Up to {selectedTable.capacity} guests
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-5">
            <ShareButton
              venueName={venueName}
              venueSlug={venueSlug}
              eventName={event.eventName}
              sectionName={displaySectionName}

              tableName={selectedTable.name}
            />
          </div>

          <div className="mb-5">
            <button
              type="button"
              onClick={onBack}
              className="rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-base font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Change Section
            </button>
          </div>

          <ReservationForm
            venueSlug={venueSlug}
            eventId={event.id}
            eventDateKey={event.dateKey}
            venueName={venueName}
            eventName={event.eventName}
            eventDate={event.dateString}
            selectedTable={{
              name: selectedTable.name,
              price: selectedTable.price,
              capacity: selectedTable.capacity,
              section: selectedTable.section,
            }}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </section>
  );
}
