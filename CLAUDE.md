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
- **Static-first:** every page SSG; blog at `/home-guide/<slug>` via
  `generateStaticParams`. Only server code: `POST /api/lead`,
  `POST /api/newsletter`.
- **Supabase schema is locked** (`supabase/migrations/0001_leads_newsletter.sql`
  = README §7 exactly). RLS on, NO policies; writes only through the route
  handlers with the secret key (server-only). Zod-validate everything; honeypot
  field `website` on both forms.
- **Supabase keys: use the NEW API keys** (decided day-one; legacy JWT keys
  deprecate end-2026). Env vars: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  (`sb_publishable_…`, `anon` role, respects RLS, client-safe, currently unused
  in code) and `SUPABASE_SECRET_KEY` (`sb_secret_…`, `service_role` role,
  bypasses RLS, server-only, the only write path). Do NOT use
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`/`SUPABASE_SERVICE_ROLE_KEY` (legacy) — this
  supersedes the legacy names in the design-handoff README/START-HERE.
  `getSupabaseAdmin()`/`assertSecretKey()` throws at startup if an RLS-respecting
  key (publishable or anon) is placed in the secret slot.
  - Known conflict, decided: the contact form's optional lastName/phone have
    no §7 columns — the route appends them to `message` in a delimited block.
- Blog section name locked: **"Home Guide"**. Posts are typed TS files in
  `src/content/posts/` — publishing = add file + git push. 2 real issues; the
  6 `draft: true` posts NEVER ship to production (visible in dev only).
- Photo slots: `public/images/<slot-id>.jpg` (ids in PHOTOS.md) rendered by
  `PhotoSlot` — filled → `next/image` cover-crop; absent → quiet brand frame,
  no placeholder text.

## Content warnings (README §9 — before go-live, owner must)

- Replace/verify ALL resource-page copy and guide prices/commutes (drafts!).
- Replace the 6 draft posts; confirm testimonials are real + permissioned.
- Day-one home hero photo (`hero-full-img`).

## Commands

`pnpm dev` · `pnpm build` · `pnpm lint` · `pnpm typecheck` · `pnpm test` ·
`pnpm shots` (side-by-side prototype/built screenshots; needs playwright +
running server). All four gates must be green before any commit is "done".
