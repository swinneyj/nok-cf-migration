import type { ParsedEvent } from "@/lib/calendarParser";

export type BookingStep = "event" | "guests" | "sections" | "review";

export interface SelectedTable {
  id: string;
  name: string;
  price: number;
  section: string;
}

export interface BookingState {
  step: BookingStep;
  selectedEvent: ParsedEvent | null;

  draftGuys: number;
  draftGirls: number;

  committedGuys: number;
  committedGirls: number;

  selectedTable: SelectedTable | null;
}

export type BookingAction =
  | { type: "SELECT_EVENT"; event: ParsedEvent }
  | { type: "SET_DRAFT_GUYS"; value: number }
  | { type: "SET_DRAFT_GIRLS"; value: number }
  | { type: "CONTINUE_FROM_GUESTS" }
  | { type: "SELECT_TABLE"; table: SelectedTable }
  | { type: "BACK_TO_EVENT" }
  | { type: "BACK_TO_GUESTS" }
  | { type: "BACK_TO_SECTIONS" }
  | { type: "RESET_FLOW" };
