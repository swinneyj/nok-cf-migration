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
      <div className="rounded-lg bg-fuchsia-50 p-4 border border-fuchsia-200">
        <p className="text-sm text-gray-600 mb-2">
          Share this reservation with your group:
        </p>
        <div className="flex items-center gap-2 bg-white rounded border border-gray-300 p-3">
          <code className="text-sm flex-1 break-all text-gray-700">
            {shareUrl}
          </code>
          <button
            onClick={handleCopyToClipboard}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded transition-colors"
            title="Copy to clipboard"
            aria-label="Copy link to clipboard"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <Copy className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
        {copied && (
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <Check className="w-4 h-4" />
            Link copied to clipboard!
          </p>
        )}
      </div>

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
        Friends can open this link to see your selected table
      </p>
    </div>
  );
}
