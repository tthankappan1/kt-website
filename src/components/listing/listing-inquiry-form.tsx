'use client'

import React from 'react'
import { listingAddress, listingPath } from '@/content/listings'
import type { Listing } from '@/content/listings'
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from '@/lib/site'

type FormState = 'idle' | 'sending' | 'sent'

const DEFAULT_NOTE = 'Please contact me about this home.'

export function inquiryCtaLabel(listing: Listing): string {
  return listing.status === 'active' || listing.status === 'coming-soon'
    ? 'Request a showing'
    : 'Ask about similar homes'
}

// Listing inquiry → the existing /api/lead route (no API change). The message
// is tagged with the address so the CRM knows which home; sourcePage is the
// listing path. Never subscribes anyone (consent invariant, CLAUDE.md).
export function ListingInquiryForm({ listing }: { listing: Listing }) {
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [honeypot, setHoneypot] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [formState, setFormState] = React.useState<FormState>('idle')

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (formState === 'sending') return

    if (!firstName.trim() || !email.trim()) {
      setError('Please add your first name and email so I can reply.')
      return
    }
    if (!isValidEmail(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    setError(null)
    setFormState('sending')

    const payload = {
      intent: 'buying',
      timeframe: null,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: `Inquiry — ${listingAddress(listing)}: ${message.trim() || DEFAULT_NOTE}`,
      newsletterAlameda: false,
      newsletterContracosta: false,
      sourcePage: listingPath(listing.slug),
      website: honeypot,
    }

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setFormState('sent')
      } else {
        setError('Something went wrong — please try again, or call me directly.')
        setFormState('idle')
      }
    } catch {
      setError('Something went wrong — please try again, or call me directly.')
      setFormState('idle')
    }
  }

  if (formState === 'sent') {
    return (
      <div>
        <h3 className="kt-h2" style={{ color: 'var(--ivory)' }}>
          Thank you.
        </h3>
        <hr className="kt-rule" />
        <p className="kt-lead" style={{ color: 'var(--body-on-dark)', maxWidth: '480px' }}>
          Your note is on its way &mdash; I personally read and answer every message, usually
          within a few hours. If it&rsquo;s time-sensitive, call or text me at{' '}
          <a href={`tel:${CONTACT_PHONE_TEL}`} style={{ color: 'var(--gold)' }}>
            {CONTACT_PHONE_DISPLAY}
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate>
      <span className="kt-visually-hidden">
        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </span>

      <div className="grid-form-pair">
        <div>
          <label className="kt-field-label" htmlFor="inq-first-name">
            First name
          </label>
          <input
            className="kt-input"
            id="inq-first-name"
            name="firstName"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label className="kt-field-label" htmlFor="inq-last-name">
            Last name <span className="opt">(optional)</span>
          </label>
          <input
            className="kt-input"
            id="inq-last-name"
            name="lastName"
            type="text"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      <div className="grid-form-pair">
        <div>
          <label className="kt-field-label" htmlFor="inq-email">
            Email
          </label>
          <input
            className="kt-input"
            id="inq-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="kt-field-label" htmlFor="inq-phone">
            Phone <span className="opt">(optional)</span>
          </label>
          <input
            className="kt-input"
            id="inq-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <label className="kt-field-label" htmlFor="inq-message">
          Message <span className="opt">(optional)</span>
        </label>
        <textarea
          className="kt-input"
          id="inq-message"
          name="message"
          rows={4}
          placeholder="A day that works for a showing, a question about the home, or anything else on your mind…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {error && (
        <p
          role="alert"
          aria-live="polite"
          style={{
            color: '#D9A08C',
            fontFamily: 'var(--sans)',
            fontSize: '14px',
            marginBottom: '20px',
          }}
        >
          {error}
        </p>
      )}

      <button
        className="kt-btn btn-solid-dark"
        type="submit"
        style={{ padding: '16px 44px' }}
        disabled={formState === 'sending'}
      >
        {inquiryCtaLabel(listing)}
      </button>
      <p className="kt-body-small" style={{ marginTop: '16px', color: 'rgba(243,240,235,0.55)' }}>
        No spam, no pressure &mdash; your details go only to Kalyani.
      </p>
    </form>
  )
}
