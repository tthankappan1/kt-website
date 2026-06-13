import { KTNav } from '@/components/nav/kt-nav'
import { KTNewsletter } from '@/components/close/kt-newsletter'
import { KTFooter } from '@/components/close/kt-footer'
import { PhotoSlot } from '@/components/ui/photo-slot'
import { Monogram } from '@/components/ui/monogram'
import type { Guide, City } from '@/content/guides'

export function GuideHero({
  eyebrow,
  title,
  sub,
  slotId,
  placeholder,
}: {
  eyebrow: string
  title: string
  sub: string
  slotId: string
  placeholder: string
}) {
  return (
    <header id="top" className="bg-dark on-dark" style={{ position: 'relative', minHeight: '72vh' }}>
      <PhotoSlot
        id={slotId}
        alt={placeholder}
        style={{ position: 'absolute', inset: '0', width: '100%', height: '100%' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '0',
          pointerEvents: 'none',
          background:
            'linear-gradient(180deg, rgba(38,37,35,0.62) 0%, rgba(38,37,35,0.25) 45%, rgba(38,37,35,0.62) 100%)',
        }}
      />
      <div
        className="kt-container"
        style={{
          position: 'relative',
          zIndex: 4,
          minHeight: '72vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          paddingTop: '140px',
          paddingBottom: '72px',
          pointerEvents: 'none',
        }}
      >
        <p className="kt-eyebrow on-dark">{eyebrow}</p>
        <h1
          className="kt-display"
          style={{ maxWidth: '920px', fontSize: 'clamp(40px, 4.6vw, 64px)' }}
        >
          {title}
        </h1>
        <p
          className="kt-lead"
          style={{ color: 'var(--body-on-dark)', maxWidth: '460px', marginTop: '24px' }}
        >
          {sub}
        </p>
        <div style={{ marginTop: '40px' }}>
          <Monogram />
        </div>
      </div>
    </header>
  )
}

export function JumpBar({ cities }: { cities: Pick<City, 'id' | 'name'>[] }) {
  return (
    <div className="kt-jumpbar">
      <div className="kt-jumpbar-inner">
        <span className="jump-label">Jump to</span>
        {cities.map((c) => (
          <a key={c.id} className="kt-jump-link" href={'#' + c.id}>
            {c.name}
          </a>
        ))}
      </div>
    </div>
  )
}

export function CityRow({ city, alt }: { city: City; alt: boolean }) {
  return (
    <section
      id={city.id}
      className={'kt-city' + (alt ? ' alt' : '')}
      data-screen-label={city.name}
    >
      <div className="kt-container">
        <div className="grid-city">
          <div>
            <h2 className="kt-h1">{city.name}</h2>
            <hr className="kt-rule rule-light" />
            <div className="kt-citystats">
              <p>{city.price}</p>
              <p>{city.drive}</p>
              <p>{city.transit}</p>
              <p className="stat-schools">{city.schools}</p>
            </div>
            <p className="kt-eyebrow" style={{ marginTop: '36px' }}>
              Best for
            </p>
            <p style={{ maxWidth: '440px' }}>{city.bestFor}</p>
          </div>
          <div className="kt-citybody">
            {city.paras.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function GuidePageView({ guide }: { guide: Guide }) {
  const { eyebrow, title, sub, slotId, placeholder, cities } = guide

  return (
    <div>
      <KTNav base="/" />
      <main id="main">
      <GuideHero
        eyebrow={eyebrow}
        title={title}
        sub={sub}
        slotId={slotId}
        placeholder={placeholder}
      />
      <JumpBar cities={cities} />
      <section
        className="bg-light"
        style={{ padding: 'calc(72px * var(--dm)) 24px 0', textAlign: 'center' }}
      >
        <h2 className="kt-h1">
          The <em className="kt-em" style={{ fontStyle: 'italic' }}>Neighborhoods</em>
        </h2>
        <hr className="kt-rule rule-light" style={{ margin: '28px auto 0' }} />
      </section>
      <div className="bg-light" style={{ paddingTop: 'calc(40px * var(--dm))' }}>
        {cities.map((c, i) => (
          <CityRow key={c.id} city={c} alt={i % 2 === 0} />
        ))}
      </div>
      </main>
      <div className="bg-dark on-dark" style={{ position: 'relative' }}>
        <KTNewsletter />
        <KTFooter />
      </div>
    </div>
  )
}
