"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import type { VenueMapConfig } from "@/lib/venueMaps";

interface VenueMapModalProps {
  open: boolean;
  onClose: () => void;
  venueName: string;
  config: VenueMapConfig;
  sections: string[];
  selectedSectionName?: string;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.25;

export default function VenueMapModal({
  open,
  onClose,
  venueName,
  config,
  sections,
  selectedSectionName,
}: VenueMapModalProps) {
  const [zoom, setZoom] = useState(1);
  const [activeViewId, setActiveViewId] = useState(config.views[0]?.id ?? "default");
  const [activePageIndex, setActivePageIndex] = useState(0);

  useEffect(() => {
    setActiveViewId(config.views[0]?.id ?? "default");
    setZoom(1);
    setActivePageIndex(0);
  }, [config]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const activeView = useMemo(
    () => config.views.find((view) => view.id === activeViewId) ?? config.views[0],
    [config.views, activeViewId]
  );
  const activePages = activeView?.pages ?? [{ imagePath: activeView.imagePath, alt: activeView.alt }];
  const activePage = activePages[Math.min(activePageIndex, activePages.length - 1)];

  const visibleSections = useMemo(
    () => sections.filter(Boolean).slice(0, 10),
    [sections]
  );

  const zoomIn = () => setZoom((current) => Math.min(MAX_ZOOM, current + ZOOM_STEP));
  const zoomOut = () => setZoom((current) => Math.max(MIN_ZOOM, current - ZOOM_STEP));

  useEffect(() => {
    setActivePageIndex(0);
  }, [activeViewId]);

  if (!open || !activeView || !activePage) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120]">
      <button
        type="button"
        aria-label="Close venue map"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-end justify-center p-0 sm:items-center sm:p-4">
        <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden rounded-none bg-white shadow-2xl sm:h-[min(92vh,860px)] sm:max-w-6xl sm:rounded-3xl">
          <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-4 py-4 sm:px-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {config.title}
                </h3>
                {config.badge && (
                  <span className="rounded-full bg-fuchsia-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-fuchsia-700">
                    {config.badge}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {config.helperText ?? `Use this map to get a clearer sense of the ${venueName} layout.`}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-1 flex-col overflow-hidden xl:flex-row">
            <div className="order-2 flex flex-col border-t border-gray-200 bg-gray-50 xl:order-1 xl:w-[280px] xl:border-r xl:border-t-0">
              {config.views.length > 1 && (
                <div className="border-b border-gray-200 px-4 py-4 sm:px-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Map Views
                  </p>
                  <div className="flex flex-wrap gap-2 xl:flex-col">
                    {config.views.map((view) => {
                      const active = view.id === activeView.id;
                      return (
                        <button
                          key={view.id}
                          type="button"
                          onClick={() => {
                            setActiveViewId(view.id);
                            setZoom(1);
                            setActivePageIndex(0);
                          }}
                          className={[
                            "rounded-xl border px-3 py-2 text-left text-sm font-semibold transition",
                            active
                              ? "border-fuchsia-500 bg-fuchsia-50 text-fuchsia-700"
                              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100",
                          ].join(" ")}
                        >
                          {view.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="px-4 py-4 sm:px-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Sections
                  </p>
                  {selectedSectionName && (
                    <span className="rounded-full bg-fuchsia-100 px-2.5 py-1 text-[11px] font-semibold text-fuchsia-700">
                      {selectedSectionName}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2 xl:max-h-[280px] xl:overflow-auto">
                  {visibleSections.length > 0 ? (
                    visibleSections.map((section) => {
                      const active = section === selectedSectionName;
                      return (
                        <span
                          key={section}
                          className={[
                            "rounded-full border px-3 py-1.5 text-sm",
                            active
                              ? "border-fuchsia-500 bg-fuchsia-50 font-semibold text-fuchsia-700"
                              : "border-gray-200 bg-white text-gray-700",
                          ].join(" ")}
                        >
                          {section}
                        </span>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500">Sections will appear here once pricing loads.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="order-1 flex min-h-0 flex-1 flex-col xl:order-2">
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-6">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{activeView.label}</p>
                  <p className="text-xs text-gray-500">
                    {activePages.length > 1
                      ? `Page ${activePageIndex + 1} of ${activePages.length}`
                      : "Zoom in for a closer look. This layout is ready for future section hotspots."}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {activePages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setActivePageIndex((current) => Math.max(0, current - 1))
                        }
                        disabled={activePageIndex === 0}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActivePageIndex((current) =>
                            Math.min(activePages.length - 1, current + 1)
                          )
                        }
                        disabled={activePageIndex >= activePages.length - 1}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={zoomOut}
                    disabled={zoom <= MIN_ZOOM}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <span className="min-w-[52px] text-center text-sm font-semibold text-gray-700">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={zoomIn}
                    disabled={zoom >= MAX_ZOOM}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="min-h-[48dvh] flex-1 overflow-auto bg-[#f7f7f8] p-2 sm:min-h-0 sm:p-5">
                <div className="flex min-h-full min-w-full items-start justify-start">
                  <img
                    src={activePage.imagePath}
                    alt={activePage.alt}
                    className="h-auto min-w-full shrink-0 rounded-2xl border border-gray-200 bg-white shadow-sm"
                    style={{
                      width: `${zoom * 100}%`,
                      maxWidth: "none",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
