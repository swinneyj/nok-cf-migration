#!/usr/bin/env python3
import os
import re
from pathlib import Path
from shutil import copy2

# Configuration
HOME = os.path.expanduser("~")
PROJECT_PATH = f"{HOME}/Documents/GitHub/nokturnal-lifestyle"
POSTS_PATH = f"{PROJECT_PATH}/_scheduled-posts"
BLOG_PATH = f"{PROJECT_PATH}/public/blog"

# Create mapping from actual folder structure
print("=" * 80)
print("Blog Image Updater - Reading actual folder structure")
print("=" * 80)

# Get all post folders and their slugs
posts = {}
if os.path.exists(POSTS_PATH):
    for folder in sorted(os.listdir(POSTS_PATH)):
        folder_path = os.path.join(POSTS_PATH, folder)
        if os.path.isdir(folder_path):
            # Extract slug (everything after the date prefix)
            match = re.match(r'(\d{4}-\d{2}-\d{2})_(.+)', folder)
            if match:
                date_str = match.group(1)
                slug = match.group(2)
                posts[folder] = {'date': date_str, 'slug': slug, 'path': folder_path}

# Get all image folders
images = {}
if os.path.exists(BLOG_PATH):
    for folder in os.listdir(BLOG_PATH):
        folder_path = os.path.join(BLOG_PATH, folder)
        if os.path.isdir(folder_path):
            images[folder] = folder_path

print(f"\nFound {len(posts)} post folders")
print(f"Found {len(images)} image folders\n")

# Match posts to images
matches = {}
unmatched_posts = []

for post_folder, post_info in posts.items():
    slug = post_info['slug']
    if slug in images:
        matches[post_folder] = slug
        print(f"✓ {post_folder} → {slug}")
    else:
        unmatched_posts.append((post_folder, slug))
        print(f"✗ {post_folder} → NO MATCH for '{slug}'")

print(f"\n{'=' * 80}")
print(f"Matches: {len(matches)}/{len(posts)}")
print(f"{'=' * 80}\n")

if unmatched_posts:
    print("⚠️  Unmatched posts:")
    for post_folder, slug in unmatched_posts:
        print(f"   {post_folder}: looking for '{slug}'")
        # Try fuzzy matching
        for img_folder in sorted(images.keys()):
            if slug.lower() in img_folder.lower() or img_folder.lower() in slug.lower():
                print(f"      POSSIBLE: {img_folder}")
    print()

# Now update the files
if matches:
    print(f"{'=' * 80}")
    print("Updating page.tsx files...")
    print(f"{'=' * 80}\n")

    updated = 0
    errors = 0

    for post_folder, image_slug in matches.items():
        page_file = os.path.join(POSTS_PATH, post_folder, "page.tsx")

        if not os.path.exists(page_file):
            print(f"✗ {post_folder}: page.tsx not found")
            errors += 1
            continue

        try:
            # Read file
            with open(page_file, 'r') as f:
                content = f.read()

            # Create backup
            backup_file = page_file + ".backup"
            if not os.path.exists(backup_file):
                copy2(page_file, backup_file)

            # Replace Unsplash URLs with local paths
            original_content = content
            # Replace all Unsplash URLs with local image path
            content = re.sub(
                r'https://images\.unsplash\.com/[^\s\'"]*',
                f'/public/blog/{image_slug}/image.jpg',
                content
            )

            # Write back
            with open(page_file, 'w') as f:
                f.write(content)

            if content != original_content:
                print(f"✓ {post_folder}")
                updated += 1
            else:
                print(f"⊘ {post_folder} (no changes needed)")

        except Exception as e:
            print(f"✗ {post_folder}: {str(e)}")
            errors += 1

    print(f"\n{'=' * 80}")
    print(f"Summary:")
    print(f"  ✓ Updated: {updated}")
    print(f"  ✗ Errors: {errors}")
    print(f"{'=' * 80}\n")

    if errors == 0:
        print("✅ All files updated successfully!")
        print("\nNext steps:")
        print("1. Review changes: git diff")
        print("2. Test: npm run dev")
        print("3. Commit: git add -A && git commit -m 'Update blog images to use local fal.ai images'")
    else:
        print("⚠️  Some files had errors. Check permissions and try again.")
