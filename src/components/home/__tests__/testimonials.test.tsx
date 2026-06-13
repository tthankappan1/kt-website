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
    // Attribution row is a sibling <div> after the <blockquote>, not inside it
    const attribution = document.querySelector('[data-testid="testimonial-attribution"]')
    expect(attribution?.textContent).toContain('Buyer')
    expect(attribution?.textContent).toContain('Pleasanton')
  })

  it('quote paragraph has fontWeight 400', () => {
    vi.useFakeTimers()
    render(<KTTestimonials />)
    const quote = document.querySelector('blockquote p') as HTMLElement | null
    expect(quote?.style.fontWeight).toBe('400')
  })

  it('attribution row is a sibling div after blockquote, not nested inside it', () => {
    vi.useFakeTimers()
    render(<KTTestimonials />)
    const blockquote = document.querySelector('blockquote')
    // No footer element inside blockquote
    expect(blockquote?.querySelector('footer')).toBeNull()
    // Sibling attribution div exists
    const attribution = document.querySelector('[data-testid="testimonial-attribution"]')
    expect(attribution).not.toBeNull()
    expect(attribution?.parentElement?.contains(blockquote)).toBe(true)
  })

  it('dots container gap is 10px', () => {
    vi.useFakeTimers()
    render(<KTTestimonials />)
    const dotsContainer = document.querySelector('[data-testid="testimonial-dots"]') as HTMLElement | null
    expect(dotsContainer?.style.gap).toBe('10px')
  })

  it('dot buttons have transition background 0.3s', () => {
    vi.useFakeTimers()
    render(<KTTestimonials />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => {
      expect((btn as HTMLElement).style.transition).toBe('background 0.3s')
    })
  })

  it('eyebrow paragraph has both kt-eyebrow and on-dark classes', () => {
    vi.useFakeTimers()
    render(<KTTestimonials />)
    const eyebrow = document.querySelector('.kt-eyebrow')
    expect(eyebrow?.classList.contains('on-dark')).toBe(true)
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
