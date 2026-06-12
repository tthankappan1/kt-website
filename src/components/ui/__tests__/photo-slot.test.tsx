import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PhotoSlot } from '@/components/ui/photo-slot'

// The manifest is mocked so this unit test never depends on the actual
// contents of public/images (photos are owner-swappable content, not code).
vi.mock('@/lib/images', () => ({
  slotImageSrc: (id: string) =>
    id === 'contact-portrait' ? '/images/contact-portrait.jpg' : null,
}))

describe('PhotoSlot (PHOTOS.md slot pipeline)', () => {
  it('renders an optimized image when the slot has a file', () => {
    render(<PhotoSlot id="contact-portrait" alt="Kalyani Thilak, REALTOR" />)
    const img = screen.getByRole('img', { name: 'Kalyani Thilak, REALTOR' })
    expect(img).toBeInTheDocument()
    expect(img.getAttribute('src')).toContain('contact-portrait')
  })

  it('renders a quiet brand frame (no drop-zone text) when the slot file is absent', () => {
    const { container } = render(<PhotoSlot id="hero-full-img" alt="Tri-Valley hills at dusk" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(container.textContent).toBe('')
    expect(container.querySelector('.kt-slot-empty')).toBeInTheDocument()
  })

  it('applies the prototype slot geometry (aspect ratio + asymmetric radius)', () => {
    const { container } = render(
      <PhotoSlot
        id="about-portrait"
        alt="Portrait of Kalyani"
        radius={24}
        style={{ width: '100%', maxWidth: '360px', height: '440px', display: 'block' }}
      />,
    )
    const slot = container.querySelector('.kt-slot') as HTMLElement
    expect(slot).toBeInTheDocument()
    expect(slot.style.borderTopLeftRadius).toBe('24px')
    expect(slot.style.maxWidth).toBe('360px')
  })
})
