# Blog Auto-Publish + Manual Publish

This repo has a simple blog publishing pipeline with two states:

- `app/blog/<slug>/page.tsx`: published (live)
- `_scheduled-posts/YYYY-MM-DD_<slug>/`: queued (will be published by automation)

## Auto publishing (scheduled)

The GitHub workflow ` .github/workflows/publish-scheduled-posts.yml` runs on a cron schedule and:

1. Finds due folders in `_scheduled-posts/` (publish date <= today's UTC date)
2. Copies them into `app/blog/<slug>/`
3. Deletes the scheduled folder
4. Rebuilds the blog index via `scripts/rebuild-blog-index.mjs` (writes `app/blog/generated-posts.ts`)
5. Commits + pushes the changes (Vercel deploys)

## Manual publishing (publish now)

Use GitHub Actions -> "Publish Scheduled Blog Posts" -> "Run workflow".

Inputs:

- `slug`: publish a specific scheduled slug immediately (example: `las-vegas-all-inclusive-packages`)
- `random=true`: publish one random scheduled post immediately
- `dry_run=true`: show what would publish (no changes committed)
- `force=true`: overwrite `app/blog/<slug>` if it already exists

Safety behavior:

- If `app/blog/<slug>` already exists and `force` is not `true`, the workflow skips copying and removes the queued scheduled folder to avoid reprocessing.
  - Note: By default it now skips without deleting the queued scheduled folder. Use `force=true` if you want the scheduled version to overwrite.

## How to publish an already-created post in app/blog

If a post already exists in `app/blog/<slug>`, it is already routable at `/blog/<slug>`.
To ensure it shows up in the `/blog` listing, rebuild the index:

```bash
node scripts/rebuild-blog-index.mjs
```

Then commit/push the updated `app/blog/generated-posts.ts`.

For a one-click version, use GitHub Actions -> "Rebuild Blog Index" -> "Run workflow".

That workflow also ensures `public/blog/<slug>/` exists for each `app/blog/<slug>/` post, and can create a placeholder `cover.jpg` so you can drop in the real image later.

## Gotcha: cover images for manual posts

Scheduled posts go through `scripts/generate-blog-images.js` in the workflow.
Manual posts in `app/blog/` do not automatically generate `public/blog/<slug>/cover.jpg`.

Before publishing a manual post, verify the cover exists:

`public/blog/<slug>/cover.jpg`
