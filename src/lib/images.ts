import fs from 'node:fs'
import path from 'node:path'

// Photo-slot manifest (PHOTOS.md): a slot is filled by dropping a file at
// public/images/<slot-id>.<ext>. Updating a photo = replace file, push,
// auto-deploy. No layout or code edits, ever.

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif'] as const
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images')

function buildManifest(): Map<string, string> {
  const manifest = new Map<string, string>()
  let entries: string[] = []
  try {
    entries = fs.readdirSync(IMAGES_DIR)
  } catch {
    return manifest // no images directory yet — every slot renders its quiet frame
  }
  for (const file of entries) {
    const ext = path.extname(file).slice(1).toLowerCase()
    if ((IMAGE_EXTENSIONS as readonly string[]).includes(ext)) {
      const id = path.basename(file, path.extname(file))
      if (!manifest.has(id)) manifest.set(id, `/images/${file}`)
    }
  }
  return manifest
}

// Built once per server/build process — pages are SSG so this runs at build time.
const manifest = buildManifest()

export function slotImageSrc(id: string): string | null {
  return manifest.get(id) ?? null
}
