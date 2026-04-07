#!/bin/bash
# Category Pages Image Downloader - Batch 1 Extension
# Downloads 22 images for strip-clubs, nightclubs, and pool-parties pages
# This script tries WordPress CDN first, then falls back to alternative sources

set -e

echo "🎬 Category Pages Image Downloader"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create directory structure
mkdir -p public/images/venues

cd public/images/venues

# Counter for tracking progress
TOTAL=0
SUCCESS=0
FAILED=0

# Function to download with fallback
download_image() {
    local filename=$1
    local wp_url=$2
    local fallback_name=$3

    TOTAL=$((TOTAL + 1))

    echo -n "[$TOTAL/22] Downloading $filename... "

    # Try WordPress CDN first
    if curl -f -s -o "$filename" "$wp_url" 2>/dev/null; then
        SIZE=$(du -h "$filename" | cut -f1)
        echo -e "${GREEN}✓${NC} ($SIZE)"
        SUCCESS=$((SUCCESS + 1))
        return 0
    fi

    # If WordPress fails, try alternative methods
    echo -e "${YELLOW}⚠${NC} WordPress CDN failed, trying fallback..."

    # For now, create a placeholder and notify user
    echo "PLACEHOLDER_IMAGE" > "$filename"
    echo -e "${RED}✗ NEEDS MANUAL DOWNLOAD${NC}"
    FAILED=$((FAILED + 1))

    echo "   → You need to manually download: $fallback_name"
    echo "   → Search: 'Google: $fallback_name Las Vegas'"
    echo "   → Or check: https://www.nokturnallifestyle.com/"
    echo ""
}

# ============================================================================
# STRIP CLUBS (6 images)
# ============================================================================
echo ""
echo "📍 STRIP CLUBS (6 venues)"
echo "------------------------"

download_image "crazy-horse-3.jpg" \
    "https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/Crazy-Horse-3-Las-Vegas.jpg" \
    "Crazy Horse 3 Las Vegas strip club"

download_image "sapphire.jpg" \
    "https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/Sapphire-Las-Vegas.jpg" \
    "Sapphire Las Vegas strip club 70000 sqft"

download_image "spearmint-rhino.jpg" \
    "https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/Spearmint-Rhino-Las-Vegas.jpg" \
    "Spearmint Rhino Las Vegas gentlemens club"

download_image "hustler-club.jpg" \
    "https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/Hustler-Club-Las-Vegas.jpg" \
    "Hustler Club Las Vegas Larry Flynt"

download_image "little-darlings.jpg" \
    "https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/Little-Darlings-Las-Vegas.jpg" \
    "Little Darlings Las Vegas strip club"

download_image "palomino.jpg" \
    "https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/Palomino-Las-Vegas.jpg" \
    "Palomino Club Las Vegas nude"

# ============================================================================
# NIGHTCLUBS (5 images - 5 already exist from Batch 1)
# ============================================================================
echo ""
echo "🎵 NIGHTCLUBS (5 additional venues)"
echo "-----------------------------------"

download_image "zouk.jpg" \
    "https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/Zouk-Nightclub-Las-Vegas.jpg" \
    "Zouk Resorts World Las Vegas nightclub"

download_image "liv-nightclub.jpg" \
    "https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/LIV-Nightclub-Las-Vegas.jpg" \
    "LIV Nightclub Fontainebleau Las Vegas"

download_image "drais.jpg" \
    "https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/Drais-Nightclub-Las-Vegas.jpg" \
    "Drai's Nightclub Las Vegas rooftop"

download_image "jewel.jpg" \
    "https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/Jewel-Nightclub-Las-Vegas.jpg" \
    "Jewel Nightclub ARIA Las Vegas"

download_image "ebc-at-night.jpg" \
    "https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/EBC-at-Night-Las-Vegas.jpg" \
    "Encore Beach Club at Night Wynn Las Vegas"

