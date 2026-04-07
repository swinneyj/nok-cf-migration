/**
 * Blog Cover Image Generator
 * Automatically generates cover images for blog posts using fal.ai
 *
 * Usage in your blog page.tsx:
 * ```
 * import { generateBlogCoverImage } from '@/lib/generate-blog-cover-image'
 *
 * export async function generateMetadata(...) {
 *   const coverImagePath = await generateBlogCoverImage(slug, prompt)
 *   // Use coverImagePath in metadata
 * }
 * ```
 */

import fs from 'fs/promises'
import path from 'path'
import https from 'https'

const FAL_API_KEY = process.env.FAL_API_KEY

/**
 * Generate a cover image using fal.ai and save it locally
 */
export async function generateBlogCoverImage(
  slug: string,
  prompt: string
): Promise<string> {
  // Check if image already exists
  const publicDir = path.join(process.cwd(), 'public', 'blog', slug)
  const imagePath = path.join(publicDir, 'cover.jpg')

  try {
    await fs.access(imagePath)
    console.log(`✅ Image already exists: ${imagePath}`)
    return `/blog/${slug}/cover.jpg`
  } catch {
    // Image doesn't exist, generate it
  }

  if (!FAL_API_KEY) {
    console.warn('⚠️ FAL_API_KEY not set, skipping image generation')
    // Return a placeholder or default image
    return `/blog/${slug}/cover.jpg`
  }

  try {
    // Create directory if it doesn't exist
    await fs.mkdir(publicDir, { recursive: true })

    // Call fal.ai API
    const imageUrl = await callFalAiApi(prompt)

    // Download and save image
    await downloadImage(imageUrl, imagePath)

    console.log(`✨ Generated and saved cover image: ${imagePath}`)
    return `/blog/${slug}/cover.jpg`
  } catch (error) {
    console.error(`❌ Failed to generate image for ${slug}:`, error)
    // Return placeholder if generation fails
    return `/blog/${slug}/cover.jpg`
  }
}

/**
 * Call fal.ai API to generate an image from text prompt
 */
async function callFalAiApi(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      prompt: prompt,
      image_size: { width: 1200, height: 630 },
      num_images: 1,
      enable_safety_checker: true,
    })

    const options = {
      hostname: 'api.fal.ai',
      port: 443,
      path: '/v1/flux-pro/text-to-image',
      method: 'POST' as const,
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': payload.length,
      },
    }

    const req = https.request(options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(data)
            if (result.images?.[0]?.url) {
              resolve(result.images[0].url)
            } else {
              reject(new Error('No image URL in response'))
            }
          } catch (e) {
            reject(new Error(`Failed to parse API response: ${e}`))
          }
        } else {
          reject(new Error(`fal.ai API error ${res.statusCode}: ${data}`))
        }
      })
    })

    req.on('error', reject)
    req.write(payload)
    req.end()
  })
}

/**
 * Download image from URL and save locally
 */
async function downloadImage(
  imageUrl: string,
  savePath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = require('fs').createWriteStream(savePath)

    https
      .get(imageUrl, (response) => {
        response.pipe(file)

        file.on('finish', () => {
          file.close()
          resolve()
        })

        file.on('error', (err: Error) => {
          require('fs').unlink(savePath, () => { })
          reject(err)
        })
      })
      .on('error', reject)
  })
}

/**
 * Predefined prompts for each blog post
 * Use these when creating new posts
 */
export const BLOG_IMAGE_PROMPTS: Record<string, string> = {
  'top-golf-las-vegas':
    'A vibrant, modern Top Golf Las Vegas bay with golf simulator screens, sleek black gaming bays, LED lighting, and a group of friends celebrating a bachelor party. Professional photography style, Vegas luxury vibe.',
  'las-vegas-birthday-freebies':
    'A celebratory Las Vegas birthday scene with champagne bottles, colorful party decorations, confetti, neon birthday signs, and happy people toasting. Upscale Vegas nightlife setting, festive atmosphere.',
  'las-vegas-gentlemens-club-guide':
    'An elegant upscale gentleman\'s club interior with dimmed ambient lighting, VIP seating areas, polished wood, and professional stage lighting. Sophisticated Vegas nightlife venue, luxurious atmosphere.',
  'what-time-do-vegas-clubs-close':
    'A Las Vegas nightclub dance floor at night with dynamic LED lighting, laser shows, dancing crowds. Peak party time energy, vibrant Vegas club atmosphere, professional nightlife photography.',
  'las-vegas-nightclub-attire-men':
    'Well-dressed men in stylish nightclub attire at a Las Vegas nightclub entrance. Smart casual to upscale looks: fitted shirts, blazers, dress pants, nice shoes. Sophisticated Vegas nightlife.',
  'male-strip-clubs-las-vegas':
    'A bachelorette party group of women at an upscale Vegas venue celebrating with champagne and enjoying entertainment. Fun, celebratory atmosphere, professional show lighting, exclusive VIP lounge.',
  'omnia-nightclub-review':
    'Omnia Nightclub Las Vegas interior with its distinctive architecture, multi-level dance floor, professional DJ setup, premium sound system, and electronic dance music crowd. Iconic Vegas club atmosphere.',
  'las-vegas-all-inclusive-packages':
    'A luxury Las Vegas all-inclusive party package experience showing VIP bottle service, premium nightclub table, champagne, and guests enjoying an elevated party experience. Upscale Vegas entertainment.',
  'las-vegas-pool-party-season':
    'A vibrant Las Vegas dayclub pool party with resort pool, sunny skies, DJ booth, dancing crowd, and tropical atmosphere. Spring/summer Vegas pool season, energy and celebration.',
  'las-vegas-21st-birthday-ideas':
    'A 21-year-old celebrating their first legal night in Las Vegas with friends at an upscale nightclub. Youthful celebration, champagne toast, party atmosphere, Vegas nightlife.',
  'las-vegas-nye-packages':
    'A New Year\'s Eve celebration in Las Vegas with champagne, countdown atmosphere, confetti cannons, party hats, and VIP bottle service. Festive NYE nightclub party, luxury celebration.',
  'las-vegas-club-tips-first-timers':
    'First-time visitors at a Las Vegas nightclub looking excited and ready for the experience. Vibrant club atmosphere with DJ, dance floor, lights, and energetic crowd.',
  'las-vegas-bachelorette-party-ideas':
    'A bachelorette party group celebrating at an upscale Las Vegas nightclub with the bride-to-be in the center. Festive, elegant atmosphere, champagne bottles, VIP table setting.',
  'las-vegas-vip-host-worth-it':
    'A VIP host professionally managing a group at an exclusive Las Vegas nightclub table with premium bottle service, reserved seating. Luxury Vegas nightlife, exclusive access.',
  'best-hotels-bachelor-party-las-vegas':
    'A luxurious Las Vegas resort hotel with stunning architecture, pool area, nightlife venues, and bachelor party guests enjoying the facilities. Premium Vegas hotel photography.',
  'las-vegas-gentlemens-club-guide-v2':
    'A sophisticated gentleman\'s club interior with premium bar seating, VIP lounge areas, ambient lighting, and professional entertainment stage. High-end Vegas venue, elegant atmosphere.',
}
