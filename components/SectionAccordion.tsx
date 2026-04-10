"use client";

import { EventSection, PricingTier } from "@/lib/calendarParser";
import { ChevronDown, Users } from "lucide-react";

interface SectionAccordionProps {
  section: EventSection;
  guestCount: number;
  isOpen: boolean;
  onToggle: () => void;
  selectedTierId?: string;
  onSelectTier: (
    tierId: string,
    tierName: string,
    price: number,
    sectionTitle: string
  ) => void;
}

function makeTierId(sectionTitle: string, tierName: string) {
  return `${sectionTitle}__${tierName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTierState(tier: PricingTier, guestCount: number) {
  if (tier.soldOut) {
    return {
      disabled: true,
      buttonText: "Sold Out",
      message: null as string | null,
    };
  }

  if (guestCount > tier.capacity) {
    return {
      disabled: true,
      buttonText: "Too Small",
      message: `Best for up to ${tier.capacity} guests`,
    };
  }

  return {
    disabled: false,
    buttonText: "Select",
    message: null as string | null,
  };
}

export default function SectionAccordion({
  section,
  guestCount,
  isOpen,
  onToggle,
  selectedTierId,
  onSelectTier,
}: SectionAccordionProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-[#4056a3] shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-5 text-left text-white transition hover:bg-white/5"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl font-medium tracking-wide">{section.title}</span>
        </div>

        <ChevronDown className={`h-6 w-6 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="border-t border-white/10 bg-[#50384a] p-4 sm:p-5">
          <div className="space-y-3">
            {section.tiers.map((tier) => {
              const tierId = makeTierId(section.title, tier.name);
              const isSelected = selectedTierId === tierId;
              const tierState = getTierState(tier, guestCount);

              return (
                <div
                  key={tierId}
                  className="rounded-lg border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-xl font-semibold text-white">{tier.name}</h3>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/25 px-3 py-1 text-sm text-white/90">
                          <Users className="h-4 w-4" />
                          {tier.capacity} people
                        </span>

                        {tier.soldOut && (
                          <span className="rounded-full bg-red-500/20 px-3 py-1 text-sm font-medium text-red-200">
                            Sold Out
                          </span>
                        )}
                      </div>

                      {tierState.message && (
                        <p className="mt-3 text-sm text-white/75">{tierState.message}</p>
                      )}
                    </div>

                    <div className="shrink-0 text-left md:text-right">
                      <p className="text-sm uppercase tracking-wide text-white/70">
                        Minimum Spend
                      </p>
                      <p className="text-4xl font-bold text-white">
                        ${tier.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      disabled={tierState.disabled}
                      onClick={() =>
                        onSelectTier(tierId, tier.name, tier.price, section.title)
                      }
                      className={[
                        "min-w-[140px] rounded-md px-5 py-3 text-sm font-semibold transition-all duration-200 active:scale-95",
                        tierState.disabled
                          ? "cursor-not-allowed bg-white/10 text-white/40"
                          : isSelected
                            ? "bg-fuchsia-700 text-white"
                            : "bg-fuchsia-500 text-white hover:bg-fuchsia-400",
                      ].join(" ")}
                    >
                      {isSelected && !tierState.disabled ? "Selected" : tierState.buttonText}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}