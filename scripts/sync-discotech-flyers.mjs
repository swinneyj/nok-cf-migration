#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { load } from "cheerio";
import { chromium } from "playwright";

const OUT_DIR = path.join(process.cwd(), "public", "event-flyers");
const CITY = "las-vegas";
const BOOKETING_LANDING_URL = "https://booketing.com/microsite/bluvalue/";
const BOOKETING_SOURCE_CODE = "microsite";
const BOOKETING_SOURCE_LOC = "bluvalue";

const VENUE_ALIASES = [
  { slug: "encore-beach-club", aliases: ["Encore Beach Club (EBC)", "Encore Beach Club"] },
  { slug: "ebc-at-night", aliases: ["EBC at Night", "Encore Beach Club at Night"] },
  { slug: "marquee-dayclub", aliases: ["Marquee Dayclub: North Strip", "Marquee Dayclub"] },
  { slug: "marquee-nightclub", aliases: ["Marquee Nightclub: North Strip", "Marquee Nightclub"] },
  { slug: "hakkasan-nightclub", aliases: ["Hakkasan: South Strip", "Hakkasan Nightclub", "Hakkasan"] },
  { slug: "jewel-nightclub", aliases: ["Jewel: South Strip", "Jewel Nightclub", "Jewel"] },
  { slug: "omnia-nightclub", aliases: ["Omnia: South Strip", "Omnia Nightclub", "Omnia"] },
  { slug: "xs-nightclub", aliases: ["XS Nightclub: North Strip", "XS Nightclub", "XS"] },
  { slug: "zouk-nightclub", aliases: ["Zouk: North Strip", "Zouk Nightclub", "Zouk"] },
  { slug: "tao-nightclub", aliases: ["Tao: North Strip", "Tao Nightclub", "Tao"] },

  { slug: "tao-beach", aliases: ["Tao Beach: North Strip", "Tao Beach"] },
  { slug: "liv-beach-club", aliases: ["LIV Beach Club", "LIV Beach", "LIV Beach at Fontainebleau"] },
  { slug: "liquid-pool-lounge", aliases: ["Liquid: South Strip", "Liquid Pool Lounge", "Liquid"] },
  { slug: "ayu-dayclub", aliases: ["AYU Dayclub", "Ayu Dayclub"] },
  { slug: "daylight-beach-club", aliases: ["Daylight Beach Club"] },
  { slug: "palm-tree-beach-club", aliases: ["Palm Tree Beach Club"] },
  { slug: "kassi-beach-club", aliases: ["Kassi Beach Club", "Kassi Beach"] },
  { slug: "omnia-dayclub", aliases: ["OMNIA Dayclub", "Omnia Dayclub", "Omnia Dayclub at Caesars Palace"] },
  { slug: "liv-nightclub", aliases: ["LIV Nightclub", "LIV"] },
  { slug: "drais-nightclub", aliases: ["Drai's Nightclub", "Drai's Nightclub: South Strip", "Drai's After Hours: North Strip", "Drai's After Hours"] },
  { slug: "stadium-swim", aliases: ["Stadium Swim", "Stadium Swim at Circa", "Circa Resort"] },
];

