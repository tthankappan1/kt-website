import { KT_SOCIALS } from '@/lib/site'

export function NavSocial() {
  return (
    <div className="kt-nav-social">
      {KT_SOCIALS.map((s) => (
        <a
          key={s.label}
          className={'kt-soc soc-' + s.slug}
          href={s.href}
          target="_blank"
          rel="noreferrer"
          aria-label={s.label}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={s.d}></path>
          </svg>
        </a>
      ))}
    </div>
  )
}
