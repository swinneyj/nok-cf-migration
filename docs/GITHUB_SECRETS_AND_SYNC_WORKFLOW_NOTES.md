# GitHub Secrets + Sync Workflow Notes

## Purpose

This document records the fix for the failed GitHub Actions sync jobs after copying the Nokturnal project into the new Cloudflare migration repo.

The new repo is:

```txt
swinneyj/nok-cf-migration
```

The source/old repo is:

```txt
swinneyj/nokturnal-lifestyle
```

The main issue was that the project code copied over, but **GitHub Actions secrets do not copy between repositories**. Cloudflare variables/secrets and GitHub Actions secrets are separate systems.

---

## Initial Problem

The GitHub Actions workflow **Database Event Sync** failed during preflight with:

```txt
Error: Missing PROD_DATABASE_URL secret (mapped to POSTGRES_URL)
```

The workflow checks:

```bash
test -n "${POSTGRES_URL:-}" || { echo "::error::Missing PROD_DATABASE_URL secret (mapped to POSTGRES_URL)"; exit 1; }
```

In `.github/workflows/sync-events.yml`, production maps:

```yaml
POSTGRES_URL: ${{ secrets.PROD_DATABASE_URL }}
DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }}
```

So if `PROD_DATABASE_URL` does not exist in **GitHub repository secrets** for `swinneyj/nok-cf-migration`, the workflow receives an empty value and fails.

---

## Important Distinction

Cloudflare variables/secrets are used by the deployed Worker.

GitHub Actions repository secrets are used by workflows running in GitHub.

Adding a secret in Cloudflare does **not** make it available to GitHub Actions.

Likewise, adding a secret in GitHub does **not** automatically make it available to Cloudflare.

---

## Wrangler Vars Update

The Google Calendar IDs were added to `wrangler.jsonc` under the existing `vars` block so they persist across Cloudflare deployments.

These are safe to commit because they are calendar IDs / non-secret configuration values.

Existing public config was preserved:

```txt
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_ALLOWED_HOSTNAMES
FORMSPREE_INQUIRY_FORM_ID
FORMSPREE_RESERVATION_FORM_ID
```

Added calendar IDs included:

```txt
GOOGLE_CALENDAR_ID_JEWEL_NIGHTCLUB
GOOGLE_CALENDAR_ID_HAKKASAN_NIGHTCLUB
GOOGLE_CALENDAR_ID_EBC_AT_NIGHT
GOOGLE_CALENDAR_ID_ENCORE_BEACH_CLUB
GOOGLE_CALENDAR_ID_LIV_BEACH_CLUB
GOOGLE_CALENDAR_ID_DRAIS_NIGHTCLUB
GOOGLE_CALENDAR_ID_LIQUID_POOL_LOUNGE
GOOGLE_CALENDAR_ID_MARQUEE_NIGHTCLUB
GOOGLE_CALENDAR_ID_XS_NIGHTCLUB
GOOGLE_CALENDAR_ID_ZOUK_NIGHTCLUB
GOOGLE_CALENDAR_ID_OMNIA_NIGHTCLUB
GOOGLE_CALENDAR_ID_OMNIA_DAYCLUB
GOOGLE_CALENDAR_ID_TAO_NIGHTCLUB
GOOGLE_CALENDAR_ID_LIV_NIGHTCLUB
GOOGLE_CALENDAR_ID_AYU_DAYCLUB
GOOGLE_CALENDAR_ID_MARQUEE_DAYCLUB
GOOGLE_CALENDAR_ID_TAO_BEACH
GOOGLE_CALENDAR_ID_PALM_TREE_BEACH_CLUB
```

Commit created:

```txt
b763f38f249c2c51ae2044238d5f3d3c8ad61e9e
```

---

## Secrets Sync Action Setup

To avoid manually recreating all GitHub Actions secrets in the new repo, the `jpoehnelt/secrets-sync-action@v1.10.0` GitHub Action was used.

Marketplace action:

```txt
https://github.com/marketplace/actions/secrets-sync-action
```

The workflow should run from the **old/source repo** because that repo already has the secrets available.

The action copies secrets from the workflow environment into the destination repo.

Destination repo:

```txt
swinneyj/nok-cf-migration
```

---

## Personal Access Token

A fine-grained GitHub Personal Access Token was created for the sync action.

Repository access should include both repos:

```txt
swinneyj/nokturnal-lifestyle
swinneyj/nok-cf-migration
```

Required permissions:

```txt
Actions: Read and write
Secrets: Read and write
Metadata: Read-only
```

The token was added to the old/source repo as:

```txt
SYNC_SECRETS_TOKEN
```

