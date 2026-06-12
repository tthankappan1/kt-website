# Handoff: kalyanithilak.com — Production Build

Personal real-estate website for **Kalyani Thilak** — REALTOR®, Intero Real Estate Services (Livermore, CA), serving the Tri-Valley / East Bay market. DRE #02254890.

This package hands a finished hi-fi HTML design over to a developer (Claude Code) to build the production site.

---

## 1. About the design files

Everything in `design/` is a **design reference built in HTML** — a working prototype (CDN React + in-browser Babel, no build step) that shows the exact intended look, copy, and behavior. It is **not production code to ship**. The task is to **recreate these designs 1:1 in a Next.js codebase** (stack below). The prototype's biggest costs — Babel-standalone transpiling in the browser, dev React builds, render-blocking Google Fonts — exist only for the prototyping workflow and must not survive into production.

Open `design/KT Home.html` in a browser to see the live design. Every page works standalone.

**Fidelity: HIGH.** Colors, type, spacing, copy, hover states, and interactions are final design intent. Recreate pixel-perfectly. The one area that is *not* final is certain **content** (flagged in §9).

## 2. Tech stack (decided — use this)

- **Framework:** Next.js 15 (App Router), React 19, TypeScript 5.x
- **Styling:** Tailwind CSS 3.4+ — but **map the brand tokens from `design/kt-tokens.css` into the Tailwind theme**; do not use Tailwind's default palette for brand surfaces
- **Fonts:** **Fraunces + Inter via `next/font` (self-hosted, subsetted).** ⚠️ NOT Geist — the brand is Fraunces/Inter, non-negotiable. Fraunces is a variable font; the design uses `font-variation-settings: "opsz"` per type role — preserve optical sizing.
- **Icons:** the design uses almost no icon library — social/share icons are inline SVGs in the prototype (copy them). lucide-react acceptable for any future incidental icons.
- **Backend/DB:** Supabase (Postgres) via `@supabase/supabase-js` + `@supabase/ssr`; RLS on all tables (schema in §7)
- **Validation:** Zod on all form inputs (server-side, in route handlers / server actions)
- **Testing:** Vitest + React Testing Library; **Lint/types:** ESLint (eslint-config-next) + `tsc --noEmit`
- **Package manager:** pnpm 9.x via corepack
- **Hosting:** Vercel, auto-deploy from GitHub. Domain: **kalyanithilak.com**
- **Email:** Resend with custom-domain sender — optional v1, used only to notify Kalyani of new leads (§7)

Next 15 notes: `cookies()`/`headers()`/`params`/`searchParams` are async; fetch/GET caching is opt-in. Current Supabase `@supabase/ssr` quickstart already uses the async pattern.

**Rendering model: static-first.** Every page including every blog post is pre-rendered static HTML (SSG). No page needs SSR. The only server code is the lead/newsletter submission endpoint. There is no auth in v1.

## 3. Site map → routes

| Prototype file | Production route | Source components |
|---|---|---|
| `KT Home.html` | `/` | `kt-app.jsx`, `kt-hero.jsx`, `kt-body.jsx`, `kt-close.jsx` |
| `Contact.html` | `/contact` | `kt-contact.jsx` |
| `Blog.html` | `/home-guide` | `kt-blog.jsx`, `kt-blog-data.jsx` |
| `Blog Post.html` (`?post=<slug>`) | `/home-guide/<slug>` | `kt-post.jsx`, `kt-blog-data.jsx` |
| `Selling.html` | `/resources/selling` | `kt-resource.jsx` + `kt-resources-data.jsx` |
| `Buying.html` | `/resources/buying` | 〃 |
| `Cost of Selling.html` | `/resources/cost-of-selling` | 〃 |
| `Intero Concierge.html` | `/resources/intero-concierge` | 〃 |
| `Schools in Alameda and Contra Costa.html` | `/resources/schools` | 〃 |
| `Market Updates.html` | `/resources/market-updates` | 〃 |
| `Buyers Guide.html` | `/resources/buyers-guide` | 〃 |
| `Alameda County Neighborhoods.html` | `/neighborhoods/alameda-county` | `kt-guide.jsx` + `kt-guide-alameda.jsx` |
| `Contra Costa County Neighborhoods.html` | `/neighborhoods/contra-costa-county` | `kt-guide.jsx` + `kt-guide-contracosta.jsx` |

Blog permalink scheme **`/home-guide/<slug>`** is the recommendation (matches the locked section name "Home Guide"); confirm with Kalyani before go-live — shared links live forever. Add at build: **privacy policy page** (CCPA — the lead form collects PII), **404 page**, **favicon from the KT monogram**.

## 4. Design tokens (authoritative source: `design/kt-tokens.css`)

