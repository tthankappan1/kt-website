import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { getListing } from '@/content/listings'
import { ListingInquiryForm } from '@/components/listing/listing-inquiry-form'

const base = getListing('553-covington-way-livermore')!

function fill(over: Partial<Record<'firstName' | 'lastName' | 'email' | 'phone' | 'message', string>> = {}) {
  const v = { firstName: 'Ana', lastName: '', email: 'ana@example.com', phone: '', message: '', ...over }
  fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: v.firstName } })
  fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: v.lastName } })
  fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: v.email } })
  fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: v.phone } })
  fireEvent.change(screen.getByLabelText(/message/i), { target: { value: v.message } })
}

function submit() {
  fireEvent.click(screen.getByRole('button', { name: 'Request a showing' }))
}

describe('ListingInquiryForm', () => {
  let fetchMock: ReturnType<typeof vi.fn>
  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requires a first name and email, and a valid email', async () => {
    render(<ListingInquiryForm listing={base} />)
    submit()
    expect(await screen.findByRole('alert')).toHaveTextContent('Please add your first name and email so I can reply.')
    fill({ email: 'not-an-email' })
    submit()
    expect(await screen.findByRole('alert')).toHaveTextContent('Please enter a valid email address.')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('posts a buying lead tagged with the address to /api/lead and never subscribes anyone', async () => {
    render(<ListingInquiryForm listing={base} />)
    fill({ lastName: 'Lopez', phone: '925-555-0100', message: 'Is Saturday possible?' })
    submit()
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/lead')
    expect(init.method).toBe('POST')
    expect(init.headers).toEqual({ 'Content-Type': 'application/json' })
    expect(JSON.parse(init.body)).toEqual({
      intent: 'buying',
      timeframe: null,
      firstName: 'Ana',
      lastName: 'Lopez',
      email: 'ana@example.com',
      phone: '925-555-0100',
      message: 'Inquiry — 553 Covington Way, Livermore, CA 94551: Is Saturday possible?',
      newsletterAlameda: false,
      newsletterContracosta: false,
      sourcePage: '/listings/553-covington-way-livermore',
      website: '',
    })
    expect(await screen.findByText('Thank you.')).toBeInTheDocument()
  })

  it('uses a default note when the message is empty and forwards the honeypot value', async () => {
    const { container } = render(<ListingInquiryForm listing={base} />)
    fill()
    const honeypot = container.querySelector('input[name="website"]') as HTMLInputElement
    fireEvent.change(honeypot, { target: { value: 'spam' } })
    submit()
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.message).toBe(
      'Inquiry — 553 Covington Way, Livermore, CA 94551: Please contact me about this home.',
    )
    expect(body.website).toBe('spam')
  })

  it('shows the failure copy and keeps the form when the API rejects', async () => {
    fetchMock.mockResolvedValue({ ok: false })
    render(<ListingInquiryForm listing={base} />)
    fill()
    submit()
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Something went wrong — please try again, or call me directly.',
    )
    expect(screen.getByRole('button', { name: 'Request a showing' })).toBeInTheDocument()
  })
})
