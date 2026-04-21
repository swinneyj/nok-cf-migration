import { load } from "cheerio";
import type { EventSection, ParsedEvent, PricingTier } from "./calendarParser";

const VEGAS_TIME_ZONE = "America/Los_Angeles";

const BOOKETING_STADIUM_SWIM = {
  manageentId: "1183",
  venueId: "535556",
  venueCode: "VEN535556",
  venueSlug: "stadium-swim",
  sourceCode: "microsite",
  sourceLoc: "bluvalue",
};

interface BooketingEventSummary {
  eventCode: string;
  eventName: string;
  href: string;
  dateKey: string;
}

interface BooketingInventoryItem {
  itemname?: string;
  capacity?: string | number;
  stock?: string | number;
  inactive?: string | number;
  listprice?: string | number;
  paynow?: string | number;
  pricingdisplay?: string;
  disclaimer?: string;
  booktypename?: string;
  ecocode?: string;
}

interface BooketingEcozone {
  ecozoneid: string;
  name: string;
  starttime?: string;
  endtime?: string;
}

interface BooketingInventoryEventData {
  name?: string;
  date?: string;
  dstarttime?: string;
  ecozone?: string;
  ecozones?: BooketingEcozone[];
  flyers?: {
    share?: {
      url?: string;
      full?: string;
    };
    eventpage?: {
      url?: string;
      full?: string;
    };
    list?: {
      url?: string;
      full?: string;
    };
  };
}

interface BooketingInventoryResponse {
  html?: string;
  items?: Record<string, BooketingInventoryItem> | string;
  eventdata?: BooketingInventoryEventData;
}

interface EcozoneOption {
  eventCode: string;
  label: string;
}

function toAbsoluteBooketingUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `https://booketing.com${path}`;
}

function dateToMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function parseMonthKey(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

function formatBooketingShortDate(date: Date) {
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function getMonthKeysInRange(startDate: Date, endDate: Date) {
  const monthKeys: string[] = [];
  const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const endCursor = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  while (cursor <= endCursor) {
    monthKeys.push(dateToMonthKey(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return monthKeys;
}

function parseDateKeyFromEventCode(eventCode: string) {
  const match = eventCode.match(/(\d{8})$/);
  if (!match) return null;

  const raw = match[1];
  return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
}

function parseCurrency(value: string | number | undefined) {
  if (typeof value === "number") return value;
  const numeric = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function parseInteger(value: string | number | undefined) {
  const numeric =
    typeof value === "number" ? value : Number(String(value ?? "").replace(/[^\d]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function isItemSoldOut(item: BooketingInventoryItem) {
  const stock = parseInteger(item.stock);
  const inactive = parseInteger(item.inactive);
  return inactive > 0 || stock <= 0;
}

function normalizeEcoCode(value: string | undefined) {
  const digits = String(value ?? "")
    .replace(/^ECZ/i, "")
    .replace(/[^\d]/g, "");

  if (!digits) return "";
  return `ECZ${digits.padStart(3, "0")}`;
}

function normalizeEcoLabel(label: string) {
  const cleaned = String(label || "").replace(/\s+/g, " ").trim();
  const match = cleaned.match(/^(.+?)\s+(\d{1,2}:\d{2}(?:am|pm))\s+(\d{1,2}:\d{2}(?:am|pm))$/i);

  if (!match) {
    return {
      title: cleaned || "Main",
      description: undefined as string | undefined,
    };
  }

  return {
    title: match[1].trim(),
    description: `${match[2]} - ${match[3]}`,
  };
}

function dateKeyToLocalNoon(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function normalizeBooketingTime(value: string | undefined) {
  const cleaned = String(value || "").trim().toLowerCase();
  const match = cleaned.match(/(\d{1,2}):(\d{2})\s*([ap]m)/i);
  if (!match) {
    return {
      timeLabel: undefined as string | undefined,
      timeSortKey: "12:00",
    };
  }

  const [, hourString, minuteString, meridiem] = match;
  const hour = Number(hourString);
  const minute = Number(minuteString);
  const normalizedHour =
    meridiem.toLowerCase() === "pm" && hour !== 12
      ? hour + 12
      : meridiem.toLowerCase() === "am" && hour === 12
        ? 0
        : hour;

  return {
    timeLabel: `${hour}${minute ? `:${String(minute).padStart(2, "0")}` : ""} ${meridiem.toUpperCase()}`,
    timeSortKey: `${String(normalizedHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
  };
}

async function fetchBooketingText(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; NokturnalLifestyleBot/1.0)",
      Accept: "text/html,application/json;q=0.9,*/*;q=0.8",
    },
    next: {
      revalidate: 300,
    },
  } as RequestInit & { next: { revalidate: number } });

  if (!response.ok) {
    throw new Error(`Booketing request failed: ${response.status} ${url}`);
  }

  return response.text();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchBooketingJson<T>(url: string, retries: number = 2): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const text = await fetchBooketingText(url);
      return JSON.parse(text) as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === retries) {
        break;
      }

      await sleep(250 * (attempt + 1));
    }
  }

  throw lastError ?? new Error(`Booketing JSON request failed for ${url}`);
}

async function fetchMonthEvents(monthKey: string) {
  const monthDate = parseMonthKey(monthKey);
  const formattedDate = formatBooketingShortDate(monthDate);

  const monthUrl =
    `https://booketing.com/uvcore/${BOOKETING_STADIUM_SWIM.sourceLoc}/uvcore.proxy.html` +
    `?action=uvpx_loadcalmonth` +
    `&sourcecode=${BOOKETING_STADIUM_SWIM.sourceCode}` +
    `&sourceloc=${BOOKETING_STADIUM_SWIM.sourceLoc}` +
    `&manageents=${BOOKETING_STADIUM_SWIM.manageentId}` +
    `&venueid=${BOOKETING_STADIUM_SWIM.venueId}` +
    `&feedtoken=venuecodes=${BOOKETING_STADIUM_SWIM.venueCode}` +
    `&fd=${formattedDate}`;

  const html = await fetchBooketingText(monthUrl);
  const $ = load(html);
  const seen = new Map<string, BooketingEventSummary>();

  $("a[href*='/microsite/bluvalue/event/']").each((_, element) => {
    const href = $(element).attr("href") || "";
    const absoluteHref = toAbsoluteBooketingUrl(href);
    const eventCodeMatch = absoluteHref.match(/[?&]eventcode=([^&]+)/i);
    const eventCode = eventCodeMatch?.[1];
    if (!eventCode || seen.has(eventCode)) return;

    const eventName =
      $(element).find(".name").first().text().trim() ||
      $(element).find(".uv-name").first().text().trim() ||
      $(element).find("img").attr("alt")?.replace(/^Flyer:\s*/i, "").trim() ||
      "";

    const dateKey = parseDateKeyFromEventCode(eventCode);
    if (!eventName || !dateKey) return;

    seen.set(eventCode, {
      eventCode,
      eventName,
      href: absoluteHref,
      dateKey,
    });
  });

  return Array.from(seen.values());
}

function getEcozoneOptions(response: BooketingInventoryResponse) {
  const html = response.html || "";
  const $ = load(html);
  const options: EcozoneOption[] = [];

  $(".uwsjs-select-invlist-ecozone").each((_, element) => {
    const eventCode = $(element).attr("data-eventcode")?.trim();
    const label = $(element).attr("data-ecozonename")?.trim();
    if (!eventCode || !label) return;
    options.push({ eventCode, label });
  });

  return options;
}

function getInventoryItemsForEcozone(
  response: BooketingInventoryResponse,
  ecoCode: string
) {
  if (!response.items || typeof response.items === "string") {
    return [];
  }

  return Object.values(response.items).filter((item) => {
    if (!ecoCode) return true;
    return normalizeEcoCode(item.ecocode) === ecoCode;
  });
}

function mapItemsToTiers(items: BooketingInventoryItem[]): PricingTier[] {
  return items
    .filter((item) => !!item.itemname)
    .map((item) => ({
      name: String(item.itemname).trim(),
      price: parseCurrency(item.listprice),
      capacity: parseInteger(item.capacity),
      soldOut: isItemSoldOut(item),
    }))
    .filter((tier) => tier.name && (tier.price > 0 || tier.capacity > 0 || tier.soldOut));
}

async function fetchInventoryForEventCode(
  eventCode: string,
  homeEventCode = "",
  homeName = ""
) {
  const url =
    `https://booketing.com/uws/${BOOKETING_STADIUM_SWIM.sourceLoc}/proxy` +
    `?action=uvpx` +
    `&manageentid=${BOOKETING_STADIUM_SWIM.manageentId}` +
    `&uvaction=uwspx_inventoryinit` +
    `&eventcode=${encodeURIComponent(eventCode)}` +
    `&cartcode=` +
    `&homeeventcode=${encodeURIComponent(homeEventCode)}` +
    `&homename=${encodeURIComponent(homeName)}` +
    `&returntempl=1`;

  return fetchBooketingJson<BooketingInventoryResponse>(url);
}

async function buildParsedBooketingEvent(summary: BooketingEventSummary): Promise<ParsedEvent | null> {
  const initialResponse = await fetchInventoryForEventCode(summary.eventCode);
  const baseDateKey = initialResponse.eventdata?.date || summary.dateKey;
  if (!baseDateKey) return null;

  const sections: EventSection[] = [];
  const ecozoneOptions = getEcozoneOptions(initialResponse);

  if (ecozoneOptions.length > 0) {
    const ecozoneResponses = await Promise.all(
      ecozoneOptions.map(async (option) => {
        try {
          const response = await fetchInventoryForEventCode(
            option.eventCode,
            summary.eventCode,
            option.label
          );
          return { option, response };
        } catch (error) {
          console.error("Booketing ecozone fetch failed", {
            eventCode: summary.eventCode,
            ecozoneEventCode: option.eventCode,
            error,
          });
          return null;
        }
      })
    );

    for (const result of ecozoneResponses) {
      if (!result) continue;

      const ecoCode = normalizeEcoCode(result.response.eventdata?.ecozone);
      const tiers = mapItemsToTiers(getInventoryItemsForEcozone(result.response, ecoCode));
      if (tiers.length === 0) continue;

      const { title, description } = normalizeEcoLabel(result.option.label);
      sections.push({
        title,
        description,
        tiers,
      });
    }
  } else {
    const tiers = mapItemsToTiers(getInventoryItemsForEcozone(initialResponse, ""));
    if (tiers.length > 0) {
      sections.push({
        title: "Main",
        tiers,
      });
    }
  }

  return {
    id: summary.eventCode,
    eventName: initialResponse.eventdata?.name?.trim() || summary.eventName,
    date: dateKeyToLocalNoon(baseDateKey),
    dateKey: baseDateKey,
    dateString: dateKeyToLocalNoon(baseDateKey).toLocaleDateString("en-US", {
      timeZone: VEGAS_TIME_ZONE,
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    ...normalizeBooketingTime(initialResponse.eventdata?.dstarttime),
    sections,
    flyerImagePath:
      initialResponse.eventdata?.flyers?.share?.url ||
      initialResponse.eventdata?.flyers?.eventpage?.url ||
      initialResponse.eventdata?.flyers?.list?.url ||
      undefined,
    pricingNote: "Pricing and availability are sourced live from Booketing.",
  };
}

export async function fetchBooketingVenueEvents(
  venueSlug: string,
  startDate?: Date,
  endDate?: Date
): Promise<ParsedEvent[]> {
  if (venueSlug !== BOOKETING_STADIUM_SWIM.venueSlug) {
    return [];
  }

  const start = startDate || new Date();
  const end = endDate || new Date(start.getTime() + 45 * 24 * 60 * 60 * 1000);
  const monthKeys = getMonthKeysInRange(start, end);
  const monthResults = await Promise.all(monthKeys.map((monthKey) => fetchMonthEvents(monthKey)));
  const summaries = monthResults
    .flat()
    .filter((event) => {
      const date = dateKeyToLocalNoon(event.dateKey);
      return date >= start && date <= end;
    });

  const uniqueSummaries = Array.from(
    new Map(summaries.map((event) => [event.eventCode, event])).values()
  ).sort((a, b) => a.dateKey.localeCompare(b.dateKey));

  const parsedEvents = await Promise.all(
    uniqueSummaries.map(async (summary) => {
      try {
        return await buildParsedBooketingEvent(summary);
      } catch (error) {
        console.error("Booketing event parse failed", {
          eventCode: summary.eventCode,
          href: summary.href,
          error,
        });
        return null;
      }
    })
  );

  return parsedEvents.filter((event): event is ParsedEvent => !!event);
}
