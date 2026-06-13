import Link from 'next/link'
import { PhotoSlot } from '@/components/ui/photo-slot'

export function HeroFull() {
  return (
    <header id="top" className="bg-dark on-dark" style={{ position: 'relative', minHeight: '94vh' }}>
      <PhotoSlot
        id="hero-full-img"
        alt="Tri-Valley hills at dusk, Pleasanton"
        priority
        sizes="100vw"
        style={{ position: 'absolute', inset: '0', width: '100%', height: '100%' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '0',
          pointerEvents: 'none',
          background:
            'linear-gradient(180deg, rgba(38,37,35,0.55) 0%, rgba(38,37,35,0.15) 40%, rgba(38,37,35,0.78) 100%)',
        }}
      />
      <div
        className="kt-container"
        style={{
          position: 'relative',
          zIndex: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          minHeight: '94vh',
          paddingBottom: '12vh',
          pointerEvents: 'none',
        }}
      >
        <div style={{ pointerEvents: 'auto', maxWidth: '640px' }}>
          <p className="kt-eyebrow on-dark">
            Pleasanton &middot; Dublin &middot; San Ramon &middot; Livermore
          </p>
          <h1 className="kt-display">Kalyani Thilak</h1>
          <hr className="kt-rule" />
          <p className="kt-lead" style={{ color: 'var(--body-on-dark)', maxWidth: '480px' }}>
            Luxury Tri-Valley real estate, with{' '}
            <em className="kt-em" style={{ fontFamily: 'var(--serif)' }}>
              clarity
            </em>{' '}
            at every step &mdash; for buyers and sellers who read the numbers.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '36px', flexWrap: 'wrap' }}>
            <a className="kt-btn btn-solid-dark" href="#about">
              Meet Kalyani
            </a>
            <Link className="kt-btn btn-ghost-dark" href="/contact">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
