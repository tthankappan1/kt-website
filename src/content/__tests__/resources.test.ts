import { describe, it, expect } from 'vitest'
import { RESOURCE_PAGES, RESOURCE_SLUGS } from '../resources'

const EXPECTED_SLUGS = [
  'selling',
  'buying',
  'cost-of-selling',
  'intero-concierge',
  'schools',
  'market-updates',
  'buyers-guide',
] as const

const ALLOWED_SECTION_KEYS = new Set(['heading', 'paras', 'steps', 'rows', 'note'])

describe('RESOURCE_PAGES', () => {
  it('has exactly 7 keys', () => {
    expect(Object.keys(RESOURCE_PAGES)).toHaveLength(7)
  })

  it('has exactly the expected 7 slugs', () => {
    expect(Object.keys(RESOURCE_PAGES).sort()).toEqual([...EXPECTED_SLUGS].sort())
  })

  it('every page has title, sub, and sections', () => {
    for (const [slug, page] of Object.entries(RESOURCE_PAGES)) {
      expect(page.title, `${slug}.title`).toBeTruthy()
      expect(page.sub, `${slug}.sub`).toBeTruthy()
      expect(Array.isArray(page.sections), `${slug}.sections is array`).toBe(true)
      expect(page.sections.length, `${slug}.sections non-empty`).toBeGreaterThan(0)
    }
  })

  it('every section only has allowed keys', () => {
    for (const [slug, page] of Object.entries(RESOURCE_PAGES)) {
      for (const section of page.sections) {
        for (const key of Object.keys(section)) {
          expect(
            ALLOWED_SECTION_KEYS.has(key),
            `${slug}: unexpected section key "${key}"`
          ).toBe(true)
        }
      }
    }
  })

  it('steps are 3-tuples of strings', () => {
    for (const [slug, page] of Object.entries(RESOURCE_PAGES)) {
      for (const section of page.sections) {
        if (section.steps) {
          expect(Array.isArray(section.steps), `${slug}.steps is array`).toBe(true)
          for (const step of section.steps) {
            expect(Array.isArray(step), `${slug} step is array`).toBe(true)
            expect(step).toHaveLength(3)
            expect(typeof step[0]).toBe('string')
            expect(typeof step[1]).toBe('string')
            expect(typeof step[2]).toBe('string')
          }
        }
      }
    }
  })

  it('rows are 2-tuples of strings', () => {
    for (const [slug, page] of Object.entries(RESOURCE_PAGES)) {
      for (const section of page.sections) {
        if (section.rows) {
          expect(Array.isArray(section.rows), `${slug}.rows is array`).toBe(true)
          for (const row of section.rows) {
            expect(Array.isArray(row), `${slug} row is array`).toBe(true)
            expect(row).toHaveLength(2)
            expect(typeof row[0]).toBe('string')
            expect(typeof row[1]).toBe('string')
          }
        }
      }
    }
  })

  it('selling page has expected title and 2 sections', () => {
    const page = RESOURCE_PAGES['selling']
    expect(page.title).toBe('Selling')
    expect(page.sub).toBe('A calm, numbers-first approach to selling your East Bay home.')
    expect(page.sections).toHaveLength(2)
  })

  it('selling process section has 5 steps with correct step numbers', () => {
    const page = RESOURCE_PAGES['selling']
    const processSection = page.sections.find(s => s.heading === 'The process')!
    expect(processSection).toBeDefined()
    expect(processSection.steps).toHaveLength(5)
    expect(processSection.steps![0][0]).toBe('01')
    expect(processSection.steps![4][0]).toBe('05')
  })

  it('cost-of-selling has correct title and rows', () => {
    const page = RESOURCE_PAGES['cost-of-selling']
    expect(page.title).toBe('The Cost of Selling')
    expect(page.sub).toBe('Every line item, in plain view, before you commit to anything.')
    const rowSection = page.sections.find(s => s.rows)!
    expect(rowSection).toBeDefined()
    expect(rowSection.rows).toHaveLength(6)
    expect(rowSection.rows![0][0]).toBe('Preparation & staging')
    expect(rowSection.rows![5][0]).toBe('Agent compensation')
  })

  it('cost-of-selling has no placeholder note', () => {
    const page = RESOURCE_PAGES['cost-of-selling']
    const rowSection = page.sections.find(s => s.rows)!
    expect(rowSection.note).toBeUndefined()
  })

  it('intero-concierge has 3 sections with steps and rows', () => {
    const page = RESOURCE_PAGES['intero-concierge']
    expect(page.title).toBe('Intero Concierge')
    const stepSection = page.sections.find(s => s.steps)!
    expect(stepSection.steps).toHaveLength(3)
    const rowSection = page.sections.find(s => s.rows)!
    expect(rowSection.rows).toHaveLength(4)
  })

  it('schools page Alameda section rows has 5 items', () => {
    const page = RESOURCE_PAGES['schools']
    const alamedaSection = page.sections.find(s => s.heading === 'Alameda County')!
    expect(alamedaSection).toBeDefined()
    expect(alamedaSection.rows).toHaveLength(5)
    expect(alamedaSection.rows![0][0]).toBe('Pleasanton USD')
  })

  it('schools page Contra Costa section has note with boundary warning', () => {
    const page = RESOURCE_PAGES['schools']
    const ccSection = page.sections.find(s => s.heading === 'Contra Costa County')!
    expect(ccSection).toBeDefined()
    expect(ccSection.note).toBe(
      'Verify any specific address directly with the district before writing an offer — boundaries and enrollment policies change.'
    )
  })

  it('buyers-guide has correct title and sub with typographic apostrophe', () => {
    const page = RESOURCE_PAGES['buyers-guide']
    expect(page.title).toBe('The Buyer’s Guide')
    expect(page.sub).toBe('Everything worth knowing before your first offer.')
  })

  it('market-updates has correct note referencing sign up', () => {
    const page = RESOURCE_PAGES['market-updates']
    const noteSection = page.sections.find(s => s.note)!
    expect(noteSection.note).toBe(
      'The first update publishes when the site goes live. Sign up below to receive them by email.'
    )
  })

  it('buying intro paragraph contains correct copy', () => {
    const page = RESOURCE_PAGES['buying']
    const introSection = page.sections[0]
    expect(introSection.paras).toBeDefined()
    expect(introSection.paras![0]).toContain('The right purchase is the one that still looks smart five years later')
    expect(introSection.paras).toHaveLength(2)
  })
})

describe('RESOURCE_SLUGS', () => {
  it('matches the 7 route slugs', () => {
    expect(RESOURCE_SLUGS.sort()).toEqual([...EXPECTED_SLUGS].sort())
  })

  it('has exactly 7 entries', () => {
    expect(RESOURCE_SLUGS).toHaveLength(7)
  })

  it('RESOURCE_SLUGS values are the same as RESOURCE_PAGES keys', () => {
    expect(RESOURCE_SLUGS.sort()).toEqual(Object.keys(RESOURCE_PAGES).sort())
  })
})
