# Nokturnal Lifestyle — Cloudflare Migration Notes

Last updated: 2026-04-27

This file exists so future chats/dev sessions can quickly understand the current Cloudflare migration state for the Nokturnal Lifestyle project.

## Repository

- GitHub repo: `swinneyj/nok-cf-migration`
- Main branch: `main`
- Current Cloudflare Worker URL: `https://nok-cf-migration.sales-c25.workers.dev/`
- Original production site remains separate from this migration project.

## High-level architecture

The project is a Next.js app deployed to Cloudflare Workers using OpenNext for Cloudflare.

Current stack:

- Next.js `15.5.15`
- React `19.2.5`
- pnpm
- OpenNext Cloudflare: `@opennextjs/cloudflare`
- Wrangler
- Cloudflare Workers + Assets + R2 incremental cache
- Neon Postgres for event/cache data

Important scripts in `package.json`:

```bash
pnpm run build
pnpm run preview
pnpm run deploy
```

Cloudflare build command is currently using:

```bash
pnpm run deploy
```

which runs:

```bash
opennextjs-cloudflare build && opennextjs-cloudflare deploy
```

## Cloudflare deployment notes

Cloudflare Workers Free hit the Worker size limit. The deployment was only slightly over the free 3 MiB compressed script limit, so the project was upgraded to Workers Paid. After upgrading, the main site and venue routes began loading successfully.

Important Cloudflare issue encountered:

```txt
Your Worker exceeded the size limit of 3 MiB.
Please upgrade to a paid plan to deploy Workers up to 10 MiB.
```

The OpenNext generated handler was around 28 MB uncompressed, around 3.1 MB gzipped. Paid Workers was the practical fix.

## Environment variables / secrets

The app needs `POSTGRES_URL` available in Cloudflare for Neon database access.

Earlier build failures happened when Postgres env vars were missing:

```txt
VercelPostgresError - missing_connection_string
You did not supply a connectionString and no POSTGRES_URL env var was found.
```

Current production runtime depends on:

- `POSTGRES_URL`
- any existing booking/contact/Turnstile secrets already configured in Cloudflare

Important: Cloudflare Workers dashboard variables apply differently than Vercel. Do not assume per-variable production/preview dropdowns exist in the same way.

## Database direction

The project is keeping Neon for now.

Reasoning:

- Neon already stores event data, section pricing, flyer metadata, and cached Google Calendar/imported event data.
- D1 is not currently necessary and would require schema/client migration.
- The better cost/performance path was optimizing DB usage and adding Cloudflare caching first.

## Critical DB/runtime lesson

`@vercel/postgres` caused Cloudflare Worker runtime issues:

```txt
Cannot perform I/O on behalf of a different request.
Worker code had hung and would never generate a response.
```

Fix pattern:

Use Neon serverless client instead:

```ts
import { neon } from "@neondatabase/serverless";

const getSql = () => {
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error("Missing POSTGRES_URL environment variable");
  }
  return neon(connectionString);
};
```

Avoid global `@vercel/postgres` clients in Worker request paths.

## Routes already migrated/fixed

### `/api/calendar/events`

File:

```txt
lib/getCachedVenueEvents.ts
```

Fixes completed:

- Replaced `@vercel/postgres` with `@neondatabase/serverless`.
- Replaced N+1/event-by-event DB reads with optimized bulk reads.
- Fetches venue/month event rows from `events`.
- Fetches sections from `event_sections`.
- Fetches pricing from `pricing_tiers`.
- Normalizes nullable DB fields:
  - `price ?? 0`
  - `capacity ?? 0`
  - `section_description ?? undefined`
- Keeps Google/Booketing source metadata from `raw_data`.
- Preserves LA timezone dateKey logic.

The API route now returns JSON reliably for URLs like:

```txt
/api/calendar/events?venue=xs-nightclub&month=2026-06
```

Caching was added so the route no longer returns `no-store` headers. Expected header:

```txt
Cache-Control: public, s-maxage=300, stale-while-revalidate=3600
```

### `/api/category-events`

File:

```txt
lib/categoryEvents.ts
```

This route was still crashing when changing months on `/events` because it used `@vercel/postgres`. It has now been migrated to Neon serverless too.

Fixes completed:

- Replaced `import { sql } from "@vercel/postgres"` with Neon serverless.
- Replaced `sql.query(...)` with tagged template Neon queries.
- Added `CategoryEventRow` type.
- Added helper `buildCategoryEventItems(...)` to avoid duplicate row mapping logic.
- Supports month fetch and search fetch.