| Token | Value | Use |
|---|---|---|
| `--charcoal` | `#262623` | dark surfaces, headings on light |
| `--ivory` | `#F3F0EB` | light surfaces, text on dark |
| `--gold` | `#C0A278` | accents on DARK surfaces only |
| `--gold-deep` | `#7E6A4F` | accents on LIGHT surfaces only (contrast) |
| `--body-on-dark` | `rgba(243,240,235,.78)` | body text on dark |
| `--body-on-light` | `rgba(38,37,35,.78)` | body text on light |
| `--tint-row` | `rgba(126,106,79,.08)` | subtle row/hover tint on light |

- **Type:** Fraunces (serif, headings/display, weight 400–500, optical size 24–144 per role) + Inter (sans, body weight 300, UI labels weight 500 uppercase with wide tracking). Full type roles (`.kt-display`, `.kt-h1`–`.kt-h3`, `.kt-eyebrow`, `.kt-lead`, etc.) are defined in `kt-tokens.css` — port them as-is.
- **Signature shape:** hairline 1px borders with an **asymmetric top-left radius** (buttons 12px, cards 24px, monogram 13px, dropdown 18px…). This is THE brand shape — never plain rounded corners.
- **Layout:** max-width 1200px container, 48px gutters (24px ≤900px), 96px section padding.
- **Hard rules:** multi-section pages **bookend in dark** (dark nav/hero at top + dark newsletter/footer at bottom); "INTERO" is always re-typed in Fraunces gold caps, never their logo image; **no emoji** anywhere; gold on dark / gold-deep on light, never swapped.
- **Hardcode the prototype's tweak defaults** (the Tweaks panel itself is prototype-only, do not build it): hero = **Full-bleed**, density = **Regular** (`--dm: 1`), palette = default charcoal/ivory/gold, serifUI = **false**. Delete every `localStorage` switch (e.g. `kt-blog-nav` → hardcode "Home Guide").

## 5. Shared components (build once, used everywhere)

**Nav (`KTNav` in `kt-hero.jsx`):** fixed, transparent over dark heroes → solid charcoal + tighter padding on scroll. Lockup (left → right): KT monogram (50px, links home) · "KALYANI THILAK" wordmark + "REALTOR® · TRI-VALLEY" sub-line · 1px gold divider · "INTERO" gold serif caps. Links: About / Services / Testimonials / **Home Guide** / Client Resources (dropdown, 9 items, hover-open with caret rotate) / social icons / Contact button. Responsive: divider+INTERO hide ≤1100px; monogram 50→40→34px (never hidden); header socials hide ≤1024px (footer set remains). On non-home pages the About/Services/Testimonials anchors point to `/#about` etc.

**Footer (`KTFooter` in `kt-close.jsx`):** dark, 3-column grid. Compliance block must include: "Intero Real Estate Services" · "A Berkshire Hathaway Affiliate" · DRE 02254890 · 187 S J Street, Livermore. Contact column: `kthilak@intero.com` · `(408) 597-7371` · social icons.

**Social icons:** ivory/charcoal at rest, **hover-to-native** colors (FB `#1877F2`, LinkedIn `#0A66C2`, IG `#E1306C`). Real URLs are in `kt-hero.jsx` `KT_SOCIALS`.

**Newsletter section (`KTNewsletter` in `kt-close.jsx`):** dark band above footer on every multi-section page; email input + "Browse past issues →" link to the blog index (suppressed on the blog index itself).

## 6. Page behaviors (read the source for full detail)

- **Home:** Full-bleed hero (photo slot + dark scrim + gold hairline frame, `.kt-frame`) → intro/About ("A trusted advisor…", portrait slot, "Work with Kalyani" → /contact) → 3 service cards (numbered, hover lift, "Learn more" → buying/selling/market-updates pages) → testimonials (charcoal block on ivory) → social tiles → newsletter → footer.
- **Contact (`kt-contact.jsx`):** progressive form — intent chips (Selling / Buying / Both / Just curious) → conditional timeframe chips → first name + email (only required fields) → optional message → county-newsletter opt-in checkboxes → personal thank-you state. Submissions flow through a single adapter, `window.KT_CRM.submit(lead)` — in production this becomes the Supabase insert (§7). Zod-validate server-side; keep client checks minimal (required + email format), matching the prototype's forgiving tone.
- **Blog index (`kt-blog.jsx`):** dark hero → featured latest 3 → topic filter chips (`.kt-fchip`) → month-grouped archive list with sticky gold timeline rail (year/month, scroll-synced, hidden ≤980px) → newsletter → footer.
- **Blog reader (`kt-post.jsx`):** pre-rendered per slug. Title supports `*word*` → gold-italic emphasis. Body block types (see `kt-blog-data.jsx`): string paragraph with `*italic*`/`**bold**` inline, `{h}` heading, `{cta}` gold-tint callout, `{disclaimer}`, `{sources:[{t,href}]}`. Share row (FB/LinkedIn/X/WhatsApp/email + copy-link with "Copied" feedback; charcoal at rest, hover-to-native). Prev/next issue cards. "Contact Kalyani" button after signature.
- **Resource pages (`kt-resource.jsx`):** shared shell — dark hero, numbered step lists (`.kt-step`), term/definition rows (`.kt-row`), italic gold note, CTA, newsletter, footer. All content driven by `kt-resources-data.jsx`.
- **Neighborhood guides (`kt-guide.jsx`):** sticky jump bar, alternating city sections (photo slot + stats + prose), data in `kt-guide-alameda.jsx` (Pleasanton, Dublin, Livermore, Fremont, Castro Valley) / `kt-guide-contracosta.jsx` (San Ramon, Danville, Alamo, Walnut Creek, Lafayette, Orinda, Moraga).

