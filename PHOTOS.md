# Photo Slots

Drop the file at `public/images/<slot-id>.jpg`. If the file is absent the component renders a quiet brand-colored placeholder frame — no broken image, no placeholder text.

---

## Home page (`/`)

| Slot ID | File | Where on page | Size / ratio | Notes |
|---|---|---|---|---|
| `hero-full-img` | `public/images/hero-full-img.jpg` | Full-bleed hero background behind the name/headline | 100vw × 94vh — use a wide landscape shot, 2400px+ wide | A charcoal gradient overlay is applied; avoid very light/washed-out images |
| `about-portrait` | `public/images/about-portrait.jpg` | About section — left column portrait | 360 × 440 px (portrait orientation) | Sits beside the bio copy |
| `social-1` – `social-4` | `public/images/social-1.jpg` … `social-4.jpg` | "Follow along" strip near the bottom (dark section) | Square 1:1 | Four tiles shown side by side; treat like Instagram feed screenshots |

---

## Contact page (`/contact`)

| Slot ID | File | Where on page | Size / ratio | Notes |
|---|---|---|---|---|
| `contact-portrait` | `public/images/contact-portrait.jpg` | Sidebar left of the contact form | 4:5 portrait ratio | Different photo from `about-portrait` recommended — same subject, different crop/mood |

---

## Neighborhood guide pages (`/neighborhoods/…`)

| Slot ID | File | Where on page | Size / ratio | Notes |
|---|---|---|---|---|
| `guide-alameda-hero` | `public/images/guide-alameda-hero.jpg` | Alameda County guide hero background | 100vw × 72vh — wide landscape | Same gradient overlay as hero; Tri-Valley / East Bay scenery works well |
| `guide-contracosta-hero` | `public/images/guide-contracosta-hero.jpg` | Contra Costa County guide hero background | 100vw × 72vh — wide landscape | |

---

## Home Guide blog posts (`/home-guide/<slug>`)

Each post with `cover: true` in its frontmatter gets a cover image. The slot ID is `blog-` + the post's slug.

| Slot ID pattern | File | Where | Size / ratio |
|---|---|---|---|
| `blog-<slug>` | `public/images/blog-<slug>.jpg` | Top of the post page (below the headline) | 21:9 wide banner |
| `blog-<slug>` (same file) | — | Home page featured section: lead post 16:10, secondary posts 16:9 | Same file is reused at different crops via `next/image` |

Example: a post with `slug: "spring-2025-market-update"` uses `public/images/blog-spring-2025-market-update.jpg`.

---

## Unused / not yet wired

| File | Status |
|---|---|
| `hero-split-img.jpg` | No component references this slot ID — file is present but not displayed anywhere. Either rename it to match an existing slot, or a new component needs to be built that uses `id="hero-split-img"`. |
