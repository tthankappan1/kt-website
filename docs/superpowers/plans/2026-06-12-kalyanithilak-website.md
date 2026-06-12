# kalyanithilak.com Production Build — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recreate the hi-fi prototype in `design_handoff_kt_website/design/` 1:1 as a production-grade, static-first Next.js 15 site with Supabase lead/newsletter capture, full test coverage, and Lighthouse/security sign-off.

**Architecture:** Static-first App Router site — every page SSG (blog posts via `generateStaticParams`), the only server code is two POST route handlers (`/api/lead`, `/api/newsletter`) writing to Supabase with the service-role key behind Zod validation. The ported `kt-tokens.css` is the design-system layer (the `.kt-*` classes ARE the brand); Tailwind 3.4 supplies layout utilities with brand tokens mapped into its theme. Content (posts, resources, guides) lives in typed TS collections — publishing = git push.

**Tech Stack:** Next.js 15 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 3.4 · next/font (Fraunces variable + Inter — NEVER Geist) · Zod · @supabase/supabase-js (+ @supabase/ssr installed for future use) · Vitest + React Testing Library · ESLint (eslint-config-next) · pnpm 9 via corepack.

**Spec sources (authoritative):**
- `design_handoff_kt_website/README.md` — build spec (§ references below)
- `design_handoff_kt_website/design/kt-*.jsx` + `kt-tokens.css` — exact markup/copy/behavior
- `design_handoff_kt_website/PHOTOS.md` — image slot inventory
- `design_handoff_kt_website/PROJECT-STATUS.md` — locked decisions

---

## Global conversion rules (apply to EVERY ported component)

These rules are stated once; every task that ports prototype JSX must follow them.

| Prototype | Production |
|---|---|
| `<image-slot id="X" …>` | `<PhotoSlot id="X" alt="…" …>` (Task 1.8). Aspect/size styles preserved. Production shows NO "Drop image" text — quiet brand frame when image absent. |
| `href="KT Home.html"` / `base + '#about'` | `/` and `/#about` (on home page itself: `#about`) |
| `href="Contact.html"` | `/contact` |
| `href="Blog.html"` | `/home-guide` |
| `href="Blog Post.html?post=<slug>"` | `/home-guide/<slug>` |
| `href="Selling.html"` etc. | `/resources/selling`, `/resources/buying`, `/resources/cost-of-selling`, `/resources/intero-concierge`, `/resources/schools`, `/resources/market-updates`, `/resources/buyers-guide` |
| `Alameda County Neighborhoods.html` | `/neighborhoods/alameda-county` |
| `Contra Costa County Neighborhoods.html` | `/neighborhoods/contra-costa-county` |
| `localStorage['kt-blog-nav']` | hardcode `"Home Guide"` (decision locked) |
| `localStorage['kt-leads']` / `window.KT_CRM.submit()` | `POST /api/lead` |
| Tweaks panel / `useTweaks` / `TweaksPanel` | DELETE. Hardcode: hero = Full-bleed, `--dm: 1`, default palette, `serifUI = false`. Remove all `serifUI` props — they are always false, so drop the prop entirely and the `serif-ui` class branches. |
| `useReveal()` / `.kt-reveal` | Keep the class names for layout parity but content is always visible (tokens file already says "reveal-on-scroll removed"). Do NOT add IntersectionObserver. |
| `Object.assign(window, …)` | ES module exports |
| Inline `style={{…}}` objects | Keep as-is (pixel fidelity beats utility-class purity); convert to Tailwind ONLY where trivially identical |
| `<a>` internal links | `next/link` `<Link>`; external links keep `<a target="_blank" rel="noreferrer">` |
| jsx loose strings (`rows="4"`) | TS-correct (`rows={4}`) |
| No emoji anywhere; INTERO always re-typed Fraunces gold caps | hard brand rules |

**Client/server split rule:** default to Server Components. `'use client'` ONLY for: KTNav (scroll + dropdown state), KTNewsletter form, KTTestimonials (rotation), ContactForm, BlogArchive (filter + rail sync), ShareRow (copy). Everything else stays server.

