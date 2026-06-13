import type { Metadata } from 'next'
import { KTNav } from '@/components/nav/kt-nav'
import { NavSocial } from '@/components/nav/nav-social'
import { PhotoSlot } from '@/components/ui/photo-slot'
import { KTFooter } from '@/components/close/kt-footer'
import { ContactForm } from '@/components/contact/contact-form'
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL, DRE, OFFICE_ADDRESS_LINES } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Buying, selling, or just curious about the market? Tell Kalyani a little about where you are.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <div>
      <KTNav base="/" />
      <main id="main">
      <header id="top" className="bg-dark on-dark" style={{ padding: '160px 0 64px' }}>
        <div className="kt-container">
          <p className="kt-eyebrow on-dark">Contact</p>
          <h1 className="kt-display" style={{ fontSize: 'clamp(38px, 4.4vw, 60px)' }}>
            Let&rsquo;s talk about your move.
          </h1>
        </div>
      </header>
      <section className="bg-light" style={{ padding: 'calc(72px * var(--dm)) 0' }}>
        <div className="kt-container">
          <div className="grid-contact">
            <aside className="kt-contact-aside">
              <PhotoSlot
                id="contact-portrait"
                alt="Kalyani Thilak — REALTOR portrait"
                radius={20}
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '4 / 5',
                  display: 'block',
                  marginBottom: '28px',
                }}
                sizes="(max-width: 900px) 100vw, 380px"
              />
              <h2 className="kt-h3" style={{ fontSize: '24px' }}>
                Kalyani Thilak
              </h2>
              <p
                className="kt-body-small"
                style={{ color: 'var(--body-on-light)', lineHeight: 2.1, marginTop: '12px' }}
              >
                REALTOR&reg; &middot; DRE {DRE}
                <br />
                Intero Real Estate Services
                <br />
                <a href={`tel:${CONTACT_PHONE_TEL}`} style={{ color: 'var(--charcoal)', textDecoration: 'none' }}>
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </p>
              <p
                className="kt-body-small"
                style={{ color: 'var(--body-on-light)', lineHeight: 2.1, marginTop: '16px' }}
              >
                {OFFICE_ADDRESS_LINES[0]}
                <br />
                {OFFICE_ADDRESS_LINES[1]}
              </p>
              <div style={{ marginTop: '24px' }}>
                <NavSocial />
              </div>
            </aside>
            <div>
              <p className="kt-lead" style={{ maxWidth: '560px', marginBottom: '44px' }}>
                Buying, selling, or just curious about the market? Tell me a little about where you
                are &mdash; two taps and a name is enough. I&rsquo;ll take it from there.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      </main>
      <div className="bg-dark on-dark" style={{ position: 'relative' }}>
        <KTFooter />
      </div>
    </div>
  )
}
