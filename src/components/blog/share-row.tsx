'use client'

import { useState } from 'react'
import { SITE_URL } from '@/lib/site'

const KT_SHARE_ICONS = {
  facebook:
    'M13.4 21.5v-7.6h2.55l.38-2.96H13.4V9.05c0-.86.24-1.44 1.47-1.44h1.57V4.96c-.27-.04-1.2-.12-2.29-.12-2.26 0-3.81 1.38-3.81 3.92v2.18H7.78v2.96h2.56v7.6h3.06Z',
  linkedin:
    'M6.94 8.5H3.56v12h3.38v-12ZM5.25 3.5a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM12.6 8.5H9.36v12h3.37v-6.3c0-1.71.33-3.37 2.45-3.37 2.09 0 2.12 1.96 2.12 3.48v6.19h3.38v-6.86c0-2.93-.63-5.44-4.06-5.44-1.65 0-2.75.9-3.2 1.76h-.05V8.5H12.6Z',
  x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25h6.826l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z',
  whatsapp:
    'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26C2.167 6.443 6.602 2.01 12.054 2.01c2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.883-9.885 9.883m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z',
  email:
    'M2 4h20v16H2V4Zm2 2v.511l8 5.333 8-5.333V6H4Zm16 2.989-8 5.333-8-5.333V18h16V8.989Z',
  link: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1ZM8 13h8v-2H8v2Zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5Z',
}

export function ShareRow({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const url = SITE_URL + '/home-guide/' + slug
  const enc = encodeURIComponent
  const targets = [
    {
      cls: 'sb-facebook',
      label: 'Share on Facebook',
      icon: 'facebook' as const,
      href: 'https://www.facebook.com/sharer/sharer.php?u=' + enc(url),
    },
    {
      cls: 'sb-linkedin',
      label: 'Share on LinkedIn',
      icon: 'linkedin' as const,
      href: 'https://www.linkedin.com/sharing/share-offsite/?url=' + enc(url),
    },
    {
      cls: 'sb-x',
      label: 'Share on X',
      icon: 'x' as const,
      href: 'https://twitter.com/intent/tweet?text=' + enc(title) + '&url=' + enc(url),
    },
    {
      cls: 'sb-whatsapp',
      label: 'Share on WhatsApp',
      icon: 'whatsapp' as const,
      href: 'https://wa.me/?text=' + enc(title + ' — ' + url),
    },
    {
      cls: 'sb-email',
      label: 'Share by email',
      icon: 'email' as const,
      href: 'mailto:?subject=' + enc(title) + '&body=' + enc(url),
    },
  ]

  const copy = () => {
    const finish = () => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    }
    const fallback = () => {
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
      } catch {}
      document.body.removeChild(ta)
      finish()
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(finish).catch(fallback)
    } else {
      fallback()
    }
  }

  return (
    <div>
      <p className="kt-eyebrow" style={{ marginBottom: '14px' }}>
        Share this issue
      </p>
      <div className="kt-share">
        {targets.map((t) => (
          <a
            key={t.cls}
            className={'kt-share-btn ' + t.cls}
            href={t.href}
            target="_blank"
            rel="noreferrer"
            aria-label={t.label}
            title={t.label}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={KT_SHARE_ICONS[t.icon]}></path>
            </svg>
          </a>
        ))}
        <button
          className={'kt-share-btn sb-copy' + (copied ? ' copied' : '')}
          onClick={copy}
          aria-label={copied ? 'Link copied' : 'Copy link'}
          title="Copy a plain URL to paste anywhere"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={KT_SHARE_ICONS.link}></path>
          </svg>
          {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>
    </div>
  )
}
