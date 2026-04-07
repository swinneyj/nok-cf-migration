#!/bin/bash
# Batch 1 Image Download Script for Nokturnal Lifestyle Vercel Migration
# This script downloads all Batch 1 images from nokturnallifestyle.com WordPress site
# and places them in your public/images/venues/ folder

set -e  # Exit on error

echo "🖼️  Downloading Batch 1 Images..."
echo "================================"

# Create directory structure
mkdir -p public/images/venues

cd public/images/venues

# Array of images to download
declare -a IMAGES=(
    "xs-nightclub.jpg:https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/XS-Nightclub-Las-Vegas.jpg"
    "hakkasan.jpg:https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/Hakkasan-Nightclub-Las-Vegas.jpg"
    "omnia.jpg:https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/OMNIA-Nightclub-Las-Vegas.jpg"
    "marquee.jpg:https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/Marquee-Nightclub-Las-Vegas.jpg"
    "tao.jpg:https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/TAO-Nightclub-Las-Vegas.jpg"
    "vegas-vip-services.jpg:https://www.nokturnallifestyle.com/wp-content/uploads/2022/01/Las-Vegas-VIP-Services.jpg"
)

# Download each image
for image in "${IMAGES[@]}"
do
    IFS=':' read -r filename url <<< "$image"
    echo "⬇️  Downloading $filename..."

    if curl -f -s -o "$filename" "$url"; then
        echo "   ✓ $filename downloaded ($(du -h "$filename" | cut -f1))"
    else
        echo "   ✗ Failed to download $filename"
        echo "   URL: $url"
        exit 1
    fi
done

cd ../../../

echo ""
echo "✅ All images downloaded successfully!"
echo ""
echo "Directory structure:"
ls -lh public/images/venues/
echo ""
echo "Ready to deploy! 🚀"
