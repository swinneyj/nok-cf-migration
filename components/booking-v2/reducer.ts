import type { BookingAction, BookingState } from "./types";

export const initialBookingState: BookingState = {
  step: "event",
  selectedEvent: null,

  draftGuys: 0,
  draftGirls: 0,

  committedGuys: 0,
  committedGirls: 0,

  selectedTable: null,
};

function clampCount(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
}

export function bookingReducer(
  state: BookingState,
  action: BookingAction
): BookingState {
  switch (action.type) {
    case "SELECT_EVENT":
      return {
        ...state,
        step: "guests",
        selectedEvent: action.event,
        selectedTable: null,
      };

    case "SET_DRAFT_GUYS": {
      const nextGuys = clampCount(action.value);

      const committedChanged =
        state.committedGuys !== nextGuys ||
        state.committedGirls !== state.draftGirls;

      return {
        ...state,
        draftGuys: nextGuys,
        ...(committedChanged && state.step !== "guests"
          ? {
              step: "guests",
              committedGuys: 0,
              committedGirls: 0,
              selectedTable: null,
            }
          : {}),
      };
    }

    case "SET_DRAFT_GIRLS": {
      const nextGirls = clampCount(action.value);

      const committedChanged =
        state.committedGirls !== nextGirls ||
        state.committedGuys !== state.draftGuys;

      return {
        ...state,
        draftGirls: nextGirls,
        ...(committedChanged && state.step !== "guests"
          ? {
              step: "guests",
              committedGuys: 0,
              committedGirls: 0,
              selectedTable: null,
            }
          : {}),
      };
    }

    case "CONTINUE_FROM_GUESTS": {
      const total = state.draftGuys + state.draftGirls;
      if (!state.selectedEvent || total <= 0) return state;

      return {
        ...state,
        step: "sections",
        committedGuys: state.draftGuys,
        committedGirls: state.draftGirls,
        selectedTable: null,
      };
    }

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

    case "BACK_TO_GUESTS":
      return {
        ...state,
        step: "guests",
        committedGuys: 0,
        committedGirls: 0,
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
