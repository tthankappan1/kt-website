import { describe, expect, it } from 'vitest'
import { ktFormatDate, ktMonthLabel, ktMonthName, ktShortDate } from '@/lib/dates'

describe('date helpers (ported from prototype kt-blog-data.jsx)', () => {
  it('ktFormatDate renders full date', () => {
    expect(ktFormatDate('2026-05-29')).toBe('May 29, 2026')
    expect(ktFormatDate('2025-12-09')).toBe('December 9, 2025')
  })

  it('ktShortDate renders 3-letter month + day', () => {
    expect(ktShortDate('2026-05-29')).toBe('May 29')
    expect(ktShortDate('2026-02-10')).toBe('Feb 10')
  })

  it('ktMonthLabel renders month + year', () => {
    expect(ktMonthLabel('2026-05-29')).toBe('May 2026')
  })

  it('ktMonthName renders month from YYYY-MM key', () => {
    expect(ktMonthName('2026-05')).toBe('May')
    expect(ktMonthName('2025-12')).toBe('December')
  })

  it('is timezone-independent (pure string parsing — no Date object)', () => {
    // Jan 1 must never shift to Dec 31 regardless of local TZ
    expect(ktFormatDate('2026-01-01')).toBe('January 1, 2026')
  })
})