Do not sync `SYNC_SECRETS_TOKEN` itself to other repos.

---

## First Sync Issue

The first workflow attempt failed with:

```txt
Error: Input required and not supplied: GITHUB_TOKEN
```

The fix was to use the input name expected by the action.

Working input style:

```yaml
with:
  github_token: ${{ secrets.SYNC_SECRETS_TOKEN }}
```

The logs later showed the token was correctly passed as `github_token: ***`.

---

## Second Sync Issue

The workflow completed, but no secrets were copied.

The log showed:

```json
"FOUND_SECRETS": []
```

Root cause:

The action received the list of secret names, but the actual secret values were not available in the job environment.

GitHub Actions does not automatically expose every repo secret as an environment variable just because its name is listed in the action input.

Each source secret must be explicitly passed into the step under `env`.

---

## Correct Workflow Pattern

The working pattern is:

```yaml
name: Sync Secrets to nok-cf-migration

on:
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest

    steps:
      - name: Sync secrets to nok-cf-migration
        uses: jpoehnelt/secrets-sync-action@v1.10.0
        with:
          github_token: ${{ secrets.SYNC_SECRETS_TOKEN }}
          repositories: |
            swinneyj/nok-cf-migration
          secrets: |
            FAL_API_KEY
            GOOGLE_CALENDAR_ID_AYU_DAYCLUB
            GOOGLE_CALENDAR_ID_DRAIS_NIGHTCLUB
            GOOGLE_CALENDAR_ID_EBC_AT_NIGHT
            GOOGLE_CALENDAR_ID_ENCORE_BEACH_CLUB
            GOOGLE_CALENDAR_ID_HAKKASAN_NIGHTCLUB
            GOOGLE_CALENDAR_ID_JEWEL_NIGHTCLUB
            GOOGLE_CALENDAR_ID_LIQUID_POOL_LOUNGE
            GOOGLE_CALENDAR_ID_LIV_BEACH_CLUB
            GOOGLE_CALENDAR_ID_LIV_NIGHTCLUB
            GOOGLE_CALENDAR_ID_MARQUEE_DAYCLUB
            GOOGLE_CALENDAR_ID_MARQUEE_NIGHTCLUB
            GOOGLE_CALENDAR_ID_OMNIA_DAYCLUB
            GOOGLE_CALENDAR_ID_OMNIA_NIGHTCLUB
            GOOGLE_CALENDAR_ID_PALM_TREE_BEACH_CLUB
            GOOGLE_CALENDAR_ID_TAO_BEACH
            GOOGLE_CALENDAR_ID_TAO_NIGHTCLUB
            GOOGLE_CALENDAR_ID_XS_NIGHTCLUB
            GOOGLE_CALENDAR_ID_ZOUK_NIGHTCLUB
            GOOGLE_CLIENT_ID
            GOOGLE_CLIENT_SECRET
            GOOGLE_REDIRECT_URI
            GOOGLE_REFRESH_TOKEN
            POSTGRES_URL
            PROD_DATABASE_URL
            STAGING_DATABASE_URL
            SYNC_ENDPOINT
            SYNC_SECRET_KEY
        env:
          FAL_API_KEY: ${{ secrets.FAL_API_KEY }}
          GOOGLE_CALENDAR_ID_AYU_DAYCLUB: ${{ secrets.GOOGLE_CALENDAR_ID_AYU_DAYCLUB }}
          GOOGLE_CALENDAR_ID_DRAIS_NIGHTCLUB: ${{ secrets.GOOGLE_CALENDAR_ID_DRAIS_NIGHTCLUB }}
          GOOGLE_CALENDAR_ID_EBC_AT_NIGHT: ${{ secrets.GOOGLE_CALENDAR_ID_EBC_AT_NIGHT }}
          GOOGLE_CALENDAR_ID_ENCORE_BEACH_CLUB: ${{ secrets.GOOGLE_CALENDAR_ID_ENCORE_BEACH_CLUB }}
          GOOGLE_CALENDAR_ID_HAKKASAN_NIGHTCLUB: ${{ secrets.GOOGLE_CALENDAR_ID_HAKKASAN_NIGHTCLUB }}
          GOOGLE_CALENDAR_ID_JEWEL_NIGHTCLUB: ${{ secrets.GOOGLE_CALENDAR_ID_JEWEL_NIGHTCLUB }}
          GOOGLE_CALENDAR_ID_LIQUID_POOL_LOUNGE: ${{ secrets.GOOGLE_CALENDAR_ID_LIQUID_POOL_LOUNGE }}
          GOOGLE_CALENDAR_ID_LIV_BEACH_CLUB: ${{ secrets.GOOGLE_CALENDAR_ID_LIV_BEACH_CLUB }}
          GOOGLE_CALENDAR_ID_LIV_NIGHTCLUB: ${{ secrets.GOOGLE_CALENDAR_ID_LIV_NIGHTCLUB }}
          GOOGLE_CALENDAR_ID_MARQUEE_DAYCLUB: ${{ secrets.GOOGLE_CALENDAR_ID_MARQUEE_DAYCLUB }}
          GOOGLE_CALENDAR_ID_MARQUEE_NIGHTCLUB: ${{ secrets.GOOGLE_CALENDAR_ID_MARQUEE_NIGHTCLUB }}
          GOOGLE_CALENDAR_ID_OMNIA_DAYCLUB: ${{ secrets.GOOGLE_CALENDAR_ID_OMNIA_DAYCLUB }}
          GOOGLE_CALENDAR_ID_OMNIA_NIGHTCLUB: ${{ secrets.GOOGLE_CALENDAR_ID_OMNIA_NIGHTCLUB }}
          GOOGLE_CALENDAR_ID_PALM_TREE_BEACH_CLUB: ${{ secrets.GOOGLE_CALENDAR_ID_PALM_TREE_BEACH_CLUB }}
          GOOGLE_CALENDAR_ID_TAO_BEACH: ${{ secrets.GOOGLE_CALENDAR_ID_TAO_BEACH }}
          GOOGLE_CALENDAR_ID_TAO_NIGHTCLUB: ${{ secrets.GOOGLE_CALENDAR_ID_TAO_NIGHTCLUB }}
          GOOGLE_CALENDAR_ID_XS_NIGHTCLUB: ${{ secrets.GOOGLE_CALENDAR_ID_XS_NIGHTCLUB }}
          GOOGLE_CALENDAR_ID_ZOUK_NIGHTCLUB: ${{ secrets.GOOGLE_CALENDAR_ID_ZOUK_NIGHTCLUB }}
          GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
          GOOGLE_CLIENT_SECRET: ${{ secrets.GOOGLE_CLIENT_SECRET }}
          GOOGLE_REDIRECT_URI: ${{ secrets.GOOGLE_REDIRECT_URI }}
          GOOGLE_REFRESH_TOKEN: ${{ secrets.GOOGLE_REFRESH_TOKEN }}
          POSTGRES_URL: ${{ secrets.POSTGRES_URL }}
          PROD_DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }}
          STAGING_DATABASE_URL: ${{ secrets.STAGING_DATABASE_URL }}
          SYNC_ENDPOINT: ${{ secrets.SYNC_ENDPOINT }}
          SYNC_SECRET_KEY: ${{ secrets.SYNC_SECRET_KEY }}
```

