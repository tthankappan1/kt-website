import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock @/lib/images so PhotoSlot renders empty frames (no filesystem access)
vi.mock('@/lib/images', () => ({
  slotImageSrc: () => null,
  buildManifest: () => new Map(),
}))

import { KTSocialStrip } from '@/components/close/kt-social-strip'

describe('KTSocialStrip', () => {
  it('renders heading with "The Tri-Valley,"', () => {
    const { container } = render(<KTSocialStrip />)
    // h2 contains "The Tri-Valley,"
    const h2 = container.querySelector('h2')
    expect(h2).toBeInTheDocument()
    expect(h2!.textContent).toContain('The Tri-Valley,')
  })

  it('renders em element with text "weekly"', () => {
    render(<KTSocialStrip />)
    const em = screen.getByText('weekly')
    expect(em.tagName.toLowerCase()).toBe('em')
  })

  it('renders 4 photo slots with data-slot social-1 through social-4', () => {
    const { container } = render(<KTSocialStrip />)
    const slots = ['social-1', 'social-2', 'social-3', 'social-4']
    for (const slotId of slots) {
      const el = container.querySelector(`[data-slot="${slotId}"]`)
      expect(el).toBeInTheDocument()
    }
  })

  it('renders exactly 4 slot elements', () => {
    const { container } = render(<KTSocialStrip />)
    const allSlots = container.querySelectorAll('[data-slot^="social-"]')
    expect(allSlots).toHaveLength(4)
  })

  it('renders the "Follow along" eyebrow text', () => {
    render(<KTSocialStrip />)
    expect(screen.getByText('Follow along')).toBeInTheDocument()
  })

  it('renders body copy about what is actually selling', () => {
    const { container } = render(<KTSocialStrip />)
    expect(container.textContent).toContain('what is actually selling')
  })
})
