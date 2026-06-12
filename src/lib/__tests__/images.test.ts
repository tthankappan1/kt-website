import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { buildManifest } from '@/lib/images'

describe('buildManifest (photo-slot pipeline)', () => {
  let dir: string

  beforeAll(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'kt-images-'))
    writeFileSync(path.join(dir, 'about-portrait.jpg'), 'x')
    writeFileSync(path.join(dir, 'hero-full-img.webp'), 'x')
    writeFileSync(path.join(dir, 'hero-full-img.jpg'), 'x') // jpg should win (extension preference)
    writeFileSync(path.join(dir, 'notes.txt'), 'not an image')
  })

  afterAll(() => rmSync(dir, { recursive: true, force: true }))

  it('maps slot ids to /images/ paths, ignoring non-images', () => {
    const m = buildManifest(dir)
    expect(m.get('about-portrait')).toBe('/images/about-portrait.jpg')
    expect(m.has('notes')).toBe(false)
  })

  it('prefers extensions deterministically (jpg before webp), not readdir order', () => {
    const m = buildManifest(dir)
    expect(m.get('hero-full-img')).toBe('/images/hero-full-img.jpg')
  })

  it('returns an empty manifest for a missing directory (every slot renders quiet frame)', () => {
    expect(buildManifest(path.join(dir, 'does-not-exist')).size).toBe(0)
  })
})
