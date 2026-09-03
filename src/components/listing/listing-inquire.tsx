import { PhotoSlot } from '@/components/ui/photo-slot'
import { ListingInquiryForm, inquiryCtaLabel } from '@/components/listing/listing-inquiry-form'
import type { Listing } from '@/content/listings'
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  DRE,
  OFFICE_ADDRESS_LINES,
} from '@/lib/site'

// Charcoal hybrid block on ivory: Kalyani + direct contact on the left, the
// inquiry form on the right, then the listed-by compliance line
// (spec 2026-09-03 §Listing page 6–7).
export function ListingInquire({ listing }: { listing: Listing }) {
  const showing = listing.status === 'active' || listing.status === 'coming-soon'
  return (
    <section id="inquire" className="kt-section bg-light kt-listing-inquire">
      <div className="kt-container">
        <div className="kt-hybrid-block on-dark">
          <div className="grid-listing-inquire">
            <div>
              <p className="kt-eyebrow on-dark">
                {showing ? 'Interested in this home?' : 'Looking for a home like this?'}
              </p>
              <h2 className="kt-h2" style={{ color: 'var(--ivory)' }}>
                {showing ? 'Request a private showing.' : inquiryCtaLabel(listing) + '.'}
              </h2>
              <hr className="kt-rule" />
              <p style={{ color: 'var(--body-on-dark)', maxWidth: '360px' }}>
                Tell me a little about what you&rsquo;re looking for and I&rsquo;ll be in touch,
                usually within a few hours.
              </p>
              <PhotoSlot
                id="about-portrait"
                alt="Portrait of Kalyani Thilak"
                radius={24}
                sizes="(max-width: 900px) 100vw, 280px"
                style={{ width: '100%', maxWidth: '280px', height: '340px', display: 'block', marginTop: '32px' }}
              />
              <div className="kt-listing-contact">
                <a href={`tel:${CONTACT_PHONE_TEL}`}>{CONTACT_PHONE_DISPLAY}</a>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </div>
            </div>
            <ListingInquiryForm listing={listing} />
          </div>
        </div>
        <div className="kt-listing-by">
          <p className="kt-body-small" style={{ letterSpacing: '0.06em', color: 'var(--body-on-light)' }}>
            Listed by Kalyani Thilak &middot; REALTOR&reg; &middot; Intero Real Estate Services &middot;
            A Berkshire Hathaway Affiliate &middot; DRE {DRE} &middot; {OFFICE_ADDRESS_LINES[0]}, Livermore
          </p>
          <p className="kt-caption" style={{ marginTop: '8px', color: 'rgba(38,37,35,0.55)', maxWidth: '640px' }}>
            Information deemed reliable but not guaranteed. Buyer to verify all information,
            including square footage, lot size and schools.
          </p>
        </div>
      </div>
    </section>
  )
}
