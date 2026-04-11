import type { ParsedEvent } from "@/lib/calendarParser";

export type BookingStep = "event" | "sections" | "review";

export interface SelectedTable {
  id: string;
  name: string;
  price: number;
  section: string;
  capacity?: number;
  soldOut?: boolean;
}

export interface BookingState {
  step: BookingStep;
  selectedEvent: ParsedEvent | null;
  selectedTable: SelectedTable | null;
}

export type BookingAction =
  | { type: "SELECT_EVENT"; event: ParsedEvent }
  | { type: "SELECT_TABLE"; table: SelectedTable }
  | { type: "BACK_TO_EVENT" }
  | { type: "BACK_TO_SECTIONS" }
  | { type: "RESET_FLOW" };