**Definition of done for every task:** failing test written first → implementation → `pnpm test` green → `pnpm lint` + `pnpm typecheck` green → commit (conventional message). Milestone gates additionally run `pnpm build` + side-by-side screenshots vs prototype.

---

## File structure (target)

```
/ (repo root)
├── CLAUDE.md                          # brand hard rules + workflow (Task 1.10)
├── package.json / pnpm-lock.yaml      # packageManager: pnpm@9.15.0
├── next.config.ts · tsconfig.json · tailwind.config.ts · postcss.config.mjs
├── eslint.config.mjs · vitest.config.ts · .env.local.example · .gitignore
├── supabase/migrations/0001_leads_newsletter.sql
├── scripts/shots.mjs                  # Playwright side-by-side capture
├── public/images/<slot-id>.jpg        # photo slots (contact-portrait.jpg seeded)
├── src/
│   ├── app/
│   │   ├── layout.tsx · globals.css · page.tsx (home)
│   │   ├── icon.tsx                   # KT monogram favicon (ImageResponse)
│   │   ├── not-found.tsx · privacy/page.tsx
│   │   ├── sitemap.ts · robots.ts
│   │   ├── contact/page.tsx
│   │   ├── home-guide/page.tsx
│   │   ├── home-guide/[slug]/page.tsx
│   │   ├── home-guide/[slug]/opengraph-image.tsx
│   │   ├── resources/[slug]/page.tsx  # generateStaticParams over RESOURCE_PAGES, dynamicParams=false
│   │   ├── neighborhoods/alameda-county/page.tsx
│   │   ├── neighborhoods/contra-costa-county/page.tsx
│   │   └── api/lead/route.ts · api/newsletter/route.ts
│   ├── components/
│   │   ├── ui/photo-slot.tsx · ui/monogram.tsx
│   │   ├── nav/kt-nav.tsx · nav/resources-drop.tsx · nav/nav-social.tsx
│   │   ├── close/kt-footer.tsx · close/kt-newsletter.tsx · close/kt-social-strip.tsx
│   │   ├── home/hero-full.tsx · home/intro.tsx · home/services.tsx · home/testimonials.tsx
│   │   ├── contact/contact-form.tsx
│   │   ├── blog/featured.tsx · blog/archive.tsx · blog/share-row.tsx · blog/post-body.tsx
│   │   ├── resource/resource-page.tsx
│   │   └── guide/guide-page.tsx
│   ├── lib/
│   │   ├── inline.tsx                 # ktInline → <KtInline> + ktPlain
│   │   ├── dates.ts                   # ktFormatDate/ktShortDate/ktMonthLabel/ktMonthName
│   │   ├── images.ts                  # slot-id → public/images manifest (server-only)
│   │   ├── validation.ts              # Zod: LeadSchema, NewsletterSchema
│   │   ├── supabase-admin.ts          # service-role client factory (server-only)
│   │   └── site.ts                    # KT_SOCIALS, CLIENT_RESOURCES, contact constants, SITE_URL
│   └── content/
│       ├── posts/index.ts + posts/<slug>.ts (8 files, 6 with draft:true)
│       ├── resources.ts               # RESOURCE_PAGES port
│       └── guides.ts                  # ALAMEDA_CITIES + CONTRA_COSTA_CITIES port
└── tests co-located: src/**/__tests__/*.test.ts(x)
```

---

## Milestone 1 — Scaffold + tokens + fonts (README §12.1)

### Task 1.1: Repo scaffold
**Files:** Create `package.json`, `.gitignore`, `.env.local.example`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `next-env.d.ts` (generated).

