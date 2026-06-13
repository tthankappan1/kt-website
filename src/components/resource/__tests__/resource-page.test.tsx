import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/lib/images', () => ({
  slotImageSrc: () => null,
}))

vi.mock('@/components/nav/kt-nav', () => ({
  KTNav: ({ base }: { base?: string }) => <nav data-testid="kt-nav" data-base={base}>nav</nav>,
}))

vi.mock('@/components/close/kt-newsletter', () => ({
  KTNewsletter: () => <div data-testid="kt-newsletter">newsletter</div>,
}))

vi.mock('@/components/close/kt-footer', () => ({
  KTFooter: () => <footer data-testid="kt-footer">footer</footer>,
}))

const { ResourcePageView } = await import('../resource-page')

describe('ResourcePageView — selling', () => {
  it('hero eyebrow is "Client Resources"', () => {
    render(<ResourcePageView page="selling" />)
    expect(screen.getByText('Client Resources')).toBeInTheDocument()
  })

  it('hero h1 contains "Selling"', () => {
    const { container } = render(<ResourcePageView page="selling" />)
    const h1 = container.querySelector('h1.kt-display')
    expect(h1).toBeInTheDocument()
    expect(h1?.textContent).toContain('Selling')
  })

  it('renders a step with num "01"', () => {
    const { container } = render(<ResourcePageView page="selling" />)
    const stepNum = container.querySelector('.step-num')
    expect(stepNum).toBeInTheDocument()
    expect(stepNum?.textContent).toBe('01')
  })

  it('renders a kt-step element', () => {
    const { container } = render(<ResourcePageView page="selling" />)
    const step = container.querySelector('.kt-step')
    expect(step).toBeInTheDocument()
  })

  it('renders KTNav with base="/"', () => {
    render(<ResourcePageView page="selling" />)
    const nav = screen.getByTestId('kt-nav')
    expect(nav.getAttribute('data-base')).toBe('/')
  })

  it('renders KTNewsletter', () => {
    render(<ResourcePageView page="selling" />)
    expect(screen.getByTestId('kt-newsletter')).toBeInTheDocument()
  })

  it('renders KTFooter', () => {
    render(<ResourcePageView page="selling" />)
    expect(screen.getByTestId('kt-footer')).toBeInTheDocument()
  })
})

describe('ResourcePageView — cost-of-selling', () => {
  it('renders kt-row terms present', () => {
    const { container } = render(<ResourcePageView page="cost-of-selling" />)
    const rows = container.querySelectorAll('.kt-row')
    expect(rows.length).toBeGreaterThan(0)
    const rowTerm = container.querySelector('.row-term')
    expect(rowTerm).toBeInTheDocument()
    expect(rowTerm?.textContent).toBeTruthy()
  })

  it('renders kt-note italic present', () => {
    const { container } = render(<ResourcePageView page="cost-of-selling" />)
    const note = container.querySelector('.kt-note')
    expect(note).toBeInTheDocument()
    expect(note?.textContent).toBeTruthy()
  })

  it('hero title is "The Cost of Selling"', () => {
    const { container } = render(<ResourcePageView page="cost-of-selling" />)
    const h1 = container.querySelector('h1.kt-display')
    expect(h1?.textContent).toContain('The Cost of Selling')
  })
})

describe('ResourceSection alt striping', () => {
  it('section at index 1 has "alt" class', () => {
    // selling has 2 sections; index 1 should have 'alt'
    const { container } = render(<ResourcePageView page="selling" />)
    const sections = container.querySelectorAll('section.kt-city')
    expect(sections.length).toBeGreaterThanOrEqual(2)
    expect(sections[1].classList.contains('alt')).toBe(true)
  })

  it('section at index 0 does not have "alt" class', () => {
    const { container } = render(<ResourcePageView page="selling" />)
    const sections = container.querySelectorAll('section.kt-city')
    expect(sections[0].classList.contains('alt')).toBe(false)
  })
})
