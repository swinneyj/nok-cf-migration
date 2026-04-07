"use client";

import { EventSection, PricingTier, calculatePricingForGuests } from "@/lib/calendarParser";
import { Users } from "lucide-react";

interface PricingCardProps {
  section: EventSection;
  guestCount: number;
  selectedTierId?: string;
  onSelectTier: (tierId: string, tierName: string, price: number) => void;
  onGuestCountChange?: (count: number) => void;
}

export default function PricingCard({
  section,
  guestCount,
  selectedTierId,
  onSelectTier,
  onGuestCountChange,
}: PricingCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-4">
        <h3 className="font-bold text-lg">{section.title}</h3>
        {section.description && (
          <p className="text-sm text-gray-300 mt-1">{section.description}</p>
        )}
      </div>

      {/* Tiers List */}
      <div className="divide-y divide-gray-200">
        {section.tiers.map((tier, index) => {
          const tierId = `${section.title}-${index}`;
          const pricing = calculatePricingForGuests(tier, guestCount);
          const isSelected = selectedTierId === tierId;

          return (
            <div
              key={tierId}
              className={`p-4 transition ${
                tier.soldOut
                  ? "bg-gray-50 opacity-60 cursor-not-allowed"
                  : "hover:bg-blue-50 cursor-pointer"
              } ${isSelected ? "bg-purple-100 border-l-4 border-purple-900" : ""}`}
              onClick={() => {
                if (!tier.soldOut && pricing.isValid) {
                  onSelectTier(tierId, tier.name, tier.price);
                }
              }}
            >
              {/* Tier Name and Price */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{tier.name}</p>
                  <p className="text-sm text-gray-600">
                    Capacity: {tier.capacity} people
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-900">
                    ${tier.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">minimum spend</p>
                </div>
              </div>

              {/* Status */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                {tier.soldOut ? (
                  <div className="bg-red-50 text-red-700 px-3 py-2 rounded text-sm font-medium">
                    SOLD OUT
                  </div>
                ) : !pricing.isValid && guestCount > 0 ? (
                  <div className="bg-yellow-50 text-yellow-700 px-3 py-2 rounded text-sm font-medium">
                    {pricing.message}
                  </div>
                ) : (
                  <button
                    className={`w-full py-2 px-3 rounded font-medium transition text-sm ${
                      isSelected
                        ? "bg-purple-900 text-white"
                        : "bg-purple-100 text-purple-900 hover:bg-purple-200"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTier(tierId, tier.name, tier.price);
                    }}
                  >
                    {isSelected ? "✓ Selected" : "Select"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
