"use client";

import { useEffect, useMemo, useReducer, useRef } from "react";
import { bookingReducer, initialBookingState } from "./reducer";
import StepEvent from "./StepEvent";
import StepGuests from "./StepGuests";
import StepSections from "./StepSections";
import StepReview from "./StepReview";
import type { ReservationData } from "@/components/ReservationForm";

interface BookingFlowV2Props {
  venueName: string;
  venueSlug: string;
}

export default function BookingFlowV2({
  venueName,
  venueSlug,
}: BookingFlowV2Props) {
  const [state, dispatch] = useReducer(bookingReducer, initialBookingState);
  const eventRef = useRef<HTMLDivElement | null>(null);
  const guestsRef = useRef<HTMLDivElement | null>(null);
  const sectionsRef = useRef<HTMLDivElement | null>(null);
  const reviewRef = useRef<HTMLDivElement | null>(null);
  const previousStepRef = useRef(state.step);

  const progress = useMemo(() => {
    switch (state.step) {
      case "event":
        return 1;
      case "guests":
        return 2;
      case "sections":
        return 3;
      case "review":
        return 4;
      default:
        return 1;
    }
  }, [state.step]);

  useEffect(() => {
    const previousStep = previousStepRef.current;

    if (previousStep === state.step) {
      return;
    }

    if (state.step === "event") {
      requestAnimationFrame(() => {
        eventRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }

    if (state.step === "guests") {
      requestAnimationFrame(() => {
        guestsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }

    if (state.step === "sections") {
      requestAnimationFrame(() => {
        sectionsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }

    if (state.step === "review") {
      requestAnimationFrame(() => {
        reviewRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }

    previousStepRef.current = state.step;
  }, [state.step]);

  const handleReservationSubmit = (data: ReservationData) => {
    console.log("V2 reservation submitted:", data);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { n: 1, label: "Event" },
            { n: 2, label: "Guests" },
            { n: 3, label: "Sections" },
            { n: 4, label: "Review" },
          ].map((item) => {
            const active = progress === item.n;
            const complete = progress > item.n;

            return (
              <div
                key={item.n}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold",
                  active
                    ? "bg-fuchsia-700 text-white"
                    : complete
                      ? "bg-green-700 text-white"
                      : "bg-white/10 text-gray-300",
                ].join(" ")}
              >
                {item.n}. {item.label}
              </div>
            );
          })}
        </div>
      </div>

      <div ref={eventRef} className="scroll-mt-24">
        <StepEvent
          venueName={venueName}
          venueSlug={venueSlug}
          selectedEvent={state.selectedEvent}
          onSelectEvent={(event) => dispatch({ type: "SELECT_EVENT", event })}
        />
      </div>

      {state.selectedEvent && state.step !== "event" && (
        <div ref={guestsRef} className="scroll-mt-24">
          <StepGuests
            eventName={state.selectedEvent.eventName}
            eventDate={state.selectedEvent.dateString}
            guys={state.draftGuys}
            girls={state.draftGirls}
            autoAdvanceEnabled={state.step === "guests"}
            onChangeGuys={(value) => dispatch({ type: "SET_DRAFT_GUYS", value })}
            onChangeGirls={(value) => dispatch({ type: "SET_DRAFT_GIRLS", value })}
            onBack={() => dispatch({ type: "BACK_TO_EVENT" })}
            onContinue={() => dispatch({ type: "CONTINUE_FROM_GUESTS" })}
          />
        </div>
      )}

      {state.selectedEvent && state.step === "sections" && (
        <div ref={sectionsRef} className="scroll-mt-24">
          <StepSections
            venueName={venueName}
            venueSlug={venueSlug}
            eventName={state.selectedEvent.eventName}
            eventDate={state.selectedEvent.dateString}
            pricingNote={state.selectedEvent.pricingNote}
            committedTotalGuests={state.committedGuys + state.committedGirls}
            sections={state.selectedEvent.sections ?? []}
            selectedSectionName={state.selectedTable?.section}
            selectedTableName={state.selectedTable?.name}
            selectedTablePrice={state.selectedTable?.price}
            onBack={() => dispatch({ type: "BACK_TO_GUESTS" })}
            onSelectTable={(table) => {
              dispatch({
                type: "SELECT_TABLE",
                table: {
                  id: table.id,
                  name: table.name,
                  price: Number(table.price ?? 0),
                  section: table.section,
                },
              });
            }}
          />
        </div>
      )}

      {state.selectedEvent && state.selectedTable && state.step === "review" && (
        <div ref={reviewRef} className="scroll-mt-24">
          <StepReview
            venueName={venueName}
            event={state.selectedEvent}
            selectedTable={state.selectedTable}
            committedGuys={state.committedGuys}
            committedGirls={state.committedGirls}
            onBack={() => dispatch({ type: "BACK_TO_SECTIONS" })}
            onSubmit={handleReservationSubmit}
          />
        </div>
      )}
    </div>
  );
}
