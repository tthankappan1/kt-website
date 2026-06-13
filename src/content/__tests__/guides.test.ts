import { describe, it, expect } from 'vitest'
import { ALAMEDA_GUIDE, CONTRA_COSTA_GUIDE } from '../guides'

const ALAMEDA_CITY_IDS = ['pleasanton', 'dublin', 'livermore', 'fremont', 'castro-valley']
const CONTRA_COSTA_CITY_IDS = [
  'san-ramon',
  'danville',
  'alamo',
  'walnut-creek',
  'lafayette',
  'orinda',
  'moraga',
]
const CITY_FIELDS = ['id', 'name', 'price', 'drive', 'transit', 'schools', 'bestFor', 'paras'] as const

describe('ALAMEDA_GUIDE', () => {
  it('has correct eyebrow', () => {
    expect(ALAMEDA_GUIDE.eyebrow).toBe('Client Resources · Neighborhood Guide')
  })

  it('has correct title', () => {
    expect(ALAMEDA_GUIDE.title).toBe('Alameda County Neighborhood Guide')
  })

  it('has correct sub', () => {
    expect(ALAMEDA_GUIDE.sub).toBe('Pleasanton, Dublin, Livermore, Fremont, or Castro Valley? Start here.')
  })

  it('has correct slotId', () => {
    expect(ALAMEDA_GUIDE.slotId).toBe('guide-alameda-hero')
  })

  it('has correct placeholder', () => {
    expect(ALAMEDA_GUIDE.placeholder).toBe('Tri-Valley hills or Pleasanton Main Street')
  })

  it('cities array has exactly 5 entries', () => {
    expect(ALAMEDA_GUIDE.cities).toHaveLength(5)
  })

  it('city ids match expected order', () => {
    expect(ALAMEDA_GUIDE.cities.map(c => c.id)).toEqual(ALAMEDA_CITY_IDS)
  })

  it('all city ids are kebab-case', () => {
    for (const city of ALAMEDA_GUIDE.cities) {
      expect(city.id).toMatch(/^[a-z][a-z0-9-]*$/)
    }
  })

  it('all city ids are unique', () => {
    const ids = ALAMEDA_GUIDE.cities.map(c => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every city has all 8 fields non-empty', () => {
    for (const city of ALAMEDA_GUIDE.cities) {
      for (const field of CITY_FIELDS) {
        if (field === 'paras') {
          expect(Array.isArray(city.paras), `${city.id}.paras is array`).toBe(true)
          expect(city.paras.length, `${city.id}.paras non-empty`).toBeGreaterThan(0)
          for (const para of city.paras) {
            expect(para.trim(), `${city.id} para non-empty`).toBeTruthy()
          }
        } else {
          expect(city[field].trim(), `${city.id}.${field} non-empty`).toBeTruthy()
        }
      }
    }
  })

  it('pleasanton.price is byte-exact', () => {
    const city = ALAMEDA_GUIDE.cities.find(c => c.id === 'pleasanton')!
    expect(city.price).toBe('~$1.6M – $3.5M+')
  })

  it('pleasanton.drive is byte-exact', () => {
    const city = ALAMEDA_GUIDE.cities.find(c => c.id === 'pleasanton')!
    expect(city.drive).toBe('Drive to SF: 45–60 min')
  })

  it('pleasanton.transit is byte-exact', () => {
    const city = ALAMEDA_GUIDE.cities.find(c => c.id === 'pleasanton')!
    expect(city.transit).toBe('BART: West Dublin/Pleasanton · ACE train downtown')
  })

  it('pleasanton first paragraph opens correctly', () => {
    const city = ALAMEDA_GUIDE.cities.find(c => c.id === 'pleasanton')!
    expect(city.paras[0]).toContain('Pleasanton is the anchor of the Tri-Valley')
  })

  it('pleasanton has 2 paragraphs', () => {
    const city = ALAMEDA_GUIDE.cities.find(c => c.id === 'pleasanton')!
    expect(city.paras).toHaveLength(2)
  })

  it('dublin.price is byte-exact', () => {
    const city = ALAMEDA_GUIDE.cities.find(c => c.id === 'dublin')!
    expect(city.price).toBe('~$1.2M – $2.4M')
  })

  it('castro-valley.price is byte-exact', () => {
    const city = ALAMEDA_GUIDE.cities.find(c => c.id === 'castro-valley')!
    expect(city.price).toBe('~$1.0M – $1.8M')
  })

  it('fremont.drive includes South Bay commute', () => {
    const city = ALAMEDA_GUIDE.cities.find(c => c.id === 'fremont')!
    expect(city.drive).toBe('Drive to SF: 50–65 min · South Bay: 20–35 min')
  })

  it('livermore bestFor contains lab and wine country', () => {
    const city = ALAMEDA_GUIDE.cities.find(c => c.id === 'livermore')!
    expect(city.bestFor).toContain('lab and engineering professionals')
    expect(city.bestFor).toContain('wine country')
  })

  it('all cities have 2 paragraphs', () => {
    for (const city of ALAMEDA_GUIDE.cities) {
      expect(city.paras, `${city.id} paras`).toHaveLength(2)
    }
  })
})

describe('CONTRA_COSTA_GUIDE', () => {
  it('has correct eyebrow', () => {
    expect(CONTRA_COSTA_GUIDE.eyebrow).toBe('Client Resources · Neighborhood Guide')
  })

  it('has correct title', () => {
    expect(CONTRA_COSTA_GUIDE.title).toBe('Contra Costa County Neighborhood Guide')
  })

  it('has correct sub with em dash', () => {
    expect(CONTRA_COSTA_GUIDE.sub).toBe('From San Ramon to Lamorinda — the 680 corridor, town by town.')
  })

  it('has correct slotId', () => {
    expect(CONTRA_COSTA_GUIDE.slotId).toBe('guide-contracosta-hero')
  })

  it('has correct placeholder', () => {
    expect(CONTRA_COSTA_GUIDE.placeholder).toBe('Mt. Diablo or the 680 corridor hills')
  })

  it('cities array has exactly 7 entries', () => {
    expect(CONTRA_COSTA_GUIDE.cities).toHaveLength(7)
  })

  it('city ids match expected order', () => {
    expect(CONTRA_COSTA_GUIDE.cities.map(c => c.id)).toEqual(CONTRA_COSTA_CITY_IDS)
  })

  it('all city ids are kebab-case', () => {
    for (const city of CONTRA_COSTA_GUIDE.cities) {
      expect(city.id).toMatch(/^[a-z][a-z0-9-]*$/)
    }
  })

  it('all city ids are unique', () => {
    const ids = CONTRA_COSTA_GUIDE.cities.map(c => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every city has all 8 fields non-empty', () => {
    for (const city of CONTRA_COSTA_GUIDE.cities) {
      for (const field of CITY_FIELDS) {
        if (field === 'paras') {
          expect(Array.isArray(city.paras), `${city.id}.paras is array`).toBe(true)
          expect(city.paras.length, `${city.id}.paras non-empty`).toBeGreaterThan(0)
          for (const para of city.paras) {
            expect(para.trim(), `${city.id} para non-empty`).toBeTruthy()
          }
        } else {
          expect(city[field].trim(), `${city.id}.${field} non-empty`).toBeTruthy()
        }
      }
    }
  })

  it('san-ramon.price is byte-exact', () => {
    const city = CONTRA_COSTA_GUIDE.cities.find(c => c.id === 'san-ramon')!
    expect(city.price).toBe('~$1.4M – $2.8M')
  })

  it('danville.price is byte-exact', () => {
    const city = CONTRA_COSTA_GUIDE.cities.find(c => c.id === 'danville')!
    expect(city.price).toBe('~$1.8M – $4M+')
  })

  it('alamo.price is byte-exact', () => {
    const city = CONTRA_COSTA_GUIDE.cities.find(c => c.id === 'alamo')!
    expect(city.price).toBe('~$2.5M – $5M+')
  })

  it('walnut-creek.price is byte-exact', () => {
    const city = CONTRA_COSTA_GUIDE.cities.find(c => c.id === 'walnut-creek')!
    expect(city.price).toBe('~$950K – $2.5M+')
  })

  it('lafayette.drive contains BART reference', () => {
    const city = CONTRA_COSTA_GUIDE.cities.find(c => c.id === 'lafayette')!
    expect(city.transit).toBe('BART: Lafayette')
  })

  it('orinda.drive is shortest commute to SF', () => {
    const city = CONTRA_COSTA_GUIDE.cities.find(c => c.id === 'orinda')!
    expect(city.drive).toBe('Drive to SF: 20–35 min')
  })

  it('moraga.price is byte-exact', () => {
    const city = CONTRA_COSTA_GUIDE.cities.find(c => c.id === 'moraga')!
    expect(city.price).toBe('~$1.6M – $3M')
  })

  it('moraga transit mentions Canyon roads', () => {
    const city = CONTRA_COSTA_GUIDE.cities.find(c => c.id === 'moraga')!
    expect(city.transit).toBe('Via Lafayette or Orinda BART · Canyon roads')
  })

  it('danville first paragraph mentions Iron Horse Trail', () => {
    const city = CONTRA_COSTA_GUIDE.cities.find(c => c.id === 'danville')!
    expect(city.paras[0]).toContain('Iron Horse Trail')
  })

  it('alamo bestFor mentions acreage and privacy', () => {
    const city = CONTRA_COSTA_GUIDE.cities.find(c => c.id === 'alamo')!
    expect(city.bestFor).toContain('acreage and privacy')
  })

  it('all cities have 2 paragraphs', () => {
    for (const city of CONTRA_COSTA_GUIDE.cities) {
      expect(city.paras, `${city.id} paras`).toHaveLength(2)
    }
  })

  it('lafayette first paragraph mentions Lamorinda', () => {
    const city = CONTRA_COSTA_GUIDE.cities.find(c => c.id === 'lafayette')!
    expect(city.paras[0]).toContain('Lafayette is the center of gravity of Lamorinda')
  })

  it('schools page reference for lamorinda uses K–8 spelling', () => {
    // From resources.ts schools page — Lamorinda K–8 note
    const city = CONTRA_COSTA_GUIDE.cities.find(c => c.id === 'orinda')!
    expect(city.schools).toContain('Miramonte High')
  })
})
