export interface FlyerManifestEntry {
  venueSlug: string;
  venueName?: string;
  eventName: string;
  date: string;
  imagePath: string;
  sourceUrl?: string;
}

function slugify(value: string) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeEventName(value: string) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/\b(guest list|tickets|vip tables|table service)\b/gi, "")
    .replace(/\s*[|•].*$/g, "")
    .trim();
}

function scoreFlyerMatch(entry: FlyerManifestEntry, targetSlug: string) {
  const entrySlug = slugify(normalizeEventName(entry.eventName));
  let score = 0;

  if (!entrySlug || !targetSlug) {
    return score;
  }

  if (entrySlug === targetSlug) {
    score += 30;
  } else if (entrySlug.includes(targetSlug) || targetSlug.includes(entrySlug)) {
    score += 18;
  }

  const entryWords = new Set(entrySlug.split("-").filter(Boolean));
  const targetWords = targetSlug.split("-").filter(Boolean);
  const overlap = targetWords.filter((word) => entryWords.has(word)).length;
  score += overlap * 3;

  // Prefer more specific flyers when multiple same-day entries compete.
  score += Math.min(6, Math.max(0, entryWords.size - 2));

  return score;
}

export function findBestFlyerEntry(
  manifest: FlyerManifestEntry[],
  venueSlug: string,
  eventName: string,
  dateKey: string
) {
  const sameDateEntries = manifest.filter(
    (entry) => entry.venueSlug === venueSlug && entry.date === dateKey
  );

  if (!sameDateEntries.length) {
    return null;
  }

  const targetSlug = slugify(normalizeEventName(eventName));
  let bestEntry: FlyerManifestEntry | null = null;
  let bestScore = 0;

  for (const entry of sameDateEntries) {
    const score = scoreFlyerMatch(entry, targetSlug);
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
      continue;
    }

    if (score === bestScore && bestEntry) {
      // Keep the later entry on ties so a refreshed manifest wins.
      bestEntry = entry;
    }
  }

  return bestScore > 0 ? bestEntry : null;
}
