import { describe, expect, it, vi, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import { KTTestimonials } from '../testimonials'

vi.mock('@/lib/images', () => ({
  slotImageSrc: () => null,
}))

describe('KTTestimonials', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the first quote visible initially', () => {
    vi.useFakeTimers()
    render(<KTTestimonials />)
    expect(screen.getByText(/comparable sale/)).toBeInTheDocument()
  })

  it('advances to the second quote after 7000ms', () => {
    vi.useFakeTimers()
    render(<KTTestimonials />)
    act(() => {
      vi.advanceTimersByTime(7000)
    })
    expect(screen.getByText(/actually worth/)).toBeInTheDocument()
  })

  it('jumps to third quote when dot 3 is clicked', () => {
    vi.useFakeTimers()
    render(<KTTestimonials />)
    const dot3 = screen.getByRole('button', { name: 'Quote 3' })
    act(() => {
      fireEvent.click(dot3)
    })
    expect(screen.getByText(/two steps ahead/)).toBeInTheDocument()
  })

  it('renders attribution text for first quote', () => {
    vi.useFakeTimers()
    render(<KTTestimonials />)
    // The footer renders as "Buyer · Pleasanton" via &middot; — check with textContent
    const footer = document.querySelector('blockquote footer')
    expect(footer?.textContent).toContain('Buyer')
    expect(footer?.textContent).toContain('Pleasanton')
  })

  it('clears interval on unmount (no act warnings)', () => {
    vi.useFakeTimers()
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')
    const { unmount } = render(<KTTestimonials />)
    act(() => {
      unmount()
    })
    expect(clearIntervalSpy).toHaveBeenCalled()
    clearIntervalSpy.mockRestore()
  })
})
