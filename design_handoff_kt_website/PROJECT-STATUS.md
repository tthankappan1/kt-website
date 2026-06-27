# KT-Website2.0 — Project Status & Handoff

Personal real-estate site for **Kalyani Thilak** — REALTOR®, Intero Real Estate Services (Livermore), Tri-Valley / East Bay market. Currently a hi-fi HTML prototype; next phase is the real build (this doc is the pickup point for new sessions and for Claude CLI handoff).

## Brand & design system
- Tokens/base styles: `kt-tokens.css` (charcoal `--charcoal`, ivory `--ivory`, gold `--gold` / `--gold-deep`; Fraunces serif + Inter sans; hairline borders with asymmetric top-left radius as the signature shape).
- Hard rules: multi-section pages bookend in dark (dark nav/hero + dark newsletter/footer); INTERO is always re-set in Fraunces (never their black logo file); no emoji.

## Decisions locked in
- **Header lockup = Option C**: KT monogram (clickable, 50px) · "KALYANI THILAK" with sub-line "REALTOR® · TRI-VALLEY" · thin gold divider · "INTERO" in gold serif caps. Divider+INTERO hide ≤1100px; monogram scales 50→40→34px, never hidden. Comparison page kept at `Header Lockups v2.html` (the design-canvas version `Header Lockups.html` is deprecated — its saved pan position kept losing users).
- **Footer**: compliance block includes "Intero Real Estate Services" + "A Berkshire Hathaway Affiliate" + DRE 02254890 + 187 S J Street, Livermore.
- **Nav order (final, assessed)**: About / Services / Testimonials / **Newsletter** (blog link, label from `localStorage['kt-blog-nav']`) / Client Resources (dropdown last — carets read best at end of link group) / FB·LinkedIn·IG icons / Contact button → `Contact.html`.
- Real socials (wired in `kt-hero.jsx` KT_SOCIALS):
  - FB: https://www.facebook.com/profile.php?id=100076622906268
  - IG: https://www.instagram.com/kalyani_thilak_intero/
  - LI: https://www.linkedin.com/in/kalyanithilak
