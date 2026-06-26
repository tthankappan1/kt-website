import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { PostBlock } from '@/content/posts/types'

const { PostBody } = await import('../post-body')

describe('PostBody', () => {
  it('renders string block as <p> with inline text', () => {
    const body: PostBlock[] = ['Hello *world* text']
    const { container } = render(<PostBody body={body} />)
    const p = container.querySelector('p')
    expect(p).toBeInTheDocument()
    expect(p?.textContent).toBe('Hello world text')
    // em rendered inside p
    expect(container.querySelector('p em')).toBeInTheDocument()
  })

  it('renders {h} block as <h2>', () => {
    const body: PostBlock[] = [{ h: 'Section *Title*' }]
    const { container } = render(<PostBody body={body} />)
    const h2 = container.querySelector('h2')
    expect(h2).toBeInTheDocument()
    expect(h2?.textContent).toBe('Section Title')
    // em has kt-em class
    const em = h2?.querySelector('em.kt-em')
    expect(em).toBeInTheDocument()
    expect(em?.textContent).toBe('Title')
  })

  it('renders {list} block as ul.kt-list with one li per item and inline markup', () => {
    const body: PostBlock[] = [{ list: ['First **bold** item', 'Second item'] }]
    const { container } = render(<PostBody body={body} />)
    const ul = container.querySelector('ul.kt-list')
    expect(ul).toBeInTheDocument()
    const items = ul?.querySelectorAll('li')
    expect(items?.length).toBe(2)
    expect(items?.[0].textContent).toBe('First bold item')
    // **bold** rendered as <strong> inside the li
    expect(items?.[0].querySelector('strong')?.textContent).toBe('bold')
    expect(items?.[1].textContent).toBe('Second item')
  })

  it('renders {cta} block as div.kt-cta', () => {
    const body: PostBlock[] = [{ cta: 'Call me today.' }]
    const { container } = render(<PostBody body={body} />)
    const div = container.querySelector('div.kt-cta')
    expect(div).toBeInTheDocument()
    expect(div?.textContent).toBe('Call me today.')
  })

  it('renders {disclaimer} block as p.kt-disclaimer', () => {
    const body: PostBlock[] = [{ disclaimer: 'Not financial advice.' }]
    const { container } = render(<PostBody body={body} />)
    const p = container.querySelector('p.kt-disclaimer')
    expect(p).toBeInTheDocument()
    expect(p?.textContent).toBe('Not financial advice.')
  })

  it('renders {sources} block with src-label and entries joined by · separator', () => {
    const body: PostBlock[] = [
      {
        sources: [
          { t: 'Redfin', href: 'https://www.redfin.com' },
          { t: 'Zillow', href: 'https://www.zillow.com' },
          { t: 'MLS', href: 'https://www.mls.com' },
        ],
      },
    ]
    const { container } = render(<PostBody body={body} />)
    const div = container.querySelector('div.kt-sources')
    expect(div).toBeInTheDocument()
    // src-label
    const label = div?.querySelector('span.src-label')
    expect(label?.textContent).toBe('Sources')
    // links
    const links = div?.querySelectorAll('a')
    expect(links?.length).toBe(3)
    expect(links?.[0].getAttribute('href')).toBe('https://www.redfin.com')
    expect(links?.[0].getAttribute('target')).toBe('_blank')
    expect(links?.[0].getAttribute('rel')).toBe('noreferrer')
    expect(links?.[1].getAttribute('href')).toBe('https://www.zillow.com')
    // separator character · (U+00B7) between entries
    expect(div?.textContent).toContain('·')
  })

  it('renders all block types together', () => {
    const body: PostBlock[] = [
      'paragraph text',
      { h: 'A heading' },
      { list: ['List item one'] },
      { cta: 'Click here' },
      { disclaimer: 'Disclaimer text' },
      { sources: [{ t: 'Source A', href: 'https://example.com' }] },
    ]
    render(<PostBody body={body} />)
    expect(screen.getByText('paragraph text')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    expect(screen.getByText('List item one')).toBeInTheDocument()
    expect(screen.getByText('Click here')).toBeInTheDocument()
    expect(screen.getByText('Disclaimer text')).toBeInTheDocument()
    expect(screen.getByText('Source A')).toBeInTheDocument()
  })
})