- [ ] package.json (exact):
```json
{
  "name": "kalyanithilak-com",
  "version": "0.1.0",
  "private": true,
  "packageManager": "pnpm@9.15.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "shots": "node scripts/shots.mjs"
  }
}
```
- [ ] `pnpm add next@^15 react@^19 react-dom@^19 zod@^3.24 @supabase/supabase-js@^2 @supabase/ssr`
- [ ] `pnpm add -D typescript @types/react @types/react-dom @types/node tailwindcss@^3.4 postcss autoprefixer eslint eslint-config-next @eslint/eslintrc vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`
- [ ] `next.config.ts`: `{ reactStrictMode: true }` only. Static-first — no `output: 'export'` (route handlers need node runtime on Vercel; all pages still SSG).
- [ ] `.env.local.example`: `NEXT_PUBLIC_SUPABASE_URL=` / `NEXT_PUBLIC_SUPABASE_ANON_KEY=` / `SUPABASE_SERVICE_ROLE_KEY=` / `RESEND_API_KEY=` with comments from START-HERE.md.
- [ ] `.gitignore`: node_modules, .next, .env*.local, coverage, playwright artifacts, .DS_Store.
- [ ] Commit: `chore: scaffold Next 15 + React 19 + TS workspace`

### Task 1.2: Tailwind + tokens port
**Files:** Create `tailwind.config.ts`, `src/app/globals.css`.

- [ ] `globals.css` = `@tailwind base/components/utilities` + **full verbatim port of `design/kt-tokens.css`** with exactly these edits: (1) delete the Google-font-dependent `--serif`/`--sans` literals — set `--serif: var(--font-fraunces), serif; --sans: var(--font-inter), sans-serif;`; (2) `--dm: 1` fixed (comment: density locked Regular); (3) drop `image-slot::part` rules (replaced by PhotoSlot styles `.kt-slot`/`.kt-slot-empty` with same dark-surface tints); (4) keep every other selector byte-identical.
- [ ] `tailwind.config.ts` maps tokens:
```ts
import type { Config } from 'tailwindcss'
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#262623', ivory: '#F3F0EB',
        gold: { DEFAULT: '#C0A278', deep: '#7E6A4F' },
      },
      fontFamily: { serif: ['var(--font-fraunces)', 'serif'], sans: ['var(--font-inter)', 'sans-serif'] },
      maxWidth: { container: '1200px' },
    },
  },
  plugins: [],
} satisfies Config
```
- [ ] Test (`src/app/__tests__/tokens.test.ts`): read `globals.css` with `fs`, assert it contains `--charcoal: #262623`, `--gold: #C0A278`, `.kt-frame`, `border-top-left-radius: 24px`, `.kt-btn`, and does NOT contain `Geist` or `image-slot`.
- [ ] Commit: `feat: port kt-tokens design system into globals + Tailwind theme`

### Task 1.3: Fonts + root layout
**Files:** Create `src/app/layout.tsx`.

- [ ] Fraunces variable with optical-sizing axis + Inter via `next/font/google`:
```tsx
import { Fraunces, Inter } from 'next/font/google'
const fraunces = Fraunces({ subsets: ['latin'], axes: ['opsz'], variable: '--font-fraunces', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
```
- [ ] `<html lang="en">`, body gets both `.variable` classes. `metadata` export: `metadataBase: new URL('https://kalyanithilak.com')`, default title `Kalyani Thilak — Tri-Valley Real Estate`, title template `%s — Kalyani Thilak`, description from hero copy.
- [ ] Test: render layout children via RTL; assert html lang and font variable classes present.
- [ ] Commit: `feat: Fraunces+Inter via next/font with opsz axis, root layout + metadata base`

### Task 1.4: Test harness
**Files:** Create `vitest.config.ts`, `src/test/setup.ts`.

- [ ] `vitest.config.ts`: plugin-react, `environment: 'jsdom'`, `setupFiles: ['src/test/setup.ts']`, alias `@ → ./src`, `include: ['src/**/*.test.{ts,tsx}']`.
- [ ] `setup.ts`: `import '@testing-library/jest-dom/vitest'`.
- [ ] Trivial smoke test passes; `pnpm test`, `pnpm lint`, `pnpm typecheck` all green.
- [ ] Commit: `chore: vitest + RTL harness`

### Task 1.5: lib/dates + lib/inline (TDD — port from kt-blog-data.jsx:184-222)
**Files:** `src/lib/dates.ts`, `src/lib/inline.tsx`, tests.

