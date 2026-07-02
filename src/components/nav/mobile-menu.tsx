'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Monogram } from '@/components/ui/monogram'
import { NavSocial } from '@/components/nav/nav-social'
import { CLIENT_RESOURCES } from '@/lib/site'

interface MobileMenuProps {
  base?: string
  onClose: () => void
}

// Full-screen mobile menu (spec 2026-07-01). Parent mounts it only while
// open — mounting is what triggers the entry animation and scroll lock.
export function MobileMenu({ base = '', onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [resourcesOpen, setResourcesOpen] = useState(false)

  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow
    const prevBody = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = prevHtml
      document.body.style.overflow = prevBody
    }
  }, [])

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
      return
    }
    if (e.key !== 'Tab' || !panelRef.current) return
    const focusables = panelRef.current.querySelectorAll<HTMLElement>('a[href], button')
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (!panelRef.current.contains(document.activeElement)) {
      e.preventDefault()
      first.focus()
      return
    }
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      id="kt-mobile-menu"
      className="kt-mobile-menu on-dark"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      onKeyDown={handleKeyDown}
    >
      <div className="kt-mm-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Monogram />
          <span className="kt-wordmark">
            Kalyani Thilak
            <span className="wm-sub">REALTOR&reg; &middot; TRI-VALLEY</span>
          </span>
        </div>
        <button ref={closeRef} className="kt-mm-close" aria-label="Close menu" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 3l14 14M17 3L3 17" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </div>
      <nav className="kt-mm-links" aria-label="Mobile">
        <a className="kt-mm-link" href={base + '#about'} onClick={onClose}>About</a>
        <a className="kt-mm-link" href={base + '#services'} onClick={onClose}>Services</a>
        <a className="kt-mm-link" href={base + '#testimonials'} onClick={onClose}>Testimonials</a>
        <Link className="kt-mm-link" href="/newsletter" onClick={onClose}>Newsletter</Link>
        <button
          className="kt-mm-link kt-mm-group"
          aria-expanded={resourcesOpen}
          aria-controls="kt-mm-resources"
          onClick={() => setResourcesOpen((prev) => !prev)}
        >
          Client Resources
          <svg
            className="drop-caret"
            width="11"
            height="7"
            viewBox="0 0 9 6"
            fill="none"
            aria-hidden="true"
            style={{ transform: resourcesOpen ? 'rotate(180deg)' : undefined }}
          >
            <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
        {resourcesOpen ? (
          <div id="kt-mm-resources" className="kt-mm-sub">
            {CLIENT_RESOURCES.map((item) => (
              <Link key={item.label} className="kt-mm-subitem" href={item.href} onClick={onClose}>
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}
      </nav>
      <div className="kt-mm-foot">
        <hr className="kt-rule" style={{ margin: 0 }} />
        <Link className="kt-btn btn-ghost-dark kt-mm-contact" href="/contact" onClick={onClose}>
          Contact
        </Link>
        <NavSocial />
        <span className="kt-mm-intero">Intero</span>
      </div>
    </div>
  )
}
