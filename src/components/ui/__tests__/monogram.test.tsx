import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Monogram } from '@/components/ui/monogram'

describe('Monogram', () => {
  it('renders the K span', () => {
    const { container } = render(<Monogram />)
    const spans = container.querySelectorAll('span')
    const texts = Array.from(spans).map((s) => s.textContent)
    expect(texts).toContain('K')
  })

  it('renders the T span with class mg-t', () => {
    const { container } = render(<Monogram />)
    const tSpan = container.querySelector('span.mg-t')
    expect(tSpan).toBeInTheDocument()
    expect(tSpan?.textContent).toBe('T')
  })

  it('wrapper has class kt-monogram and aria-hidden true', () => {
    const { container } = render(<Monogram />)
    const wrapper = container.querySelector('.kt-monogram')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper?.getAttribute('aria-hidden')).toBe('true')
  })
})
