"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Mail, Phone, Users } from "lucide-react";
import TurnstileField, { type TurnstileStatus } from "@/components/TurnstileField";

interface ReservationFormProps {
  venueName: string;
  eventName: string;
  eventDate: string;
  selectedTable?: {
    name: string;
    price: number;
    capacity?: number;
    section?: string;
  };
  onSubmit?: (data: ReservationData) => void;
}

export interface ReservationData {
  venueName: string;
  eventName: string;
  eventDate: string;
  tableName: string;
  tablePrice: number;
  tableSection?: string;
  tableCapacity?: number;
  numGuys: number;
  numGirls: number;
  totalGuests: number;
  reservationStatus: "VALID" | "OVER_CAPACITY";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

type GuestField = "numGuys" | "numGirls";

export default function ReservationForm({
  venueName,
  eventName,
  eventDate,
  selectedTable,
  onSubmit,
}: ReservationFormProps) {
  const successRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [guestData, setGuestData] = useState({
    numGuys: 0,
    numGirls: 0,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [turnstileStatus, setTurnstileStatus] = useState<TurnstileStatus>("loading");
  const [turnstileMessage, setTurnstileMessage] = useState("Loading spam protection...");

  const totalGuests = guestData.numGuys + guestData.numGirls;
  const handleTurnstileTokenChange = useCallback((token: string | null) => {
    setTurnstileToken(token);
  }, []);
  const handleTurnstileStatusChange = useCallback((status: TurnstileStatus, message?: string | null) => {
    setTurnstileStatus(status);
    setTurnstileMessage(message ?? "");
  }, []);

  const isOverCapacity = useMemo(() => {
    if (!selectedTable?.capacity || selectedTable.capacity <= 0) {
      return false;
    }

    return totalGuests > selectedTable.capacity;
  }, [selectedTable?.capacity, totalGuests]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setGuestValue = (name: GuestField, nextValue: number) => {
    setGuestData((prev) => ({
      ...prev,
      [name]: Math.max(0, Math.floor(nextValue) || 0),
    }));
  };

  const handleGuestInputChange = (
    name: GuestField,
    value: string,
  ) => {
    const digitsOnly = value.replace(/\D/g, "");
    setGuestValue(name, digitsOnly === "" ? 0 : Number(digitsOnly));
  };

  const adjustGuestValue = (name: GuestField, delta: number) => {
    setGuestValue(name, guestData[name] + delta);
  };

  const selectGuestInputValue = (input: HTMLInputElement) => {
    requestAnimationFrame(() => {
      input.select();
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!selectedTable) {
      setError("Please select a table");
      setLoading(false);
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (totalGuests <= 0) {
      setError("Please enter at least 1 guest so our team can validate your request.");
      setLoading(false);
      return;
    }

    if (!turnstileToken) {
      setError("Please complete the spam protection check.");
      setLoading(false);
      return;
    }

    try {
      const data: ReservationData = {
        venueName,
        eventName,
        eventDate,
        tableName: selectedTable.name,
        tablePrice: selectedTable.price,
        tableSection: selectedTable.section,
        tableCapacity: selectedTable.capacity,
        numGuys: guestData.numGuys,
        numGirls: guestData.numGirls,
        totalGuests,
        reservationStatus: isOverCapacity ? "OVER_CAPACITY" : "VALID",
        ...formData,
      };

      onSubmit?.(data);

      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...data,
          website: "",
          turnstileToken,
          _subject: `${isOverCapacity ? "⚠️ OVER CAPACITY — " : ""}New Reservation Request - ${eventName} at ${venueName}`,
          _replyto: formData.email,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTurnstileToken(null);
        setTurnstileResetKey((current) => current + 1);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        });
        setGuestData({
          numGuys: 0,
          numGirls: 0,
        });
      } else {
        setError("Failed to submit reservation. Please try again.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-purple-900 focus:ring-2 focus:ring-purple-200";


  useEffect(() => {
    if (!submitted) return;

    requestAnimationFrame(() => {
      successRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [submitted]);

  if (submitted) {
    return (
      <div ref={successRef} className="rounded-lg border-2 border-green-200 bg-green-50 p-6 text-center">
        <div className="mb-3 text-5xl">✓</div>
        <h3 className="mb-2 text-2xl font-bold text-green-900">
          Reservation Request Submitted!
        </h3>
        <p className="mb-4 text-green-800">
          Thank you for your interest! We&apos;ve received your request for{" "}
          <strong>{selectedTable?.name}</strong> at <strong>{venueName}</strong> on{" "}
          <strong>{eventDate}</strong>.
        </p>
        <p className="mb-4 text-green-800">
          Our team will review your request and send you a deposit link within 24
          hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="rounded bg-green-900 px-6 py-2 font-medium text-white transition hover:bg-green-800"
        >
          Make Another Reservation
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="bg-gradient-to-r from-purple-900 to-black p-6 text-white">
        <h3 className="mb-2 text-2xl font-bold">Complete Your Reservation</h3>
        <p className="text-purple-200">
          {eventName} • {eventDate} • {venueName}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        {selectedTable && (
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Selected Section</p>
                <p className="text-lg font-bold text-purple-900">
                  {selectedTable.section || selectedTable.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Minimum Spend</p>
                <p className="text-lg font-bold text-purple-900">
                  ${selectedTable.price.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Table Option</p>
                <p className="text-sm font-bold text-purple-900">{selectedTable.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Recommended Capacity</p>
                <p className="text-sm font-bold text-purple-900">
                  {selectedTable.capacity && selectedTable.capacity > 0
                    ? `Up to ${selectedTable.capacity} guests`
                    : "Will be confirmed by your host"}
                </p>
              </div>
            </div>
          </div>
        )}

        {isOverCapacity && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">Over capacity request</p>
                <p className="mt-1">
                  This table is typically for up to {selectedTable?.capacity} guests,
                  but you can still submit your request. Your host will review the
                  group size and adjust the quote if needed.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <h4 className="font-bold text-gray-900">Group Breakdown</h4>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { key: "numGirls", label: "Girls", value: guestData.numGirls },
              { key: "numGuys", label: "Guys", value: guestData.numGuys },
            ].map((field) => (
              <div
                key={field.key}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
              >
                <p className="mb-3 text-sm font-semibold text-gray-700">{field.label}</p>
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => adjustGuestValue(field.key as GuestField, -1)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-2xl font-bold text-gray-700 transition hover:bg-gray-200"
                    aria-label={`Decrease ${field.label.toLowerCase()}`}
                  >
                    −
                  </button>

                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    name={field.key}
                    value={field.value}
                    onChange={(e) => handleGuestInputChange(field.key as GuestField, e.target.value)}
                    onFocus={(e) => selectGuestInputValue(e.currentTarget)}
                    onClick={(e) => selectGuestInputValue(e.currentTarget)}
                    className="h-11 min-w-0 flex-1 border-0 bg-transparent px-0 text-center text-4xl font-bold leading-none text-gray-950 outline-none focus:ring-0"
                    aria-label={`Number of ${field.label.toLowerCase()}`}
                  />

                  <button
                    type="button"
                    onClick={() => adjustGuestValue(field.key as GuestField, 1)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-2xl font-bold text-gray-700 transition hover:bg-gray-200"
                    aria-label={`Increase ${field.label.toLowerCase()}`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-fuchsia-100 bg-fuchsia-50 px-5 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Users className="h-4 w-4 text-gray-500" />
              Total Guests
            </div>
            <div className="text-4xl font-bold leading-none text-fuchsia-900">
              {totalGuests}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-gray-900">Your Contact Information</h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={inputClassName}
                placeholder="John"
                autoComplete="given-name"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={inputClassName}
                placeholder="Doe"
                autoComplete="family-name"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              <Mail className="mr-1 inline h-4 w-4" />
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClassName}
              placeholder="john@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              <Phone className="mr-1 inline h-4 w-4" />
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputClassName}
              placeholder="(702) 555-0000"
              autoComplete="tel"
              required
            />
          </div>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          <p className="mb-1 font-medium">What happens next?</p>
          <ul className="list-inside list-disc space-y-1 text-xs">
            <li>We&apos;ll review your reservation request</li>
            <li>You&apos;ll receive a deposit link within 24 hours</li>
            <li>Complete the deposit to secure your reservation</li>
          </ul>
        </div>

        <TurnstileField
          onTokenChange={handleTurnstileTokenChange}
          onStatusChange={handleTurnstileStatusChange}
          resetKey={turnstileResetKey}
          theme="light"
        />

        {!turnstileToken ? (
          <p className={`text-sm ${turnstileStatus === "error" ? "text-red-600" : "text-gray-600"}`}>
            {turnstileMessage || "Complete the spam check to enable submission."}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading || !selectedTable || !turnstileToken}
          className={`w-full rounded-lg px-6 py-3 text-lg font-bold text-white transition ${
            loading || !selectedTable || !turnstileToken
              ? "cursor-not-allowed bg-gray-400"
              : "bg-gradient-to-r from-purple-900 to-black hover:from-purple-800 hover:to-gray-900"
          }`}
        >
          {loading ? "Submitting..." : "Submit Reservation Request"}
        </button>

        <p className="text-center text-xs text-gray-600">
          By submitting, you agree that we&apos;ll contact you about your reservation
        </p>
      </form>
    </div>
  );
}
