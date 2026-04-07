#!/usr/bin/env node

/**
 * Blog Image Generator - Updated Version
 * Generates AI images via FAL.ai, saves them locally to /public/blog/{slug}/cover.jpg
 * and updates page.tsx to reference local paths
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Load prompts from repo root
const promptsPath = path.join(process.cwd(), 'blog-image-prompts.json');
let BLOG_PROMPTS;

try {
  const promptsContent = fs.readFileSync(promptsPath, 'utf8');
  BLOG_PROMPTS = JSON.parse(promptsContent);
} catch (error) {
  console.error(`❌ Error loading prompts file: ${error.message}`);
  process.exit(1);
}

// Configuration
const CONFIG = {
  imageService: process.env.IMAGE_SERVICE || 'fal',
  falKey: process.env.FAL_API_KEY,
  imageWidth: 1200,
  imageHeight: 630,
  outputFormat: 'webp',
  timeout: 180000, // 3 minutes
  publicBlogPath: path.join(process.cwd(), 'public', 'blog'),
};

/**
 * Make HTTP/HTTPS request
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const requestOptions = {
      ...options,
      timeout: CONFIG.timeout,
    };

    const req = protocol.request(url, requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, data });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

/**
 * Download image from URL and save to file
 */
function downloadImage(imageUrl, savePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(savePath);
    const protocol = imageUrl.startsWith('https') ? https : http;

    protocol
      .get(imageUrl, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(savePath);
        });
      })
      .on('error', (err) => {
        fs.unlink(savePath, () => { }); // Delete the file async
        reject(err);
      });
  });
}

/**
 * Generate image using FAL.ai API
 */
async function generateWithFal(prompt) {
  if (!CONFIG.falKey) {
    throw new Error('FAL_API_KEY not configured');
  }

  const payload = {
    prompt: prompt,
    image_width: CONFIG.imageWidth,
    image_height: CONFIG.imageHeight,
    num_inference_steps: 28,
    guidance_scale: 7.5,
  };

  try {
    const response = await makeRequest('https://fal.run/fal-ai/flux-pro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${CONFIG.falKey}`,
      },
      body: JSON.stringify(payload),
    });

    const result = JSON.parse(response.data);

    if (result.images && result.images.length > 0) {
      return result.images[0].url;
    } else {
      throw new Error('No images in response');
    }
  } catch (error) {
    console.error(`   ❌ FAL.ai error: ${error.message}`);
    throw error;
  }
}

/**
 * Get fallback image URL from Unsplash
 */
function getFallbackImage(keywords) {
  if (keywords && keywords.length > 0) {
    const keyword = keywords[0];
    return `https://images.unsplash.com/search?query=${encodeURIComponent(keyword)}&w=1200&h=630`;
  }
  return 'https://images.unsplash.com/photo-1516321318423-f06f70504504?w=1200&h=630';
}

/**
 * Get image prompt for a post
 */
function getImagePrompt(postSlug) {
  const mappings = BLOG_PROMPTS['post-mappings'];

  if (!mappings) {
    console.error('❌ post-mappings not defined in blog-image-prompts.json');
    return null;
  }

  if (mappings[postSlug]) {
    return mappings[postSlug];
  }

  // No exact match found
  return null;
}

/**
 * Process scheduled posts and generate images
 */
async function processScheduledPosts() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('No posts to process');
    return;
  }

  const postsArg = args[0];
  const dateArg = args[1];

  console.log('📸 Blog Image Generation Started');
  console.log(`📅 Date: ${dateArg}`);

  // Parse post directories from argument
  const postDirs = postsArg.split(' ').filter(p => p.trim());
  console.log(`📋 Posts: ${postDirs.length}`);

  let successCount = 0;
  let failedCount = 0;

  for (const postDir of postDirs) {
    if (!postDir.trim()) continue;

    // Extract slug from directory name (format: YYYY-MM-DD_slug)
    const dirName = path.basename(postDir.replace(/\/$/, ''));
    const slug = dirName.substring(11); // Remove date prefix (YYYY-MM-DD_)

    console.log(`\n🖼️  Generating image for: ${slug}`);

    // Get prompt mapping
    const promptData = getImagePrompt(slug);

    if (!promptData) {
      console.log(`   ⚠️  No prompt mapping found for: ${slug}`);
      console.log(`⏭️ Skipping image generation (not an error)`);
      failedCount++;
      continue;
    }

    console.log(`   📝 Prompt: "${promptData.image_prompt.substring(0, 60)}..."`);

    // Create public/blog/{slug} directory if it doesn't exist
    const slugBlogDir = path.join(CONFIG.publicBlogPath, slug);
    if (!fs.existsSync(slugBlogDir)) {
      fs.mkdirSync(slugBlogDir, { recursive: true });
    }

    const imageSavePath = path.join(slugBlogDir, 'cover.jpg');

    // Try to generate image
    try {
      console.log(`   ⏳ Generating image via FAL.ai...`);
      const imageUrl = await generateWithFal(promptData.image_prompt);
      console.log(`   ✅ Image generated: ${imageUrl.substring(0, 50)}...`);

      // Download and save image locally
      console.log(`   ⏳ Downloading and saving image locally...`);
      await downloadImage(imageUrl, imageSavePath);
      console.log(`   ✅ Image saved to: /public/blog/${slug}/cover.jpg`);

      // Update post file with LOCAL image path
      const pageFile = path.join(postDir, 'page.tsx');
      if (fs.existsSync(pageFile)) {
        let content = fs.readFileSync(pageFile, 'utf8');

        // Replace with local path instead of remote URL
        content = content.replace(
          /images: \[\{[\s\S]*?url: "([^"]*)"[\s\S]*?\}\]/,
          `images: [{\n    url: "/blog/${slug}/cover.jpg",\n    alt: "${promptData.title}",\n    caption: "AI-generated image"\n  }]`
        );

        // Also update any img src tags
        content = content.replace(
          /<img\s+src="https:\/\/images\.unsplash\.com\/[^"]*"/g,
          `<img src="/blog/${slug}/cover.jpg"`
        );

        fs.writeFileSync(pageFile, content);
        console.log(`   ✅ Updated page.tsx with local image path: /blog/${slug}/cover.jpg`);
        successCount++;
      } else {
        console.log(`   ⚠️  Could not find post file: ${pageFile}`);
        failedCount++;
      }
    } catch (error) {
      console.log(`   ❌ Image generation failed: ${error.message}`);
      console.log(`   ⚠️  Using fallback Unsplash image`);

      const fallbackUrl = getFallbackImage(promptData.image_keywords);

      // Try to update with fallback (still remote, but better than nothing)
      const pageFile = path.join(postDir, 'page.tsx');
      if (fs.existsSync(pageFile)) {
        let content = fs.readFileSync(pageFile, 'utf8');
        content = content.replace(
          /images: \[\{[\s\S]*?url: "([^"]*)"[\s\S]*?\}\]/,
          `images: [{\n    url: "${fallbackUrl}",\n    alt: "${promptData.title}",\n    caption: "Placeholder image"\n  }]`
        );
        fs.writeFileSync(pageFile, content);
      }

      failedCount++;
    }
  }

  // Summary
  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failedCount}`);

  if (failedCount > 0) {
    console.log('⚠️ Some images failed, but continuing pipeline...');
  }
}

// Run the script
processScheduledPosts().catch(error => {
  console.error(`❌ Fatal error: ${error.message}`);
  process.exit(1);
});
