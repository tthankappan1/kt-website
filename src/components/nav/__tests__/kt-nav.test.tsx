import { describe, expect, it } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { KTNav } from '@/components/nav/kt-nav'

describe('KTNav', () => {
  it('About link has href /#about when base="/"', () => {
    render(<KTNav base="/" />)
    const link = screen.getByRole('link', { name: 'About' })
    expect(link.getAttribute('href')).toBe('/#about')
  })

  it('Services link has href /#services when base="/"', () => {
    render(<KTNav base="/" />)
    const link = screen.getByRole('link', { name: 'Services' })
    expect(link.getAttribute('href')).toBe('/#services')
  })

  it('Testimonials link has href /#testimonials when base="/"', () => {
    render(<KTNav base="/" />)
    const link = screen.getByRole('link', { name: 'Testimonials' })
    expect(link.getAttribute('href')).toBe('/#testimonials')
  })

  it('Home Guide links to /home-guide', () => {
    render(<KTNav base="/" />)
    const link = screen.getByRole('link', { name: 'Home Guide' })
    expect(link.getAttribute('href')).toBe('/home-guide')
  })

  it('Contact button links to /contact', () => {
    render(<KTNav base="/" />)
    const link = screen.getByRole('link', { name: 'Contact' })
    expect(link.getAttribute('href')).toBe('/contact')
  })

  it('wordmark renders "Kalyani Thilak"', () => {
    render(<KTNav base="/" />)
    expect(screen.getByText('Kalyani Thilak')).toBeInTheDocument()
  })

  it('wordmark sub-line contains REALTOR® · TRI-VALLEY', () => {
    render(<KTNav base="/" />)
    // The sub-line may be rendered as a <span> inside the wordmark link
    const sub = screen.getByText(/REALTOR/i)
    expect(sub.textContent).toContain('REALTOR®')
    expect(sub.textContent).toContain('TRI-VALLEY')
  })

  it('Intero is present as text with class kt-nav-intero', () => {
    const { container } = render(<KTNav base="/" />)
    const el = container.querySelector('.kt-nav-intero')
    expect(el).toBeInTheDocument()
    expect(el?.textContent).toBe('Intero')
  })

  it('nav lacks scrolled class initially', () => {
    const { container } = render(<KTNav base="/" />)
    const nav = container.querySelector('nav.kt-nav')
    expect(nav?.classList.contains('scrolled')).toBe(false)
  })

  it('nav gains scrolled class after scroll past 40px', () => {
    const { container } = render(<KTNav base="/" />)
    const nav = container.querySelector('nav.kt-nav')
    Object.defineProperty(window, 'scrollY', { value: 50, configurable: true, writable: true })
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    expect(nav?.classList.contains('scrolled')).toBe(true)
  })

  it('anchor links use empty base on home page (base="")', () => {
    render(<KTNav base="" />)
    const aboutLink = screen.getByRole('link', { name: 'About' })
    expect(aboutLink.getAttribute('href')).toBe('#about')
  })
})
