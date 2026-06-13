import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NavSocial } from '@/components/nav/nav-social'

describe('NavSocial', () => {
  it('renders exactly 3 social links', () => {
    render(<NavSocial />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(3)
  })

  it('Facebook link has correct href, target, rel, aria-label, and class', () => {
    render(<NavSocial />)
    const link = screen.getByRole('link', { name: 'Facebook' })
    expect(link).toBeInTheDocument()
    expect(link.getAttribute('href')).toBe('https://www.facebook.com/profile.php?id=100076622906268')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noreferrer')
    expect(link.classList.contains('kt-soc')).toBe(true)
    expect(link.classList.contains('soc-facebook')).toBe(true)
  })

  it('LinkedIn link has correct href, target, rel, aria-label, and class', () => {
    render(<NavSocial />)
    const link = screen.getByRole('link', { name: 'LinkedIn' })
    expect(link).toBeInTheDocument()
    expect(link.getAttribute('href')).toBe('https://www.linkedin.com/in/kalyanithilak')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noreferrer')
    expect(link.classList.contains('kt-soc')).toBe(true)
    expect(link.classList.contains('soc-linkedin')).toBe(true)
  })

  it('Instagram link has correct href, target, rel, aria-label, and class', () => {
    render(<NavSocial />)
    const link = screen.getByRole('link', { name: 'Instagram' })
    expect(link).toBeInTheDocument()
    expect(link.getAttribute('href')).toBe('https://www.instagram.com/kalyani_thilak_intero/')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noreferrer')
    expect(link.classList.contains('kt-soc')).toBe(true)
    expect(link.classList.contains('soc-instagram')).toBe(true)
  })

  it('each link contains an svg with a path element', () => {
    const { container } = render(<NavSocial />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs).toHaveLength(3)
    svgs.forEach((svg) => {
      expect(svg.querySelector('path')).toBeInTheDocument()
    })
  })

  it('wrapper has class kt-nav-social', () => {
    const { container } = render(<NavSocial />)
    expect(container.querySelector('.kt-nav-social')).toBeInTheDocument()
  })
})
