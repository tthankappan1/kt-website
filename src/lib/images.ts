import 'server-only'
import fs from 'node:fs'
import path from 'node:path'

// Photo-slot manifest (PHOTOS.md): a slot is filled by dropping a file at
// public/images/<slot-id>.<ext>. Updating a photo = replace file, push,
// auto-deploy. No layout or code edits, ever.
//
// HARD CONSTRAINT: this reads the filesystem at module scope, which is only
// correct because every consumer is SSG (manifest resolves at build time).
// If a consuming route ever goes dynamic, public/ is not in the function
// bundle and this would break — keep pages static (README §2).
// Dev caveat: `next dev` needs a restart to pick up newly dropped files.

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif'] as const

export function buildManifest(dir: string): Map<string, string> {
  const manifest = new Map<string, string>()
  let entries: string[] = []
  try {
    entries = fs.readdirSync(dir)
  } catch (err) {
    // Only "directory missing" is benign (every slot renders its quiet frame).
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return manifest
    throw err
  }
  // Deterministic extension preference, then name order — never readdir order.
  const byPreference = [...entries].sort((a, b) => {
    const rank = (f: string) =>
      (IMAGE_EXTENSIONS as readonly string[]).indexOf(path.extname(f).slice(1).toLowerCase())
    return rank(a) - rank(b) || a.localeCompare(b)
  })
  for (const file of byPreference) {
    const ext = path.extname(file).slice(1).toLowerCase()
    if (!(IMAGE_EXTENSIONS as readonly string[]).includes(ext)) continue
    const id = path.basename(file, path.extname(file))
    if (!manifest.has(id)) manifest.set(id, `/images/${file}`)
  }
  return manifest
}

// Built once per build process (all consumers are SSG — see constraint above).
const manifest = buildManifest(path.join(process.cwd(), 'public', 'images'))

export function slotImageSrc(id: string): string | null {
  return manifest.get(id) ?? null
}
