import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KTIntro } from '../intro'

vi.mock('@/lib/images', () => ({
  slotImageSrc: () => null,
}))

describe('KTIntro', () => {
  it('renders the heading with em home', () => {
    render(<KTIntro />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading.textContent).toContain('never just a transaction')
    const em = heading.querySelector('em')
    expect(em).toBeInTheDocument()
    expect(em?.textContent).toBe('home')
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

  it('renders the opening paragraph with key phrase (keeps all of us guessing)', () => {
    render(<KTIntro />)
    expect(screen.getByText(/keeps all of us guessing/)).toBeInTheDocument()
  })

  it('renders the career paragraph with key phrase (find their footing)', () => {
    render(<KTIntro />)
    expect(screen.getByText(/find their footing/)).toBeInTheDocument()
  })

  it('renders the approach paragraph with key phrase (patient, honest)', () => {
    render(<KTIntro />)
    expect(screen.getByText(/patient, honest/)).toBeInTheDocument()
  })

  it('renders the client review pull quote', () => {
    render(<KTIntro />)
    expect(screen.getByText(/without\s+any\s+pressure/)).toBeInTheDocument()
    expect(screen.getByText('Client review')).toBeInTheDocument()
  })
})
