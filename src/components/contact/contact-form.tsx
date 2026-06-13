'use client'

import React from 'react'
import { CONTACT_PHONE_TEL } from '@/lib/site'

const INTENTS = ['Selling', 'Buying', 'Both', 'Just curious'] as const
const TIMEFRAMES = ['Ready now', 'In 3–6 months', 'This year', 'Just exploring'] as const
const NEWSLETTERS = [
  'Alameda County market updates',
  'Contra Costa County market updates',
] as const

type FormState = 'idle' | 'sending' | 'fail' | 'sent'

export function ContactForm() {
  const [intent, setIntent] = React.useState<string | null>(null)
  const [timeframe, setTimeframe] = React.useState<string | null>(null)
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [newsletters, setNewsletters] = React.useState<string[]>([])
  const [honeypot, setHoneypot] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [formState, setFormState] = React.useState<FormState>('idle')

  const showTimeframe = intent !== null && intent !== 'Just curious'

  const toggleIntent = (val: string) => {
    setIntent((prev) => (prev === val ? null : val))
    setTimeframe(null)
  }

  const toggleTimeframe = (val: string) => {
    setTimeframe((prev) => (prev === val ? null : val))
  }

  const toggleNewsletter = (val: string) => {
    setNewsletters((prev) =>
      prev.includes(val) ? prev.filter((n) => n !== val) : [...prev, val],
    )
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!firstName.trim() || !email.trim()) {
      setError('Please add your first name and email so I can reply.')
      return
    }

    setError(null)
    setFormState('sending')

    const intentMap: Record<string, string> = {
      Selling: 'selling',
      Buying: 'buying',
      Both: 'both',
      'Just curious': 'curious',
    }

    const payload = {
      intent: intent ? intentMap[intent] : 'curious',
      timeframe: timeframe ?? null,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim(),
      newsletterAlameda: newsletters.includes('Alameda County market updates'),
      newsletterContracosta: newsletters.includes('Contra Costa County market updates'),
      sourcePage: window.location.pathname,
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
      <div style={{ padding: '48px 0' }}>
        <h2 className="kt-h1">Thank you.</h2>
        <hr className="kt-rule rule-light" />
        <p className="kt-lead" style={{ maxWidth: '520px' }}>
          Your note is on its way &mdash; I personally read and answer every message, usually
          within a few hours. If it&rsquo;s time-sensitive, call or text me at{' '}
          <a href={`tel:${CONTACT_PHONE_TEL}`} style={{ color: 'var(--gold-deep)' }}>
            (408)&nbsp;597-7371
          </a>
          .
        </p>
        <p className="kt-note">&mdash; Kalyani</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate>
      {/* Honeypot */}
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

      {/* Intent chips */}
      <div className="kt-chips" role="group" aria-label="What brings you here?">
        {INTENTS.map((val) => (
          <button
            key={val}
            type="button"
            className={'kt-chip' + (intent === val ? ' sel' : '')}
            onClick={() => toggleIntent(val)}
          >
            {val}
          </button>
        ))}
      </div>

      {/* Timeframe chips — conditional */}
      {showTimeframe && (
        <div style={{ marginTop: '20px' }}>
          <p className="kt-label" style={{ marginBottom: '10px' }}>
            What&rsquo;s your timeframe?
          </p>
          <div className="kt-chips" role="group" aria-label="Timeframe">
            {TIMEFRAMES.map((val) => (
              <button
                key={val}
                type="button"
                className={'kt-chip' + (timeframe === val ? ' sel' : '')}
                onClick={() => toggleTimeframe(val)}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Name grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginTop: '28px',
        }}
      >
        <div>
          <label className="kt-label" htmlFor="firstName">
            First name
          </label>
          <input
            className="kt-input-light"
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label className="kt-label" htmlFor="lastName">
            Last name <span className="opt">(optional)</span>
          </label>
          <input
            className="kt-input-light"
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      {/* Contact grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginTop: '20px',
        }}
      >
        <div>
          <label className="kt-label" htmlFor="email">
            Email
          </label>
          <input
            className="kt-input-light"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="kt-label" htmlFor="phone">
            Phone <span className="opt">(optional)</span>
          </label>
          <input
            className="kt-input-light"
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      {/* Message */}
      <div style={{ marginTop: '20px' }}>
        <label className="kt-label" htmlFor="message">
          Message
        </label>
        <textarea
          className="kt-input-light"
          id="message"
          name="message"
          rows={4}
          placeholder="A question, a property, a neighborhood you have your eye on&hellip;"
          style={{ resize: 'vertical', minHeight: '110px' }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {/* Newsletters */}
      <div style={{ marginTop: '24px' }}>
        <p className="kt-label" style={{ marginBottom: '12px' }}>
          Monthly market updates <span className="opt">(optional)</span>
        </p>
        {NEWSLETTERS.map((val) => (
          <label key={val} className="kt-check">
            <input
              type="checkbox"
              checked={newsletters.includes(val)}
              onChange={() => toggleNewsletter(val)}
            />
            <span className="box">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                <path
                  d="M1 4l2.8 2.8L9 1"
                  stroke="#F3F0EB"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            {val}
          </label>
        ))}
      </div>

      {/* Validation error */}
      {error && (
        <p
          style={{
            color: '#A4543C',
            fontFamily: 'var(--sans)',
            fontSize: '14px',
            marginBottom: '20px',
          }}
        >
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        className="kt-btn btn-solid-light"
        type="submit"
        style={{ padding: '16px 44px' }}
        disabled={formState === 'sending'}
      >
        Send
      </button>
      <p
        className="kt-body-small"
        style={{ marginTop: '16px', color: 'rgba(38,37,35,0.45)' }}
      >
        No spam, no pressure &mdash; your details go only to Kalyani.
      </p>
    </form>
  )
}