- Social icons: ivory at rest, **hover-to-native colors** (FB #1877F2, LinkedIn #0A66C2, IG #E1306C) — decided after for/against debate; rest state stays monochrome per brand restraint. Icons appear in nav AND footer (under Contact column, via shared `NavSocial`); ≤1024px the header set hides but the footer set stays.
- Real phone: **(408) 597-7371** (footer + contact page). Email: **kthilak@intero.com** wired in footer (`kt-close.jsx`) — interim; may switch to a kalyanithilak.com address later. Domain chosen: **kalyanithilak.com**. Email intentionally omitted from Contact page.
- Note: clicking the social icons inside this design-preview environment throws a cross-origin (COOP) error — that's a sandbox restriction, not a bug; links work on a real deployment. Verified hrefs are correct.

## Pages (all share KTNav/KTFooter via Babel/React, no build step)
- `KT Home.html` — home (hero variants + tweaks in `kt-app.jsx`, sections in `kt-hero.jsx`/`kt-body.jsx`/`kt-close.jsx`)
- `Contact.html` + `kt-contact.jsx` — dedicated contact page: intent chips (Selling/Buying/Both/Just curious) → conditional timeframe chips → 2 required fields (first name, email) → county-newsletter opt-ins → personal thank-you state. Leads queue to `localStorage['kt-leads']` through the `window.KT_CRM.submit()` adapter — single seam for future CRM (Zapier/FollowUpBoss/HubSpot/own API); swap only the adapter body at build.
- Client Resources dropdown (9 items, in `kt-hero.jsx` CLIENT_RESOURCES):
  - `Selling.html`, `Buying.html`, `Cost of Selling.html`, `Intero Concierge.html`, `Schools in Alameda and Contra Costa.html`, `Market Updates.html`, `Buyers Guide.html` — shared shell `kt-resource.jsx`, ALL COPY IS GENERIC DRAFT in `kt-resources-data.jsx`
  - `Alameda County Neighborhoods.html` (Pleasanton, Dublin, Livermore, Fremont, Castro Valley) and `Contra Costa County Neighborhoods.html` (San Ramon, Danville, Alamo, Walnut Creek, Lafayette, Orinda, Moraga) — shared components `kt-guide.jsx`, data in `kt-guide-alameda.jsx` / `kt-guide-contracosta.jsx`. **Price ranges & commute times are unverified drafts.**
- Photos: `image-slot.js` drop-zones everywhere — **see `PHOTOS.md` for the full slot inventory, aspect ratios, and the build-phase update process** (slot id ↔ `/images/<id>.jpg` file convention). Contact portrait has a real default: `images/contact-portrait.jpg` (4:5 crop from `uploads/Spring-53.JPEG`, interim until a new photo).
- **Blog / newsletter archive** (blog IS the weekly newsletter — decided; topics may be general industry/local-market info, NOT strictly Tri-Valley — confirmed by user):
  - `Blog.html` + `kt-blog.jsx` — index: dark hero, featured latest 3 issues, topic filter chips (`.kt-fchip` — NOT `.kt-chip`, that's the contact page), gold timeline rail (year/month, sticky, scroll-synced; hidden ≤980px), month-grouped archive list, newsletter + footer bookend.
  - `Blog Post.html` + `kt-post.jsx` — reader page via `?post=<slug>` (shareable), falls back to latest; prev/next issue cards.
  - `kt-blog-data.jsx` — TWO REAL ISSUES (from `uploads/Newsletter_May_Week4_2.html` / `_3.html`): `proximity-premium-san-jose` (2026-05-29) and `two-markets-twenty-minutes` (2026-05-27); remaining 6 posts are GENERIC DRAFTS. Body block types: string para (`*italic*`/`**bold**` via `ktInline`), `{h}`, `{cta}` (gold-tint callout per brand newsletter template), `{disclaimer}`, `{sources:[{t,href}]}`. Titles support `*word*` for gold-italic emphasis. Adding a post = one object in `KT_POSTS`. Cover image-slot id = `blog-<slug>` (shared between index card and reader hero — drop once).
  - Reader page has a **share row** (FB / LinkedIn / X / WhatsApp / email + Copy-link with “Copied” feedback) — charcoal at rest, hover-to-native colors, canonical `?post=<slug>` URL — and a “Contact Kalyani” button after the signature line.
  - **PUBLISHING WORKFLOW DECIDED (June 2026): git-push redeploy** — posts data as standalone content files in the repo, push to publish, static host auto-deploys (~1 min). No CMS for v1. Post URLs are `?post=<slug>` in the prototype — final permalink scheme (e.g. `/guide/<slug>`) must still be chosen before go-live since shared links live forever.
  - **Section name DECIDED: "Newsletter"** (already the default in the tweak + `localStorage['kt-blog-nav']`). Hardcode at build; filename `Blog.html` is intentionally name-neutral.
  - Newsletter section site-wide now links "Browse past issues →" to Blog.html (suppressed on the blog page itself via `archiveLink={false}`).
  - Cover images are **opt-in per post** (`cover: true` → drop-zone on index card + reader hero, same image under id `blog-<slug>`; absent → clean typographic card, no placeholder). Currently only `spotlight-ruby-hill` and `saturday-downtown-livermore` have covers.

## Production build requirements (build phase — user flagged: must be production-grade, not fragile; perf matters; target host Vercel)
- This prototype (CDN React + in-browser Babel transpile) is the DESIGN SPEC, not the production stack. NEVER ship Babel-standalone or dev React builds live — they are the single biggest perf cost here and exist only for the no-build prototype workflow.
- Target: static-first framework (Astro or Next.js SSG) on Vercel. Every post pre-rendered to its own static HTML page (`/guide/<slug>` or similar) — instant loads, SEO-indexable, stable permalinks. Shared nav/footer/tokens port 1:1 from `kt-hero.jsx`/`kt-close.jsx`/`kt-tokens.css`.
- Per-post `<head>` meta: title, description (= excerpt), OG/Twitter image — so the share row produces rich previews on FB/LinkedIn/WhatsApp.
- Fonts: preload/self-host Fraunces + Inter subsets (currently render-blocking Google CSS). Images: optimized + lazy-loaded via the framework's image pipeline.
- The `KT_POSTS` data shape is the content model — it ports directly to markdown files, a JSON store, or a CMS schema (see publishing-workflow decision above).
- Acceptance bar before go-live: Lighthouse perf/SEO/a11y pass on the blog index and a post page.

## Pre-build handoff checklist (final assessment, June 2026)
**Blockers:** ~~(1) email~~ → kthilak@intero.com (interim) + domain kalyanithilak.com — DONE; ~~(2) publishing workflow~~ → git-push redeploy — DECIDED; ~~(3) blog section name~~ → Newsletter — DECIDED; (4) lead + newsletter destination DECIDED: **simple Supabase DB** capturing both lead-form submissions and newsletter opt-ins (user will build their own lightweight CRM product on top later) — wire `KT_CRM.submit()` adapter + newsletter signups to Supabase at build.
**User-owned content:** (5) replace/verify ALL generic resource-page copy + guide prices/commutes (plausible-sounding drafts — credibility risk if shipped); (6) confirm testimonials are real + permissioned; (7) replace or drop the 6 draft blog posts.
**Build-stage additions:** (8) privacy policy page (CCPA — lead form collects PII), 404 page, favicon from KT monogram; (9) day-one home hero photo (rest can follow per PHOTOS.md); (10) full desktop+mobile click-through of every nav/dropdown route.
Production stack requirements + acceptance bar: see section above. This doc + PHOTOS.md = the handoff package.

## Open / next steps
1. Replace the remaining 6 draft posts in `kt-blog-data.jsx` with real newsletter issues (2 real ones already in). Section name locked: Newsletter.
1. Minor tweaks from user review (expected before Claude CLI / build handoff — user confirmed this is the plan). DONE June 2026: home CTAs fixed — hero "Start a conversation"/"Contact", intro "Work with Kalyani" now go to `Contact.html` (previously hit the `#contact` footer anchor and landed on the newsletter signup); services "Learn more" links now go to Buying.html / Selling.html / Market Updates.html.
2. Replace generic resource-page copy with real program details; verify all guide prices/commutes/school claims.
3. ~~Real email~~ — kthilak@intero.com in footer; revisit if a kalyanithilak.com mailbox is set up.
4. Supabase capture for `KT_CRM` adapter + newsletter checkboxes (home + contact) — at build.
5. Photos into all image slots.
6. Possible future: "Compare Towns" table on guide pages; per-city detail pages.
