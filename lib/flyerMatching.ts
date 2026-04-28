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

function stripVenueSuffix(value: string) {
  const original = String(value || "").trim();
  const parts = original.split(/\s+[-–—|•]\s+/);

  if (parts.length <= 1) {
    return original;
  }

  const suffix = parts[parts.length - 1].toLowerCase();
  const looksLikeVenue =
    suffix.includes("nightclub") ||
    suffix.includes("dayclub") ||
    suffix.includes("beach club") ||
    suffix.includes("pool") ||
    suffix.includes("xs") ||
    suffix.includes("drai") ||
    suffix.includes("ebc") ||
    suffix.includes("omnia") ||
    suffix.includes("hakkasan") ||
    suffix.includes("tao") ||
    suffix.includes("marquee") ||
    suffix.includes("zouk") ||
    suffix.includes("liv") ||
    suffix.includes("ayu");

  return looksLikeVenue ? parts.slice(0, -1).join(" - ").trim() : original;
}

export function normalizeEventName(value: string) {
  return stripVenueSuffix(value)
    .replace(/\s+/g, " ")
    .replace(/\b(guest list|tickets|vip tables|table service|bottle service)\b/gi, "")
    .replace(/\b(special guest dj set|special guest|dj set)\b/gi, "")
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
    score += 60;
  } else if (entrySlug.includes(targetSlug) || targetSlug.includes(entrySlug)) {
    score += 35;
  }

  const entryWords = new Set(entrySlug.split("-").filter(Boolean));
  const targetWords = targetSlug.split("-").filter(Boolean);
  const overlap = targetWords.filter((word) => entryWords.has(word)).length;
  score += overlap * 8;

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
      bestEntry = entry;
    }
  }

  return bestScore >= 8 ? bestEntry : null;
}

export function buildFlyerCandidates(
  manifest: FlyerManifestEntry[],
  venueSlug: string,
  eventName: string,
  dateKey: string,
  options: {
    preferredPath?: string;
    fallbackPath?: string;
    sourceUrl?: string;
  } = {}
) {
  const candidates: string[] = [];
  const pushCandidate = (value?: string) => {
    const normalized = typeof value === "string" ? value.trim() : "";
    if (!normalized || candidates.includes(normalized)) {
      return;
    }
    candidates.push(normalized);
  };

  const manifestEntry = findBestFlyerEntry(manifest, venueSlug, eventName, dateKey);

  pushCandidate(manifestEntry?.imagePath);
  pushCandidate(options.preferredPath);
  pushCandidate(options.fallbackPath);
  pushCandidate(options.sourceUrl);

  return candidates;
}
