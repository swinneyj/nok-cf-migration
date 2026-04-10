"use client";

import { useEffect, useMemo, useRef } from "react";

interface StepGuestsProps {
  eventName: string;
  eventDate: string;
  guys: number;
  girls: number;
  autoAdvanceEnabled?: boolean;
  onChangeGuys: (value: number) => void;
  onChangeGirls: (value: number) => void;
  onBack: () => void;
  onContinue: () => void;
}

function CounterCard({
  label,
  value,
  onDecrease,
  onIncrease,
}: {
  label: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="mb-3 text-[15px] font-semibold text-gray-700">{label}</div>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onDecrease}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-xl font-bold text-gray-900 transition hover:bg-gray-200"
        >
          −
        </button>

        <span className="min-w-[2rem] text-center text-[2rem] font-bold leading-none text-gray-950">
          {value}
        </span>

        <button
          type="button"
          onClick={onIncrease}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-xl font-bold text-gray-900 transition hover:bg-gray-200"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function StepGuests({
  eventName,
  eventDate,
  guys,
  girls,
  autoAdvanceEnabled = false,
  onChangeGuys,
  onChangeGirls,
  onBack,
  onContinue,
}: StepGuestsProps) {
  const totalGuests = guys + girls;
  const firstAutoAdvanceRef = useRef(true);
  const totalGuestsRef = useRef(totalGuests);
  const interactionCountRef = useRef(0);

  useEffect(() => {
    if (!autoAdvanceEnabled) {
      firstAutoAdvanceRef.current = true;
      totalGuestsRef.current = totalGuests;
      interactionCountRef.current = 0;
      return;
    }

    const previousTotal = totalGuestsRef.current;
    totalGuestsRef.current = totalGuests;

    if (firstAutoAdvanceRef.current) {
      firstAutoAdvanceRef.current = false;
      return;
    }

    if (totalGuests === previousTotal) {
      return;
    }

    interactionCountRef.current += 1;

    if (totalGuests <= 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      onContinue();
    }, interactionCountRef.current > 1 ? 1200 : 1800);

    return () => window.clearTimeout(timeout);
  }, [autoAdvanceEnabled, onContinue, totalGuests]);

  const helperText = useMemo(() => {
    if (totalGuests <= 0) {
      return "Choose your group size to continue.";
    }

    return `We’ll continue to sections once you pause on ${totalGuests} guest${
      totalGuests === 1 ? "" : "s"
    }.`;
  }, [totalGuests]);

  return (
    <section className="rounded-[30px] bg-[#a7a7ad] p-3 shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
      <div className="overflow-hidden rounded-[26px] bg-white shadow-sm">
        <div className="bg-gradient-to-r from-purple-900 to-black px-5 py-5 text-white md:px-6">
          <p className="text-[13px] font-semibold uppercase tracking-[0.24em] text-fuchsia-200">
            Step 2
          </p>
          <h2 className="mt-1 text-[2rem] font-bold leading-tight tracking-[-0.02em] text-white">
            Enter guest count
          </h2>
          <p className="mt-2 text-[15px] font-medium leading-6 text-white/82">
            {eventName} • {eventDate}
          </p>
        </div>

        <div className="bg-white p-4 md:p-6">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <CounterCard
                label="Girls"
                value={girls}
                onDecrease={() => onChangeGirls(Math.max(0, girls - 1))}
                onIncrease={() => onChangeGirls(girls + 1)}
              />

              <CounterCard
                label="Guys"
                value={guys}
                onDecrease={() => onChangeGuys(Math.max(0, guys - 1))}
                onIncrease={() => onChangeGuys(guys + 1)}
              />
            </div>

            <div className="rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[15px] font-semibold text-gray-700">
                  Total Guests
                </span>
                <span className="text-[2rem] font-bold leading-none text-gray-950">
                  {totalGuests}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-fuchsia-100 bg-fuchsia-50/70 px-4 py-3 text-[14px] font-medium text-fuchsia-900">
              {helperText}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-[15px] font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              Change Event
            </button>

            <button
              type="button"
              onClick={onContinue}
              disabled={totalGuests <= 0}
              className="flex-1 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-purple-900 px-5 py-3.5 text-[15px] font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue to sections
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
