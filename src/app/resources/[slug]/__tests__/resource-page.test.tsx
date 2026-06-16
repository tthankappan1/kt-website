import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { notFound } from 'next/navigation'

vi.mock('next/navigation', () => ({ notFound: vi.fn(() => { throw new Error('NOT_FOUND') }) }))

vi.mock('@/lib/images', () => ({ slotImageSrc: () => null }))

vi.mock('@/components/nav/kt-nav', () => ({
  KTNav: ({ base }: { base?: string }) => <nav data-testid="kt-nav" data-base={base}>nav</nav>,
}))

vi.mock('@/components/close/kt-newsletter', () => ({
  KTNewsletter: () => <div data-testid="kt-newsletter">newsletter</div>,
}))

vi.mock('@/components/close/kt-footer', () => ({
  KTFooter: () => <footer data-testid="kt-footer">footer</footer>,
}))

const { default: ResourcePage, generateStaticParams } = await import('../page')

describe('ResourcePage generateStaticParams', () => {
  it('returns exactly 7 slugs', async () => {
    const params = await generateStaticParams()
    expect(params).toHaveLength(7)
  })

  it('includes all 7 expected slugs', async () => {
    const params = await generateStaticParams()
    const slugs = params.map((p: { slug: string }) => p.slug).sort()
    expect(slugs).toEqual([
      'buyers-guide',
      'buying',
      'cost-of-selling',
      'intero-concierge',
      'market-updates',
      'schools',
      'selling',
    ])
  })
})

describe('ResourcePage — selling', () => {
  it('renders KTNav with base="/"', async () => {
    const page = await ResourcePage({ params: Promise.resolve({ slug: 'selling' }) })
    render(page)
    expect(screen.getByTestId('kt-nav').getAttribute('data-base')).toBe('/')
  })

  it('renders eyebrow "Client Resources"', async () => {
    const page = await ResourcePage({ params: Promise.resolve({ slug: 'selling' }) })
    render(page)
    expect(screen.getByText('Client Resources')).toBeInTheDocument()
  })

  it('renders h1 with the page title', async () => {
    const page = await ResourcePage({ params: Promise.resolve({ slug: 'selling' }) })
    const { container } = render(page)
    const h1 = container.querySelector('h1.kt-display')
    expect(h1?.textContent).toBe('Selling')
  })

  it('renders the sub text', async () => {
    const page = await ResourcePage({ params: Promise.resolve({ slug: 'selling' }) })
    render(page)
    expect(screen.getByText('A calm, numbers-first approach to selling your East Bay home.')).toBeInTheDocument()
  })

  it('renders "The process" heading', async () => {
    const page = await ResourcePage({ params: Promise.resolve({ slug: 'selling' }) })
    render(page)
    expect(screen.getByRole('heading', { level: 2, name: 'The process' })).toBeInTheDocument()
  })

  it('renders 5 steps with step-num spans', async () => {
    const page = await ResourcePage({ params: Promise.resolve({ slug: 'selling' }) })
    const { container } = render(page)
    const stepNums = container.querySelectorAll('.step-num')
    expect(stepNums).toHaveLength(5)
    expect(stepNums[0].textContent).toBe('01')
    expect(stepNums[4].textContent).toBe('05')
  })

  it('renders newsletter and footer', async () => {
    const page = await ResourcePage({ params: Promise.resolve({ slug: 'selling' }) })
    render(page)
    expect(screen.getByTestId('kt-newsletter')).toBeInTheDocument()
    expect(screen.getByTestId('kt-footer')).toBeInTheDocument()
  })
})

describe('ResourcePage — cost-of-selling', () => {
  it('renders rows with row-term spans', async () => {
    const page = await ResourcePage({ params: Promise.resolve({ slug: 'cost-of-selling' }) })
    const { container } = render(page)
    const terms = container.querySelectorAll('.row-term')
    expect(terms.length).toBeGreaterThanOrEqual(6)
    expect(terms[0].textContent).toBe('Preparation & staging')
    expect(terms[5].textContent).toBe('Agent compensation')
  })

  it('does not render placeholder note text', async () => {
    const page = await ResourcePage({ params: Promise.resolve({ slug: 'cost-of-selling' }) })
    render(page)
    expect(screen.queryByText(/Placeholder copy/)).not.toBeInTheDocument()
  })
})

describe('ResourcePage — notFound on unknown slug', () => {
  it('calls notFound() for an unknown slug', async () => {
    await expect(
      ResourcePage({ params: Promise.resolve({ slug: 'does-not-exist' }) })
    ).rejects.toThrow('NOT_FOUND')
    expect(notFound).toHaveBeenCalled()
  })
})
