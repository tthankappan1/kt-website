'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { GROUP_LABEL, GROUP_ORDER, photoSrc } from '@/content/listings'
import type { Listing } from '@/content/listings'
import { Lightbox } from './lightbox'
import type { LightboxItem } from './lightbox'

type TileProps = {
  index: number
  src: string
  alt: string
  wide?: boolean
  contain?: boolean
  onOpen: (index: number, el: HTMLButtonElement) => void
}

function Tile({ index, src, alt, wide, contain, onOpen }: TileProps) {
  return (
    <button
      type="button"
      className={'kt-gallery-tile' + (wide ? ' wide' : '')}
      onClick={(e) => onOpen(index, e.currentTarget)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        loading="lazy"
        sizes={
          wide
            ? '(max-width: 700px) 100vw, (max-width: 1200px) 66vw, 800px'
            : '(max-width: 700px) 50vw, (max-width: 1200px) 33vw, 400px'
        }
        style={{ objectFit: contain ? 'contain' : 'cover' }}
      />
    </button>
  )
}

// Photo gallery grouped by room, plus the floor plans, sharing one lightbox
// (spec 2026-09-03 §Listing page 3–4). First tile of each group runs wide.
export function ListingGallery({ listing }: { listing: Listing }) {
  const [index, setIndex] = useState<number | null>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)

  const floorPlans = listing.floorPlans ?? []
  const items: LightboxItem[] = [
    ...listing.photos.map((p) => ({ src: photoSrc(listing, p.file), alt: p.alt })),
    ...floorPlans.map((f) => ({ src: photoSrc(listing, f.file), alt: f.alt, contain: true })),
  ]
  const total = items.length

  const open = useCallback((i: number, el: HTMLButtonElement) => {
    openerRef.current = el
    setIndex(i)
  }, [])
  const close = useCallback(() => setIndex(null), [])
  const step = useCallback(
    (delta: number) => setIndex((i) => (i === null ? null : (i + delta + total) % total)),
    [total],
  )

  // Runs after the Lightbox's own effect has closed the dialog (children first).
  useEffect(() => {
    if (index === null && openerRef.current) {
      openerRef.current.focus()
      openerRef.current = null
    }
  }, [index])

  const groups = GROUP_ORDER.map((g) => ({
    g,
    photos: listing.photos.map((p, i) => ({ p, i })).filter(({ p }) => p.group === g),
  })).filter((x) => x.photos.length > 0)

  return (
    <>
      <section id="photos" className="kt-section kt-listing-gallery">
        <div className="kt-container">
          <div className="kt-gallery-head">
            <div>
              <p className="kt-eyebrow">Photos</p>
              <h2 className="kt-h1">
                Take a look <em className="kt-em">around</em>.
              </h2>
            </div>
            <span className="kt-gallery-count">{listing.photos.length} photos</span>
          </div>
          {groups.map(({ g, photos }) => (
            <div key={g} className="kt-gallery-group">
              <p className="kt-gallery-caption">{GROUP_LABEL[g]}</p>
              <div className="kt-gallery-grid">
                {photos.map(({ p, i }, j) => (
                  <Tile
                    key={p.file}
                    index={i}
                    src={photoSrc(listing, p.file)}
                    alt={p.alt}
                    wide={j === 0}
                    onOpen={open}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {floorPlans.length > 0 ? (
        <section id="floor-plan" className="kt-section bg-light kt-listing-floorplan">
          <div className="kt-container">
            <p className="kt-eyebrow">Floor plan</p>
            <h2 className="kt-h1">
              The <em className="kt-em">layout</em>.
            </h2>
            <hr className="kt-rule rule-light" />
            <div className="kt-floorplans">
              {floorPlans.map((f, j) => (
                <Tile
                  key={f.file}
                  index={listing.photos.length + j}
                  src={photoSrc(listing, f.file)}
                  alt={f.alt}
                  contain
                  onOpen={open}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Lightbox items={items} index={index} onClose={close} onStep={step} />
    </>
  )
}
