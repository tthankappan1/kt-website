import Link from 'next/link'
import { PhotoSlot } from '@/components/ui/photo-slot'

export function KTIntro() {
  return (
    <section id="about" className="kt-section bg-light">
      <div className="kt-container">
        <div className="grid-intro">
          {/* Portrait column */}
          <div>
            <PhotoSlot
              id="about-portrait"
              alt="Portrait of Kalyani Thilak"
              radius={24}
              style={{ width: '100%', maxWidth: '360px', height: '440px', display: 'block' }}
            />
            <p
              className="kt-caption"
              style={{ marginTop: '12px', letterSpacing: '0.12em', color: 'var(--gold-deep)' }}
            >
              KALYANI THILAK &middot; REALTOR&reg;
            </p>
          </div>

          {/* Copy column */}
          <div>
            <p className="kt-eyebrow">About</p>
            <h2 className="kt-h1" style={{ marginBottom: 'var(--gap-h1)' }}>
              A trusted advisor for the{' '}
              <em className="kt-em">Tri-Valley</em>.
            </h2>
            <div className="kt-measure" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p className="kt-lead">
                Kalyani works with buyers and sellers across Pleasanton, Dublin, San Ramon, and
                Livermore &mdash; a market she knows street by street, school boundary by school
                boundary.
              </p>
              <p>
                Her clients are sophisticated readers. They review comparable sales cover to cover and
                ask pointed questions. That suits her well: her practice is built on data-grounded
                analysis, honest market assessments, and recommendations she can defend with numbers.
              </p>
              <p>
                Whether you are buying your first Pleasanton home for the schools or selling a house
                you have held for twenty years, the approach is the same &mdash; calm, informed, and
                never selling.
              </p>
            </div>
            <div style={{ marginTop: '40px' }}>
              <Link className="kt-btn btn-solid-light" href="/contact">
                Work with Kalyani
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
