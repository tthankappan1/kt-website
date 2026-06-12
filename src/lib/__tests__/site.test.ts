import { describe, expect, it } from 'vitest'
import {
  CLIENT_RESOURCES,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  DRE,
  KT_SOCIALS,
  SITE_URL,
} from '@/lib/site'

// Deliberate change-detector tests: these values are LOCKED decisions from
// PROJECT-STATUS.md. A failure here means "renegotiate the spec with the
// owner", not "update the test to match the code".
describe('site constants (PROJECT-STATUS locked decisions)', () => {
  it('has the 9 Client Resources items in locked order with production routes', () => {
    expect(CLIENT_RESOURCES.map((r) => r.label)).toEqual([
      'Selling',
      'Buying',
      'Cost of Selling',
      'Intero Concierge',
      'Alameda County Neighborhoods',
      'Contra Costa County Neighborhoods',
      'Schools in Alameda & Contra Costa',
      'Market Updates',
      "Buyer's Guide",
    ])
    expect(CLIENT_RESOURCES.map((r) => r.href)).toEqual([
      '/resources/selling',
      '/resources/buying',
      '/resources/cost-of-selling',
      '/resources/intero-concierge',
      '/neighborhoods/alameda-county',
      '/neighborhoods/contra-costa-county',
      '/resources/schools',
      '/resources/market-updates',
      '/resources/buyers-guide',
    ])
    for (const r of CLIENT_RESOURCES) expect(r.href).not.toContain('.html')
  })

  it('has the 3 real social profiles with svg path data', () => {
    expect(KT_SOCIALS).toHaveLength(3)
    expect(KT_SOCIALS.map((s) => s.slug)).toEqual(['facebook', 'linkedin', 'instagram'])
    expect(KT_SOCIALS[0].href).toBe('https://www.facebook.com/profile.php?id=100076622906268')
    expect(KT_SOCIALS[1].href).toBe('https://www.linkedin.com/in/kalyanithilak')
    expect(KT_SOCIALS[2].href).toBe('https://www.instagram.com/kalyani_thilak_intero/')
    for (const s of KT_SOCIALS) {
      expect(s.href).toMatch(/^https:\/\//)
      expect(s.d.length).toBeGreaterThan(20)
    }
  })

  it('carries the locked contact identity', () => {
    expect(CONTACT_EMAIL).toBe('kthilak@intero.com')
    expect(CONTACT_PHONE_DISPLAY).toBe('(408) 597-7371')
    expect(CONTACT_PHONE_TEL).toBe('+14085977371')
    expect(DRE).toBe('02254890')
    expect(SITE_URL).toBe('https://kalyanithilak.com')
  })
})
