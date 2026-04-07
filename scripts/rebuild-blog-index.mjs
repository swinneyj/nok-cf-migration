import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// go from /scripts → project root
const rootDir = path.join(__dirname, '..');

const blogDir = path.join(rootDir, 'app', 'blog');
const outputFile = path.join(blogDir, 'generated-posts.ts');

const EXCLUDE = new Set(['_template', '[slug]']);

function extract(pattern, text, fallback = '') {
  const match = text.match(pattern);
  return match?.[1]?.trim() ?? fallback;
}

function extractAll(pattern, text) {
  return [...text.matchAll(pattern)].map((m) => m[1]?.trim()).filter(Boolean);
}

function parsePost(slug) {
  const filePath = path.join(blogDir, slug, 'page.tsx');
  if (!fs.existsSync(filePath)) return null;

  const source = fs.readFileSync(filePath, 'utf8');

  if (source.includes("export { default } from '@/app/blog/_template/page'")) {
    return null;
  }

  // 🔥 Step 1: Extract ONLY metadata block
  const metadataBlock =
    extract(/export const metadata:\s*Metadata\s*=\s*\{([\s\S]*?)\n\}/s, source) ||
    extract(/export const metadata\s*=\s*\{([\s\S]*?)\n\}/s, source);

  // 🔥 Step 2: Extract title ONLY from metadata
  const metadataTitle =
    extract(/title:\s*'([^']+)'/s, metadataBlock) ||
    extract(/title:\s*"([^"]+)"/s, metadataBlock);

  // 🔥 Step 3: fallback to <h1> if needed
  const h1Title =
    extract(/<h1[^>]*>\s*([^<]+?)\s*<\/h1>/s, source);

  const title = metadataTitle || h1Title;

  const excerpt =
    extract(/description:\s*'([^']+)'/s, metadataBlock) ||
    extract(/description:\s*"([^"]+)"/s, metadataBlock);

  const image =
    extract(/images:\s*\[\{\s*url:\s*'([^']+)'/s, metadataBlock) ||
    extract(/images:\s*\[\{\s*url:\s*"([^"]+)"/s, metadataBlock) ||
    extract(/<img\s+src="([^"]+)"/s, source);

  const imageAlt =
    extract(/<img[^>]+alt="([^"]+)"/s, source) || title;

  const date =
    extract(/<span>([A-Z][a-z]+ \d{1,2}, \d{4})<\/span>\s*<span>·<\/span>\s*<span>([^<]+)<\/span>/s, source);

  const readTime =
    (source.match(/<span>([A-Z][a-z]+ \d{1,2}, \d{4})<\/span>\s*<span>·<\/span>\s*<span>([^<]+)<\/span>/s) || [])[2] || '';

  const eyebrowMatches = extractAll(/section-eyebrow[^>]*>([^<]+)</g, source);
  const category = eyebrowMatches.find((x) => x !== '← Blog' && x !== 'The Nokturnal Blog') || 'Guides';

  if (!title) return null;

  // 🔥 Optional safety warning
  if (metadataTitle && h1Title && metadataTitle !== h1Title) {
    console.warn(`⚠️ Title mismatch in ${slug}`);
    console.warn(`metadata: ${metadataTitle}`);
    console.warn(`h1:       ${h1Title}`);
  }

  return {
    slug,
    title,
    excerpt,
    date,
    readTime,
    category,
    image,
    imageAlt,
  };
}

const dirs = fs
  .readdirSync(blogDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((name) => !EXCLUDE.has(name) && !name.startsWith('_'));

const posts = dirs
  .map(parsePost)
  .filter(Boolean)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

const content = `export type GeneratedPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  image: string
  imageAlt: string
}

export const posts: GeneratedPost[] = ${JSON.stringify(posts, null, 2)}
`

fs.writeFileSync(outputFile, content);
console.log(`Generated ${outputFile} with ${posts.length} posts.`);
