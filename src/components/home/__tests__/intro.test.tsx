import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KTIntro } from '../intro'

vi.mock('@/lib/images', () => ({
  slotImageSrc: () => null,
}))

describe('KTIntro', () => {
  it('renders the heading with em Tri-Valley', () => {
    render(<KTIntro />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading.textContent).toContain('Tri-Valley')
    const em = heading.querySelector('em')
    expect(em).toBeInTheDocument()
    expect(em?.textContent).toBe('Tri-Valley')
  })

  it('renders Work with Kalyani link to /contact', () => {
    render(<KTIntro />)
    const link = screen.getByRole('link', { name: 'Work with Kalyani' })
    expect(link.getAttribute('href')).toBe('/contact')
  })

  it('renders the about-portrait photo slot', () => {
    const { container } = render(<KTIntro />)
    const slot = container.querySelector('[data-slot="about-portrait"]')
    expect(slot).toBeInTheDocument()
  })

  it('renders the first paragraph with key phrase (street by street)', () => {
    render(<KTIntro />)
    expect(screen.getByText(/street by street/)).toBeInTheDocument()
  })

  it('renders the second paragraph with key phrase (data-grounded)', () => {
    render(<KTIntro />)
    expect(screen.getByText(/data-grounded/)).toBeInTheDocument()
  })

  it('renders the third paragraph with key phrase (calm, informed)', () => {
    render(<KTIntro />)
    expect(screen.getByText(/calm, informed/)).toBeInTheDocument()
  })
})
