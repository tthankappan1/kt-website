import fs from 'node:fs'
import path from 'node:path'
import type { PostImage } from '@/content/posts/types'

// Post-body image block. Graceful degradation is the contract: a referenced
// asset that isn't on disk renders nothing — a missing photo never blocks
// publishing. Resolved at build time (posts are SSG, same constraint as
// src/lib/images.ts).
export function PostFigure({ image }: { image: PostImage }) {
  const abs = path.join(process.cwd(), 'public', image.src.replace(/^\//, ''))
  if (!fs.existsSync(abs)) return null
  return (
    <figure className="kt-figure kt-fig-img">
      {/* eslint-disable-next-line @next/next/no-img-element -- natural-aspect post assets (often SVG, which next/image won't optimize) */}
      <img src={image.src} alt={image.alt} loading="lazy" />
      {image.caption ? <figcaption className="fig-note">{image.caption}</figcaption> : null}
    </figure>
  )
}
