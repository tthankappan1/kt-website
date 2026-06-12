// TEMPORARY type-specimen page — milestone 1 checkpoint ("scaffold + tokens +
// fonts render"). Replaced by the real home page in milestone 3.
export default function Home() {
  return (
    <main>
      <section className="bg-dark on-dark kt-section" style={{ position: 'relative', minHeight: '60vh' }}>
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
          <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
            <span className="kt-btn btn-solid-dark">Solid on dark</span>
            <span className="kt-btn btn-ghost-dark">Ghost on dark</span>
          </div>
        </div>
      </section>
      <section className="bg-light kt-section">
        <div className="kt-container">
          <p className="kt-eyebrow">Type specimen · light surface</p>
          <h2 className="kt-h1">
            Heading one with <em className="kt-em">gold-deep</em> emphasis.
          </h2>
          <hr className="kt-rule rule-light" />
          <h3 className="kt-h2">Heading two — opsz 96</h3>
          <p className="kt-lead kt-measure">
            Lead paragraph at 17px/1.75. The signature shape is the hairline border with an
            asymmetric top-left radius.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
            <span className="kt-btn btn-solid-light">Solid on light</span>
            <span className="kt-btn btn-ghost-light">Ghost on light</span>
          </div>
        </div>
      </section>
    </main>
  )
}
