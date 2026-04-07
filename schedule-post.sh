#!/bin/bash
# ============================================
# NOKTURNAL LIFESTYLE — BLOG POST SCHEDULER
# ============================================
# Usage: ./schedule-post.sh <publish-date> <slug>
# Example: ./schedule-post.sh 2026-06-03 my-new-post
#
# This moves a blog post from app/blog/<slug> into
# _scheduled-posts/<date>_<slug> so it gets published
# automatically on the scheduled date.
# ============================================

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: ./schedule-post.sh <publish-date> <slug>"
  echo "Example: ./schedule-post.sh 2026-06-03 my-new-post"
  exit 1
fi

DATE=$1
SLUG=$2
SOURCE="app/blog/$SLUG"
DEST="_scheduled-posts/${DATE}_${SLUG}"

# Validate date format
if ! [[ "$DATE" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
  echo "❌ Invalid date format. Use YYYY-MM-DD (e.g. 2026-06-03)"
  exit 1
fi

# Check source exists
if [ ! -d "$SOURCE" ]; then
  echo "❌ Blog post not found: $SOURCE"
  echo "Create it first in app/blog/$SLUG/page.tsx"
  exit 1
fi

# Move to scheduled
mv "$SOURCE" "$DEST"
echo "✅ Scheduled: $SLUG for publication on $DATE"
echo "   Staged at: $DEST"
echo ""
echo "The GitHub Action will publish it automatically on $DATE."
echo "Commit and push _scheduled-posts/ to activate the schedule."
