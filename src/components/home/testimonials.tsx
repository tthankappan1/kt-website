'use client'

import { useState, useEffect } from 'react'

const KT_QUOTES = [
  {
    quote:
      'Kalyani walked us through every comparable sale before we wrote a single offer. We always knew exactly where we stood — and we closed under asking in a competitive market.',
    name: 'Buyer',
    where: 'Pleasanton',
  },
  {
    quote:
      'She told us what our home was actually worth, not what we wanted to hear. The preparation plan paid for itself several times over.',
    name: 'Seller',
    where: 'San Ramon',
  },
  {
    quote:
      'Calm, precise, and two steps ahead the entire time. The first agent we have worked with who reads the numbers the way we do.',
    name: 'Buyer',
    where: 'Dublin',
  },
] as const

export function KTTestimonials() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((prev) => (prev + 1) % KT_QUOTES.length)
    }, 7000)
    return () => clearInterval(id)
  }, [])

  const active = KT_QUOTES[idx]

  return (
    <section id="testimonials" className="kt-section bg-light" style={{ paddingTop: 0 }}>
      <div className="kt-container">
        <div className="kt-hybrid-block on-dark kt-reveal">
          <p className="kt-eyebrow" style={{ color: 'var(--gold)' }}>
            What clients say
          </p>
          <blockquote style={{ minHeight: '150px' }}>
            <p
              style={{
                fontFamily: 'var(--serif)',
                fontVariationSettings: '"opsz" 96',
                fontSize: 'clamp(22px, 2.4vw, 30px)',
                lineHeight: 1.45,
                color: 'var(--ivory)',
                maxWidth: '820px',
              }}
            >
              &ldquo;{active.quote}&rdquo;
            </p>
            <footer
              style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '24px' }}
            >
              <p
                className="kt-body-small"
                style={{
                  color: 'var(--gold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  fontWeight: 500,
                }}
              >
                {active.name} &middot; {active.where}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {KT_QUOTES.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Quote ${i + 1}`}
                    onClick={() => setIdx(i)}
                    style={{
                      width: '32px',
                      height: '2px',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      background: i === idx ? 'var(--gold)' : 'rgba(192,162,120,0.3)',
                    }}
                  />
                ))}
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
