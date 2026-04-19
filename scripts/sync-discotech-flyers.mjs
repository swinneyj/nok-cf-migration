#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const OUT_DIR = path.join(process.cwd(), "public", "event-flyers");
const CITY = "las-vegas";

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

async function downloadImage(context, url, filePath) {
  const response = await context.request.get(url, {
    headers: {
      referer: "https://app.discotech.me/",
      "user-agent": "Mozilla/5.0",
    },
  });

  if (!response.ok()) {
    throw new Error(`Image download failed: ${response.status()} ${url}`);
  }

  const buffer = Buffer.from(await response.body());
  await fs.writeFile(filePath, buffer);
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

  for (const item of existingManifest) {
    const key = `${item.venueSlug}__${item.date}__${slugify(item.eventName)}`;
    manifestMap.set(key, item);
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
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

        if (!card.imageUrl) {
          console.log("skip missing image:", parsed.eventName, "|", parsed.venueName);
          continue;
        }

        const eventSlug = slugify(parsed.eventName);
        if (!eventSlug) continue;

        const venueDir = path.join(OUT_DIR, parsed.venueSlug);
        const ext = path.extname(new URL(card.imageUrl).pathname) || ".jpg";
        const fileName = `${date}_${eventSlug}${ext}`;
        const filePath = path.join(venueDir, fileName);
        const manifestKey = `${parsed.venueSlug}__${date}__${eventSlug}`;

        if (seenKeys.has(manifestKey)) continue;
        seenKeys.add(manifestKey);

        await ensureDir(venueDir);

        try {
          await fs.access(filePath);
        } catch {
          await downloadImage(page.context(), card.imageUrl, filePath);
          console.log(`✅ saved ${parsed.venueSlug}/${fileName}`);
        }

        manifestMap.set(manifestKey, {
          venueSlug: parsed.venueSlug,
          venueName: parsed.venueName,
          eventName: parsed.eventName,
          date,
          imagePath: `/event-flyers/${parsed.venueSlug}/${fileName}`,
          sourceUrl: card.href,
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