#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

let FAL_API_KEY = process.env.FAL_API_KEY;

if (!FAL_API_KEY) {
  const envPath = path.join(process.cwd(), '.env.local');
  try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/FAL_API_KEY=(.+)/);
    if (match) {
      FAL_API_KEY = match[1].trim();
    }
  } catch (e) { }
}

if (!FAL_API_KEY) {
  console.error('❌ FAL_API_KEY not found');
  process.exit(1);
}

console.log('✅ API key loaded\n');

// 🔥 GLOBAL RULE (no text in images)
const NO_TEXT_RULE =
  'Do NOT include any visible text, words, letters, numbers, logos, labels, captions, watermarks, signage, typography, or readable writing anywhere in the image.';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 🔥 AUTO DETECT BLOG FOLDERS
function getBlogSlugs() {
  const blogDir = path.join(process.cwd(), 'public', 'blog');

  return fs
    .readdirSync(blogDir)
    .filter((name) => {
      const fullPath = path.join(blogDir, name);
      return fs.statSync(fullPath).isDirectory();
    });
}

async function submitImageRequest(prompt) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      prompt,
      aspect_ratio: '16:9',
      num_images: 1,
    });

    const options = {
      hostname: 'queue.fal.run',
      path: '/fal-ai/nano-banana-2',
      method: 'POST',
      headers: {
        Authorization: `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        Accept: 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);

          if (!json.response_url) {
            return reject(new Error(`Invalid response:\n${data}`));
          }

          resolve(json);
        } catch (err) {
          reject(new Error(`Bad JSON:\n${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function checkStatus(responseUrl) {
  return new Promise((resolve, reject) => {
    const url = new URL(responseUrl);

    const options = {
      hostname: url.hostname,
      path: url.pathname + (url.search || ''),
      method: 'GET',
      headers: {
        Authorization: `Key ${FAL_API_KEY}`,
        Accept: 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);

          // 🔥 HANDLE "STILL PROCESSING"
          if (res.statusCode === 400 && json.detail === 'Request is still in progress') {
            return resolve({ status: 'IN_PROGRESS' });
          }

          resolve(json);
        } catch (err) {
          reject(new Error(`Status parse error:\n${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function pollForResult(responseUrl) {
  let attempts = 0;

  while (true) {
    attempts++;

    const result = await checkStatus(responseUrl);

    if (result.status === 'IN_PROGRESS') {
      if (attempts % 5 === 0) {
        console.log(`    ⏳ Still generating... (${attempts}s)`);
      }
      await sleep(1000);
      continue;
    }

    if (result.images?.[0]?.url) return result.images[0].url;
    if (result.result?.images?.[0]?.url) return result.result.images[0].url;

    if (result.status === 'FAILED') {
      throw new Error('Image generation failed');
    }

    await sleep(1000);
  }
}

async function downloadImage(url, savePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(savePath);

    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

// 🔥 MAIN AUTOMATION
async function main() {
  const slugs = getBlogSlugs();

  console.log(`🎨 Generating ${slugs.length} images...\n`);

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];

    console.log(`[${i + 1}/${slugs.length}] ${slug}`);

    const dir = path.join(process.cwd(), 'public', 'blog', slug);
    const savePath = path.join(dir, 'cover.jpg');

    // 🔥 SKIP IF EXISTS
    if (fs.existsSync(savePath)) {
      console.log('  🔄 Regenerating (overwriting existing image)');
      fs.unlinkSync(savePath);
    }

    const prompt = `
High-quality, cinematic, modern Las Vegas themed image representing:
"${slug.replace(/-/g, ' ')}".

Nightlife, luxury, neon, premium atmosphere, visually engaging, blog cover style.

${NO_TEXT_RULE}
`;

    try {
      const { response_url } = await submitImageRequest(prompt);

      const imageUrl = await pollForResult(response_url);

      await downloadImage(imageUrl, savePath);

      console.log(`  ✅ Saved ${savePath}\n`);
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}\n`);
    }

    // 🔥 PREVENT RATE LIMIT
    await sleep(500);
  }

  console.log('✨ Done');
}

main();