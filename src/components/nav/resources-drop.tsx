'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { CLIENT_RESOURCES } from '@/lib/site'

export function ResourcesDrop() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false)
    }
  }, [])

  const handleBlur = useCallback((e: React.FocusEvent) => {
    // Close when focus leaves the navdrop container entirely
    if (containerRef.current && !containerRef.current.contains(e.relatedTarget as Node)) {
      setOpen(false)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={'kt-navdrop' + (open ? ' open' : '')}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      <a
        className="kt-navlink"
        href="#resources"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={(e) => {
          e.preventDefault()
          setOpen(!open)
        }}
      >
        Client Resources
        <svg className="drop-caret" width="9" height="6" viewBox="0 0 9 6" fill="none" aria-hidden="true">
          <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.2"></path>
        </svg>
      </a>
      <div className="kt-drop-wrap">
        <div className="kt-drop-panel">
          {CLIENT_RESOURCES.map((item) => (
            <Link key={item.label} className="kt-drop-item" href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
