import type { BookingAction, BookingState } from "./types";

export const initialBookingState: BookingState = {
  step: "event",
  selectedEvent: null,
  selectedTable: null,
};

export function bookingReducer(
  state: BookingState,
  action: BookingAction
): BookingState {
  switch (action.type) {
    case "SELECT_EVENT":
      return {
        ...state,
        step: "sections",
        selectedEvent: action.event,
        selectedTable: null,
      };

    case "SELECT_TABLE":
      return {
        ...state,
        selectedTable: action.table,
        step: "review",
      };

    case "BACK_TO_EVENT":
      return {
        ...state,
        step: "event",
        selectedTable: null,
      };

    case "BACK_TO_SECTIONS":
      return {
        ...state,
        step: "sections",
      };

    case "RESET_FLOW":
      return initialBookingState;

    default:
      return state;
  }
}
