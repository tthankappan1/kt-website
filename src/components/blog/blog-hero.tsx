// Server component — no 'use client' directive
export function BlogHero() {
  return (
    <header id="top" className="bg-dark on-dark" style={{ padding: '180px 0 88px' }}>
      <div className="kt-container">
        <p className="kt-eyebrow on-dark">The weekly newsletter &middot; archived here</p>
        <h1 className="kt-display" style={{ fontSize: 'clamp(40px, 5vw, 72px)' }}>
          The Bay Area <em className="kt-em">Home Guide</em>
        </h1>
        <hr className="kt-rule" />
        <p className="kt-lead kt-measure" style={{ color: 'var(--body-on-dark)', maxWidth: '560px' }}>
          Every issue lives here &mdash; the market read, neighborhood spotlights, and what
          the numbers actually mean for Tri-Valley buyers and sellers. New issues most weeks.
        </p>
      </div>
    </header>
  )
}
