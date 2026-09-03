# kalyanithilak.com — engineering + brand rules

Personal real-estate site for Kalyani Thilak — REALTOR®, Intero Real Estate
Services (Livermore, CA), Tri-Valley / East Bay. DRE 02254890.

**Design source of truth:** `design_handoff_kt_website/design/` (hi-fi HTML
prototype). The production site recreates it 1:1. The build spec is
`design_handoff_kt_website/README.md`; locked decisions are in
`PROJECT-STATUS.md`; photo slots in `PHOTOS.md`.

## Brand hard rules (NEVER break)

| Token | Value | Use |
|---|---|---|
| `--charcoal` | `#262623` | dark surfaces, headings on light |
| `--ivory` | `#F3F0EB` | light surfaces, text on dark |
| `--gold` | `#C0A278` | accents on DARK surfaces ONLY |
| `--gold-deep` | `#7E6A4F` | accents on LIGHT surfaces ONLY |
| `--body-on-dark` | `rgba(243,240,235,.78)` | body text on dark |
| `--body-on-light` | `rgba(38,37,35,.78)` | body text on light |
| `--tint-row` | `rgba(126,106,79,.08)` | row/hover tint on light |

1. **Gold crossing rule:** gold on dark, gold-deep on light — never swapped.
2. **Typography is locked:** Fraunces (display/serif) + Inter (body/sans) via
   `next/font` — NEVER Geist, never any substitute. Preserve
   `font-variation-settings: "opsz"` per type role (display 144, h2 96, h3 36…).
3. **Signature shape:** 1px hairline borders with asymmetric TOP-LEFT-ONLY
   radius — buttons 12px, cards 24px, monogram 13px, dropdown 18px. Never
   plain rounded corners.
4. **Dark bookends:** every multi-section page opens dark (nav/hero) and
   closes dark (newsletter + footer).
5. **INTERO** is always re-typed in Fraunces gold caps — never their logo image.
6. **No emoji.** Anywhere.
7. **Compliance block** (footer, marketing pieces): Intero Real Estate
   Services · A Berkshire Hathaway Affiliate · DRE 02254890 · 187 S J Street,
   Livermore.
8. Layout: max-width 1200px container, 48px gutters (24px ≤900px), 96px
   section padding. Density locked `--dm: 1`; home hero locked **Full-bleed**;
   `serifUI` locked false (variants were prototype-only tweaks).

## Architecture (locked)

- Next.js 15 App Router · React 19 · TS 5 · Tailwind 3.4 (brand tokens mapped
  into theme; the ported `.kt-*` classes in `src/app/globals.css` ARE the
  design system — do not restyle them).
- **Static-first:** every page SSG; blog at `/newsletter/<slug>` via
  `generateStaticParams`. Only server code: `POST /api/lead`,
  `POST /api/newsletter`.
- **Lead capture → KT CRM** (issue #6, 2026-07): both forms POST to the site's
  own route handlers (`/api/lead`, `/api/newsletter`), which forward
  server-side to the KT CRM ingestion API
  (`POST https://kt-crm.onrender.com/api/v1/contacts/ingest`; bearer
  `KT_CRM_INGEST_API_KEY`, optional `KT_CRM_INGEST_URL` override — both
  server-only; the CRM has no CORS, deliberately). Zod-validate everything;
  honeypot field `website` on both forms. Consent invariant: the homepage
  signup requests `lists: ["newsletter"]`; the contact form requests
  `["market-updates"]` ONLY when a county checkbox is ticked — never
  auto-subscribe. lastName/phone now map to real CRM fields (the old
  append-to-message workaround is retired).
- Blog section name locked: **"Newsletter"**, served at `/newsletter` (renamed
  from "Home Guide" 2026-06-26 — "Home Guide" read like a static buyer's guide,
  not the weekly newsletter archive it is; old `/home-guide` + `/home-guide/<slug>`
  paths 301-redirect to `/newsletter` in `next.config.ts`). Posts are typed TS
  files in `src/content/posts/` — publishing = add file + git push. 2 real
  issues; the 6 `draft: true` posts NEVER ship to production (visible in dev only).
- Photo slots: `public/images/<slot-id>.jpg` (ids in PHOTOS.md) rendered by
  `PhotoSlot` — filled → `next/image` cover-crop; absent → quiet brand frame,
  no placeholder text.
- **Listings** (2026-09-03, spec `docs/superpowers/specs/2026-09-03-listings-design.md`):
  `/listings` index + `/listings/<slug>` pages, both SSG. One typed TS file per
  listing in `src/content/listings/` (+ import in `index.ts`); photos at
  `public/images/listings/<slug>/` (see PHOTOS.md). `status`
  (`coming-soon | active | pending | sold`) alone drives the lifecycle —
  hero copy, card badge, index order, JSON-LD availability; marking sold =
  edit `status` (+ `soldPrice`), push. "Listings" is the first Client
  Resources item. The legacy RealGeeks redirect is `/listings/:section/:path+`
  (two+ segments) so our one-segment pages resolve — never widen it back to
  `/listings/:path*`. The inquiry form posts to `/api/lead` unchanged
  (`intent: buying`, address-prefixed message, no newsletter flags).

## Content ingestion rules

When updating copy in `src/content/resources.ts` (or any content TS file):

- **Always use template literals (backticks) for strings that contain apostrophes or contractions.** Copy-pasted text from word processors, chat, or Google Docs arrives with typographic curly quotes (U+2018 `'` / U+2019 `'`). These are invalid JS string delimiters and cause parse errors when pasted inside single-quoted strings.
- **Never bulk-replace curly quotes → straight quotes across the whole file.** That fixes delimiter issues but breaks any intentional typographic apostrophes already in the file (e.g. `"The Buyer's Guide"` uses a curly apostrophe on purpose).
- **Safe pattern:** use backtick template literals for any body/para/step string; reserve single or double quotes only for short keys and titles without apostrophes.

## Content warnings (README §9 — before go-live, owner must)

- Replace/verify ALL resource-page copy and guide prices/commutes (drafts!).
- Replace the 6 draft posts; confirm testimonials are real + permissioned.
- Day-one home hero photo (`hero-full-img`).

## Commands

`pnpm dev` · `pnpm build` · `pnpm lint` · `pnpm typecheck` · `pnpm test` ·
`pnpm shots` (side-by-side prototype/built screenshots; needs playwright +
running server). All four gates must be green before any commit is "done".
