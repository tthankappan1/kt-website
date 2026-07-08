import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import type { ChartSpec } from '@/content/posts/types'

const { PostChart } = await import('../post-chart')

const ratioDonut: ChartSpec = {
  kind: 'donut',
  title: 'One in Three',
  source: 'NAR',
  note: 'A third bought anyway.',
  unit: '%',
  slices: [
    { label: 'With student debt', value: 33 },
    { label: 'Without student debt', value: 67 },
  ],
}

describe('PostChart — donut', () => {
  it('renders the figure chrome: title, note, source', () => {
    const { container } = render(<PostChart chart={ratioDonut} />)
    expect(container.querySelector('.fig-title')?.textContent).toBe('One in Three')
    expect(container.querySelector('.fig-note')?.textContent).toBe('A third bought anyway.')
    expect(container.querySelector('.fig-src')?.textContent).toContain('NAR')
  })

  it('names every slice and value in the svg aria-label', () => {
    const { container } = render(<PostChart chart={ratioDonut} />)
    const svg = container.querySelector('svg[role="img"]')
    expect(svg?.getAttribute('aria-label')).toContain('With student debt: 33%')
    expect(svg?.getAttribute('aria-label')).toContain('Without student debt: 67%')
  })

  it('a two-slice donut is a ratio: the first slice share sits in the center', () => {
    const { container } = render(<PostChart chart={ratioDonut} />)
    expect(container.querySelector('.donut-hero')?.textContent).toBe('33%')
  })

  it('legend rows carry both label and value as text (never color alone)', () => {
    const { container } = render(<PostChart chart={ratioDonut} />)
    const legendText = Array.from(container.querySelectorAll('svg text')).map(t => t.textContent).join(' ')
    expect(legendText).toContain('With student debt')
    expect(legendText).toContain('Without student debt')
    expect(legendText).toContain('67%')
  })

  it('a three-plus-slice donut is categorical: no center hero, one path per slice', () => {
    const spec: ChartSpec = {
      kind: 'donut',
      title: 'Mix',
      unit: '%',
      slices: [
        { label: 'A', value: 50 },
        { label: 'B', value: 30 },
        { label: 'C', value: 20 },
      ],
    }
    const { container } = render(<PostChart chart={spec} />)
    expect(container.querySelector('.donut-hero')).toBeNull()
    expect(container.querySelectorAll('path.donut-slice')).toHaveLength(3)
  })

  it('ships the screen-reader table twin with one row per slice', () => {
    const { container } = render(<PostChart chart={ratioDonut} />)
    const rows = container.querySelectorAll('.kt-visually-hidden table tbody tr')
    expect(rows).toHaveLength(2)
    expect(rows[0].textContent).toContain('With student debt')
    expect(rows[0].textContent).toContain('33%')
  })

  it('a zero-value slice keeps its legend row but draws no mark', () => {
    const spec: ChartSpec = {
      kind: 'donut',
      title: 'Edge',
      slices: [
        { label: 'All of it', value: 10 },
        { label: 'None of it', value: 0 },
      ],
    }
    const { container, getAllByText } = render(<PostChart chart={spec} />)
    expect(container.querySelectorAll('path.donut-slice')).toHaveLength(1)
    expect(getAllByText(/None of it/).length).toBeGreaterThan(0)
  })
})
