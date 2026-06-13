import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KTServices } from '../services'

vi.mock('@/lib/images', () => ({
  slotImageSrc: () => null,
}))

describe('KTServices', () => {
  it('renders 3 service cards', () => {
    const { container } = render(<KTServices />)
    const cards = container.querySelectorAll('.kt-card')
    expect(cards).toHaveLength(3)
  })

  it('renders card numbers 01, 02, 03', () => {
    render(<KTServices />)
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.getByText('03')).toBeInTheDocument()
  })

  it('renders service titles', () => {
    render(<KTServices />)
    expect(screen.getByText('Buying')).toBeInTheDocument()
    expect(screen.getByText('Selling')).toBeInTheDocument()
    expect(screen.getByText('Market guidance')).toBeInTheDocument()
  })

  it('renders Learn more links with correct hrefs', () => {
    render(<KTServices />)
    const links = screen.getAllByText(/Learn more/)
    const hrefs = links.map((l) => l.closest('a')?.getAttribute('href'))
    expect(hrefs).toContain('/resources/buying')
    expect(hrefs).toContain('/resources/selling')
    expect(hrefs).toContain('/resources/market-updates')
  })
})
