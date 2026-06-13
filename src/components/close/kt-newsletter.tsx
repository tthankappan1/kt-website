'use client'

import React from 'react'

type NewsletterState = 'idle' | 'error' | 'sending' | 'done' | 'fail'

export function KTNewsletter({ archiveLink = true }: { archiveLink?: boolean }) {
  const [email, setEmail] = React.useState('')
  const [state, setState] = React.useState<NewsletterState>('idle')
  const [honeypot, setHoneypot] = React.useState('')

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState('error')
      return
    }
    setState('sending')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          sourcePage: typeof window !== 'undefined' ? window.location.pathname : '',
          website: honeypot,
        }),
      })
      if (res.ok) {
        setState('done')
      } else {
        setState('fail')
      }
    } catch {
      setState('fail')
    }
  }

  return (
    <div className="kt-container" style={{ paddingTop: 'var(--sect-pad)', paddingBottom: 'var(--sect-pad)' }}>
      <div className="grid-news kt-reveal">
        <div>
          <p className="kt-eyebrow on-dark">The Bay Area Home Guide</p>
          <h2 className="kt-h2" style={{ color: 'var(--ivory)', fontSize: 'clamp(24px, 2.4vw, 30px)' }}>
            One email a week. Where the <em className="kt-em">market</em> is, and what it means.
          </h2>
          {archiveLink ? (
            <a className="kt-read" href="/home-guide" style={{ color: 'var(--gold)', display: 'inline-block', marginTop: '18px' }}>Browse past issues &rarr;</a>
          ) : null}
        </div>
        <div>
          {/* Visually hidden honeypot */}
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

          {state === 'done' ? (
            <p style={{ color: 'var(--gold)', fontFamily: 'var(--serif)', fontSize: '18px' }}>
              You are on the list. Welcome.
            </p>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', gap: '12px' }}>
              <input
                className="kt-input"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setState('idle') }}
                aria-label="Email address"
              />
              <button
                className="kt-btn btn-solid-dark"
                type="submit"
                style={{ flex: 'none' }}
                disabled={state === 'sending'}
              >
                Sign up
              </button>
            </form>
          )}

          {state === 'error' ? (
            <p className="kt-body-small" style={{ marginTop: '10px', color: 'var(--gold)' }}>
              Please enter a valid email address.
            </p>
          ) : null}

          {state === 'fail' ? (
            <p className="kt-body-small" style={{ marginTop: '10px', color: 'var(--gold)' }}>
              Something went wrong &mdash; please try again.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