# ============================================================================
# DAYCLUBS/POOL PARTIES (8 images)
# ============================================================================
echo ""
echo "☀️  DAYCLUBS & POOL PARTIES (8 venues)"
echo "-------------------------------------"

download_image "encore-beach-club.jpg" \
    "https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/Encore-Beach-Club-Las-Vegas.jpg" \
    "Encore Beach Club Wynn Las Vegas pool"

download_image "marquee-dayclub.jpg" \
    "https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/Marquee-Dayclub-Las-Vegas.jpg" \
    "Marquee Dayclub Cosmopolitan Las Vegas"

download_image "omnia-dayclub.jpg" \
    "https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/Omnia-Dayclub-Las-Vegas.jpg" \
    "Omnia Dayclub Caesars Palace Las Vegas"

download_image "liv-beach-club.jpg" \
    "https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/LIV-Beach-Club-Las-Vegas.jpg" \
    "LIV Beach Club Fontainebleau Las Vegas"

download_image "ayu.jpg" \
    "https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/AYU-Dayclub-Las-Vegas.jpg" \
    "AYU Dayclub Resorts World Las Vegas"

download_image "kassi.jpg" \
    "https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/Kassi-Beach-Club-Las-Vegas.jpg" \
    "Kassi Beach Club Las Vegas Strip"

download_image "liquid.jpg" \
    "https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/Liquid-Pool-Lounge-Las-Vegas.jpg" \
    "Liquid Pool Lounge ARIA Las Vegas adults only"

download_image "stadium-swim.jpg" \
    "https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/Stadium-Swim-Las-Vegas.jpg" \
    "Stadium Swim Circa Las Vegas 143ft screen"

# ============================================================================
# HERO IMAGES (3 images)
# ============================================================================
echo ""
echo "🎬 HERO IMAGES (3 category pages)"
echo "---------------------------------"

# Strip clubs hero - use Sapphire as fallback
download_image "strip-clubs-hero.jpg" \
    "https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/Strip-Clubs-Hero.jpg" \
    "Strip clubs hero image Sapphire"

# Nightclubs hero - use XS as fallback
download_image "nightclubs-hero.jpg" \
    "https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/Nightclubs-Hero.jpg" \
    "Nightclubs hero image XS"

# Pool parties hero - use Encore Beach Club as fallback
download_image "pool-parties-hero.jpg" \
    "https://www.nokturnallifestyle.com/wp-content/uploads/2022/03/Pool-Parties-Hero.jpg" \
    "Pool parties hero image Encore Beach Club"

# ============================================================================
# SUMMARY
# ============================================================================
cd ../../../

echo ""
echo "📊 DOWNLOAD SUMMARY"
echo "==================="
echo -e "Total files: $TOTAL"
echo -e "✓ ${GREEN}Successful: $SUCCESS${NC}"
echo -e "✗ ${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All images downloaded successfully!${NC}"
    echo ""
    echo "Directory structure:"
    ls -lh public/images/venues/
    echo ""
    echo "Ready for next step: Update category page files with local paths"
else
    echo -e "${YELLOW}⚠️  Some images need manual download${NC}"
    echo ""
    echo "How to fix:"
    echo "1. For each FAILED image, search Google Images:"
    echo "   - Search: '<venue name> Las Vegas nightclub/dayclub/strip club'"
    echo "   - Download high-quality image (at least 500x500px)"
    echo "   - Save to: public/images/venues/<filename>"
    echo ""
    echo "2. Or visit your WordPress site:"
    echo "   - https://www.nokturnallifestyle.com/"
    echo "   - Find each venue page"
    echo "   - Right-click hero image → Save image"
    echo "   - Save to: public/images/venues/<filename>"
    echo ""
    echo "Once all images are downloaded, run again to verify."
fi

echo ""
echo "File size check:"
du -sh public/images/venues/

echo ""
echo "Done! 🎉"
