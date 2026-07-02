import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const css = readFileSync(path.resolve(__dirname, '../globals.css'), 'utf8')

describe('mobile optimization CSS (spec 2026-07-01)', () => {
  it('hides desktop nav links and shows the burger at ≤900px', () => {
    expect(css).toMatch(/@media \(max-width: 900px\)[\s\S]{0,400}\.kt-nav-inner \.kt-navlinks \{ display: none; \}/)
    expect(css).toMatch(/\.kt-burger \{[\s\S]{0,300}display: none;/)
    expect(css).toMatch(/@media \(max-width: 900px\)[\s\S]{0,500}\.kt-burger \{ display: inline-flex; \}/)
  })

  it('burger and close buttons meet the 44px touch target', () => {
    expect(css).toMatch(/\.kt-burger \{[\s\S]{0,300}width: 44px;\s*height: 44px;/)
    expect(css).toMatch(/\.kt-mm-close \{[\s\S]{0,300}width: 44px;\s*height: 44px;/)
  })

  it('mobile menu is a fixed full-screen charcoal surface above the nav', () => {
    expect(css).toMatch(/\.kt-mobile-menu \{[\s\S]{0,300}position: fixed;\s*inset: 0;/)
    expect(css).toMatch(/\.kt-mobile-menu \{[\s\S]{0,400}background: var\(--charcoal\);/)
    expect(css).toMatch(/\.kt-mobile-menu \{[\s\S]{0,400}z-index: 70;/)
  })

  it('menu links are Fraunces serif with opsz 36', () => {
    expect(css).toMatch(/\.kt-mm-link \{[\s\S]{0,300}font-family: var\(--serif\);/)
    expect(css).toMatch(/\.kt-mm-link \{[\s\S]{0,300}"opsz" 36/)
  })

  it('menu INTERO lockup is Fraunces gold caps (brand rule 5)', () => {
    expect(css).toMatch(/\.kt-mm-intero \{[\s\S]{0,300}font-family: var\(--serif\);/)
    expect(css).toMatch(/\.kt-mm-intero \{[\s\S]{0,300}color: var\(--gold\);/)
    expect(css).toMatch(/\.kt-mm-intero \{[\s\S]{0,300}text-transform: uppercase;/)
  })

  it('hero uses svh with vh fallback', () => {
    expect(css).toMatch(/\.kt-hero-full \{\s*min-height: 94vh;\s*min-height: 94svh;/)
    expect(css).toMatch(/\.kt-hero-full-inner \{[\s\S]{0,200}min-height: 94vh;\s*min-height: 94svh;/)
  })

  it('testimonial block compresses padding on mobile; quote well relaxes', () => {
    expect(css).toMatch(/@media \(max-width: 900px\)[\s\S]{0,600}\.kt-hybrid-block \{ padding: 48px 28px; \}/)
    expect(css).toMatch(/@media \(max-width: 480px\)[\s\S]{0,300}\.kt-hybrid-block \{ padding: 40px 24px; \}/)
    expect(css).toMatch(/\.kt-quote-well \{ min-height: 150px; \}/)
    expect(css).toMatch(/@media \(max-width: 900px\)[\s\S]{0,600}\.kt-quote-well \{ min-height: 0; \}/)
  })

  it('carousel dots keep a 32×2 bar but gain a 44px hit area on mobile', () => {
    expect(css).toMatch(/\.kt-dot-bar \{[\s\S]{0,200}width: 32px;\s*height: 2px;/)
    expect(css).toMatch(/@media \(max-width: 900px\)[\s\S]{0,800}\.kt-dot \{ min-width: 44px; min-height: 44px; \}/)
  })

  it('newsletter form stacks at ≤560px with a full-width button', () => {
    expect(css).toMatch(/\.kt-news-form \{ display: flex; gap: 12px; \}/)
    expect(css).toMatch(/@media \(max-width: 560px\)[\s\S]{0,400}\.kt-news-form \{ flex-direction: column; \}/)
    expect(css).toMatch(/@media \(max-width: 560px\)[\s\S]{0,400}\.kt-news-form \.kt-btn \{ width: 100%; justify-content: center; \}/)
  })

  it('form field pairs collapse to one column at ≤480px', () => {
    expect(css).toMatch(/\.grid-form-pair \{ display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; \}/)
    expect(css).toMatch(/@media \(max-width: 480px\)[\s\S]{0,300}\.grid-form-pair \{ grid-template-columns: 1fr; \}/)
  })

  it('inputs are ≥16px on mobile so iOS Safari does not auto-zoom', () => {
    expect(css).toMatch(/@media \(max-width: 900px\)[\s\S]{0,300}\.kt-input,\s*\.kt-input-light \{ font-size: 16px; \}/)
  })

  it('section rhythm drops to 72px at ≤700px (owner-approved)', () => {
    expect(css).toMatch(/@media \(max-width: 700px\)[\s\S]{0,200}--sect-pad: calc\(72px \* var\(--dm\)\);/)
  })

  it('drops the dead ≤800px navlinks wrap block (links are hidden at 900px)', () => {
    expect(css).not.toMatch(/@media \(max-width: 800px\)/)
  })
})
