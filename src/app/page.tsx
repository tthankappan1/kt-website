import { KTNav } from '@/components/nav/kt-nav'
import { KTFooter } from '@/components/close/kt-footer'
import { KTNewsletter } from '@/components/close/kt-newsletter'
import { KTSocialStrip } from '@/components/close/kt-social-strip'

// TEMPORARY milestone-2 harness page — shared Nav + type specimen + dark close
// band (social strip, newsletter, footer) for side-by-side comparison with the
// prototype. Replaced by the real home page in milestone 3.
export default function Home() {
  return (
    <div>
      <KTNav />
      <header id="top" className="bg-dark on-dark kt-section" style={{ position: 'relative', minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="kt-frame" />
        <div className="kt-container">
          <p className="kt-eyebrow on-dark">Type specimen · dark surface</p>
          <h1 className="kt-display">
            Tri-Valley real estate, advised with <em className="kt-em">clarity</em>.
          </h1>
          <hr className="kt-rule" />
          <p className="kt-lead kt-measure" style={{ color: 'var(--body-on-dark)' }}>
            Fraunces with optical sizing for display, Inter 300 for body. Gold on dark.
          </p>
        </div>
      </header>
      <section id="about" className="bg-light kt-section">
        <div className="kt-container">
          <p className="kt-eyebrow">Type specimen · light surface</p>
          <h2 className="kt-h1">
            Heading one with <em className="kt-em">gold-deep</em> emphasis.
          </h2>
          <hr className="kt-rule rule-light" />
          <p className="kt-lead kt-measure">
            Lead paragraph at 17px/1.75. The signature shape is the hairline border with an
            asymmetric top-left radius.
          </p>
        </div>
      </section>
      <div className="bg-dark on-dark" style={{ position: 'relative' }}>
        <KTSocialStrip />
        <KTNewsletter />
        <KTFooter />
      </div>
    </div>
  )
}
