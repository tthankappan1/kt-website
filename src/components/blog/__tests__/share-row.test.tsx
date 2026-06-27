import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { SITE_URL } from '@/lib/site'

// Mock navigator.clipboard
const writeTextMock = vi.fn()
Object.defineProperty(globalThis.navigator, 'clipboard', {
  value: { writeText: writeTextMock },
  configurable: true,
  writable: true,
})

const { ShareRow } = await import('../share-row')

const TEST_SLUG = 'test-slug-123'
const TEST_TITLE = 'Test Post Title'
const TEST_URL = SITE_URL + '/newsletter/' + TEST_SLUG

describe('ShareRow', () => {
  beforeEach(() => {
    writeTextMock.mockResolvedValue(undefined)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('renders "Share this issue" eyebrow', () => {
    render(<ShareRow slug={TEST_SLUG} title={TEST_TITLE} />)
    expect(screen.getByText('Share this issue')).toBeInTheDocument()
  })

  it('Facebook share link has correct encoded href', () => {
    render(<ShareRow slug={TEST_SLUG} title={TEST_TITLE} />)
    const link = screen.getByRole('link', { name: /Facebook/i })
    expect(link.getAttribute('href')).toBe(
      'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(TEST_URL)
    )
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noreferrer')
  })

  it('LinkedIn share link has correct encoded href', () => {
    render(<ShareRow slug={TEST_SLUG} title={TEST_TITLE} />)
    const link = screen.getByRole('link', { name: /LinkedIn/i })
    expect(link.getAttribute('href')).toBe(
      'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(TEST_URL)
    )
  })

  it('X (Twitter) share link has correct encoded href', () => {
    render(<ShareRow slug={TEST_SLUG} title={TEST_TITLE} />)
    const link = screen.getByRole('link', { name: /Share on X/i })
    expect(link.getAttribute('href')).toBe(
      'https://twitter.com/intent/tweet?text=' + encodeURIComponent(TEST_TITLE) + '&url=' + encodeURIComponent(TEST_URL)
    )
  })

  it('WhatsApp share link has correct encoded href', () => {
    render(<ShareRow slug={TEST_SLUG} title={TEST_TITLE} />)
    const link = screen.getByRole('link', { name: /WhatsApp/i })
    expect(link.getAttribute('href')).toBe(
      'https://wa.me/?text=' + encodeURIComponent(TEST_TITLE + ' — ' + TEST_URL)
    )
  })

  it('Email share link has correct encoded href', () => {
    render(<ShareRow slug={TEST_SLUG} title={TEST_TITLE} />)
    const link = screen.getByRole('link', { name: /email/i })
    expect(link.getAttribute('href')).toBe(
      'mailto:?subject=' + encodeURIComponent(TEST_TITLE) + '&body=' + encodeURIComponent(TEST_URL)
    )
  })

  it('copy button clicks calls navigator.clipboard.writeText with SITE_URL path', async () => {
    render(<ShareRow slug={TEST_SLUG} title={TEST_TITLE} />)
    const btn = screen.getByRole('button', { name: /Copy link/i })
    await act(async () => {
      fireEvent.click(btn)
      await Promise.resolve()
    })
    expect(writeTextMock).toHaveBeenCalledWith(TEST_URL)
  })

  it('copy button shows "Copied" after click and reverts after 2200ms', async () => {
    render(<ShareRow slug={TEST_SLUG} title={TEST_TITLE} />)
    const btn = screen.getByRole('button', { name: /Copy link/i })

    await act(async () => {
      fireEvent.click(btn)
      await Promise.resolve()
    })

    // Should show "Copied"
    expect(screen.getByText('Copied')).toBeInTheDocument()
    expect(btn.className).toContain('copied')

    // Advance timers past 2200ms
    await act(async () => {
      vi.advanceTimersByTime(2200)
    })

    // Should revert to "Copy link"
    expect(screen.getByText('Copy link')).toBeInTheDocument()
    expect(btn.className).not.toContain('copied')
  })

  it('copy button aria-label is "Copy link" initially and flips to "Link copied" after click', async () => {
    render(<ShareRow slug={TEST_SLUG} title={TEST_TITLE} />)
    const btn = screen.getByRole('button', { name: 'Copy link' })
    expect(btn.getAttribute('aria-label')).toBe('Copy link')

    await act(async () => {
      fireEvent.click(btn)
      await Promise.resolve()
    })

    expect(btn.getAttribute('aria-label')).toBe('Link copied')

    // Reverts after the 2200ms timeout
    await act(async () => {
      vi.advanceTimersByTime(2200)
    })
    expect(btn.getAttribute('aria-label')).toBe('Copy link')
  })
})
