#!/bin/bash

HOME_DIR="$HOME"
PROJECT_PATH="$HOME_DIR/Documents/GitHub/nokturnal-lifestyle"
BLOG_PATH="$PROJECT_PATH/public/blog"
SCHEDULED_POSTS_PATH="$PROJECT_PATH/_scheduled-posts"
APP_BLOG_PATH="$PROJECT_PATH/app/blog"

echo "================================================================================"
echo "Fixing Image Filenames to Match Actual Files"
echo "================================================================================"
echo ""

# First, map what actual image files exist
declare -A image_map

if [ -d "$BLOG_PATH" ]; then
  for folder in "$BLOG_PATH"/*/; do
    [ -d "$folder" ] || continue
    folder_name=$(basename "$folder")

    # Find image file
    for file in "$folder"/*; do
      if [[ "$file" =~ \.(jpg|png|jpeg|webp)$ ]]; then
        filename=$(basename "$file")
        image_map["$folder_name"]="$filename"
        echo "Found: $folder_name → $filename"
        break
      fi
    done
  done
fi

echo ""
echo "================================================================================"
echo "Updating page.tsx files..."
echo "================================================================================"
echo ""

updated=0

# Fix _scheduled-posts
if [ -d "$SCHEDULED_POSTS_PATH" ]; then
  for folder in "$SCHEDULED_POSTS_PATH"/*/; do
    [ -d "$folder" ] || continue
    folder_name=$(basename "$folder")
    page_file="$folder/page.tsx"

    if [ -f "$page_file" ]; then
      # Extract slug from folder name (everything after the date)
      slug="${folder_name:11}"

      if [ -n "${image_map[$slug]}" ]; then
        image_filename="${image_map[$slug]}"

        # Use sed to replace the image filename
        sudo sed -i '' "s|/blog/$slug/[a-zA-Z0-9._-]*\\.jpg|/blog/$slug/$image_filename|g" "$page_file"
        sudo sed -i '' "s|/blog/$slug/[a-zA-Z0-9._-]*\\.png|/blog/$slug/$image_filename|g" "$page_file"

        if [ $? -eq 0 ]; then
          echo "✓ _scheduled-posts/$folder_name"
          ((updated++))
        fi
      fi
    fi
  done
fi

# Fix app/blog
if [ -d "$APP_BLOG_PATH" ]; then
  for folder in "$APP_BLOG_PATH"/*/; do
    [ -d "$folder" ] || continue
    folder_name=$(basename "$folder")
    page_file="$folder/page.tsx"

    if [ -f "$page_file" ]; then
      slug="$folder_name"

      if [ -n "${image_map[$slug]}" ]; then
        image_filename="${image_map[$slug]}"

        # Use sed to replace the image filename
        sudo sed -i '' "s|/blog/$slug/[a-zA-Z0-9._-]*\\.jpg|/blog/$slug/$image_filename|g" "$page_file"
        sudo sed -i '' "s|/blog/$slug/[a-zA-Z0-9._-]*\\.png|/blog/$slug/$image_filename|g" "$page_file"

        if [ $? -eq 0 ]; then
          echo "✓ app/blog/$folder_name"
          ((updated++))
        fi
      fi
    fi
  done
fi

echo ""
echo "================================================================================"
echo "Updated: $updated files"
echo "================================================================================"
echo ""

if [ $updated -gt 0 ]; then
  echo "✅ Image filenames fixed!"
  echo ""
  echo "Next steps:"
  echo "1. git add _scheduled-posts/ app/blog/"
  echo "2. git commit -m 'Fix image filenames in page.tsx files'"
  echo "3. git push"
  echo "4. Wait for Vercel to redeploy"
  echo "5. Images should load now!"
else
  echo "No files were updated."
fi
