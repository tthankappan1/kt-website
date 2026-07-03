#!/usr/bin/env node
// Weekly publish, step 1: convert a contract-markdown newsletter issue
// (docs/content-contract.md) into a typed post + registered route + assets.
//
//   pnpm ingest <path-to-issue.md>
//
// Then: pnpm dev → review /newsletter/<slug> → run the four gates → commit.
import fs from 'node:fs'
import path from 'node:path'
import { parsePostMd, IngestError } from './ingest/parse-post-md.mjs'
import { emitPostTs } from './ingest/emit-post-ts.mjs'
import { registerPost } from './ingest/register-post.mjs'

const ROOT = path.resolve(import.meta.dirname, '..')
const POSTS_DIR = path.join(ROOT, 'src', 'content', 'posts')

function fail(msg) {
  console.error(`\ningest: ${msg}`)
  process.exit(1)
}

const mdPath = process.argv[2]
if (!mdPath) fail('usage: pnpm ingest <path-to-issue.md>')
if (!fs.existsSync(mdPath)) fail(`no such file: ${mdPath}`)

// KT_BLOG_CATS lives in types.ts — read it there so the list has one home.
const typesSrc = fs.readFileSync(path.join(POSTS_DIR, 'types.ts'), 'utf8')
const catsMatch = typesSrc.match(/KT_BLOG_CATS = \[([^\]]+)\]/)
if (!catsMatch) fail('could not read KT_BLOG_CATS from src/content/posts/types.ts')
const categories = [...catsMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1])

let parsed
try {
  parsed = parsePostMd(fs.readFileSync(mdPath, 'utf8'), { categories })
} catch (err) {
  if (err instanceof IngestError) fail(err.message)
  throw err
}
const { post, assets } = parsed

const postFile = path.join(POSTS_DIR, `${post.slug}.ts`)
if (fs.existsSync(postFile)) fail(`${path.relative(ROOT, postFile)} already exists — pick a new slug or delete the old post first`)

const indexFile = path.join(POSTS_DIR, 'index.ts')
let newIndex
try {
  newIndex = registerPost(fs.readFileSync(indexFile, 'utf8'), post.slug)
} catch (err) {
  if (err instanceof IngestError) fail(err.message)
  throw err
}

// Copy assets shipped alongside the markdown. A referenced-but-absent file is
// a WARNING, not an error: the image block renders nothing until the file is
// dropped into public/images/posts/<slug>/ (same fill-later model as PHOTOS.md).
const srcDir = path.dirname(mdPath)
const assetDir = path.join(ROOT, 'public', 'images', 'posts', post.slug)
const copied = []
const missing = []
for (const asset of assets) {
  const from = path.join(srcDir, asset)
  if (!fs.existsSync(from)) {
    missing.push(asset)
    continue
  }
  fs.mkdirSync(assetDir, { recursive: true })
  fs.copyFileSync(from, path.join(assetDir, asset))
  copied.push(asset)
}

fs.writeFileSync(postFile, emitPostTs(parsed))
fs.writeFileSync(indexFile, newIndex)

console.log(`ingested: ${post.title}`)
console.log(`  post:   ${path.relative(ROOT, postFile)}`)
console.log(`  route:  /newsletter/${post.slug}`)
console.log(`  blocks: ${post.body.length} (${post.body.filter(b => typeof b === 'object' && 'chart' in b).length} charts, ${assets.length} images)`)
for (const a of copied) console.log(`  asset:  ${a} → public/images/posts/${post.slug}/`)
for (const a of missing) console.log(`  WARNING: asset "${a}" not found next to the markdown — block will render once the file lands in public/images/posts/${post.slug}/`)
console.log(`\nnext: pnpm dev → http://localhost:3000/newsletter/${post.slug}`)
console.log('then: pnpm typecheck && pnpm lint && pnpm test && pnpm build')
