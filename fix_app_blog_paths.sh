#!/bin/bash

APP_BLOG_PATH="$HOME/Documents/GitHub/nokturnal-lifestyle/app/blog"

echo "================================================================================"
echo "Fixing Image Paths in Published Posts (app/blog/)"
echo "================================================================================"
echo ""
echo "Looking in: $APP_BLOG_PATH"
echo ""

UPDATED=0

if [ -d "$APP_BLOG_PATH" ]; then
  for folder in "$APP_BLOG_PATH"/*/; do
    [ -d "$folder" ] || continue

    page_file="$folder/page.tsx"

    if [ -f "$page_file" ]; then
      # Use sed to replace /public/blog/ with /blog/
      # The -i '' syntax is for macOS
      sudo sed -i '' 's|/public/blog/|/blog/|g' "$page_file"

      if [ $? -eq 0 ]; then
        echo "✓ $(basename "$folder")"
        ((UPDATED++))
      else
        echo "✗ $(basename "$folder") - Failed"
      fi
    fi
  done
else
  echo "ERROR: Path not found: $APP_BLOG_PATH"
  exit 1
fi

echo ""
echo "================================================================================"
echo "Updated: $UPDATED files"
echo "================================================================================"
echo ""

if [ $UPDATED -gt 0 ]; then
  echo "✅ Published post paths fixed! (/public/blog/ → /blog/)"
  echo ""
  echo "Next steps:"
  echo "1. git add app/blog/"
  echo "2. git commit -m 'Fix published post image paths'"
  echo "3. git push"
  echo "4. Wait for Vercel to redeploy"
  echo "5. Images should load now on the live post!"
else
  echo "No files were updated."
fi