## 7. Supabase (leads + newsletter)

Decision: **one simple Supabase DB** captures both lead-form submissions and newsletter opt-ins. Kalyani will build a lightweight CRM product on top later — keep the schema clean and boring.

```sql
create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  intent text not null check (intent in ('selling','buying','both','curious')),
  timeframe text,
  first_name text not null,
  email text not null,
  message text,
  newsletter_alameda boolean not null default false,
  newsletter_contracosta boolean not null default false,
  source_page text
);

create table newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  source_page text
);
create unique index newsletter_signups_email_idx on newsletter_signups (lower(email));
```

- **RLS enabled on both tables, NO anon policies.** All writes go through a server route handler (or server action) using the service-role key — never expose the service key client-side, never allow anon inserts directly.
- Zod-validate the payload in the route before insert; rate-limit lightly (honeypot field is enough for v1).
- The prototype's `window.KT_CRM.submit()` and `localStorage['kt-leads']` queue is the seam to replace — same payload shape as the `leads` table.
- Optional v1: on new lead, send Kalyani a notification email via Resend.

## 8. Blog content model & publishing (decided: git-push)

- Posts live **in the repo** (port `KT_POSTS` from `kt-blog-data.jsx` to one MDX/JSON/TS file per post — content collection style). Publishing a post = add file → git push → Vercel auto-deploys (~1 min). No CMS in v1.
- Statically generate every `/home-guide/<slug>` page via `generateStaticParams`.
- Per-post `<head>` meta: title, description (= excerpt), OG/Twitter image — share row must produce rich previews.
- The blog IS the weekly newsletter archive. Two posts are real issues (`proximity-premium-san-jose`, `two-markets-twenty-minutes`); the other 6 are **drafts to be replaced — do not ship them**.
- Cover images are opt-in per post (`cover: true`); no placeholder when absent — clean typographic card.

## 9. Content warnings — generic drafts, NOT final

- All 7 resource pages (`kt-resources-data.jsx`): plausible-sounding **draft copy** — Kalyani must replace/verify before go-live (credibility risk).
- Neighborhood guide **price ranges and commute times are unverified drafts**.
- 6 of 8 blog posts are drafts.
- Testimonials must be confirmed real + permissioned.
- Email `kthilak@intero.com` is interim; may switch to a kalyanithilak.com mailbox.

## 10. Photos

Every photo location in the prototype is an `image-slot.js` drop-zone with a stable id. **`PHOTOS.md` (in this folder) is the full inventory** — slot ids, aspect ratios, and the `/images/<slot-id>.jpg` file convention for the build. In production, replace slots with the framework `<Image>` component (optimized, lazy, correct aspect ratio). Only one real photo exists today: `design/images/contact-portrait.jpg` (4:5). Home hero photo is the day-one must-have; others can follow.

## 11. Acceptance bar

1. Pixel-faithful to the prototype on desktop AND mobile (the prototype is responsive — match its breakpoints).
2. Lighthouse performance / SEO / accessibility pass on `/`, `/home-guide`, and one post page.
3. No Babel/dev-React/render-blocking font CSS in production; fonts preloaded + subsetted.
4. Full click-through of every nav/dropdown route, desktop + mobile.
5. Lead + newsletter submissions land in Supabase; invalid payloads rejected with Zod errors.
6. `pnpm lint`, `pnpm typecheck`, `pnpm test` all green; deploys from GitHub to Vercel.

## 12. Suggested build order

1. Scaffold (Next 15 + TS + Tailwind + fonts + tokens) → port `kt-tokens.css` into theme + globals.
2. Shared Nav + Footer + Newsletter → verify against prototype side-by-side.
3. Home page → Contact page + Supabase wiring.
4. Blog index + post pages + content collection (port 2 real posts).
5. Resource pages + neighborhood guides (data-driven, fast once shell exists).
6. Meta/OG, privacy page, 404, favicon, redirects, Lighthouse pass.

## Files in this package

- `README.md` — this document
- `START-HERE.md` — environment setup + the kickoff prompt for Claude Code
- `PROJECT-STATUS.md` — full project history, every locked decision and its rationale
- `PHOTOS.md` — photo slot inventory + aspect ratios
- `design/` — the complete working prototype (open `KT Home.html` in a browser); all `kt-*.jsx` sources, `kt-tokens.css`, support scripts, `images/contact-portrait.jpg`
- `screenshots/` — one reference capture per page (01–13, desktop). Orientation only — very tall pages are truncated at capture height; the live prototype in `design/` is always the source of truth for pixel detail.