- [ ] Tests first: `ktFormatDate('2026-05-29') === 'May 29, 2026'`; `ktShortDate === 'May 29'`; `ktMonthLabel('2026-05-29') === 'May 2026'`; `ktMonthName('2026-05') === 'May'`. KtInline: `*word*` → `<em class="kt-em">`, `**word**` → `<strong>`, plain passthrough, mixed string; `ktPlain('a *b* **c**') === 'a b c'`.
- [ ] Implement: pure date helpers (no `Date` object — parse the ISO string exactly like prototype to avoid TZ bugs). `KtInline({ text, emClass })` React component + `ktPlain`.
- [ ] Commit: `feat: date + inline-emphasis helpers (ported from prototype)`

### Task 1.6: lib/site constants
**Files:** `src/lib/site.ts`.

- [ ] Port verbatim from `kt-hero.jsx`: `KT_SOCIALS` (3 items with exact SVG path data + real URLs), `CLIENT_RESOURCES` (9 items, labels exact incl. `Buyer's Guide` / `Schools in Alameda & Contra Costa`, hrefs per conversion table). Add `SITE_URL`, `CONTACT_EMAIL = 'kthilak@intero.com'`, `CONTACT_PHONE_DISPLAY = '(408) 597-7371'`, `CONTACT_PHONE_TEL = '+14085977371'`, `DRE = '02254890'`, `ADDRESS = '187 S J Street · Livermore · California'`.
- [ ] Test: 9 resource items, 3 socials with https URLs, no `.html` in any href.
- [ ] Commit: `feat: site constants (socials, resources nav, contact identity)`

### Task 1.7: Supabase migration + admin client + Zod schemas (README §7 EXACT)
**Files:** `supabase/migrations/0001_leads_newsletter.sql`, `src/lib/supabase-admin.ts`, `src/lib/validation.ts`, tests.

