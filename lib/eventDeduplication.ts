import type { ParsedEvent } from "@/lib/calendarParser";

function getSectionCount(event: ParsedEvent) {
  return Array.isArray(event.sections) ? event.sections.length : 0;
}

function getTierCount(event: ParsedEvent) {
  return Array.isArray(event.sections)
    ? event.sections.reduce(
        (count, section) =>
          count + (Array.isArray(section.tiers) ? section.tiers.length : 0),
        0
      )
    : 0;
}

function isGenericPlaceholderEventName(name: string | undefined) {
  const normalized = String(name || "").trim().toLowerCase();

  return (
    normalized.startsWith("special guest") ||
    normalized.startsWith("special event") ||
    normalized === "xs nightclub" ||
    normalized === "omnia nightclub"
  );
}

function getFallbackTimeSortKey(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
}

export function canonicalizeRecurringEventId(id: string | undefined) {
  if (!id) return "";

  const match = id.match(/^(.*)_((R)?\d{8}T\d{6})(Z)?$/);
  if (match && match[1]) {
    return match[1];
  }

  return id;
}

function isRecurringInstanceId(id: string | undefined) {
  return typeof id === "string" && /_(R)?\d{8}T\d{6}Z?$/.test(id);
}

export function pickPreferredEvent(a: ParsedEvent, b: ParsedEvent) {
  const aPlaceholder = isGenericPlaceholderEventName(a.eventName);
  const bPlaceholder = isGenericPlaceholderEventName(b.eventName);
  if (aPlaceholder !== bPlaceholder) return aPlaceholder ? b : a;

  const aSections = getSectionCount(a);
  const bSections = getSectionCount(b);
  if (aSections !== bSections) return aSections > bSections ? a : b;

  const aTiers = getTierCount(a);
  const bTiers = getTierCount(b);
  if (aTiers !== bTiers) return aTiers > bTiers ? a : b;

  const aHasFlyer = Boolean(a.flyerImagePath);
  const bHasFlyer = Boolean(b.flyerImagePath);
  if (aHasFlyer !== bHasFlyer) return aHasFlyer ? a : b;

  const aHasTime = Boolean(a.timeLabel);
  const bHasTime = Boolean(b.timeLabel);
  if (aHasTime !== bHasTime) return aHasTime ? a : b;

  const aIsR = typeof a.id === "string" && /_R\d{8}T\d{6}$/.test(a.id);
  const bIsR = typeof b.id === "string" && /_R\d{8}T\d{6}$/.test(b.id);
  if (aIsR !== bIsR) return aIsR ? b : a;

  return a;
}

export function getParsedEventDeduplicationKey(event: ParsedEvent) {
  const canonicalId = canonicalizeRecurringEventId(event.id);
  if (isRecurringInstanceId(event.id)) {
    // Google recurring expansions sometimes emit a generic placeholder instance
    // and a richer event instance for the same night with slightly different times.
    // Collapse those by series id + local event date so the better event wins.
    return `${canonicalId}::${event.dateKey}`;
  }

  const timeKey = event.timeSortKey || getFallbackTimeSortKey(event.date);
  return `${canonicalId}::${event.dateKey}::${timeKey}`;
}

export function dedupeParsedEvents(events: ParsedEvent[]) {
  const map = new Map<string, ParsedEvent>();

  for (const event of events) {
    const key = getParsedEventDeduplicationKey(event);

    const existing = map.get(key);
    if (!existing) {
      map.set(key, event);
      continue;
    }

    map.set(key, pickPreferredEvent(existing, event));
  }

  return Array.from(map.values());
}
