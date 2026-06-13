import { Monogram } from '@/components/ui/monogram'
import { NavSocial } from '@/components/nav/nav-social'
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL, DRE } from '@/lib/site'

export function KTFooter() {
  return (
    <footer style={{ position: 'relative' }}>
      <div className="kt-container">
        <hr className="kt-footer-rule"></hr>
        <div className="grid-foot" style={{ padding: 'calc(64px * var(--dm)) 0' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <Monogram></Monogram>
              <span className="kt-wordmark" style={{ fontSize: '14px' }}>Kalyani Thilak</span>
            </div>
            <p className="kt-body-small" style={{ color: 'var(--body-on-dark)', lineHeight: 2 }}>
              REALTOR&reg; &middot; DRE {DRE}<br></br>
              Intero Real Estate Services<br></br>
              A Berkshire Hathaway Affiliate<br></br>
              187 S J Street &middot; Livermore &middot; California
            </p>
          </div>
          <div>
            <p className="kt-eyebrow on-dark">Contact</p>
            <p className="kt-body-small" style={{ color: 'var(--body-on-dark)', lineHeight: 2.2 }}>
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--ivory)', textDecoration: 'none' }}>{CONTACT_EMAIL}</a><br></br>
              <a href={`tel:${CONTACT_PHONE_TEL}`} style={{ color: 'var(--ivory)', textDecoration: 'none' }}>{CONTACT_PHONE_DISPLAY}</a>
            </p>
            <div style={{ marginTop: '16px' }}>
              <NavSocial></NavSocial>
            </div>
          </div>
          <div>
            <p className="kt-eyebrow on-dark">Areas served</p>
            <p className="kt-body-small" style={{ color: 'var(--body-on-dark)', lineHeight: 2.2 }}>
              Pleasanton &middot; Dublin<br></br>
              San Ramon &middot; Livermore
            </p>
          </div>
        </div>
        <hr className="kt-footer-rule"></hr>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0 48px', flexWrap: 'wrap', gap: '16px' }}>
          <p className="kt-caption" style={{ color: 'rgba(243,240,235,0.6)', maxWidth: '640px' }}>
            Kalyani Thilak is a real estate salesperson licensed by the state of California, affiliated
            with Intero Real Estate Services. All material is intended for informational purposes only.
            Information is compiled from sources deemed reliable but is subject to errors, omissions,
            and changes without notice.
          </p>
          <p className="kt-caption" style={{ color: 'rgba(243,240,235,0.6)' }}>&copy; 2026 Kalyani Thilak</p>
        </div>
      </div>
    </footer>
  )
}
