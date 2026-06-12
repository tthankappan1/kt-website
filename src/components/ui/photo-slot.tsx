import Image from 'next/image'
import type { CSSProperties } from 'react'
import { slotImageSrc } from '@/lib/images'

type PhotoSlotProps = {
  /** Slot id from PHOTOS.md — fills from public/images/<id>.jpg */
  id: string
  alt: string
  /** Asymmetric top-left radius in px (brand signature shape) */
  radius?: number
  className?: string
  style?: CSSProperties
  /** next/image sizes hint for responsive loading */
  sizes?: string
  /** Set for above-the-fold heroes */
  priority?: boolean
}

// Production replacement for the prototype's <image-slot> drop-zones.
// Filled slot → optimized cover-cropped image; empty slot → quiet brand
// frame, no placeholder text (README §10).
export function PhotoSlot({ id, alt, radius, className, style, sizes, priority }: PhotoSlotProps) {
  const src = slotImageSrc(id)
  const slotStyle: CSSProperties = {
    ...style,
    ...(radius ? { borderTopLeftRadius: `${radius}px` } : null),
  }
  return (
    <div className={`kt-slot${className ? ` ${className}` : ''}`} style={slotStyle} data-slot={id}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes ?? '100vw'} priority={priority} />
      ) : (
        <div className="kt-slot-empty" aria-hidden="true" />
      )}
    </div>
  )
}
