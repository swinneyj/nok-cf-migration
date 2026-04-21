#!/usr/bin/env tsx
import fs from "node:fs";

async function loadDotenvIfPresent() {
  // Optional local convenience: load .env.local if present (GitHub Actions will use injected env vars).
  try {
    if (!fs.existsSync(".env.local")) return;
    const dotenv = await import("dotenv");
    dotenv.config({ path: ".env.local" });
  } catch {
    // ignore
  }
}

function parseVenueSlugs(value: string | undefined) {
  if (!value) return [];
  return value
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);
}

async function main() {
  await loadDotenvIfPresent();

  const monthsAhead = Number.parseInt(process.env.SYNC_MONTHS_AHEAD || "6", 10);
  const venueSlugs = parseVenueSlugs(process.env.SYNC_VENUE_SLUGS);

  console.log(
    JSON.stringify(
      {
        starting: true,
        monthsAhead,
        venueSlugCount: venueSlugs.length,
        hasPostgresUrl: Boolean(process.env.POSTGRES_URL),
        hasGoogleClientId: Boolean(process.env.GOOGLE_CLIENT_ID),
        hasGoogleRefreshToken: Boolean(process.env.GOOGLE_REFRESH_TOKEN),
      },
      null,
      2
    )
  );

  const sync = await import("../lib/db/syncEvents");

  const result =
    venueSlugs.length > 0
      ? await sync.syncVenuesBySlug(venueSlugs, monthsAhead)
      : await sync.scheduledEventSync(monthsAhead);

  console.log(JSON.stringify(result, null, 2));

  // Fail CI if anything went wrong, so we notice stale/missing venues early.
  const totalErrors =
    typeof (result as any).totalErrors === "number"
      ? (result as any).totalErrors
      : typeof (result as any).errorCount === "number"
        ? (result as any).errorCount
        : 0;

  if (totalErrors > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
