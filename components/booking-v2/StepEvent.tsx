"use client";

import type { ParsedEvent } from "@/lib/calendarParser";
import EventCalendar from "@/components/EventCalendar";

interface StepEventProps {
    venueName: string;
    venueSlug: string;
    selectedEvent: ParsedEvent | null;
    onSelectEvent: (event: ParsedEvent) => void;
}

export default function StepEvent({
    venueName,
    venueSlug,
    selectedEvent,
    onSelectEvent,
}: StepEventProps) {
    return (
        <section className="rounded-[28px] bg-[#a3a3a3] p-3 sm:p-4">
            <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
                <div className="bg-gradient-to-r from-[#61208f] via-[#2f0a4f] to-black px-5 py-5 sm:px-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-200">
                        Step 1
                    </p>
                    <h2 className="mt-1 text-[2rem] font-bold leading-none text-white">
                        Choose your event
                    </h2>
                    <p className="mt-2 text-base text-white/80">
                        Pick the event date first, then continue through the booking flow.
                    </p>
                </div>

                <div className="p-4 sm:p-5">
                    <EventCalendar
                        venueSlug={venueSlug}
                        selectedEventId={selectedEvent?.id}
                        onEventSelected={onSelectEvent}
                    />
                </div>
            </div>
        </section>
    );
}
