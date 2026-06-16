import Link from 'next/link'

const KT_SERVICES = [
  {
    num: '01',
    title: 'Buying',
    href: '/resources/buying',
    body: 'The right home at the right price — and never rushed into one that won\'t still look smart five years from now.',
  },
  {
    num: '02',
    title: 'Selling',
    href: '/resources/selling',
    body: 'Pricing, preparation, and timing done right — most of the outcome is set before the sign ever goes up.',
  },
  {
    num: '03',
    title: 'Market guidance',
    href: '/resources/market-updates',
    body: 'Not ready to move yet? A plain-English read of the Bay Area market — what\'s selling, what\'s sitting, and what waiting actually costs.',
  },
] as const

export function KTServices() {
  return (
    <section id="services" className="kt-section bg-light" style={{ paddingTop: 0 }}>
      <div className="kt-container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--gap-section)' }}>
          <p className="kt-eyebrow">Services</p>
          <h2 className="kt-h1">
            How I can <em className="kt-em">help</em>.
          </h2>
        </div>
        <div className="grid-services">
          {KT_SERVICES.map((svc) => (
            <div key={svc.num} className="kt-card">
              <span className="card-num">{svc.num}</span>
              <h3 className="kt-h3" style={{ fontSize: '24px' }}>
                {svc.title}
              </h3>
              <p style={{ fontSize: '14px' }}>{svc.body}</p>
              <Link className="card-link" href={svc.href}>
                Learn more <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
