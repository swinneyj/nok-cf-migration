import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rootDir = path.join(__dirname, '..')
const blogDir = path.join(rootDir, 'app', 'blog')
const publicBlogDir = path.join(rootDir, 'public', 'blog')

const EXCLUDE = new Set(['_template', '[slug]'])

function parseArgs(argv) {
  const args = { slug: null, placeholderCover: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--slug') args.slug = argv[++i] ?? null
    if (a === '--placeholder-cover') args.placeholderCover = true
  }
  return args
}

// Tiny 1x1 JPEG placeholder (valid image, stretches in CSS).
const PLACEHOLDER_JPEG_BASE64 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5/ooooA//2Q=='

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true })
}

function getBlogSlugs() {
  const dirs = fs
    .readdirSync(blogDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => !EXCLUDE.has(name) && !name.startsWith('_'))
  return dirs
}

function ensureAssetsForSlug(slug, { placeholderCover }) {
  const targetDir = path.join(publicBlogDir, slug)
  ensureDir(targetDir)

  const coverPath = path.join(targetDir, 'cover.jpg')
  if (placeholderCover && !fs.existsSync(coverPath)) {
    const buf = Buffer.from(PLACEHOLDER_JPEG_BASE64, 'base64')
    fs.writeFileSync(coverPath, buf)
    return { createdDir: true, createdCover: true }
  }

  return { createdDir: true, createdCover: false }
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const slugs = args.slug ? [args.slug] : getBlogSlugs()

  if (slugs.length === 0) {
    console.log('No blog slugs found in app/blog/')
    return
  }

  let createdDirs = 0
  let createdCovers = 0

  for (const slug of slugs) {
    const out = ensureAssetsForSlug(slug, { placeholderCover: args.placeholderCover })
    if (out.createdDir) createdDirs++
    if (out.createdCover) createdCovers++
  }

  console.log(`Ensured public/blog folders for ${slugs.length} post(s).`)
  if (args.placeholderCover) {
    console.log(`Created placeholder cover(s): ${createdCovers}`)
  } else {
    console.log('Placeholder covers disabled.')
  }
}

main()

