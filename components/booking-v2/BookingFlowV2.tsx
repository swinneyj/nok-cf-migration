"use client";

import { useEffect, useMemo, useReducer, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { ReservationData } from "@/components/ReservationForm";
import { bookingReducer, initialBookingState } from "./reducer";
import StepEvent from "./StepEvent";
import StepReview from "./StepReview";
import StepSections from "./StepSections";

// Helper to extract venue slug from URL path
function getUrlPathSlug(): string {
  if (typeof window === "undefined") return "";
  const pathParts = window.location.pathname.split("/");
  return pathParts[2] || ""; // /places/{slug}
}

interface BookingFlowV2Props {
  venueName: string;
  venueSlug: string;
}

export default function BookingFlowV2({
  venueName,
  venueSlug,
}: BookingFlowV2Props) {
  const [state, dispatch] = useReducer(bookingReducer, initialBookingState);
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventRef = useRef<HTMLDivElement | null>(null);
  const sectionsRef = useRef<HTMLDivElement | null>(null);
  const reviewRef = useRef<HTMLDivElement | null>(null);
  const previousStepRef = useRef(state.step);
  const previousSectionsEventKeyRef = useRef<string | null>(null);

  const progress = useMemo(() => {
    switch (state.step) {
      case "event":
        return 1;
      case "sections":
        return 2;
      case "review":
        return 3;
      default:
        return 1;
    }
  }, [state.step]);

  const selectedEventKey = useMemo(() => {
    if (!state.selectedEvent) return null;

    return [
      state.selectedEvent.id ?? "",
      state.selectedEvent.eventName ?? "",
      state.selectedEvent.dateString ?? "",
      state.selectedEvent.dateKey ?? "",
    ].join("__");
  }, [state.selectedEvent]);

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

  useEffect(() => {
    if (state.step !== "sections" || !selectedEventKey) {
      previousSectionsEventKeyRef.current = null;
      return;
    }

    const previousEventKey = previousSectionsEventKeyRef.current;

    if (previousEventKey && previousEventKey !== selectedEventKey) {
      requestAnimationFrame(() => {
        sectionsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }

    previousSectionsEventKeyRef.current = selectedEventKey;
  }, [state.step, selectedEventKey]);

  // Initialize from URL parameters on mount
  useEffect(() => {
    const eventParam = searchParams.get("event");
    const sectionParam = searchParams.get("section");
    const tableParam = searchParams.get("table");
    const dateParam = searchParams.get("date");

    // Only initialize if we have URL params and haven't already initialized
    if (eventParam && !state.selectedEvent) {
      // Extract venue slug from URL path
      const pathSlug = getUrlPathSlug();
      if (!pathSlug) return;

      // Store params in sessionStorage to be picked up by EventCalendar
      sessionStorage.setItem(
        `booking_${pathSlug}_pendingParams`,
        JSON.stringify({
          event: eventParam,
          date: dateParam,
          section: sectionParam,
          table: tableParam,
        })
      );
    }
  }, [searchParams, venueSlug, state.selectedEvent]);

  const handleReservationSubmit = (data: ReservationData) => {
    console.log("V2 reservation submitted:", data);
  };

  // Helper function to slugify text for URLs
  const slugify = (text: string) => {
    return String(text || "")
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // Update URL when event is selected
  const handleSelectEvent = (event: any) => {
    dispatch({ type: "SELECT_EVENT", event });
    // Update URL after event selection
    setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      const eventSlug = slugify(event.eventName);
      params.set("event", eventSlug);
      if (event.dateKey) {
        params.set("date", event.dateKey);
      }
      params.delete("section");
      params.delete("table");
      const queryString = params.toString();
      const newUrl = queryString
        ? `/places/${venueSlug}?${queryString}`
        : `/places/${venueSlug}`;
      router.push(newUrl, { scroll: false });
    }, 0);
  };

  // Update URL when table is selected
  const handleSelectTable = (table: any) => {
    dispatch({
      type: "SELECT_TABLE",
      table: {
        id: table.id,
        name: table.name,
        price: Number(table.price ?? 0),
        section: table.section,
        capacity: table.capacity,
        soldOut: table.soldOut,
      },
    });
    // Update URL after table selection
    setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      const eventSlug = state.selectedEvent?.eventName
        ? slugify(state.selectedEvent.eventName)
        : "";
      if (eventSlug) params.set("event", eventSlug);
      if (state.selectedEvent?.dateKey) {
        params.set("date", state.selectedEvent.dateKey);
      }

      const sectionSlug = slugify(table.section);
      params.set("section", sectionSlug);
      params.set("table", table.id);

      const queryString = params.toString();
      const newUrl = queryString
        ? `/places/${venueSlug}?${queryString}`
        : `/places/${venueSlug}`;
      router.push(newUrl, { scroll: false });
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { n: 1, label: "Event" },
            { n: 2, label: "Sections" },
            { n: 3, label: "Reservation" },
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
          onSelectEvent={handleSelectEvent}
        />
      </div>

      {state.selectedEvent && state.step === "sections" && (
        <div ref={sectionsRef} className="scroll-mt-24">
          <StepSections
            venueName={venueName}
            venueSlug={venueSlug}
            eventName={state.selectedEvent.eventName}
            eventDate={state.selectedEvent.dateString}
            eventFlyerPath={state.selectedEvent.flyerImagePath}
            eventFlyerSourceUrl={state.selectedEvent.flyerSourceUrl}
            pricingNote={state.selectedEvent.pricingNote}
            sections={state.selectedEvent.sections ?? []}
            selectedSectionName={state.selectedTable?.section}
            selectedTableName={state.selectedTable?.name}
            selectedTablePrice={state.selectedTable?.price}
            onBack={() => dispatch({ type: "BACK_TO_EVENT" })}
            onSelectTable={handleSelectTable}
          />
        </div>
      )}

      {state.selectedEvent && state.selectedTable && state.step === "review" && (
        <div ref={reviewRef} className="scroll-mt-24">
          <StepReview
            venueName={venueName}
            venueSlug={venueSlug}
            event={state.selectedEvent}
            selectedTable={state.selectedTable}
            onBack={() => dispatch({ type: "BACK_TO_SECTIONS" })}
            onSubmit={handleReservationSubmit}
          />
        </div>
      )}
    </div>
  );
}