function slugify(str) {
  return String(str || "")
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function dateRange(start, end) {
  const dates = [];
  const cur = new Date(`${start}T00:00:00`);
  const last = new Date(`${end}T00:00:00`);

  while (cur <= last) {
    dates.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
  }

  return dates;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function loadExistingManifest(manifestPath) {
  try {
    const text = await fs.readFile(manifestPath, "utf8");
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function downloadImage(context, url, filePath, referer = "https://app.discotech.me/") {
  const response = await context.request.get(url, {
    headers: {
      referer,
      "user-agent": "Mozilla/5.0",
    },
  });

  if (!response.ok()) {
    throw new Error(`Image download failed: ${response.status()} ${url}`);
  }

  const buffer = Buffer.from(await response.body());
  await fs.writeFile(filePath, buffer);
}

async function fetchBooketingText(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; NokturnalLifestyleBot/1.0)",
      Accept: "text/html,application/json;q=0.9,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Booketing request failed: ${response.status} ${url}`);
  }

  return response.text();
}

async function fetchBooketingJson(url) {
  const text = await fetchBooketingText(url);
  return JSON.parse(text);
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9\s-]/g, " ")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeVenueLabel(value) {
  return normalizeText(value)
    .replace(/\b(nightclub|dayclub|beach club|beach|pool|lounge|las vegas|south strip|north strip)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getMonthKey(dateKey) {
  return String(dateKey || "").slice(0, 7);
}

function formatBooketingShortDate(date) {
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function parseDateKeyFromEventCode(eventCode) {
  const match = String(eventCode || "").match(/(\d{8})$/);
  if (!match) return null;
  const raw = match[1];
  return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
}

function scoreFlyerMatch(entry, venueSlug, eventName, dateKey) {
  const targetSlug = slugify(cleanEventName(eventName));
  const entrySlug = slugify(cleanEventName(entry.eventName));
  let score = 0;

  if (entry.venueSlug === venueSlug) score += 10;
  if (entry.date === dateKey) score += 100;

  if (entrySlug === targetSlug) score += 30;
  else if (entrySlug && targetSlug && (entrySlug.includes(targetSlug) || targetSlug.includes(entrySlug))) {
    score += 18;
  }

  const entryWords = new Set(entrySlug.split("-").filter(Boolean));
  const targetWords = targetSlug.split("-").filter(Boolean);
  score += targetWords.filter((word) => entryWords.has(word)).length * 3;
  score += Math.min(6, Math.max(0, entryWords.size - 2));

  return score;
}

function scoreVenueAlias(needle, candidate) {
  const target = normalizeVenueLabel(needle);
  const option = normalizeVenueLabel(candidate);
  if (!target || !option) return 0;
  if (target === option) return 100;
  if (target.includes(option) || option.includes(target)) return 75;

  const targetWords = target.split(" ").filter(Boolean);
  const optionWords = new Set(option.split(" ").filter(Boolean));
  return targetWords.filter((word) => optionWords.has(word)).length * 10;
}

async function discoverBooketingVenues() {
  const html = await fetchBooketingText(BOOKETING_LANDING_URL);
  const $ = load(html);
  const venues = [];

  $("a[href*='/microsite/bluvalue/events/']").each((_, element) => {
    const href = $(element).attr("href") || "";
    const match = href.match(/\/microsite\/bluvalue\/events\/(\d+)\/(\d+)\/([a-z0-9-]+)/i);
    if (!match) return;

    const manageentId = match[1];
    const venueId = match[2];
    const venueSlug = match[3];
    const venueName =
      $(element).text().replace(/\s+/g, " ").trim() ||
      $(element).closest("li").attr("data-venuename") ||
      venueSlug;

    venues.push({
      manageentId,
      venueId,
      venueCode: `VEN${venueId}`,
      venueSlug,
      venueName,
      sourceCode: BOOKETING_SOURCE_CODE,
      sourceLoc: BOOKETING_SOURCE_LOC,
    });
  });

  const deduped = new Map();
  for (const venue of venues) {
    if (!deduped.has(venue.venueSlug)) {
      deduped.set(venue.venueSlug, venue);
    }
  }

  return Array.from(deduped.values());
}

function toBooketingMonthUrl(config, monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const monthDate = new Date(year, month - 1, 1);
  const fd = formatBooketingShortDate(monthDate);

  return (
    `https://booketing.com/uvcore/${config.sourceLoc}/uvcore.proxy.html` +
    `?action=uvpx_loadcalmonth` +
    `&sourcecode=${config.sourceCode}` +
    `&sourceloc=${config.sourceLoc}` +
    `&manageents=${config.manageentId}` +
    `&venueid=${config.venueId}` +
    `&feedtoken=venuecodes=${config.venueCode}` +
    `&fd=${fd}`
  );
}

function toBooketingInventoryUrl(config, eventCode, homeEventCode = "", homeName = "") {
  return (
    `https://booketing.com/uws/${config.sourceLoc}/proxy` +
    `?action=uvpx` +
    `&manageentid=${config.manageentId}` +
    `&uvaction=uwspx_inventoryinit` +
    `&eventcode=${encodeURIComponent(eventCode)}` +
    `&cartcode=` +
    `&homeeventcode=${encodeURIComponent(homeEventCode)}` +
    `&homename=${encodeURIComponent(homeName)}` +
    `&returntempl=1`
  );
}

async function fetchBooketingMonthEvents(config, monthKey) {
  const html = await fetchBooketingText(toBooketingMonthUrl(config, monthKey));
  const $ = load(html);
  const seen = new Map();

  $("a[href*='/microsite/'][href*='/event/']").each((_, element) => {
    const href = $(element).attr("href") || "";
    const absoluteHref = href.startsWith("http") ? href : `https://booketing.com${href}`;
    const eventCodeMatch = absoluteHref.match(/[?&]eventcode=([^&]+)/i);
    const eventCode = eventCodeMatch?.[1];
    if (!eventCode || seen.has(eventCode)) return;

    const eventName =
      $(element).find(".name").first().text().trim() ||
      $(element).find(".uv-name").first().text().trim() ||
      $(element).find("img").attr("alt")?.replace(/^Flyer:\s*/i, "").trim() ||
      $(element).text().replace(/\s+/g, " ").trim();
    const imagePath =
      $(element).find("img").attr("src") ||
      $(element).find("img").attr("data-src") ||
      $(element).find(".uv-flyerbg").attr("style")?.match(/url\(([^)]+)\)/i)?.[1] ||
      "";

    const dateKey = parseDateKeyFromEventCode(eventCode);
    if (!eventName || !dateKey || !imagePath) return;

    seen.set(eventCode, {
      eventCode,
      eventName,
      href: absoluteHref,
      dateKey,
      imagePath,
    });
  });

  return Array.from(seen.values());
}

function getBooketingFlyerImagePath(response) {
  return (
    response?.eventdata?.flyers?.eventpage?.full ||
    response?.eventdata?.flyers?.list?.full ||
    response?.eventdata?.flyers?.share?.full ||
    response?.eventdata?.flyers?.eventpage?.url ||
    response?.eventdata?.flyers?.list?.url ||
    response?.eventdata?.flyers?.share?.url ||
    undefined
  );
}

async function buildBooketingFlyerEntries(config, monthKey) {
  const summaries = await fetchBooketingMonthEvents(config, monthKey);
  return Promise.all(
    summaries.map(async (summary) => {
      try {
        const response = await fetchBooketingJson(
          toBooketingInventoryUrl(config, summary.eventCode)
        );
        return {
          venueSlug: config.venueSlug,
          eventName: summary.eventName,
          date: summary.dateKey,
          imagePath: getBooketingFlyerImagePath(response) || summary.imagePath,
        };
      } catch {
        return {
          venueSlug: config.venueSlug,
          eventName: summary.eventName,
          date: summary.dateKey,
          imagePath: summary.imagePath,
        };
      }
    })
  );
}

function getBooketingConfigForParsedVenue(booketingVenues, parsedVenue) {
  if (!booketingVenues.length) return null;

  const exactSlugMatch = booketingVenues.find((venue) => venue.venueSlug === parsedVenue.venueSlug);
  if (exactSlugMatch) return exactSlugMatch;

  let bestVenue = null;
  let bestScore = 0;
  for (const venue of booketingVenues) {
    const score = Math.max(
      scoreVenueAlias(parsedVenue.venueName, venue.venueName),
      scoreVenueAlias(parsedVenue.venueName, venue.venueSlug)
    );
    if (score > bestScore) {
      bestScore = score;
      bestVenue = venue;
    }
  }

  return bestScore >= 50 ? bestVenue : null;
}

function pickBestBooketingFlyer(entries, venueSlug, eventName, date) {
  let bestEntry = null;
  let bestScore = 0;

  for (const entry of entries) {
    if (entry.venueSlug !== venueSlug || entry.date !== date) continue;
    const score = scoreFlyerMatch(entry, venueSlug, eventName, date);
    if (score > bestScore || (score === bestScore && bestEntry)) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  return bestScore > 0 ? bestEntry : null;
}

function cleanEventName(name) {
  return String(name || "")
    .replace(/\s+/g, " ")
    .replace(/Guest List.*$/i, "")
    .replace(/Tickets.*$/i, "")
    .replace(/VIP Tables.*$/i, "")
    .replace(/\$\d+\s*off.*$/i, "")
    .replace(/Even Ratio.*$/i, "")
    .replace(/Girls Only.*$/i, "")
    .trim();
}

function parseCardText(text) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (!normalized) return null;

  const venueMatches = [];

  for (const venue of VENUE_ALIASES) {
    for (const alias of venue.aliases) {
      const idx = normalized.toLowerCase().indexOf(alias.toLowerCase());
      if (idx !== -1) {
        venueMatches.push({
          slug: venue.slug,
          alias,
          index: idx,
          length: alias.length,
        });
      }
    }
  }

  if (!venueMatches.length) return null;

  venueMatches.sort((a, b) => {
    if (a.index !== b.index) return a.index - b.index;
    return b.length - a.length;
  });

  const best = venueMatches[0];
  const eventName = normalized.slice(0, best.index).trim();

  if (!eventName) return null;

  return {
    eventName: cleanEventName(eventName),
    venueName: best.alias,
    venueSlug: best.slug,
  };
}

async function fetchDiscotechDetailImage(detailPage, href) {
  try {
    await detailPage.goto(href, { waitUntil: "domcontentloaded", timeout: 120000 });
    await detailPage.waitForTimeout(1500);

    const imageUrl = await detailPage.evaluate(() => {
      const normalize = (value) => {
        if (!value) return "";
        const trimmed = String(value).trim();
        if (!trimmed) return "";
        try {
          return new URL(trimmed, window.location.href).href;
        } catch {
          return trimmed;
        }
      };

      const metaSelectors = [
        'meta[property="og:image"]',
        'meta[property="twitter:image"]',
        'meta[name="twitter:image"]',
        'meta[name="og:image"]',
      ];

      for (const selector of metaSelectors) {
        const content = document.querySelector(selector)?.getAttribute("content");
        const normalized = normalize(content);
        if (normalized) return normalized;
      }

      const flyerBg = document.querySelector(".uv-flyerbg")?.getAttribute("style");
      const flyerBgMatch = flyerBg?.match(/url\(([^)]+)\)/i)?.[1];
      const flyerBgUrl = normalize(flyerBgMatch?.replace(/^['"]|['"]$/g, ""));
      if (flyerBgUrl) return flyerBgUrl;

      const candidates = Array.from(document.querySelectorAll("img"))
        .map((img) => {
          const rect = img.getBoundingClientRect();
          const src =
            img.getAttribute("src") ||
            img.getAttribute("data-src") ||
            img.getAttribute("data-lazy-src") ||
            img.getAttribute("srcset")?.split(" ")[0] ||
            "";
          return {
            src: normalize(src),
            alt: (img.getAttribute("alt") || "").toLowerCase(),
            area: Math.max(0, rect.width) * Math.max(0, rect.height),
            width: img.naturalWidth || rect.width || 0,
            height: img.naturalHeight || rect.height || 0,
          };
        })
        .filter((item) => item.src)
        .filter(
          (item) =>
            !/logo|icon|avatar|thumbnail|sprite|badge|arrow|heart|mask/i.test(item.alt) &&
            item.width >= 200 &&
            item.height >= 200
        )
        .sort((a, b) => b.area - a.area);

      return candidates[0]?.src || "";
    });

    return imageUrl || "";
  } catch {
    return "";
  }
}

async function scrapeDay(page, date) {
  const url = `https://app.discotech.me/${CITY}/events?start_date=${date}`;
  console.log(`📅 Fetching ${url}`);

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForTimeout(5000);

  const cards = await page.locator('a[href*="/events/"]').evaluateAll((anchors) => {
    const seen = new Set();
    const results = [];

    for (const a of anchors) {
      const href = a.getAttribute("href");
      if (!href || !href.includes("/events/")) continue;
      if (seen.has(href)) continue;
      seen.add(href);

      const text = (a.textContent || "").replace(/\s+/g, " ").trim();

      const img =
        a.querySelector("img") ||
        a.closest("div")?.querySelector("img") ||
        a.parentElement?.querySelector("img");

      const imageUrl =
        img?.getAttribute("src") ||
        img?.getAttribute("data-src") ||
        img?.getAttribute("srcset")?.split(" ")[0] ||
        null;

      results.push({
        href: href.startsWith("http") ? href : `https://app.discotech.me${href}`,
        text,
        imageUrl,
      });
    }

    return results;
  });

  console.log(`Found ${cards.length} event link(s)`);
  return cards;
}

async function main() {
  let start = process.argv[2];
  let end = process.argv[3];

  // If no arguments provided, calculate intelligently from manifest
  if (!start) {
    await ensureDir(OUT_DIR);
    const manifestPath = path.join(OUT_DIR, "manifest.json");
    const existingManifest = await loadExistingManifest(manifestPath);

    if (existingManifest.length > 0) {
      // Find the latest date in the manifest
      const dates = existingManifest.map((item) => new Date(item.date));
      const latestDate = new Date(Math.max(...dates.map((d) => d.getTime())));

      // Start from previous day to catch updates
      const prevDay = new Date(latestDate);
      prevDay.setDate(prevDay.getDate() - 1);
      start = prevDay.toISOString().slice(0, 10);

      console.log(
        `📅 Found manifest with ${existingManifest.length} entries. Latest date: ${latestDate.toISOString().slice(0, 10)}`
      );
      console.log(`📅 Starting sync from previous day: ${start}`);
    } else {
      // If manifest is empty, go back 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      start = sixMonthsAgo.toISOString().slice(0, 10);

      console.log(`📅 Empty manifest. Starting from 6 months ago: ${start}`);
    }

    // Always sync 6 months forward
    const sixMonthsForward = new Date();
    sixMonthsForward.setMonth(sixMonthsForward.getMonth() + 6);
    end = sixMonthsForward.toISOString().slice(0, 10);

    console.log(`📅 Syncing 6 months forward to: ${end}`);
  } else if (!end) {
    end = start;
  }

  // Validate provided arguments
  if (!start || !/^\d{4}-\d{2}-\d{2}$/.test(start)) {
    console.error("Usage: node scripts/sync-discotech-flyers.mjs");
    console.error("   or: node scripts/sync-discotech-flyers.mjs 2026-04-18 2026-04-30");
    process.exit(1);
  }

  if (!end || !/^\d{4}-\d{2}-\d{2}$/.test(end)) {
    console.error("End date must be YYYY-MM-DD");
    process.exit(1);
  }

  await ensureDir(OUT_DIR);

  const manifestPath = path.join(OUT_DIR, "manifest.json");
  const existingManifest = await loadExistingManifest(manifestPath);
  const manifestMap = new Map();
  let booketingVenues = [];
  try {
    booketingVenues = await discoverBooketingVenues();
    console.log(`📘 Discovered ${booketingVenues.length} Booketing venue(s)`);
  } catch (error) {
    console.log("📘 Booketing discovery failed; falling back to Discotech flyers only");
  }
  const booketingEntryCache = new Map();

  for (const item of existingManifest) {
    const key = `${item.venueSlug}__${item.date}__${slugify(item.eventName)}`;
    manifestMap.set(key, item);
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 2200 },
  });
  const detailPage = await browser.newPage({
    viewport: { width: 1440, height: 2200 },
  });

  const dates = dateRange(start, end);

  for (const date of dates) {
    const cards = await scrapeDay(page, date);
    const seenKeys = new Set();

    for (const card of cards) {
      try {
        const parsed = parseCardText(card.text);

        if (!parsed) {
          console.log("skip parse:", card.text.slice(0, 220));
          continue;
        }

        const eventSlug = slugify(parsed.eventName);
        if (!eventSlug) continue;

        const monthKey = getMonthKey(date);
        let sourceImageUrl = card.imageUrl;
        let sourceReferer = "https://app.discotech.me/";

        const booketingConfig = getBooketingConfigForParsedVenue(booketingVenues, parsed);
        if (booketingConfig) {
          const cacheKey = `${booketingConfig.venueSlug}__${monthKey}`;
          if (!booketingEntryCache.has(cacheKey)) {
            booketingEntryCache.set(
              cacheKey,
              buildBooketingFlyerEntries(booketingConfig, monthKey).catch((error) => {
                console.log(`skip booketing month: ${booketingConfig.venueSlug} ${monthKey}`);
                return [];
              })
            );
          }

          const booketingEntries = await booketingEntryCache.get(cacheKey);
          const matchedBooketing = pickBestBooketingFlyer(
            booketingEntries,
            booketingConfig.venueSlug,
            parsed.eventName,
            date
          );

          if (matchedBooketing?.imagePath) {
            sourceImageUrl = matchedBooketing.imagePath;
            sourceReferer = "https://booketing.com/";
            console.log(`✅ booketing flyer ${booketingConfig.venueSlug}/${date} -> ${path.basename(new URL(sourceImageUrl).pathname)}`);
          }
        }

        if (!booketingConfig && parsed.venueSlug === "drais-nightclub") {
          const detailImageUrl = await fetchDiscotechDetailImage(detailPage, card.href);
          if (detailImageUrl && detailImageUrl !== sourceImageUrl) {
            sourceImageUrl = detailImageUrl;
            sourceReferer = card.href;
            console.log(
              `✅ drais flyer detail image ${date} -> ${path.basename(new URL(sourceImageUrl).pathname)}`
            );
          }
        }

        if (!sourceImageUrl) {
          console.log("skip missing image:", parsed.eventName, "|", parsed.venueName);
          continue;
        }

        const venueDir = path.join(OUT_DIR, parsed.venueSlug);
        const ext = path.extname(new URL(sourceImageUrl).pathname) || ".jpg";
        const fileName = `${date}_${eventSlug}${ext}`;
        const filePath = path.join(venueDir, fileName);
        const manifestKey = `${parsed.venueSlug}__${date}__${eventSlug}`;

        if (seenKeys.has(manifestKey)) continue;
        seenKeys.add(manifestKey);

        await ensureDir(venueDir);

        await downloadImage(page.context(), sourceImageUrl, filePath, sourceReferer);
        console.log(`✅ saved ${parsed.venueSlug}/${fileName}`);

        manifestMap.set(manifestKey, {
          venueSlug: parsed.venueSlug,
          venueName: parsed.venueName,
          eventName: parsed.eventName,
          date,
          imagePath: `/event-flyers/${parsed.venueSlug}/${fileName}`,
          sourceUrl: booketingConfig ? sourceImageUrl : card.href,
        });
      } catch (err) {
        console.log(`skip bad card: ${card.href}`);
      }
    }
  }

  await browser.close();

  const mergedManifest = [...manifestMap.values()].sort((a, b) => {
    return (
      a.venueSlug.localeCompare(b.venueSlug) ||
      a.date.localeCompare(b.date) ||
      a.eventName.localeCompare(b.eventName)
    );
  });

  await fs.writeFile(manifestPath, JSON.stringify(mergedManifest, null, 2));

  console.log(`\n✅ Done. Wrote ${mergedManifest.length} manifest entries.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
