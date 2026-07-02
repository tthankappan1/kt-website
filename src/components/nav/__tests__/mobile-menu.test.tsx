import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MobileMenu } from '@/components/nav/mobile-menu'
import { CLIENT_RESOURCES } from '@/lib/site'

describe('MobileMenu', () => {
  it('renders primary links with base-prefixed anchors (base="/")', () => {
    render(<MobileMenu base="/" onClose={() => {}} />)
    expect(screen.getByRole('link', { name: 'About' }).getAttribute('href')).toBe('/#about')
    expect(screen.getByRole('link', { name: 'Services' }).getAttribute('href')).toBe('/#services')
    expect(screen.getByRole('link', { name: 'Testimonials' }).getAttribute('href')).toBe('/#testimonials')
    expect(screen.getByRole('link', { name: 'Newsletter' }).getAttribute('href')).toBe('/newsletter')
    expect(screen.getByRole('link', { name: 'Contact' }).getAttribute('href')).toBe('/contact')
  })

  it('uses bare anchors on the home page (base="")', () => {
    render(<MobileMenu base="" onClose={() => {}} />)
    expect(screen.getByRole('link', { name: 'About' }).getAttribute('href')).toBe('#about')
  })

  it('Client Resources group is collapsed initially and expands with all 9 items', () => {
    render(<MobileMenu onClose={() => {}} />)
    const groupBtn = screen.getByRole('button', { name: /client resources/i })
    expect(groupBtn.getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByRole('link', { name: "Buyer's Guide" })).not.toBeInTheDocument()
    fireEvent.click(groupBtn)
    expect(groupBtn.getAttribute('aria-expanded')).toBe('true')
    for (const item of CLIENT_RESOURCES) {
      expect(screen.getByRole('link', { name: item.label }).getAttribute('href')).toBe(item.href)
    }
  })

  it('calls onClose when a link is clicked', () => {
    const onClose = vi.fn()
    render(<MobileMenu base="/" onClose={onClose} />)
    fireEvent.click(screen.getByRole('link', { name: 'About' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose on Escape', () => {
    const onClose = vi.fn()
    render(<MobileMenu base="/" onClose={onClose} />)
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('locks body scroll while mounted and restores on unmount', () => {
    const { unmount } = render(<MobileMenu onClose={() => {}} />)
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('focuses the close button on mount', () => {
    render(<MobileMenu onClose={() => {}} />)
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close menu' }))
  })

  it('is a labelled modal dialog with the INTERO lockup and no emoji', () => {
    const { container } = render(<MobileMenu onClose={() => {}} />)
    const dialog = screen.getByRole('dialog', { name: 'Menu' })
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(dialog.id).toBe('kt-mobile-menu')
    const intero = container.querySelector('.kt-mm-intero')
    expect(intero?.textContent).toBe('Intero')
    expect(container.textContent).not.toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u)
  })

  it('traps Tab focus inside the panel', () => {
    render(<MobileMenu base="/" onClose={() => {}} />)
    const dialog = screen.getByRole('dialog')
    const focusables = dialog.querySelectorAll<HTMLElement>('a[href], button')
    const last = focusables[focusables.length - 1]
    last.focus()
    fireEvent.keyDown(dialog, { key: 'Tab' })
    expect(document.activeElement).toBe(focusables[0])
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(last)
  })
})
