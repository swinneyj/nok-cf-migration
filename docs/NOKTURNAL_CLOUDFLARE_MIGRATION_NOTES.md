# Nokturnal Cloudflare Migration — Final Notes

## Repo / Branches

- Repo: `swinneyj/nok-cf-migration`
- Main branch: `main`
- Working branch used: `feature/remove-vercel-deps`
- PR opened: `#1 Remove Vercel dependencies and stabilize Cloudflare deployment`
- PR was squash-merged into `main`.
- Final squash commit on `main`: `86b3f66034b91e0abf69d42a0fde4b6d106e7d3b`
- Current Cloudflare Worker preview URL: `https://nok-cf-migration.sales-c25.workers.dev/`

## Main Objective

Cleanly remove remaining Vercel runtime dependencies and stabilize the Next.js/OpenNext Cloudflare Worker deployment without breaking booking forms, Turnstile, Formspree, Google/Neon event data, or the reservation flow.

## Current Stack

- Next.js `15.5.15`
- React `19.2.5`
- pnpm
- OpenNext Cloudflare: `@opennextjs/cloudflare`
- Wrangler `4.83.0`
- Cloudflare Workers + Assets + R2 incremental cache
- Neon Postgres via `@neondatabase/serverless`
- Google Calendar data/import tooling still exists through `googleapis`
- Turnstile for form spam protection
- Formspree for inquiry/reservation submissions

Important scripts in `package.json`:

```bash
pnpm run build
pnpm run preview
pnpm run deploy
```

`pnpm run deploy` runs:

```bash
opennextjs-cloudflare build && opennextjs-cloudflare deploy
```

## What Was Completed

### 1. Removed Vercel runtime dependencies

Removed Vercel-specific packages from `package.json` / `pnpm-lock.yaml`:

- `@vercel/postgres`
- `@vercel/analytics`
- `@vercel/speed-insights`

Also removed Vercel Analytics and Speed Insights imports/components from `app/layout.tsx`.

### 2. Converted database access from Vercel Postgres to Neon

Updated `lib/db/client.ts` from:

- `@vercel/postgres`

To:

- `@neondatabase/serverless`

Important behavior changes:

- Neon query calls return rows directly instead of `result.rows`.
- Delete count logic now uses `RETURNING id` and `rows.length` where needed.
- The app expects `POSTGRES_URL` to be available as a Cloudflare secret.

Also confirmed `lib/categoryEvents.ts` no longer imports `@vercel/postgres` after branch changes were pulled locally.

### 3. Fixed Cloudflare deploy failure caused by `node:sqlite`

Deploy failed with:

```text
Could not resolve "node:sqlite"
```

Root cause:

- Newer Wrangler/workerd + future compatibility date triggered unsupported Node built-in bundling.

Fixes applied:

- Pinned Wrangler to `4.83.0` in `package.json`.
- Lockfile moved `workerd` from `1.20260424.1` to `1.20260415.1`.
- Changed `wrangler.jsonc` compatibility date from `2026-04-26` to `2025-11-01`.
- Kept `nodejs_compat` enabled.

### 4. Fixed Turnstile configuration and verification

Initial issues:

- Turnstile UI said “Spam protection is not configured yet.”
- Backend returned `Spam protection verification failed`.
- Cloudflare logs showed `invalid-input-secret` at one point.

