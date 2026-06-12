import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const css = readFileSync(path.resolve(__dirname, '../globals.css'), 'utf8')

describe('brand tokens port (README §4 hard rules)', () => {
  it('carries the locked palette', () => {
    expect(css).toContain('--charcoal: #262623')
    expect(css).toContain('--ivory: #F3F0EB')
    expect(css).toContain('--gold: #C0A278')
    expect(css).toContain('--gold-deep: #7E6A4F')
  })

  it('wires fonts through next/font variables — never Geist', () => {
    expect(css).toContain('--serif: var(--font-fraunces), serif')
    expect(css).toContain('--sans: var(--font-inter), sans-serif')
    expect(css).not.toMatch(/geist/i)
  })

  it('keeps the signature asymmetric shape system', () => {
    expect(css).toContain('.kt-frame')
    expect(css).toMatch(/\.kt-frame[\s\S]{0,200}border-top-left-radius: 24px/)
    expect(css).toMatch(/\.kt-btn[\s\S]{0,400}border-top-left-radius: 12px/)
    expect(css).toMatch(/\.kt-monogram[\s\S]{0,300}border-top-left-radius: 13px/)
    expect(css).toMatch(/\.kt-drop-panel[\s\S]{0,200}border-top-left-radius: 18px/)
  })

  it('locks density to Regular and drops prototype-only machinery', () => {
    expect(css).toContain('--dm: 1')
    expect(css).not.toContain('image-slot')
    expect(css).not.toContain('serif-ui')
  })

  it('preserves optical sizing per type role', () => {
    expect(css).toMatch(/\.kt-display[\s\S]{0,200}"opsz" 144/)
    expect(css).toMatch(/\.kt-h2[\s\S]{0,200}"opsz" 96/)
    expect(css).toMatch(/\.kt-h3[\s\S]{0,200}"opsz" 36/)
  })
})
