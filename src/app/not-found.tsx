import Link from 'next/link'
import { KTNav } from '@/components/nav/kt-nav'
import { KTFooter } from '@/components/close/kt-footer'
import { Monogram } from '@/components/ui/monogram'

export const metadata = {
  title: 'Page not found',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <div>
      <KTNav base="/" />
      <main
        className="bg-dark on-dark"
        style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', position: 'relative' }}
      >
        <div className="kt-container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <Monogram />
          </div>
          <p className="kt-eyebrow on-dark">404</p>
          <h1 className="kt-display">This page could not be found.</h1>
          <p
            className="kt-lead"
            style={{ color: 'var(--body-on-dark)', maxWidth: '460px', margin: '24px auto 0' }}
          >
            The page you are looking for may have moved or no longer exists.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              marginTop: '40px',
            }}
          >
            <Link className="kt-btn btn-solid-dark" href="/">
              Back home
            </Link>
            <Link className="kt-btn btn-ghost-dark" href="/home-guide">
              The Home Guide
            </Link>
          </div>
        </div>
      </main>
      <div className="bg-dark on-dark" style={{ position: 'relative' }}>
        <KTFooter />
      </div>
    </div>
  )
}
