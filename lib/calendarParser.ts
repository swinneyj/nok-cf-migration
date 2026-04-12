/**
 * Generic Google Calendar pricing parser for nightlife venues.
 *
 * Goals:
 * - Work across many venues, not just one
 * - Only create sections from actual heading lines in the description
 * - Never invent sections from tier names like "Poolside Section" or "Dance Floor"
 * - Handle SOLD OUT rows and lines like "6 ppl - $750"
 */

export interface PricingTier {
  name: string;
  price: number;
  capacity: number;
  soldOut?: boolean;
}

export interface EventSection {
  title: string;
  description?: string;
  tiers: PricingTier[];
}

export interface ParsedEvent {
  id: string;
  eventName: string;
  date: Date;
  dateKey: string;
  dateString: string;
  sections: EventSection[];
  minimumSpendNote?: string;
  pricingNote?: string;
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\u00A0/g, " ").replace(/[ \t]+/g, " ").trim();
}

function normalizeSlashSpacing(text: string): string {
  return text.replace(/\s*\/\s*/g, "/").replace(/\s+/g, " ").trim();
}

function titleCase(input: string): string {
  return input
    .toLowerCase()
    .split(" ")
    .map((word) => {
      if (!word) return word;
      if (["of", "and", "the", "by"].includes(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ")
    .replace(/\bVip\b/g, "VIP")
    .replace(/\bOmnia\b/g, "Omnia");
}

function cleanHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<\/h\d>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractPrice(text: string): number {
  const match = text.match(/\$\s?([\d,]+)/);
  return match ? parseInt(match[1].replace(/,/g, ""), 10) : 0;
}

function extractCapacity(text: string): number {
  const parenMatch = text.match(/\(\s*(\d+)\s*(?:ppl|people|guests?)\s*\)/i);
  if (parenMatch) return parseInt(parenMatch[1], 10);

  const inlineMatch = text.match(/(^|-)\s*(\d+)\s*(?:ppl|people|guests?)\b/i);
  if (inlineMatch) return parseInt(inlineMatch[2], 10);

  return 0;
}

function isSoldOut(text: string): boolean {
  return /\bSOLD\s*OUT\b/i.test(text);
}

function isDateLine(line: string): boolean {
  return /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday),/i.test(line);
}

function isAddressLine(line: string): boolean {
  return /\b(?:las vegas blvd|usa|\bNV\b\s*\d{5}|street|st\.?|ave\.?|road|rd\.?|boulevard|blvd\.?|drive|dr\.?)\b/i.test(line);
}

function isMetaLine(line: string): boolean {
  return (
    /^created by:/i.test(line) ||
    /^weekly on /i.test(line) ||
    /^until /i.test(line) ||
    /^at \d/i.test(line)
  );
}

function isSkippableLine(line: string): boolean {
  const trimmed = normalizeWhitespace(line);
  if (!trimmed) return true;

  return (
    isDateLine(trimmed) ||
    isAddressLine(trimmed) ||
    isMetaLine(trimmed) ||
    /^\*?minimum spend/i.test(trimmed) ||
    /^\*?pricing and availability/i.test(trimmed) ||
    /^\*?all pricing/i.test(trimmed) ||
    /^\*?for reservations/i.test(trimmed) ||
    /^\*?please note/i.test(trimmed) ||
    /taxes, fees and gratuities/i.test(trimmed) ||
    /subject to change/i.test(trimmed)
  );
}

function stripHeaderSuffix(text: string): { title: string; description?: string } {
  const cleaned = normalizeWhitespace(normalizeSlashSpacing(text.replace(/^•\s*/, "")));

  if (/\bby approval only\b/i.test(cleaned)) {
    return {
      title: cleaned.replace(/\s*-\s*by approval only\s*$/i, "").trim(),
      description: "By Approval Only",
    };
  }

  return { title: cleaned };
}

function normalizeSectionTitle(text: string): string {
  const { title } = stripHeaderSuffix(text);
  const cleaned = normalizeWhitespace(normalizeSlashSpacing(title));

  if (/^no specific location$/i.test(cleaned)) return "NO SPECIFIC LOCATION";
  if (/^outside sections?$/i.test(cleaned)) return "OUTSIDE SECTION";
  if (/^[A-Z0-9/&'\- ]+$/.test(cleaned) && cleaned === cleaned.toUpperCase()) {
    return cleaned;
  }

  return titleCase(cleaned);
}

function parseTierLine(line: string): PricingTier | null {
  const cleaned = normalizeWhitespace(line.replace(/^•\s*/, ""));
  if (!cleaned) return null;

  // Check for N/A pricing (treat as sold out)
  const isNA = /N\/A\s*$|\bN\/A\b/i.test(cleaned);

  // Check for actual price
  const hasPrice = /\$\s?\d/.test(cleaned);
  if (!hasPrice && !isNA) return null;

  const soldOut = isSoldOut(cleaned) || isNA;
  const withoutSoldOut = normalizeWhitespace(cleaned.replace(/\bSOLD\s*OUT\b/gi, "").replace(/\bN\/A\b/gi, ""));

  const patterns = [
    /^(.+?)\s*-\s*(\$\s?[\d,]+)\s*\(\s*(\d+)\s*(?:ppl|people|guests?)\s*\)$/i,
    /^(.+?)\s*-\s*(\$\s?[\d,]+)\s+(\d+)\s*(?:ppl|people|guests?)$/i,
    /^(\d+\s*(?:ppl|people|guests?))\s*-\s*(\$\s?[\d,]+)$/i,
  ];

  for (const pattern of patterns) {
    const match = withoutSoldOut.match(pattern);
    if (!match) continue;

    if (pattern === patterns[2]) {
      return {
        name: normalizeWhitespace(match[1]),
        price: extractPrice(match[2]),
        capacity: extractCapacity(match[1]),
        soldOut,
      };
    }

    return {
      name: normalizeWhitespace(match[1]),
      price: extractPrice(match[2]),
      capacity: parseInt(match[3], 10),
      soldOut,
    };
  }

  const fallbackPrice = extractPrice(withoutSoldOut);
  const fallbackCapacity = extractCapacity(withoutSoldOut);
  if (fallbackPrice > 0 && fallbackCapacity > 0) {
    const fallbackName = normalizeWhitespace(
      withoutSoldOut
        .replace(/\bSOLD\s*OUT\b/gi, "")
        .replace(/\$\s?[\d,]+/g, "")
        .replace(/\(\s*\d+\s*(?:ppl|people|guests?)\s*\)/gi, "")
        .replace(/\b\d+\s*(?:ppl|people|guests?)\b/gi, "")
        .replace(/\s*-\s*/g, " ")
    );

    if (fallbackName) {
      return {
        name: fallbackName,
        price: fallbackPrice,
        capacity: fallbackCapacity,
        soldOut,
      };
    }
  }

  return null;
}

function isMostlyUpper(line: string): boolean {
  const letters = line.replace(/[^A-Za-z]/g, "");
  if (!letters) return false;
  const upper = line.replace(/[^A-Z]/g, "").length;
  return upper / letters.length >= 0.7;
}

function looksLikeHeader(line: string, nextMeaningfulLine?: string): boolean {
  const trimmed = normalizeWhitespace(line.replace(/^•\s*/, ""));
  if (!trimmed) return false;
  if (parseTierLine(trimmed)) return false;
  if (isSkippableLine(trimmed)) return false;

  const lower = trimmed.toLowerCase();

  // avoid venue / artist / stray metadata lines unless followed by pricing
  if (trimmed.length > 60) return false;
  if (/^[A-Z0-9&' .-]{2,40}$/.test(trimmed) && isMostlyUpper(trimmed) && !nextMeaningfulLine) {
    return false;
  }

  // Strong explicit headings
  if (/^no specific location$/i.test(trimmed)) return true;
  if (/^outside sections?$/i.test(trimmed)) return true;
  if (/\bby approval only\b/i.test(trimmed) && !/\$/.test(trimmed)) return true;

  const nextIsTier = !!nextMeaningfulLine && !!parseTierLine(nextMeaningfulLine);
  if (!nextIsTier) return false;

  // Generic heading styles seen across venues
  if (isMostlyUpper(trimmed)) return true;
  if (/^[A-Z][A-Za-z0-9/&' -]{1,50}$/.test(trimmed)) return true;
  if (/\b(area|room|balcony|terrace|club|section|tables?|table|cabanas?|couch(es)?|daybeds?|beds?|patio|stage|villa|booth|mezzanine|skybox|location)\b/i.test(lower)) {
    return true;
  }

  return false;
}

function splitPossibleEmbeddedHeaders(text: string): string {
  // Only split on broad, explicit section labels that sometimes get smashed together.
  return text
    .replace(/(NO\s*SPECIFIC\s*LOCATION)/gi, "\n$1\n")
    .replace(/(OUTSIDE\s*SECTIONS?)/gi, "\n$1\n")
    .replace(/(IMMEDIATE\s*PATIO\s*\/?\s*STAGE(?:\s*-\s*By Approval Only)?)/gi, "\n$1\n");
}

function parseSectionsFromText(text: string): EventSection[] {
  const normalizedText = splitPossibleEmbeddedHeaders(text);
  const rawLines = normalizedText
    .split("\n")
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean);

  const lines = rawLines.filter((line) => !isSkippableLine(line));

  const sections: EventSection[] = [];
  let currentSection: EventSection | null = null;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    let nextMeaningfulLine: string | undefined;
    for (let j = i + 1; j < lines.length; j += 1) {
      if (!isSkippableLine(lines[j])) {
        nextMeaningfulLine = lines[j];
        break;
      }
    }

    if (looksLikeHeader(line, nextMeaningfulLine)) {
      if (currentSection && currentSection.tiers.length > 0) {
        sections.push(currentSection);
      }

      const { description } = stripHeaderSuffix(line);
      currentSection = {
        title: normalizeSectionTitle(line),
        description,
        tiers: [],
      };
      continue;
    }

    const tier = parseTierLine(line);
    if (tier) {
      if (!currentSection) {
        currentSection = {
          title: "GENERAL",
          tiers: [],
        };
      }
      currentSection.tiers.push(tier);
    }
  }

  if (currentSection && currentSection.tiers.length > 0) {
    sections.push(currentSection);
  }

  return sections;
}

export function parseEventDescription(
  description: string,
  eventId: string,
  eventSummary: string,
  startTime: Date,
  dateKey: string
): ParsedEvent | null {
  const cleaned = cleanHtml(description);

  const eventNameMatch = eventSummary.match(/^(.+?)\s*-/);
  const eventName = eventNameMatch ? eventNameMatch[1].trim() : eventSummary.trim();

  const dateMatch = cleaned.match(/([A-Za-z]+day,\s*[A-Za-z]+\s*\d{1,2},?\s*20\d{2})/);

  const fallbackDateString = startTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const dateString = fallbackDateString;
  const sections = parseSectionsFromText(cleaned);

  const minSpendMatch = cleaned.match(/\*?Minimum spend[^.\n]*[.\n]?/i);
  const minimumSpendNote = minSpendMatch?.[0]?.trim() || undefined;

  const pricingMatch = cleaned.match(/\*?Pricing and availability[^.\n]*[.\n]?/i);
  const pricingNote = pricingMatch?.[0]?.trim() || undefined;

  return {
    id: eventId,
    eventName,
    date: startTime,
    dateKey,
    dateString,
    sections,
    minimumSpendNote,
    pricingNote,
  };
}

export function calculatePricingForGuests(
  tier: PricingTier,
  guestCount: number
): {
  isValid: boolean;
  adjustedPrice: number;
  message?: string;
} {
  if (tier.soldOut) {
    return {
      isValid: false,
      adjustedPrice: 0,
      message: "This section is sold out",
    };
  }

  if (guestCount > tier.capacity) {
    return {
      isValid: false,
      adjustedPrice: 0,
      message: `Exceeds capacity of ${tier.capacity}. Please select multiple tables or a different section.`,
    };
  }

  if (guestCount === 0) {
    return {
      isValid: false,
      adjustedPrice: 0,
      message: "Please enter guest count",
    };
  }

  return {
    isValid: true,
    adjustedPrice: tier.price,
  };
}
