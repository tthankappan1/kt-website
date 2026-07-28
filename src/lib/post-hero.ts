import 'server-only'
import fs from 'node:fs'
import path from 'node:path'
import type { Post, PostBlock, PostImage } from '@/content/posts/types'

// Ingested issues ship their hero as the leading body image block
// (docs/content-contract.md). Presentation is the site's decision: a leading
// image gets the full-width cover treatment — same as `cover: true` posts —
// never the framed in-body figure. Split it off here so the post page and the
// /newsletter cards share one rule.
//
// Same graceful-degradation contract as PostFigure: a referenced-but-absent
// file renders nothing (the block is still stripped — it would render nothing
// as a figure too). Resolved at build time; all consumers are SSG.
export function splitHero(
  post: Post,
  exists: (src: string) => boolean = srcExists,
): { hero: PostImage | null; body: PostBlock[] } {
  const first = post.body[0]
  if (post.cover || !first || typeof first !== 'object' || !('image' in first)) {
    return { hero: null, body: post.body }
  }
  return { hero: exists(first.image.src) ? first.image : null, body: post.body.slice(1) }
}

function srcExists(src: string): boolean {
  return fs.existsSync(path.join(process.cwd(), 'public', src.replace(/^\//, '')))
}
