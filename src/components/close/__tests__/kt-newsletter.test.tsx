import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { KTNewsletter } from '@/components/close/kt-newsletter'

describe('KTNewsletter', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('invalid email shows exact error copy and does NOT call fetch', () => {
    render(<KTNewsletter />)
    const input = screen.getByLabelText('Email address')
    fireEvent.change(input, { target: { value: 'notanemail' } })
    fireEvent.submit(input.closest('form')!)
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('valid email POSTs to /api/newsletter with email, sourcePage, website then shows done state', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    })
    vi.stubGlobal('fetch', mockFetch)

    render(<KTNewsletter />)
    const input = screen.getByLabelText('Email address')
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.submit(input.closest('form')!)

    await waitFor(() => {
      expect(screen.getByText('You are on the list. Welcome.')).toBeInTheDocument()
    })

    expect(mockFetch).toHaveBeenCalledOnce()
    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toBe('/api/newsletter')
    expect(options.method).toBe('POST')
    const body = JSON.parse(options.body)
    expect(body.email).toBe('test@example.com')
    expect('sourcePage' in body).toBe(true)
    expect('website' in body).toBe(true)
  })

  it('failed fetch (ok: false) shows error and keeps form', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    })
    vi.stubGlobal('fetch', mockFetch)

    render(<KTNewsletter />)
    const input = screen.getByLabelText('Email address')
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.submit(input.closest('form')!)

    await waitFor(() => {
      expect(screen.getByText('Something went wrong — please try again.')).toBeInTheDocument()
    })

    // Form should still be visible (not done state)
    expect(screen.queryByText('You are on the list. Welcome.')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Email address')).toBeInTheDocument()
  })

  it('network error shows fail message and keeps form', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))
    vi.stubGlobal('fetch', mockFetch)

    render(<KTNewsletter />)
    const input = screen.getByLabelText('Email address')
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.submit(input.closest('form')!)

    await waitFor(() => {
      expect(screen.getByText('Something went wrong — please try again.')).toBeInTheDocument()
    })

    expect(screen.queryByText('You are on the list. Welcome.')).not.toBeInTheDocument()
  })

  it('archiveLink={false} hides Browse past issues', () => {
    render(<KTNewsletter archiveLink={false} />)
    expect(screen.queryByText(/Browse past issues/)).not.toBeInTheDocument()
  })

  it('archiveLink={true} shows Browse past issues link to /home-guide', () => {
    render(<KTNewsletter />)
    const link = screen.getByText(/Browse past issues/)
    expect(link.tagName.toLowerCase()).toBe('a')
    expect(link.getAttribute('href')).toBe('/home-guide')
  })

  it('honeypot input exists with name=website and tabIndex -1', () => {
    const { container } = render(<KTNewsletter />)
    const honeypot = container.querySelector('input[name="website"]')
    expect(honeypot).toBeInTheDocument()
    expect(honeypot!.getAttribute('tabindex')).toBe('-1')
    expect(honeypot!.getAttribute('autocomplete')).toBe('off')
    expect(honeypot!.getAttribute('aria-hidden')).toBe('true')
  })

  it('button is disabled while sending', async () => {
    // Use a promise that we control to keep the request in-flight
    let resolveFetch!: (value: unknown) => void
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve
    })
    const mockFetch = vi.fn().mockReturnValue(fetchPromise)
    vi.stubGlobal('fetch', mockFetch)

    render(<KTNewsletter />)
    const input = screen.getByLabelText('Email address')
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.submit(input.closest('form')!)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Sign up' })).toBeDisabled()
    })

    // Resolve the fetch to clean up
    resolveFetch({ ok: true, json: async () => ({ ok: true }) })
    await waitFor(() => {
      expect(screen.getByText('You are on the list. Welcome.')).toBeInTheDocument()
    })
  })
})