---

## Result

After adding the explicit `env` mappings, the secrets sync worked.

The new repo now has the needed GitHub Actions secrets.

The **Database Event Sync** was rerun and began running instead of failing immediately on missing `PROD_DATABASE_URL`.

The **Sync Discotech Flyers** workflow also began working.

---

## Key Lessons

1. GitHub Actions secrets do not copy when a repo is copied.
2. Cloudflare secrets and GitHub Actions secrets are separate.
3. `wrangler.jsonc` vars persist across Cloudflare deployments, but they do not feed GitHub Actions.
4. `secrets-sync-action` can copy secrets, but source secrets must be exposed through `env` in the workflow step.
5. `FOUND_SECRETS: []` means the action could not see the secret values in the job environment.
6. The destination repo only receives secrets after the action has both:
   - a token with write access to Actions secrets
   - source secret values available in `env`

---

## Follow-Up Checklist

After syncing secrets, verify:

```txt
GitHub repo → Settings → Secrets and variables → Actions
```

The new repo should include at least:

```txt
PROD_DATABASE_URL
STAGING_DATABASE_URL
POSTGRES_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN
GOOGLE_REDIRECT_URI
FAL_API_KEY
GOOGLE_CALENDAR_ID_*
```

Then rerun:

```txt
Actions → Database Event Sync → Run workflow
Actions → Sync Discotech Flyers → Run workflow
```

Expected behavior:

- Database Event Sync should pass preflight and run `scripts/sync-db.ts`.
- Sync Discotech Flyers should install dependencies, run Playwright, update flyer assets/manifest if needed, and commit changes only when files changed.

---

## Current Status

- Calendar IDs are committed in `wrangler.jsonc` for Cloudflare persistence.
- GitHub secrets were successfully synced from the old repo to `swinneyj/nok-cf-migration`.
- Database Event Sync is running.
- Sync Discotech Flyers is working.
