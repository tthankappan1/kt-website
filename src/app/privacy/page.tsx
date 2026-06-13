import type { Metadata } from 'next'
import { KTNav } from '@/components/nav/kt-nav'
import { KTFooter } from '@/components/close/kt-footer'
import { CONTACT_EMAIL, DRE, SITE_URL } from '@/lib/site'

// DRAFT privacy policy — review by legal counsel before go-live (README §9).

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How kalyanithilak.com collects, uses, and protects your personal information, and your California privacy rights.',
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
          <h1 className="kt-display" style={{ fontSize: 'clamp(38px, 4.4vw, 60px)' }}>
            Privacy Policy
          </h1>
        </div>
      </header>

      <section className="bg-light" style={{ padding: 'calc(72px * var(--dm)) 0' }}>
        <div className="kt-container" style={{ maxWidth: '760px' }}>

          <p className="kt-lead" style={{ marginBottom: '12px' }}>
            Effective date: June 12, 2026
          </p>
          <p style={{ marginBottom: '48px' }}>
            This site is operated by Kalyani Thilak, REALTOR&reg; (DRE {DRE}), Intero Real Estate
            Services. This policy describes how <strong>kalyanithilak.com</strong> (the
            &ldquo;Site&rdquo;) collects, uses, and protects your personal information.
          </p>

          <h2 className="kt-h2" style={{ marginTop: '48px', marginBottom: '16px' }}>
            Information we collect
          </h2>
          <p style={{ marginBottom: '16px' }}>
            The contact form on this Site collects the following information you provide:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
            <li>First name (required) and last name (optional)</li>
            <li>Email address (required)</li>
            <li>Phone number (optional)</li>
            <li>Message (optional)</li>
            <li>Your intent and timeframe selections</li>
            <li>Newsletter opt-in choices</li>
          </ul>
          <p style={{ marginBottom: '16px' }}>
            The newsletter sign-up form collects your email address.
          </p>
          <p style={{ marginBottom: '16px' }}>
            We do not knowingly collect sensitive personal information such as social security
            numbers, financial account numbers, or health information through this Site.
          </p>

          <h2 className="kt-h2" style={{ marginTop: '48px', marginBottom: '16px' }}>
            How we use it
          </h2>
          <p style={{ marginBottom: '16px' }}>We use the information you provide to:</p>
          <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
            <li>Respond to your inquiry and provide the real estate services you request</li>
            <li>
              Send you periodic market-update emails if you opt in to the newsletter (Bay Area Home
              Guide)
            </li>
          </ul>
          <p style={{ marginBottom: '16px' }}>
            We do not sell your personal information to any third party.
          </p>

          <h2 className="kt-h2" style={{ marginTop: '48px', marginBottom: '16px' }}>
            Sharing of information
          </h2>
          <p style={{ marginBottom: '16px' }}>
            We may share your information only in these limited circumstances:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
            <li>
              <strong>Service providers:</strong> companies that help operate the Site and deliver
              email on our behalf (e.g. hosting providers, email delivery services). These providers
              are bound by confidentiality obligations and may not use your information for their own
              purposes.
            </li>
            <li>
              <strong>Legal requirements:</strong> when disclosure is required by applicable law,
              regulation, or valid legal process.
            </li>
          </ul>
          <p style={{ marginBottom: '16px' }}>
            We do not share your personal information with third parties for cross-context behavioral
            advertising.
          </p>

          <h2 className="kt-h2" style={{ marginTop: '48px', marginBottom: '16px' }}>
            Your California privacy rights (CCPA / CPRA)
          </h2>
          <p style={{ marginBottom: '16px' }}>
            If you are a California resident, you have the following rights under the California
            Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA):
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
            <li>
              <strong>Right to know:</strong> you may request disclosure of the categories and
              specific pieces of personal information we have collected about you.
            </li>
            <li>
              <strong>Right to delete:</strong> you may request that we delete personal information
              we have collected from you, subject to certain exceptions.
            </li>
            <li>
              <strong>Right to correct:</strong> you may request correction of inaccurate personal
              information we maintain about you.
            </li>
            <li>
              <strong>Right to opt out of sale or sharing:</strong> we do not sell personal
              information and do not share it for cross-context behavioral advertising, so this right
              is not applicable; however, you may still contact us to confirm this.
            </li>
          </ul>
          <p style={{ marginBottom: '16px' }}>
            To exercise any of these rights, email us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--gold-deep)' }}>
              {CONTACT_EMAIL}
            </a>
            . We will respond within the timeframe required by applicable law. We will not
            discriminate against you for exercising your privacy rights.
          </p>

          <h2 className="kt-h2" style={{ marginTop: '48px', marginBottom: '16px' }}>
            Data retention
          </h2>
          <p style={{ marginBottom: '16px' }}>
            We retain your personal information for as long as necessary to provide the services you
            have requested and as required or permitted by applicable law. If you request deletion,
            we will delete your information unless we are required by law to retain it.
          </p>

          <h2 className="kt-h2" style={{ marginTop: '48px', marginBottom: '16px' }}>
            Contact
          </h2>
          <p style={{ marginBottom: '16px' }}>
            For any privacy-related questions or requests, contact us at:
          </p>
          <p style={{ marginBottom: '16px' }}>
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--gold-deep)' }}>
              {CONTACT_EMAIL}
            </a>
          </p>

        </div>
      </section>

      <div className="bg-dark on-dark" style={{ position: 'relative' }}>
        <KTFooter />
      </div>
    </div>
  )
}
