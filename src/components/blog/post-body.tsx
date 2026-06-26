import { KtInline } from '@/lib/inline'
import type { PostBlock } from '@/content/posts/types'

export function PostBody({ body }: { body: PostBlock[] }) {
  return (
    <>
      {body.map((b, idx) => {
        if (typeof b === 'string') {
          return (
            <p key={idx}>
              <KtInline text={b} />
            </p>
          )
        }
        if ('h' in b) {
          return (
            <h2 key={idx}>
              <KtInline text={b.h} emClass="kt-em" />
            </h2>
          )
        }
        if ('list' in b) {
          return (
            <ul key={idx} className="kt-list">
              {b.list.map((item, li) => (
                <li key={li}>
                  <KtInline text={item} />
                </li>
              ))}
            </ul>
          )
        }
        if ('cta' in b) {
          return (
            <div key={idx} className="kt-cta">
              <KtInline text={b.cta} />
            </div>
          )
        }
        if ('disclaimer' in b) {
          return (
            <p key={idx} className="kt-disclaimer">
              {b.disclaimer}
            </p>
          )
        }
        if ('sources' in b) {
          return (
            <div key={idx} className="kt-sources">
              <span className="src-label">Sources</span>
              {b.sources.map((s, si) => (
                <span key={si}>
                  {si > 0 ? ' · ' : ''}
                  <a href={s.href} target="_blank" rel="noreferrer">
                    {s.t}
                  </a>
                </span>
              ))}
            </div>
          )
        }
        return null
      })}
    </>
  )
}