This fixed the `/events` month switching crash that hit:

```txt
/api/category-events?category=all&start_date=2026-06-27&days=3
```

## Important remaining cleanup

Some files still import `@vercel/postgres` and/or `googleapis` for routes such as reservations, sync, OAuth, and older DB helpers.

Known import traces from prior build logs:

```txt
lib/db/client.ts -> @vercel/postgres
lib/db/syncEvents.ts -> googleapis
lib/googleCalendarClient.ts -> googleapis
lib/googleOAuthClient.ts -> googleapis
```

Do not remove dependencies from `package.json` unless the imports are removed or isolated first.

Future recommended cleanup:

1. Convert `lib/db/client.ts` to Neon serverless if used by live routes.
2. Confirm `/api/reservation` works under Cloudflare.
3. Move Google sync/OAuth code out of production runtime if it is only admin tooling.
4. Consider disabling/removing `/api/google/oauth/*` and `/api/sync-events` from the deployed Worker if not needed publicly.
5. Add caching to `/api/category-events` similar to `/api/calendar/events`.
6. Remove Vercel-specific packages only after no runtime imports remain:
   - `@vercel/postgres`
   - possibly `@vercel/analytics`
   - possibly `@vercel/speed-insights`
7. After dependency changes, always update `pnpm-lock.yaml`.

## pnpm lockfile rule

Cloudflare runs:

```bash
pnpm install --frozen-lockfile
```

This means any `package.json` change must be committed with the updated lockfile.

Safe workflow for dependency changes:

```bash
git pull origin main
pnpm install
git add package.json pnpm-lock.yaml
git commit -m "Update dependencies"
git push origin main
```

Do not push only `package.json`, or Cloudflare will fail with:

```txt
ERR_PNPM_OUTDATED_LOCKFILE
Cannot install with frozen-lockfile because pnpm-lock.yaml is not up to date with package.json
```

## Testing checklist after deploys

Core pages:

```txt
/
/events
/nightclubs
/bottle-service
/places/xs-nightclub
/places/xs-nightclub?event=the-chainsmokers-xs-nightclub&date=2026-05-16
```

API checks:

```txt
/api/calendar/events?venue=xs-nightclub&month=2026-06
/api/calendar/events?venue=omnia-nightclub&month=2026-06
/api/calendar/events?venue=hakkasan-nightclub&month=2026-06
/api/category-events?category=all&start_date=2026-06-27&days=3
```

Booking flow checks:

1. Pick venue event from calendar.
2. Open/close venue map.
3. Change event after opening map.
4. Select section/table.
5. Adjust guests.
6. Submit test reservation.
7. Confirm reservation storage/email/logging works.

Cloudflare logs should not show:

```txt
Worker exceeded CPU time limit
Cannot perform I/O on behalf of a different request
500 Internal Server Error
Missing POSTGRES_URL
```

## Branch/deployment workflow

Recommended workflow:

```txt
main = stable production branch
feature/* = isolated test work
```

Create a feature branch locally:

```bash
git status
git pull origin main
git checkout -b feature/my-test-change
```

Commit/push branch:

```bash
git add .
git commit -m "Test change"
git push -u origin feature/my-test-change
```

Then open a GitHub PR into `main` and only merge when tested.

For risky areas, always use a branch:

- `package.json`
- `pnpm-lock.yaml`
- Cloudflare/OpenNext/Wrangler config
- database query logic
- booking flow logic
- calendar/date parsing

## Key lessons from migration

1. Cloudflare Workers can feel faster than the old setup because static assets and Worker execution are close to users at the edge.
2. Neon can remain the database; the big win is fewer/heavier DB calls and better caching.
3. `@vercel/postgres` is not the right runtime client for Cloudflare Workers request paths.
4. Use Neon serverless for Worker-safe DB access.
5. Cache API responses that do not need real-time freshness.
6. Lockfile sync is mandatory with pnpm on Cloudflare CI.
7. Full Next/OpenNext apps may exceed free Worker limits; paid Workers may be required.

## Current known-good status

As of this note:

- The Cloudflare Worker deploys after upgrading Workers plan.
- `/places/xs-nightclub` loads.
- `/places/xs-nightclub?event=...&date=...` loads.
- `/api/calendar/events` works with Neon + cache headers.
- `/events` month switching had a category-events issue, and `lib/categoryEvents.ts` has been patched to Neon.
- Further testing should confirm `/events` month switching after the latest deploy.
