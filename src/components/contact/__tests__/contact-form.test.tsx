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
    expect(screen.queryByText("What’s your timeframe?")).not.toBeInTheDocument()
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

  // ── Review-finding fixes ──────────────────────────────────────────────────

  it('renders visible "What brings you here?" label text above intent chips (issue 1)', () => {
    render(<ContactForm />)
    expect(screen.getByText('What brings you here?')).toBeInTheDocument()
  })

  it('intent chip row wrapper has inline flex layout (issue 3)', () => {
    const { container } = render(<ContactForm />)
    // The div wrapping the intent chips must use inline display:flex
    const intentChips = container.querySelectorAll('button.kt-chip')
    expect(intentChips.length).toBeGreaterThan(0)
    const chipRow = intentChips[0].parentElement!
    expect(chipRow.style.display).toBe('flex')
    expect(chipRow.style.gap).toBe('12px')
    expect(chipRow.style.flexWrap).toBe('wrap')
  })

  it('renders message label as "Anything you’d like to share?" with (optional) span (issue 2)', () => {
    const { container } = render(<ContactForm />)
    const messageLabel = container.querySelector('label[for="message"]')
    expect(messageLabel).not.toBeNull()
    // Text content includes the full label
    expect(messageLabel!.textContent).toContain('Anything you’d like to share?')
    expect(messageLabel!.textContent).toContain('(optional)')
    // The opt span is inside the label
    const optSpan = messageLabel!.querySelector('.opt')
    expect(optSpan).not.toBeNull()
  })

  it('all visible field labels use class kt-field-label (not kt-label) (issue 3)', () => {
    const { container } = render(<ContactForm />)
    // No element should have class kt-label
    expect(container.querySelector('.kt-label')).toBeNull()
    // Intent label span exists with kt-field-label
    const fieldLabels = container.querySelectorAll('.kt-field-label')
    expect(fieldLabels.length).toBeGreaterThan(0)
  })

  it('no element uses class kt-chips (issue 3)', () => {
    const { container } = render(<ContactForm />)
    expect(container.querySelector('.kt-chips')).toBeNull()
  })

  it('intent block wrapper has marginBottom 36px (issue 4)', () => {
    render(<ContactForm />)
    // The intent section wrapping div uses marginBottom: 36px
    const intentLabel = screen.getByText('What brings you here?')
    const intentWrapper = intentLabel.parentElement!
    expect(intentWrapper.style.marginBottom).toBe('36px')
  })

  it('timeframe chip row wrapper has inline flex layout when visible (issue 3)', async () => {
    const user = userEvent.setup()
    const { container } = render(<ContactForm />)
    await user.click(screen.getByRole('button', { name: 'Selling' }))
    const allChipRows = Array.from(container.querySelectorAll('button.kt-chip'))
      .filter((b) => b.textContent === 'Ready now' || b.textContent === 'In 3–6 months')
    expect(allChipRows.length).toBeGreaterThan(0)
    const timeframeChipRow = allChipRows[0].parentElement!
    expect(timeframeChipRow.style.display).toBe('flex')
    expect(timeframeChipRow.style.gap).toBe('12px')
  })

  it('timeframe block wrapper has marginBottom 36px (issue 4)', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    await user.click(screen.getByRole('button', { name: 'Selling' }))
    const timeframeLabel = screen.getByText("What’s your timeframe?")
    const timeframeWrapper = timeframeLabel.parentElement!
    expect(timeframeWrapper.style.marginBottom).toBe('36px')
  })

  it('name and contact grids use marginBottom 28px (issue 4)', () => {
    const { container } = render(<ContactForm />)
    const grids = container.querySelectorAll('div[style]')
    const nameGrid = Array.from(grids).find((el) =>
      el.querySelector('label[for="firstName"]'),
    ) as HTMLElement | undefined
    expect(nameGrid).toBeDefined()
    expect(nameGrid!.style.marginBottom).toBe('28px')
    const contactGrid = Array.from(grids).find((el) =>
      el.querySelector('label[for="email"]'),
    ) as HTMLElement | undefined
    expect(contactGrid).toBeDefined()
    expect(contactGrid!.style.marginBottom).toBe('28px')
  })

  it('message wrapper uses marginBottom 28px (issue 4)', () => {
    const { container } = render(<ContactForm />)
    const grids = container.querySelectorAll('div[style]')
    const msgWrapper = Array.from(grids).find((el) =>
      el.querySelector('label[for="message"]'),
    ) as HTMLElement | undefined
    expect(msgWrapper).toBeDefined()
    expect(msgWrapper!.style.marginBottom).toBe('28px')
  })

  it('newsletter wrapper has flexDirection column, gap 14px, marginBottom 40px (issue 4)', () => {
    render(<ContactForm />)
    const newsletterLabel = screen.getByText((content, el) => {
      return el?.className === 'kt-field-label' && content.includes('Monthly market updates')
    })
    const newsletterWrapper = newsletterLabel.parentElement!
    expect(newsletterWrapper.style.display).toBe('flex')
    expect(newsletterWrapper.style.flexDirection).toBe('column')
    expect(newsletterWrapper.style.gap).toBe('14px')
    expect(newsletterWrapper.style.marginBottom).toBe('40px')
  })

  // ── Issue 8: coverage gaps ────────────────────────────────────────────────

  it('network error (fetch throws) shows failure error copy and keeps form (issue 8)', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))
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
  })

  it('Send button is disabled while formState is sending (issue 8)', async () => {
    let resolveFetch!: (value: unknown) => void
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve
    })
    const mockFetch = vi.fn().mockReturnValue(fetchPromise)
    vi.stubGlobal('fetch', mockFetch)

    const user = userEvent.setup()
    render(<ContactForm />)

    await user.type(screen.getByLabelText('First name'), 'Jane')
    await user.type(screen.getByLabelText('Email'), 'jane@example.com')

    await user.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled()
    })

    // Resolve to clean up
    resolveFetch({ ok: true, json: async () => ({ ok: true }) })
    await waitFor(() => {
      expect(screen.getByText('Thank you.')).toBeInTheDocument()
    })
  })

  it('filled honeypot value is forwarded in POST body (issue 8)', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const user = userEvent.setup()
    const { container } = render(<ContactForm />)

    const honeypotInput = container.querySelector('input[name="website"]')!
    // Use fireEvent for the hidden honeypot (tabIndex=-1 makes it skip with userEvent)
    const { fireEvent: fireEventNative } = await import('@testing-library/react')
    fireEventNative.change(honeypotInput, { target: { value: 'http://spam.example' } })

    await user.type(screen.getByLabelText('First name'), 'Jane')
    await user.type(screen.getByLabelText('Email'), 'jane@example.com')

    await user.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => {
      expect(screen.getByText('Thank you.')).toBeInTheDocument()
    })

    const body = JSON.parse(mockFetch.mock.calls[0][1].body)
    expect(body.website).toBe('http://spam.example')
  })

  // ── Issue 5: email format validation ────────────────────────────────────
  it('malformed email shows format hint error and does NOT call fetch (issue 5)', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.type(screen.getByLabelText('First name'), 'Jane')
    await user.type(screen.getByLabelText('Email'), 'notanemail')

    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(
      screen.getByText('Please enter a valid email address.'),
    ).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })

  // ── Issue 6: aria-live on error paragraph ──────────────────────────────
  it('error paragraph has role=alert so screen readers announce it (issue 6)', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.click(screen.getByRole('button', { name: 'Send' }))

    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert.textContent).toContain('Please add your first name')
  })

  // ── Issue 3: timeframe gated in payload ───────────────────────────────
  it('timeframe is null in payload when intent is Just curious (issue 3)', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const user = userEvent.setup()
    render(<ContactForm />)

    // Pick Selling and a timeframe
    await user.click(screen.getByRole('button', { name: 'Selling' }))
    await user.click(screen.getByRole('button', { name: 'Ready now' }))

    // Switch to Just curious — timeframe section disappears
    await user.click(screen.getByRole('button', { name: 'Just curious' }))

    await user.type(screen.getByLabelText('First name'), 'Jane')
    await user.type(screen.getByLabelText('Email'), 'jane@example.com')

    await user.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => {
      expect(screen.getByText('Thank you.')).toBeInTheDocument()
    })

    const body = JSON.parse(mockFetch.mock.calls[0][1].body)
    expect(body.intent).toBe('curious')
    expect(body.timeframe).toBeNull()
  })

  // ── Issue 4: re-entrancy guard ──────────────────────────────────────────
  it('calling submit programmatically while already sending does not issue a second fetch (issue 4)', async () => {
    let resolveFetch!: (value: unknown) => void
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve
    })
    const mockFetch = vi.fn().mockReturnValue(fetchPromise)
    vi.stubGlobal('fetch', mockFetch)

    const user = userEvent.setup()
    const { container } = render(<ContactForm />)

    await user.type(screen.getByLabelText('First name'), 'Jane')
    await user.type(screen.getByLabelText('Email'), 'jane@example.com')

    // First submission — puts form into 'sending'
    await user.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled()
    })

    // Directly submit the form while it is already sending
    const form = container.querySelector('form')!
    const { fireEvent: fireEventNative } = await import('@testing-library/react')
    fireEventNative.submit(form)

    // fetch must still have been called only once
    expect(mockFetch).toHaveBeenCalledTimes(1)

    // Clean up
    resolveFetch({ ok: true, json: async () => ({ ok: true }) })
    await waitFor(() => {
      expect(screen.getByText('Thank you.')).toBeInTheDocument()
    })
  })

  it('switching intent preserves existing timeframe selection (issue 5)', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    // Select Selling, then pick Ready now
    await user.click(screen.getByRole('button', { name: 'Selling' }))
    await user.click(screen.getByRole('button', { name: 'Ready now' }))
    expect(screen.getByRole('button', { name: 'Ready now' }).className).toContain('sel')

    // Switch to Buying — timeframe section must still show with Ready now still selected
    await user.click(screen.getByRole('button', { name: 'Buying' }))
    expect(screen.getByRole('button', { name: 'Ready now' }).className).toContain('sel')
  })
})
