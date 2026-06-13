import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ResourcesDrop } from '@/components/nav/resources-drop'
import { CLIENT_RESOURCES } from '@/lib/site'

describe('ResourcesDrop', () => {
  it('is closed by default — no open class on wrapper', () => {
    const { container } = render(<ResourcesDrop />)
    const wrapper = container.querySelector('.kt-navdrop')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper?.classList.contains('open')).toBe(false)
  })

  it('click on trigger opens the dropdown (open class + aria-expanded true)', () => {
    const { container } = render(<ResourcesDrop />)
    const trigger = screen.getByRole('link', { name: /client resources/i })
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(trigger)
    const wrapper = container.querySelector('.kt-navdrop')
    expect(wrapper?.classList.contains('open')).toBe(true)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
  })

  it('renders all 9 CLIENT_RESOURCES labels', () => {
    render(<ResourcesDrop />)
    for (const item of CLIENT_RESOURCES) {
      expect(screen.getByText(item.label)).toBeInTheDocument()
    }
  })

  it('renders all 9 CLIENT_RESOURCES with correct hrefs', () => {
    render(<ResourcesDrop />)
    for (const item of CLIENT_RESOURCES) {
      const link = screen.getByText(item.label).closest('a')
      expect(link?.getAttribute('href')).toBe(item.href)
    }
  })

  it('Escape key closes the dropdown', () => {
    const { container } = render(<ResourcesDrop />)
    const trigger = screen.getByRole('link', { name: /client resources/i })
    fireEvent.click(trigger)
    expect(container.querySelector('.kt-navdrop')?.classList.contains('open')).toBe(true)
    fireEvent.keyDown(trigger, { key: 'Escape', code: 'Escape' })
    expect(container.querySelector('.kt-navdrop')?.classList.contains('open')).toBe(false)
  })

  it('mouseEnter opens the dropdown', () => {
    const { container } = render(<ResourcesDrop />)
    const wrapper = container.querySelector('.kt-navdrop')!
    fireEvent.mouseEnter(wrapper)
    expect(wrapper.classList.contains('open')).toBe(true)
  })

  it('mouseLeave closes the dropdown', () => {
    const { container } = render(<ResourcesDrop />)
    const wrapper = container.querySelector('.kt-navdrop')!
    fireEvent.mouseEnter(wrapper)
    expect(wrapper.classList.contains('open')).toBe(true)
    fireEvent.mouseLeave(wrapper)
    expect(wrapper.classList.contains('open')).toBe(false)
  })
})
