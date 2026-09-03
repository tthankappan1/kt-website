import { beforeAll, describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { getListing } from '@/content/listings'
import { ListingGallery } from '@/components/listing/listing-gallery'

const base = getListing('553-covington-way-livermore')!
const TOTAL = base.photos.length + (base.floorPlans?.length ?? 0) // 29

// jsdom may not implement <dialog> showModal/close — polyfill the bits we use.
beforeAll(() => {
  const proto = HTMLDialogElement.prototype as HTMLDialogElement & {
    showModal: () => void
    close: () => void
  }
  if (typeof proto.showModal !== 'function') {
    proto.showModal = function (this: HTMLDialogElement) {
      this.setAttribute('open', '')
    }
  }
  if (typeof proto.close !== 'function') {
    proto.close = function (this: HTMLDialogElement) {
      this.removeAttribute('open')
      this.dispatchEvent(new Event('close'))
    }
  }
})

function dialog() {
  return document.querySelector('dialog.kt-lightbox') as HTMLDialogElement
}

describe('ListingGallery', () => {
  it('renders every photo as a tile button named by its alt text, grouped with captions', () => {
    render(<ListingGallery listing={base} />)
    for (const p of base.photos) {
      expect(screen.getByRole('button', { name: p.alt })).toBeInTheDocument()
    }
    for (const label of ['The exterior', 'Living room', 'Kitchen & dining', 'Bedrooms', 'Baths', 'Outdoor']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
    expect(screen.getByText('27 photos')).toBeInTheDocument()
  })

  it('renders the floor plans as tiles in their own section', () => {
    const { container } = render(<ListingGallery listing={base} />)
    expect(container.querySelector('#floor-plan')).toBeInTheDocument()
    for (const f of base.floorPlans!) {
      expect(screen.getByRole('button', { name: f.alt })).toBeInTheDocument()
    }
  })

  it('opens the lightbox on the clicked photo with a running counter', () => {
    render(<ListingGallery listing={base} />)
    expect(dialog().hasAttribute('open')).toBe(false)
    fireEvent.click(screen.getByRole('button', { name: base.photos[2].alt }))
    const dlg = dialog()
    expect(dlg.hasAttribute('open')).toBe(true)
    expect(within(dlg).getByRole('img', { name: base.photos[2].alt })).toBeInTheDocument()
    expect(within(dlg).getByText(`3 / ${TOTAL}`)).toBeInTheDocument()
    expect(within(dlg).getByText(base.photos[2].alt)).toBeInTheDocument()
  })

  it('steps with the buttons and arrow keys, wrapping at the ends', () => {
    render(<ListingGallery listing={base} />)
    fireEvent.click(screen.getByRole('button', { name: base.photos[0].alt }))
    const dlg = dialog()
    fireEvent.click(within(dlg).getByRole('button', { name: 'Next photo' }))
    expect(within(dlg).getByText(`2 / ${TOTAL}`)).toBeInTheDocument()
    fireEvent.keyDown(dlg, { key: 'ArrowLeft' })
    expect(within(dlg).getByText(`1 / ${TOTAL}`)).toBeInTheDocument()
    fireEvent.keyDown(dlg, { key: 'ArrowLeft' })
    expect(within(dlg).getByText(`${TOTAL} / ${TOTAL}`)).toBeInTheDocument()
    expect(within(dlg).getByRole('img', { name: base.floorPlans![1].alt })).toBeInTheDocument()
    fireEvent.keyDown(dlg, { key: 'ArrowRight' })
    expect(within(dlg).getByText(`1 / ${TOTAL}`)).toBeInTheDocument()
  })

  it('closes on the Close button and on Escape, returning focus to the opening tile', () => {
    render(<ListingGallery listing={base} />)
    const tile = screen.getByRole('button', { name: base.photos[4].alt })
    fireEvent.click(tile)
    const dlg = dialog()
    fireEvent.click(within(dlg).getByRole('button', { name: 'Close' }))
    expect(dlg.hasAttribute('open')).toBe(false)
    expect(document.activeElement).toBe(tile)

    fireEvent.click(tile)
    expect(dlg.hasAttribute('open')).toBe(true)
    fireEvent.keyDown(dlg, { key: 'Escape' })
    expect(dlg.hasAttribute('open')).toBe(false)
    expect(document.activeElement).toBe(tile)
  })

  it('a floor-plan tile opens the lightbox past the photos', () => {
    render(<ListingGallery listing={base} />)
    fireEvent.click(screen.getByRole('button', { name: base.floorPlans![0].alt }))
    expect(within(dialog()).getByText(`${base.photos.length + 1} / ${TOTAL}`)).toBeInTheDocument()
  })
})
