"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";

interface ShareButtonProps {
  venueName: string;
  venueSlug: string;
  eventName?: string;
  sectionName?: string;
  tableName?: string;
}

export default function ShareButton({
  venueName,
  venueSlug,
  eventName,
  sectionName,
  tableName,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    // Only set URL on client side
    if (typeof window !== "undefined") {
      const params = new URLSearchParams();
      
      // Get current URL params
      const currentParams = new URLSearchParams(window.location.search);
      const event = currentParams.get("event");
      const section = currentParams.get("section");
      const table = currentParams.get("table");
      
      if (event) params.set("event", event);
      if (section) params.set("section", section);
      if (table) params.set("table", table);

      const url = `${window.location.origin}/places/${venueSlug}?${params.toString()}`;
      setShareUrl(url);
    }
  }, [venueSlug]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${venueName} - ${eventName || "Reservation"}`,
          text: `Check out this table at ${venueName}!`,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    }
  };

  const hasNativeShare =
    typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          onClick={handleCopyToClipboard}
          className="flex-1 bg-fuchsia-700 hover:bg-fuchsia-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Copy className="w-5 h-5" />
          {copied ? "Copied!" : "Copy Link"}
        </button>

        {hasNativeShare && (
          <button
            onClick={handleNativeShare}
            className="flex-1 bg-white border-2 border-fuchsia-700 hover:bg-fuchsia-50 text-fuchsia-700 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500 text-center">
        Share this reservation with your group
      </p>
    </div>
  );
}
