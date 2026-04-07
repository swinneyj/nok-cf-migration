#!/usr/bin/env python3
import os
import re

# Configuration
HOME = os.path.expanduser("~")
PROJECT_PATH = f"{HOME}/Documents/GitHub/nokturnal-lifestyle"
POSTS_PATH = f"{PROJECT_PATH}/_scheduled-posts"
BLOG_PATH = f"{PROJECT_PATH}/public/blog"

# Get all post folders and their slugs
posts = {}
if os.path.exists(POSTS_PATH):
    for folder in sorted(os.listdir(POSTS_PATH)):
        folder_path = os.path.join(POSTS_PATH, folder)
        if os.path.isdir(folder_path):
            match = re.match(r'(\d{4}-\d{2}-\d{2})_(.+)', folder)
            if match:
                slug = match.group(2)
                posts[folder] = {'slug': slug, 'path': folder_path}

# Get all image folders
images = {}
if os.path.exists(BLOG_PATH):
    for folder in os.listdir(BLOG_PATH):
        folder_path = os.path.join(BLOG_PATH, folder)
        if os.path.isdir(folder_path):
            images[folder] = folder_path

# Match and update
matches = {}
for post_folder, post_info in posts.items():
    if post_info['slug'] in images:
        matches[post_folder] = post_info['slug']

print(f"Updating {len(matches)} post files with local image paths...\n")

updated = 0
for post_folder, image_slug in matches.items():
    page_file = os.path.join(POSTS_PATH, post_folder, "page.tsx")

    if not os.path.exists(page_file):
        continue

    try:
        with open(page_file, 'r') as f:
            content = f.read()

        # Replace Unsplash URLs
        new_content = re.sub(
            r'https://images\.unsplash\.com/[^\s\'"]*',
            f'/public/blog/{image_slug}/image.jpg',
            content
        )

        # Write back
        with open(page_file, 'w') as f:
            f.write(new_content)

        print(f"✓ {post_folder}")
        updated += 1
    except Exception as e:
        print(f"✗ {post_folder}: {e}")

print(f"\n✅ Updated {updated} files!")
print("\nNext: npm run dev")
