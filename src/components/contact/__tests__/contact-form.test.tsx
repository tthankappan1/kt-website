import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from '@/components/contact/contact-form'

describe('ContactForm', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('timeframe section is hidden initially', () => {
    render(<ContactForm />)
    expect(screen.queryByText("What's your timeframe?")).not.toBeInTheDocument()
  })

  it('clicking Selling chip applies sel class and shows timeframe section', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    const sellingChip = screen.getByRole('button', { name: 'Selling' })
    await user.click(sellingChip)
    expect(sellingChip.className).toContain('sel')
    expect(screen.getByText("What’s your timeframe?")).toBeInTheDocument()
  })

  it('clicking Just curious chip hides timeframe section', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    await user.click(screen.getByRole('button', { name: 'Just curious' }))
    expect(screen.queryByText("What’s your timeframe?")).not.toBeInTheDocument()
  })

  it('submitting with empty name and email shows exact error copy and does NOT call fetch', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    await user.click(screen.getByRole('button', { name: 'Send' }))
    expect(
      screen.getByText('Please add your first name and email so I can reply.'),
    ).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('fills firstName+email, selects Buying + Ready now, checks Alameda newsletter, submits; verifies fetch call and thank-you state', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const user = userEvent.setup()
    render(<ContactForm />)

    // Select Buying intent
    await user.click(screen.getByRole('button', { name: 'Buying' }))

    // Select Ready now timeframe
    await user.click(screen.getByRole('button', { name: 'Ready now' }))

    // Fill firstName and email
    await user.type(screen.getByLabelText('First name'), 'Jane')
    await user.type(screen.getByLabelText('Email'), 'jane@example.com')

    // Check Alameda newsletter
    const alamedalabel = screen.getByText('Alameda County market updates')
    await user.click(alamedalabel.closest('label')!)

    // Submit
    await user.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => {
      expect(screen.getByText('Thank you.')).toBeInTheDocument()
    })

    expect(mockFetch).toHaveBeenCalledOnce()
    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toBe('/api/lead')
    expect(options.method).toBe('POST')
    const body = JSON.parse(options.body)
    expect(body.intent).toBe('buying')
    expect(body.timeframe).toBe('Ready now')
    expect(body.newsletterAlameda).toBe(true)
    expect(body.newsletterContracosta).toBe(false)
    expect('sourcePage' in body).toBe(true)
    expect(body.website).toBe('')

    // Thank-you state visible with tel link
    const telLink = screen.getByRole('link', { name: /408/ })
    expect(telLink.getAttribute('href')).toBe('tel:+14085977371')
  })

  it('fetch resolves ok:false shows failure error copy and keeps form with values intact', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    })
    vi.stubGlobal('fetch', mockFetch)

    const user = userEvent.setup()
    render(<ContactForm />)

    await user.type(screen.getByLabelText('First name'), 'Jane')
    await user.type(screen.getByLabelText('Email'), 'jane@example.com')

    await user.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => {
      expect(
        screen.getByText('Something went wrong — please try again, or call me directly.'),
      ).toBeInTheDocument()
    })

    // Form still present — not thank-you state
    expect(screen.queryByText('Thank you.')).not.toBeInTheDocument()
    expect(screen.getByLabelText('First name')).toBeInTheDocument()

    // Field values preserved
    expect((screen.getByLabelText('First name') as HTMLInputElement).value).toBe('Jane')
    expect((screen.getByLabelText('Email') as HTMLInputElement).value).toBe('jane@example.com')
  })

  it('honeypot input exists with name=website and tabIndex -1', () => {
    const { container } = render(<ContactForm />)
    const honeypot = container.querySelector('input[name="website"]')
    expect(honeypot).toBeInTheDocument()
    expect(honeypot!.getAttribute('tabindex')).toBe('-1')
    expect(honeypot!.getAttribute('autocomplete')).toBe('off')
    expect(honeypot!.getAttribute('aria-hidden')).toBe('true')
  })
})
