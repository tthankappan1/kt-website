'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Monogram } from '@/components/ui/monogram'
import { NavSocial } from '@/components/nav/nav-social'
import { ResourcesDrop } from '@/components/nav/resources-drop'
import { MobileMenu } from '@/components/nav/mobile-menu'

interface KTNavProps {
  base?: string
}

export function KTNav({ base = '' }: KTNavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const burgerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    burgerRef.current?.focus()
  }, [])

  return (
    <nav className={'kt-nav' + (scrolled ? ' scrolled' : '')}>
      <div className="kt-nav-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href={base + '#top'} aria-label="Kalyani Thilak — home" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            <Monogram />
          </a>
          <a className="kt-wordmark" href={base + '#top'}>
            Kalyani Thilak
            <span className="wm-sub">REALTOR&reg; &middot; TRI-VALLEY</span>
          </a>
          <span className="kt-nav-divider" aria-hidden="true"></span>
          <span className="kt-nav-intero">Intero</span>
        </div>
        <div className="kt-navlinks">
          <a className="kt-navlink" href={base + '#about'}>About</a>
          <a className="kt-navlink" href={base + '#services'}>Services</a>
          <a className="kt-navlink" href={base + '#testimonials'}>Testimonials</a>
          <Link className="kt-navlink" href="/newsletter">Newsletter</Link>
          <ResourcesDrop />
          <NavSocial />
          <Link className="kt-btn btn-ghost-dark" href="/contact" style={{ padding: '10px 22px' }}>Contact</Link>
        </div>
        <button
          ref={burgerRef}
          className="kt-burger"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="kt-mobile-menu"
          onClick={() => setMenuOpen(true)}
        >
          <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
            <path d="M1 1h20M1 13h20" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </div>
      {menuOpen ? <MobileMenu base={base} onClose={closeMenu} /> : null}
    </nav>
  )
}
