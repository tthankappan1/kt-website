'use client'

import { useState, useEffect } from 'react'

const KT_QUOTES = [
  {
    quote:
      'While searching for a home, I found one I really liked that was in a competitive multiple-offer situation, and the inspection report also raised a few concerns I didn’t fully understand. Kalyani took the time to walk me through the inspection details, explain what was actually important, and help me put together a strong, sensible offer without any pressure. Her guidance made what could have been a stressful decision feel much more manageable. She’s patient, knowledgeable, and genuinely looks out for her clients.',
    name: 'Arun Krishna',
    where: 'Buyer',
  },
  {
    quote:
      'Kalyani is an incredibly hard-working and dedicated real estate agent. She’s always on top of every detail, ensuring no stone is left unturned throughout the process. Her knowledge of the East Bay is impressive, and she will truly go above and beyond to find the perfect home. I highly recommend her for anyone looking for a reliable and attentive agent!',
    name: 'Veasna Duong',
    where: 'Buyer',
  },
] as const

export function KTTestimonials() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    // Respect reduced-motion: do not auto-advance; dots remain for manual control.
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }
    const id = setInterval(() => {
      setIdx((prev) => (prev + 1) % KT_QUOTES.length)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  const active = KT_QUOTES[idx]

  return (
    <section id="testimonials" className="kt-section bg-light" style={{ paddingTop: 0 }}>
      <div className="kt-container">
        <div className="kt-hybrid-block on-dark">
          <p className="kt-eyebrow on-dark" style={{ color: 'var(--gold)' }}>
            What clients say
          </p>
          <blockquote style={{ minHeight: '150px' }}>
            <p
              style={{
                fontFamily: 'var(--serif)',
                fontWeight: 400,
                fontVariationSettings: '"opsz" 96',
                fontSize: 'clamp(22px, 2.4vw, 30px)',
                lineHeight: 1.45,
                color: 'var(--ivory)',
                maxWidth: '820px',
              }}
            >
              &ldquo;{active.quote}&rdquo;
            </p>
          </blockquote>
          <div
            data-testid="testimonial-attribution"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginTop: '32px',
            }}
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
            <div data-testid="testimonial-dots" style={{ display: 'flex', gap: '10px' }}>
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
                    transition: 'background 0.3s',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
