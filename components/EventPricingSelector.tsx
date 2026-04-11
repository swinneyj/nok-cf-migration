"use client";

import BookingFlowV2 from "@/components/booking-v2/BookingFlowV2";

interface EventPricingSelectorProps {
  venueName: string;
  venueSlug: string;
}

export default function EventPricingSelector({
  venueName,
  venueSlug,
}: EventPricingSelectorProps) {
  return <BookingFlowV2 venueName={venueName} venueSlug={venueSlug} />;
}
