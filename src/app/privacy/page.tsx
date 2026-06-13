import type { Metadata } from 'next'
import { KTNav } from '@/components/nav/kt-nav'
import { KTFooter } from '@/components/close/kt-footer'
import { CONTACT_EMAIL, DRE, SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for kalyanithilak.com — how contact and newsletter data is handled.',
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: false },
}

export default function PrivacyPage() {
  return (
    <div>
      <KTNav base="/" />
      <header id="top" className="bg-dark on-dark" style={{ padding: '160px 0 64px' }}>
        <div className="kt-container">
          <p className="kt-eyebrow on-dark">Legal</p>
          <h1 className="kt-display" style={{ fontSize: 'clamp(32px, 3.6vw, 52px)' }}>
            Privacy Policy
          </h1>
        </div>
      </header>

      <section className="bg-light" style={{ padding: 'calc(72px * var(--dm)) 0' }}>
        <div className="kt-container">
          <div style={{ maxWidth: '720px' }}>

            <p className="kt-body" style={{ color: 'var(--body-on-light)', marginBottom: '32px' }}>
              Effective date: June 2025. This policy applies to{' '}
              <strong>kalyanithilak.com</strong> (the &ldquo;Site&rdquo;), operated by Kalyani
              Thilak, REALTOR&reg;, DRE {DRE}, Intero Real Estate Services.
            </p>

            <h2 className="kt-h3" style={{ marginBottom: '16px' }}>
              Information we collect
            </h2>
            <p className="kt-body" style={{ color: 'var(--body-on-light)', marginBottom: '16px' }}>
              When you submit the contact form or subscribe to the newsletter we collect the
              information you type: name, email address, and any message text you provide. We do
              not collect payment information, social security numbers, or government identifiers
              through this Site.
            </p>
            <p className="kt-body" style={{ color: 'var(--body-on-light)', marginBottom: '32px' }}>
              Standard web-server logs (IP address, browser type, referring page, pages visited)
              are retained for security and analytics purposes. We do not use advertising trackers.
            </p>

            <h2 className="kt-h3" style={{ marginBottom: '16px' }}>
              How we use it
            </h2>
            <p className="kt-body" style={{ color: 'var(--body-on-light)', marginBottom: '32px' }}>
              Contact submissions are used solely to respond to your inquiry. Newsletter subscribers
              receive the Bay Area Home Guide, a periodic real estate market email. We do not sell,
              rent, or share your personal information with third parties for marketing purposes.
            </p>

            <h2 className="kt-h3" style={{ marginBottom: '16px' }}>
              Data storage
            </h2>
            <p className="kt-body" style={{ color: 'var(--body-on-light)', marginBottom: '32px' }}>
              Form submissions are stored in a Supabase (PostgreSQL) database hosted in the United
              States. Row-level security is enabled; no anonymous read access is permitted.
            </p>

            <h2 className="kt-h3" style={{ marginBottom: '16px' }}>
              Your rights
            </h2>
            <p className="kt-body" style={{ color: 'var(--body-on-light)', marginBottom: '32px' }}>
              You may request access to, correction of, or deletion of your data at any time by
              emailing{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--gold-deep)' }}>
                {CONTACT_EMAIL}
              </a>
              . Newsletter subscribers may unsubscribe using the link in any email.
            </p>

            <h2 className="kt-h3" style={{ marginBottom: '16px' }}>
              Cookies
            </h2>
            <p className="kt-body" style={{ color: 'var(--body-on-light)', marginBottom: '32px' }}>
              This Site does not use persistent tracking cookies. No cookie consent banner is
              required.
            </p>

            <h2 className="kt-h3" style={{ marginBottom: '16px' }}>
              Changes to this policy
            </h2>
            <p className="kt-body" style={{ color: 'var(--body-on-light)', marginBottom: '32px' }}>
              Material changes will be posted on this page with an updated effective date.
            </p>

            <p className="kt-body-small" style={{ color: 'var(--body-on-light)' }}>
              Questions? Email{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--gold-deep)' }}>
                {CONTACT_EMAIL}
              </a>
              .
            </p>

          </div>
        </div>
      </section>

      <div className="bg-dark on-dark" style={{ position: 'relative' }}>
        <KTFooter />
      </div>
    </div>
  )
}
