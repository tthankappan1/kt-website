import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KTFooter } from '@/components/close/kt-footer'

describe('KTFooter', () => {
  it('compliance block contains DRE 02254890', () => {
    const { container } = render(<KTFooter />)
    expect(container.textContent).toContain('DRE 02254890')
  })

  it('compliance block contains Intero Real Estate Services', () => {
    const { container } = render(<KTFooter />)
    expect(container.textContent).toContain('Intero Real Estate Services')
  })

  it('compliance block contains A Berkshire Hathaway Affiliate', () => {
    const { container } = render(<KTFooter />)
    expect(container.textContent).toContain('A Berkshire Hathaway Affiliate')
  })

  it('compliance block contains exact footer address line', () => {
    const { container } = render(<KTFooter />)
    expect(container.textContent).toContain('187 S J Street · Livermore · California')
  })

  it('contact column has mailto:kthilak@intero.com href', () => {
    render(<KTFooter />)
    const emailLink = screen.getByRole('link', { name: 'kthilak@intero.com' })
    expect(emailLink.getAttribute('href')).toBe('mailto:kthilak@intero.com')
  })

  it('contact column has tel:+14085977371 href', () => {
    render(<KTFooter />)
    const phoneLink = screen.getByRole('link', { name: '(408) 597-7371' })
    expect(phoneLink.getAttribute('href')).toBe('tel:+14085977371')
  })

  it('NavSocial renders 3 social links', () => {
    render(<KTFooter />)
    // Social links are external so they have target="_blank"
    const allLinks = screen.getAllByRole('link')
    const socialLinks = allLinks.filter(
      (l) => l.getAttribute('target') === '_blank' && l.getAttribute('rel') === 'noreferrer',
    )
    expect(socialLinks).toHaveLength(3)
  })

  it('copyright caption contains © 2026', () => {
    const { container } = render(<KTFooter />)
    expect(container.textContent).toContain('© 2026 Kalyani Thilak')
  })

  it('disclaimer paragraph is present', () => {
    const { container } = render(<KTFooter />)
    expect(container.textContent).toContain(
      'Kalyani Thilak is a real estate salesperson licensed by the state of California',
    )
  })

  it('renders a footer element with id="contact"', () => {
    const { container } = render(<KTFooter />)
    const footer = container.querySelector('footer#contact')
    expect(footer).toBeInTheDocument()
  })
})