- [ ] SQL file: the two `create table` statements from README §7 **byte-identical**, plus:
```sql
alter table leads enable row level security;
alter table newsletter_signups enable row level security;
-- NO anon policies: all writes go through the server route with the service-role key.
```
- [ ] `supabase-admin.ts`: lazy factory `getSupabaseAdmin()` using `process.env.NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`, `createClient(url, key, { auth: { persistSession: false } })`. `import 'server-only'`. Throws a clear error if env missing AT CALL TIME (build stays env-free).
- [ ] `validation.ts` (tests first — valid/invalid/honeypot/trim/email cases):
```ts
import { z } from 'zod'
export const LeadSchema = z.object({
  intent: z.enum(['selling', 'buying', 'both', 'curious']),
  timeframe: z.string().trim().max(40).nullable().optional(),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().max(80).optional().default(''),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional().default(''),
  message: z.string().trim().max(4000).optional().default(''),
  newsletterAlameda: z.boolean().default(false),
  newsletterContracosta: z.boolean().default(false),
  sourcePage: z.string().trim().max(200).optional().default(''),
  website: z.string().max(0).optional().default(''),  // honeypot — any value rejects
})
export const NewsletterSchema = z.object({
  email: z.string().trim().email().max(254),
  sourcePage: z.string().trim().max(200).optional().default(''),
  website: z.string().max(0).optional().default(''),
})
```
  Note: UI intent labels map `'Selling'→'selling'`, `'Just curious'→'curious'` (mapping lives in ContactForm).
  **Documented deviation:** `lastName`/`phone` have no §7 columns (spec-internal conflict — design has the fields, schema doesn't). Route appends them to `message` as `\n—\nLast name: X\nPhone: Y` when present. Schema itself stays §7-exact. Flag for Kalyani in final report.
- [ ] Commit: `feat: Supabase schema (§7 exact, RLS on) + server-only admin client + Zod validation`

### Task 1.8: PhotoSlot component
**Files:** `src/lib/images.ts`, `src/components/ui/photo-slot.tsx`, test. Copy `design_handoff_kt_website/design/images/contact-portrait.jpg` → `public/images/contact-portrait.jpg`.

- [ ] `images.ts` (server-only): `hasSlotImage(id)` via fs manifest of `public/images/*.{jpg,jpeg,png,webp}` built once at module scope.
- [ ] `photo-slot.tsx` (server component): props `{ id, alt, aspect?: string, fill?: boolean, className?, style?, sizes?, priority?, radius? }`. If image exists → `next/image` (fill mode inside relatively-positioned wrapper, `object-fit: cover`); else quiet placeholder `<div className="kt-slot-empty">` (no text). Wrapper carries the prototype's style (aspectRatio, borderRadius — `border-top-left-radius` asymmetric per shape="rounded" radius=N).
- [ ] `.kt-slot-empty` styles in globals.css: light surface `rgba(126,106,79,0.08)` + hairline `1px solid rgba(126,106,79,0.22)`; dark surface (`.on-dark` ancestor) `rgba(243,240,235,0.05)` + `rgba(192,162,120,0.25)` border.
- [ ] Test: renders img for `contact-portrait` (exists), renders empty frame for `hero-full-img` (absent), alt text correct.
- [ ] Commit: `feat: PhotoSlot — slot-id image pipeline with quiet brand placeholder`

### Task 1.9: scripts/shots.mjs (side-by-side harness)
**Files:** `scripts/shots.mjs`. Dev-dep `playwright` + `pnpm exec playwright install chromium`.

- [ ] Script: array of `{ name, prototype: 'file://…/design/<Page>.html', built: 'http://localhost:3000<route>' }`; full-page screenshots at 1440×900 (and 390×844 mobile) into `shots/<milestone>/`; prototype + built captured for any routes passed as CLI args (default: all).
- [ ] Commit: `chore: Playwright side-by-side screenshot harness`

### Task 1.10: CLAUDE.md (brand hard rules — README §4 + kt-brand skill)
**Files:** `CLAUDE.md` at repo root.

- [ ] Content: tokens table (§4); gold-on-dark / gold-deep-on-light NEVER swapped; Fraunces+Inter locked (NEVER Geist, preserve `opsz`); signature asymmetric top-left radius (buttons 12 / cards 24 / monogram 13 / dropdown 18); dark bookends on multi-section pages; INTERO re-typed Fraunces gold caps never logo image; no emoji; DRE compliance block contents; density locked `--dm: 1`; hero locked Full-bleed; blog section name locked "Home Guide" at `/home-guide/<slug>`; content drafts warning (§9); photo slot convention (`public/images/<slot-id>.jpg`); commands (`pnpm lint|typecheck|test|build`); design source of truth pointer; schema §7 immutable + lastName/phone→message note.
- [ ] Commit: `docs: CLAUDE.md brand hard rules + engineering conventions`

**MILESTONE 1 GATE:** lint ✓ typecheck ✓ test ✓ build ✓ → commit, report.

---

## Milestone 2 — Shared Nav / Footer / Newsletter (README §12.2)

### Task 2.1: Monogram + NavSocial (port kt-hero.jsx:20-26, 67-86)
- [ ] Tests: monogram renders K + gold T span, aria-hidden; NavSocial renders 3 links with exact hrefs, `target="_blank"`, `rel="noreferrer"`, aria-labels, classes `soc-facebook|linkedin|instagram`.
- [ ] Port exactly. Commit: `feat: Monogram + NavSocial`

### Task 2.2: ResourcesDrop + KTNav (port kt-hero.jsx:41-65, 88-129) — `'use client'`
- [ ] Tests: renders About/Services/Testimonials anchors with `base` prefix (`/#about` when `base="/"` on subpages, `#about` on home); Home Guide link → `/home-guide`; dropdown opens on hover/click (9 items, exact labels/routes), caret rotates (`open` class); Contact button → `/contact`; `scrolled` class toggles on `window.scrollY > 40` (fire scroll event in test).
- [ ] A11y additions (visuals unchanged): dropdown closes on `Escape` and on blur-outside; trigger is `<button>` semantics via role and `aria-expanded`/`aria-haspopup` kept.
- [ ] Commit: `feat: KTNav with Client Resources dropdown (scroll-solid, a11y)`

### Task 2.3: KTFooter (port kt-close.jsx:79-128)
- [ ] Tests: compliance block contains "Intero Real Estate Services", "A Berkshire Hathaway Affiliate", "DRE 02254890", "187 S J Street"; mailto/tel hrefs exact; NavSocial present; © 2026.
- [ ] Server component, port exactly. Commit: `feat: KTFooter with compliance lockup`

### Task 2.4: /api/newsletter route (TDD)
**Files:** `src/app/api/newsletter/route.ts`, test.
- [ ] Tests (mock `getSupabaseAdmin` via `vi.mock`): 200 + insert on valid email; 400 + Zod issues on invalid; 200-silent (no insert) when honeypot filled; duplicate email (unique idx violation code `23505`) → 200 idempotent; 500 on other insert errors.
- [ ] Route: parse JSON → `NewsletterSchema.safeParse` → honeypot drop → insert `{ email: lower, source_page }` → response. `export const runtime = 'nodejs'`.
- [ ] Commit: `feat: newsletter signup endpoint (Zod + honeypot + idempotent dupes)`

### Task 2.5: KTNewsletter + KTSocialStrip (port kt-close.jsx:5-76) — newsletter `'use client'`
- [ ] Tests: idle→error on invalid email (exact message "Please enter a valid email address."); valid submit POSTs `/api/newsletter` (mock fetch) then shows "You are on the list. Welcome."; `archiveLink={false}` suppresses "Browse past issues →"; honeypot field present but visually hidden; social strip renders 4 PhotoSlots.
- [ ] Commit: `feat: newsletter band + social strip`

**MILESTONE 2 GATE:** full quality gates + temporary harness page → shots vs `KT Home.html` (nav/footer regions) → report side-by-side to user.

---

## Milestone 3 — Home + Contact + Supabase lead wiring (README §12.3)

### Task 3.1: Home sections (port HeroFull kt-hero.jsx:161-186; KTIntro/KTServices/KTTestimonials kt-body.jsx)
- [ ] Tests: hero h1 "Kalyani Thilak", eyebrow city list, CTAs (`#about` solid, `/contact` ghost); intro copy "A trusted advisor", portrait PhotoSlot `about-portrait`, "Work with Kalyani" → `/contact`; 3 service cards numbered 01-03 with exact copy + links (`/resources/buying|selling|market-updates`); testimonials rotate every 7s (`vi.useFakeTimers`), dot buttons switch quote, 3 exact quotes.
- [ ] `src/app/page.tsx` assembles: KTNav(home anchors) → HeroFull → KTIntro → KTServices → KTTestimonials → dark band(KTSocialStrip + KTNewsletter + KTFooter). Hero PhotoSlot `hero-full-img` with `priority`.
- [ ] Commit: `feat: home page (full-bleed hero, intro, services, testimonials, dark close)`

### Task 3.2: /api/lead route (TDD)
- [ ] Tests mirror 2.4 plus: intent enum mapping verified; lastName/phone append to message block; `newsletter_alameda`/`newsletter_contracosta` booleans persisted; missing firstName/email → 400.
- [ ] Insert row mapping → §7 column names exactly. Commit: `feat: lead capture endpoint`

### Task 3.3: ContactForm + /contact page (port kt-contact.jsx)
- [ ] Tests: intent chips toggle (`sel` class), timeframe section appears only when intent ≠ null/'Just curious'; submit without name/email → exact error copy "Please add your first name and email so I can reply."; valid submit POSTs mapped payload (Selling→selling etc., newsletters checkboxes → booleans, sourcePage `/contact`) and renders thank-you state ("Thank you." + tel link); network failure → friendly error, form not cleared. Aside: portrait PhotoSlot (has real image), DRE block, address, NavSocial.
- [ ] Commit: `feat: contact page with progressive lead form wired to Supabase`

**MILESTONE 3 GATE:** gates + shots: `/` vs `KT Home.html`, `/contact` vs `Contact.html` (desktop+mobile) → report.

---

## Milestone 4 — Blog index + posts + content collection (README §12.4, §8)

### Task 4.1: Post types + content collection (TDD)
**Files:** `src/content/posts/types.ts`, `index.ts`, 8 post files.
- [ ] Types: `PostBlock = string | { h: string } | { cta: string } | { disclaimer: string } | { sources: { t: string; href: string }[] }`; `Post = { slug, title, category: Category, date, excerpt, cover?: boolean, draft?: boolean, body: PostBlock[] }`; `KT_BLOG_CATS` exact 5.
- [ ] Port all 8 posts from `kt-blog-data.jsx` verbatim (typographic chars preserved: ’ — ‘ ’). 2 real posts no flag; 6 drafts `draft: true`.
- [ ] `index.ts`: `allPosts` (sorted desc by date), `publishedPosts = allPosts.filter(p => !p.draft || process.env.NEXT_PUBLIC_SHOW_DRAFTS === 'true' || process.env.NODE_ENV === 'development')` — README §8: drafts NEVER in production builds.
- [ ] Tests: 8 total, 2 published-in-prod (env-stubbed), sorted desc, unique slugs, categories ⊆ KT_BLOG_CATS, real posts' titles/excerpts byte-match prototype strings.
- [ ] Commit: `feat: typed post collection (2 real issues, 6 gated drafts)`

### Task 4.2: Blog index `/home-guide` (port kt-blog.jsx minus tweaks)
- [ ] BlogHero static ("The Bay Area *Home Guide*"); Featured (lead + 2, cover-conditional layout incl. `noimg` variant); Archive `'use client'`: chips filter, month grouping, sticky rail scroll-sync, empty-topic copy.
- [ ] Tests: featured = 3 newest; chip filter narrows list; groups by month label; rail months match groups; all links `/home-guide/<slug>`.
- [ ] Page: KTNav → BlogHero → light(Featured+Archive) → dark(KTNewsletter `archiveLink={false}` + KTFooter). Metadata: title "The Bay Area Home Guide".
- [ ] Commit: `feat: Home Guide index (featured, topic chips, timeline rail)`

### Task 4.3: Post reader `/home-guide/[slug]` (port kt-post.jsx)
- [ ] `generateStaticParams` from `publishedPosts`; `dynamicParams = false`; unknown slug → 404 via `notFound()`.
- [ ] PostBody (server): block renderer exact (p/h2/cta/disclaimer/sources). ShareRow `'use client'`: canonical `SITE_URL/home-guide/<slug>` share targets (FB/LinkedIn/X/WhatsApp/email), copy-link with "Copied" 2.2s feedback + execCommand fallback. Prev/next cards from published order. Signature line + "Contact Kalyani" → `/contact`. Cover PhotoSlot 21/9 when `cover`.
- [ ] `generateMetadata`: title (ktPlain), description = excerpt, OG/Twitter card type article + image.
- [ ] Tests: block renderer all 5 types; share URLs encoded correctly; copy feedback (mock clipboard); prev/next ordering; metadata shape.
- [ ] Commit: `feat: statically generated post reader with share row + per-post meta`

### Task 4.4: Per-post OG image
- [ ] `opengraph-image.tsx` (ImageResponse 1200×630): charcoal canvas, gold hairline frame (asymmetric 24px top-left), Fraunces title (load TTF from `src/assets/fonts/`, copy from kt-brand repo `assets/fonts/`), eyebrow "THE BAY AREA HOME GUIDE", footer "Kalyani Thilak · DRE 02254890 · Intero Real Estate Services".
- [ ] Commit: `feat: branded per-post OG images`

**MILESTONE 4 GATE:** gates + shots: `/home-guide` vs `Blog.html`, one post vs `Blog Post.html` → report.

---

## Milestone 5 — Resource pages + neighborhood guides (README §12.5)

### Task 5.1: resources.ts + guides.ts data port
- [ ] Port `RESOURCE_PAGES` (7 keys) and both city arrays verbatim with types (`ResourceSection = { heading?, paras?, steps?: [string,string,string][], rows?: [string,string][], note? }`, `City = { id, name, price, drive, transit, schools, bestFor, paras }`).
- [ ] Tests: 7 resource keys match route slugs; sections shape valid; 5 + 7 cities; ids kebab-case unique.
- [ ] Commit: `feat: resource + guide content collections (draft copy, flagged §9)`

### Task 5.2: Resource shell + `/resources/[slug]` (port kt-resource.jsx)
- [ ] ResourceHero/ResourceSection/ResourcePage server components, exact markup incl. alt tint striping. `generateStaticParams` over keys, `dynamicParams=false`, `generateMetadata` (title + sub).
- [ ] Tests: steps render num/title/body; rows term/def; note italic; hero eyebrow "Client Resources"; all 7 routes build.
- [ ] Commit: `feat: 7 client-resource pages from data shell`

### Task 5.3: Guide shell + 2 neighborhood pages (port kt-guide.jsx)
- [ ] GuideHero (PhotoSlot `guide-*-hero` + scrim + centered + Monogram), JumpBar anchors, CityRow (stats/schools-italic/bestFor/prose, `alt` striping `i % 2 === 0`), "The *Neighborhoods*" heading section.
- [ ] Two static pages with exact eyebrow/title/sub from the data files.
- [ ] Tests: jump links match city ids; city sections have `scroll-margin`; stats render all 4 lines + bestFor.
- [ ] Commit: `feat: neighborhood guide pages (Alameda, Contra Costa)`

**MILESTONE 5 GATE:** gates + shots of all 9 pages vs prototypes (spot-check 3 in report) → report.

---

## Milestone 6 — Meta/OG, privacy, 404, favicon, sitemap, Lighthouse (README §12.6)

### Task 6.1: icon.tsx (monogram favicon via ImageResponse: charcoal square, 1px gold border, top-left radius ≈26%, "KT" serif with gold T) + apple-icon.
### Task 6.2: `not-found.tsx` — dark page, kt-display "Page not found", monogram, links home/Home Guide; metadata noindex.
### Task 6.3: `/privacy` — CCPA draft (categories collected: name/email/phone/message; purpose; no sale of PII; contact email; effective date; "review by counsel" HTML comment). Light shell + dark bookends.
### Task 6.4: `sitemap.ts` (all static routes + published posts) + `robots.ts` (allow all, sitemap URL).
### Task 6.5: Lighthouse pass — `pnpm build && pnpm start`, run Lighthouse (via Playwright/`lighthouse` CLI) on `/`, `/home-guide`, one post; fix to ≥90 perf/SEO/a11y; record scores. Verify: zero render-blocking font CSS, fonts preloaded+subsetted, no dev React (acceptance §11.3).
### Task 6.6: Full route click-through (acceptance §11.4): Playwright script walks every nav/dropdown/footer link desktop+mobile, asserts 200 + h1.

**MILESTONE 6 GATE:** gates + full shots gallery → report.

---

## Milestone 7 — Security review + M1/M2/M3 fixes + final acceptance

- [ ] 7.1 Run `/security-review` skill over the repo (focus: API routes, env handling, headers, XSS via inline renderer, SSRF none, RLS posture). Address ALL M1/M2/M3 findings; re-run until clean.
- [ ] 7.2 `/code-review` pass (correctness + simplification); apply accepted findings.
- [ ] 7.3 Acceptance bar §11 checklist run, item by item, with evidence.
- [ ] 7.4 Final report to user: side-by-side gallery, test counts, Lighthouse scores, security findings + fixes, owner TODO list (§9 content, photos, Vercel/Supabase setup, permalink confirmation).

---

## Self-review notes
- §3 route table fully covered (M3-M5 + privacy/404 M6). §4 tokens M1.2. §5 shared M2. §6 behaviors M3-M5 tests. §7 M1.7/2.4/3.2. §8 M4.1 (drafts gated). §9 flagged in CLAUDE.md + final report. §10 PhotoSlot M1.8. §11 M6/M7. §12 order preserved.
- Open items intentionally deferred: Resend notification (optional v1 — documented, not built); Vercel/Supabase provisioning (owner-side, no credentials in repo).
