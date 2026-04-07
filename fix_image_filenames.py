#!/usr/bin/env python3
import os
import re

HOME = os.path.expanduser("~")
PROJECT_PATH = f"{HOME}/Documents/GitHub/nokturnal-lifestyle"
BLOG_PATH = f"{PROJECT_PATH}/public/blog"
SCHEDULED_POSTS_PATH = f"{PROJECT_PATH}/_scheduled-posts"
APP_BLOG_PATH = f"{PROJECT_PATH}/app/blog"

print("=" * 80)
print("Fixing Image Filenames to Match Actual Files")
print("=" * 80)
print()

# First, map what actual image files exist
image_map = {}
if os.path.exists(BLOG_PATH):
    for folder in os.listdir(BLOG_PATH):
        folder_path = os.path.join(BLOG_PATH, folder)
        if os.path.isdir(folder_path):
            # Find image file
            for filename in os.listdir(folder_path):
                if filename.lower().endswith(('.jpg', '.png', '.jpeg', '.webp')):
                    image_map[folder] = filename
                    print(f"Found: {folder} → {filename}")
                    break

print()
print("=" * 80)
print("Updating page.tsx files...")
print("=" * 80)
print()

updated = 0

# Fix _scheduled-posts
if os.path.exists(SCHEDULED_POSTS_PATH):
    for folder in os.listdir(SCHEDULED_POSTS_PATH):
        folder_path = os.path.join(SCHEDULED_POSTS_PATH, folder)
        if os.path.isdir(folder_path):
            page_file = os.path.join(folder_path, "page.tsx")
            if os.path.exists(page_file):
                # Extract slug from folder name
                slug = folder[11:] if len(folder) > 11 else folder

                if slug in image_map:
                    image_filename = image_map[slug]

                    with open(page_file, 'r') as f:
                        content = f.read()

                    # Replace /blog/{slug}/image.jpg with correct filename
                    new_content = re.sub(
                        f'/blog/{slug}/[^/\\s\'"]*',
                        f'/blog/{slug}/{image_filename}',
                        content
                    )

                    if content != new_content:
                        with open(page_file, 'w') as f:
                            f.write(new_content)
                        print(f"✓ _scheduled-posts/{folder}")
                        updated += 1

# Fix app/blog
if os.path.exists(APP_BLOG_PATH):
    for folder in os.listdir(APP_BLOG_PATH):
        folder_path = os.path.join(APP_BLOG_PATH, folder)
        if os.path.isdir(folder_path):
            page_file = os.path.join(folder_path, "page.tsx")
            if os.path.exists(page_file):
                slug = folder

                if slug in image_map:
                    image_filename = image_map[slug]

                    with open(page_file, 'r') as f:
                        content = f.read()

                    # Replace /blog/{slug}/image.jpg with correct filename
                    new_content = re.sub(
                        f'/blog/{slug}/[^/\\s\'"]*',
                        f'/blog/{slug}/{image_filename}',
                        content
                    )

                    if content != new_content:
                        with open(page_file, 'w') as f:
                            f.write(new_content)
                        print(f"✓ app/blog/{folder}")
                        updated += 1

print()
print("=" * 80)
print(f"Updated: {updated} files")
print("=" * 80)
print()

if updated > 0:
    print("✅ Image filenames fixed!")
    print()
    print("Next steps:")
    print("1. git add _scheduled-posts/ app/blog/")
    print("2. git commit -m 'Fix image filenames in page.tsx files'")
    print("3. git push")
    print("4. Wait for Vercel to redeploy")
    print("5. Images should load now!")
else:
    print("No files needed updating.")
