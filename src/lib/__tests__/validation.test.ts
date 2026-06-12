import { describe, expect, it } from 'vitest'
import { LeadSchema, NewsletterSchema } from '@/lib/validation'

const validLead = {
  intent: 'selling',
  timeframe: 'Ready now',
  firstName: 'Asha',
  email: 'asha@example.com',
}

describe('LeadSchema (README §7 contract)', () => {
  it('accepts a minimal valid lead and fills defaults', () => {
    const r = LeadSchema.safeParse(validLead)
    expect(r.success).toBe(true)
    if (!r.success) return
    expect(r.data.newsletterAlameda).toBe(false)
    expect(r.data.newsletterContracosta).toBe(false)
    expect(r.data.message).toBe('')
    expect(r.data.website).toBe('')
  })

  it('enforces the §7 intent enum', () => {
    for (const intent of ['selling', 'buying', 'both', 'curious']) {
      expect(LeadSchema.safeParse({ ...validLead, intent }).success).toBe(true)
    }
    expect(LeadSchema.safeParse({ ...validLead, intent: 'Selling' }).success).toBe(false)
    expect(LeadSchema.safeParse({ ...validLead, intent: '' }).success).toBe(false)
  })

  it('requires firstName and a valid email', () => {
    expect(LeadSchema.safeParse({ ...validLead, firstName: '  ' }).success).toBe(false)
    expect(LeadSchema.safeParse({ ...validLead, email: 'not-an-email' }).success).toBe(false)
    expect(LeadSchema.safeParse({ ...validLead, email: undefined }).success).toBe(false)
  })

  it('trims whitespace on text fields', () => {
    const r = LeadSchema.safeParse({ ...validLead, firstName: '  Asha ', message: ' hi ' })
    expect(r.success).toBe(true)
    if (!r.success) return
    expect(r.data.firstName).toBe('Asha')
    expect(r.data.message).toBe('hi')
  })

  it('rejects when the honeypot carries any value', () => {
    expect(LeadSchema.safeParse({ ...validLead, website: 'http://spam' }).success).toBe(false)
  })

  it('allows timeframe to be absent or null (Just curious path)', () => {
    expect(LeadSchema.safeParse({ ...validLead, timeframe: undefined }).success).toBe(true)
    expect(LeadSchema.safeParse({ ...validLead, timeframe: null }).success).toBe(true)
  })

  it('caps field lengths defensively', () => {
    expect(LeadSchema.safeParse({ ...validLead, message: 'x'.repeat(4001) }).success).toBe(false)
    expect(LeadSchema.safeParse({ ...validLead, firstName: 'x'.repeat(81) }).success).toBe(false)
  })
})

describe('NewsletterSchema', () => {
  it('accepts a valid email', () => {
    const r = NewsletterSchema.safeParse({ email: 'reader@example.com', sourcePage: '/' })
    expect(r.success).toBe(true)
  })
  it('rejects invalid email and filled honeypot', () => {
    expect(NewsletterSchema.safeParse({ email: 'nope' }).success).toBe(false)
    expect(NewsletterSchema.safeParse({ email: 'a@b.co', website: 'x' }).success).toBe(false)
  })
})
