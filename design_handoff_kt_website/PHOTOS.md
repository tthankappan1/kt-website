# Photo inventory & management process

Photos are NOT hardcoded into layouts. Every photo lives in a named **slot**;
the slot owns the aspect ratio and crops whatever you give it (`object-fit:
cover` behavior — the image fills the frame, excess is trimmed). You never
need to pre-crop a photo to an exact ratio.

## How to add / change a photo (prototype phase)
1. Open the page and **drag the image file onto the slot** (or click the empty
   slot to browse). It persists automatically.
2. **Double-click a filled slot to reframe**: drag to reposition the crop,
   drag a corner (or scroll) to zoom. Click outside / Esc to commit.
3. Hover a filled slot for **Replace / Remove** buttons.

Slots can also carry a default file from the repo via their `src` attribute
(currently only the contact portrait does — `images/contact-portrait.jpg`,
prepared from `uploads/Spring-53.JPEG`). A drag-and-drop overrides the
default; Remove restores it.

## How it works at build phase (the "clear process")
Each slot id becomes a real file in `/images/` with the SAME NAME
(`images/<slot-id>.jpg`). Updating a photo = replacing one file, push,
auto-deploy (~1 min). No layout or code edits, ever. The build framework's
image pipeline handles resizing/optimization.

## Slot inventory

| Slot id | Page | Ratio / shape | Guidance for the photo |
|---|---|---|---|
| `hero-split-img` | Home (Split hero variant) | tall half-screen, ~1:1.2 | warm dusk exterior, subject right-of-center safe |
| `hero-full-img` | Home (Full-bleed hero — current default) | full viewport, ~16:9 landscape | wide scenic; text overlays bottom-left, keep that corner quiet |
| `hero-type-img` | Home (Typographic hero variant) | ~4:3 | portrait or architectural detail |
| `about-portrait` | Home — About section | ~4:5 portrait | casual professional portrait |
| `social-1` … `social-4` | Home — Follow along strip | 1:1 square | recent IG/FB posts |
| `contact-portrait` | Contact page | **4:5 portrait** | headshot/half-body; HAS default file |
| `guide-alameda-hero` | Alameda guide | full-width band, wide landscape | Tri-Valley hills / Main Street |
| `guide-contracosta-hero` | Contra Costa guide | full-width band, wide landscape | Danville / Mt. Diablo |
| `blog-<slug>` | Blog (only posts with `cover: true`) | 16:10 card + 21:9 reader (same image, reframable per spot) | editorial; landscape, wide-safe |

**Aspect-ratio rule of thumb:** supply photos at or above ~1600px on the long
side, in roughly the right orientation (portrait slot → portrait-ish photo);
the slot's cover-crop + double-click reframe handles the rest.
