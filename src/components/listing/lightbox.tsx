'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

export type LightboxItem = { src: string; alt: string; contain?: boolean }

type LightboxProps = {
  items: LightboxItem[]
  /** Index into `items`, or null when closed. */
  index: number | null
  onClose: () => void
  onStep: (delta: number) => void
}

// Native <dialog> lightbox: showModal() gives us the focus trap, inertness and
// Escape for free; arrow keys step. The parent owns the index (spec 2026-09-03
// §Listing page 3) and returns focus to the opening tile after close.
export function Lightbox({ items, index, onClose, onStep }: LightboxProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    const isOpen = d.hasAttribute('open')
    if (index !== null && !isOpen) {
      if (typeof d.showModal === 'function') d.showModal()
      else d.setAttribute('open', '')
    } else if (index === null && isOpen) {
      if (typeof d.close === 'function') d.close()
      else d.removeAttribute('open')
    }
  }, [index])

  const item = index !== null ? items[index] : null

  return (
    <dialog
      ref={ref}
      className="kt-lightbox"
      aria-label="Photo viewer"
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') onStep(-1)
        else if (e.key === 'ArrowRight') onStep(1)
        else if (e.key === 'Escape') {
          e.preventDefault()
          onClose()
        }
      }}
    >
      {item && index !== null ? (
        <div className="kt-lightbox-inner">
          <div className="kt-lightbox-top">
            <span className="kt-lightbox-count">
              {index + 1} / {items.length}
            </span>
            <button type="button" className="kt-lightbox-btn" aria-label="Close" onClick={onClose}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 3l14 14M17 3L3 17" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          </div>
          <div className="kt-lightbox-stage">
            <Image
              key={item.src}
              src={item.src}
              alt={item.alt}
              fill
              sizes="100vw"
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="kt-lightbox-bottom">
            <button
              type="button"
              className="kt-lightbox-btn"
              aria-label="Previous photo"
              onClick={() => onStep(-1)}
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M12.5 3.5L6 10l6.5 6.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
            <p className="kt-lightbox-caption">{item.alt}</p>
            <button
              type="button"
              className="kt-lightbox-btn"
              aria-label="Next photo"
              onClick={() => onStep(1)}
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M7.5 3.5L14 10l-6.5 6.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  )
}