Fixes/lessons:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` must be available at build/client level.
- `TURNSTILE_SECRET_KEY` must be the secret from the same Turnstile widget as the public site key.
- Added Workers preview hostname to allowed Turnstile hostnames:
  - `nok-cf-migration.sales-c25.workers.dev`
- Added `TURNSTILE_ALLOWED_HOSTNAMES`.
- Relaxed Turnstile action validation in `lib/formSecurity.ts` so valid tokens are not rejected when Cloudflare returns a blank or mismatched action.

Current verification still checks:

- Cloudflare token success
- allowed hostname
- fresh challenge timestamp
- honeypot/rate-limit flow

Action mismatch is logged, not blocked.

### 5. Persisted public runtime variables in `wrangler.jsonc`

Cloudflare auto-deploys were causing dashboard-only public vars to appear missing after deploys.

Fix:

Added non-secret public config to `wrangler.jsonc` under `vars`:

```json
"vars": {
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY": "0x4AAAAAAC_MxMyNojR3Pukd",
  "TURNSTILE_ALLOWED_HOSTNAMES": "nok-cf-migration.sales-c25.workers.dev,nokturnallifestyle.com,www.nokturnallifestyle.com,staging.nokturnallifestyle.com",
  "FORMSPREE_INQUIRY_FORM_ID": "mdayabrp",
  "FORMSPREE_RESERVATION_FORM_ID": "mdayabrp"
}
```

These are intentionally committed because they are non-secret/public configuration.

Secrets that must remain in Cloudflare only:

- `TURNSTILE_SECRET_KEY`
- `POSTGRES_URL`
- `FAL_API_KEY`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `CRON_SECRET`
- any other private keys/tokens

### 6. Fixed Formspree routing

Contact form returned `{"ok": true}` but did not show in expected Formspree inbox.

Root cause:

- App was using fallback or wrong Formspree form ID.

Fix:

- Added correct Formspree form ID: `mdayabrp`
- Added both inquiry and reservation Formspree IDs to `wrangler.jsonc`.

Confirmed:

- Contact form submits.
- Reservation form submits.
- Formspree receives submissions.
- Formspree may mark messages as spam; that is a separate Formspree deliverability/settings issue.

### 7. Verified successful behavior

Confirmed during testing:

- `/api/calendar/events?venue=xs-nightclub&month=2026-06` returns JSON event data normally.
- Contact form `/api/inquiry` returns `200 {"ok":true}`.
- Reservation form `/api/reservation` works after Turnstile action validation was relaxed and vars persisted.
- Turnstile loads and verifies on Workers preview.
- `pnpm exec tsc --noEmit` passed locally.
- `pnpm run build` passed locally.

## Vercel Disconnection Status

Code-level Vercel runtime dependency removal is complete.

The current `main` branch no longer uses these packages:

- `@vercel/postgres`
- `@vercel/analytics`
- `@vercel/speed-insights`

`app/layout.tsx` no longer imports/renders Vercel Analytics or Speed Insights.

Operationally, to be fully disconnected from Vercel, also verify outside the repo:

- Production DNS points to Cloudflare, not Vercel.
- Vercel project is not still connected to this GitHub repo for auto-deploys.
- Vercel environment variables/deployments are no longer part of the production path.

## pnpm Lockfile Rule

Cloudflare runs:

```bash
pnpm install --frozen-lockfile
```

Any `package.json` change must be committed with the updated lockfile.

Safe workflow for dependency changes:

```bash
git pull origin main
pnpm install
git add package.json pnpm-lock.yaml
git commit -m "Update dependencies"
git push origin main
```

Do not push only `package.json`, or Cloudflare may fail with:

```txt
ERR_PNPM_OUTDATED_LOCKFILE
Cannot install with frozen-lockfile because pnpm-lock.yaml is not up to date with package.json
```

## Git / Local State Notes

After squash merging PR #1, local `main` had the 11 individual commits while `origin/main` had the single squash commit, causing divergent branch warnings.

Recommended final local cleanup:

```bash
git fetch origin
git reset --hard origin/main
git status
```

Expected clean result:

```text
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

Optional branch cleanup:

```bash
git branch -D feature/remove-vercel-deps
git push origin --delete feature/remove-vercel-deps
```

Only delete the remote branch if no longer needed for reference.

## Testing Checklist After Deploys

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

Booking/form checks:

1. Contact form should return `/api/inquiry -> 200 {"ok":true}`.
2. Pick venue event from calendar.
3. Select section/table.
4. Adjust guests.
5. Submit test reservation.
6. Reservation should return `/api/reservation -> 200 {"ok":true}`.
7. Confirm Formspree receives the submission.

Cloudflare logs should not show:

```txt
Worker exceeded CPU time limit
Cannot perform I/O on behalf of a different request
500 Internal Server Error
Missing POSTGRES_URL
invalid-input-secret
```

## Branch / Deployment Workflow

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

## Key Lessons From Migration

1. Cloudflare Workers can feel faster than the old setup because static assets and Worker execution are close to users at the edge.
2. Neon can remain the database; the big win is fewer/heavier DB calls and better caching.
3. `@vercel/postgres` is not the right runtime client for Cloudflare Workers request paths.
4. Use Neon serverless for Worker-safe DB access.
5. Cache API responses that do not need real-time freshness.
6. Lockfile sync is mandatory with pnpm on Cloudflare CI.
7. Full Next/OpenNext apps may exceed free Worker limits; paid Workers may be required.
8. Public config can live in `wrangler.jsonc`; secrets should stay in Cloudflare dashboard.

## Current Known-Good Status

As of this note:

- The Cloudflare migration cleanup is complete and merged into `main`.
- Vercel runtime packages are removed.
- Neon is used instead of Vercel Postgres.
- Wrangler/workerd deploy issue is resolved by pinning/stable compatibility date.
- Turnstile works on Cloudflare Worker preview.
- Public config persists through GitHub auto-deploys via `wrangler.jsonc`.
- Forms submit successfully and reach Formspree.
- Secrets remain in Cloudflare only.

## Future Follow-Up Ideas

- Production domain test on `nokturnallifestyle.com`.
- Confirm Turnstile widget includes production hostnames.
- Improve Formspree deliverability/spam handling.
- Consider later tightening Turnstile action validation only if frontend actions are guaranteed consistent.
- Keep public config in `wrangler.jsonc`; keep secrets in Cloudflare dashboard.

## Continuation Prompt for Future Chat

```text
Continue from the Cloudflare migration cleanup summary.

We removed Vercel runtime dependencies, converted DB access to Neon, fixed Wrangler/workerd node:sqlite deploy failures, stabilized Turnstile/Formspree, persisted public Worker vars in wrangler.jsonc, and squash-merged PR #1 into main.

Current next step:
- Make sure local main is reset to origin/main after squash merge.
- Then continue production-domain testing and any final Cloudflare/Formspree hardening.
```
