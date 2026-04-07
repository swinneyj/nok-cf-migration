# 📅 Nokturnal Lifestyle — Auto Blog Publishing System

## How It Works

Blog posts are stored in `_scheduled-posts/` with their publish date in the folder name.  
A GitHub Action runs every **Tuesday and Thursday at 9:00 AM ET** and automatically:

1. Checks which posts are due
2. Moves them into `app/blog/` (making them live)
3. Commits and pushes to GitHub
4. Vercel deploys the new content automatically (within ~2 minutes)

**You do nothing after the initial upload. Posts publish themselves.**

---

## Your 8-Week Publishing Schedule

| Publish Date | Slug | Keyword Target |
|---|---|---|
| April 1, 2026 (Tue) | `top-golf-las-vegas` | "top golf las vegas" — 22,200/mo |
| April 3, 2026 (Thu) | `las-vegas-birthday-freebies` | "vegas birthday freebies" — 1,200/mo |
| April 8, 2026 (Tue) | `las-vegas-gentlemens-club-guide` | "gentlemen's club las vegas" — 2,900/mo |
| April 10, 2026 (Thu) | `what-time-do-vegas-clubs-close` | "what time do vegas clubs close" — 800/mo |
| April 15, 2026 (Tue) | `las-vegas-nightclub-attire-men` | "nightclub attire for guys" — 4,400/mo |
| April 17, 2026 (Thu) | `male-strip-clubs-las-vegas` | "male strip bars vegas" — 1,900/mo |
| April 22, 2026 (Tue) | `omnia-nightclub-review` | "omnia las vegas" — 3,600/mo |
| April 24, 2026 (Thu) | `las-vegas-all-inclusive-packages` | "las vegas all inclusive" — 1,900/mo |
| May 1, 2026 (Tue) | `las-vegas-pool-party-season` | "las vegas pool party season" — 1,200/mo |
| May 6, 2026 (Tue) | `las-vegas-21st-birthday-ideas` | "21st birthday las vegas" — 2,400/mo |
| May 8, 2026 (Thu) | `las-vegas-nye-packages` | "las vegas new years eve" — 3,600/mo |
| May 13, 2026 (Thu) | `las-vegas-club-tips-first-timers` | "las vegas nightclub tips" — 1,600/mo |
| May 15, 2026 (Tue) | `las-vegas-bachelorette-party-ideas` | "bachelorette ideas las vegas" — 1,600/mo |
| May 19, 2026 (Tue) | `las-vegas-vip-host-worth-it` | "las vegas vip host" — 1,200/mo |
| May 21, 2026 (Thu) | `best-hotels-bachelor-party-las-vegas` | "best hotels bachelor party vegas" — 1,900/mo |
| May 27, 2026 (Wed) | `las-vegas-gentlemens-club-guide-v2` | Additional strip club content |

---

## How to Add New Posts to the Schedule

### Option A: Use the helper script
```bash
# First, write your new post in app/blog/my-new-post/page.tsx
# Then run:
./schedule-post.sh 2026-06-03 my-new-post

# Then commit and push
git add .
git commit -m "Schedule new post: my-new-post for June 3"
git push
```

### Option B: Manually create the folder
1. Write your blog post in `app/blog/my-new-post/page.tsx`
2. Move the folder: rename `app/blog/my-new-post` to `_scheduled-posts/2026-06-03_my-new-post`
3. Commit and push — the action handles the rest

---

## How to Run Manually (Publish Immediately)

Go to **GitHub → Actions → Publish Scheduled Blog Posts → Run workflow**

- Set `dry_run = true` to preview what would publish without actually publishing
- Set `dry_run = false` to publish immediately regardless of schedule

---

## How to Check What's Scheduled

Look inside `_scheduled-posts/` — each folder name shows the publish date and post slug:
```
_scheduled-posts/
  2026-04-01_top-golf-las-vegas/       ← publishes April 1
  2026-04-03_las-vegas-birthday-freebies/  ← publishes April 3
  ...
```

---

## Troubleshooting

**Posts not publishing?**
- Check GitHub → Actions → look for red X errors
- Most common issue: GitHub Actions needs write permission → Settings → Actions → General → Workflow permissions → "Read and write permissions"

**Want to reschedule a post?**
- In `_scheduled-posts/`, rename the folder with the new date
- e.g., rename `2026-04-01_my-post` to `2026-04-15_my-post`

**Want to unpublish a scheduled post?**
- Delete the folder from `_scheduled-posts/` before the publish date
- If already published (moved to `app/blog/`), delete it from there

---

## GitHub Actions Permission (One-Time Setup Required)

After uploading to GitHub, do this once:
1. Go to your repo → **Settings**
2. Click **Actions** → **General**
3. Scroll to **Workflow permissions**
4. Select **"Read and write permissions"**
5. Click **Save**

Without this, the Action can't commit published posts back to the repo.
