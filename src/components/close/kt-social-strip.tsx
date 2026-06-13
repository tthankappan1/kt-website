import { PhotoSlot } from '@/components/ui/photo-slot'

const tiles = [
  { id: 'social-1', alt: 'Recent Instagram post — listing reel' },
  { id: 'social-2', alt: 'Recent Instagram post — market update' },
  { id: 'social-3', alt: 'Recent Instagram post — neighborhood' },
  { id: 'social-4', alt: 'Recent Instagram post — behind the scenes' },
]

export function KTSocialStrip() {
  return (
    <div className="kt-container" style={{ paddingTop: 'var(--sect-pad)' }}>
      <div className="kt-reveal" style={{ textAlign: 'center', marginBottom: 'var(--gap-section)' }}>
        <p className="kt-eyebrow on-dark">Follow along</p>
        <h2 className="kt-h1" style={{ color: 'var(--ivory)' }}>The Tri-Valley, <em className="kt-em">weekly</em>.</h2>
        <p className="kt-measure" style={{ margin: '20px auto 0', color: 'var(--body-on-dark)' }}>
          Market updates, neighborhood guides, and a look at what is actually selling &mdash;
          written for people who read past the headline.
        </p>
      </div>
      <div className="kt-social-grid kt-reveal">
        {tiles.map((t) => (
          <PhotoSlot
            key={t.id}
            id={t.id}
            alt={t.alt}
            radius={16}
            style={{ width: '100%', height: 'auto', aspectRatio: '1 / 1', display: 'block' }}
          />
        ))}
      </div>
    </div>
  )
}
