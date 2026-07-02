# Mobile optimization — design spec

**Date:** 2026-07-01
**Status:** Approved by owner 2026-07-01 — all three flagged decisions approved (menu pattern, whole-site scope, --sect-pad 72px ≤700px)
**Context:** kalyanithilak.com has been live ~2 weeks; analytics show ~80% of
visitors on mobile. The site was built desktop-first against the design
handoff prototype, which never specified a nav below ~800px. This spec covers
a whole-site mobile pass. Production behavior was audited live at iPhone 14
viewport (390×844, Playwright device emulation) on 2026-07-01.

## Audit findings (evidence)

1. **Nav (every page, critical):** no mobile pattern exists. Below ~800px the
   `.kt-navlinks` row wraps into 3–4 rows overlaid on the hero; links clip
   off-screen mid-word (measured DOM overflow: nav elements at x=403–419 in a
   390px viewport). On `/contact` and `/newsletter` the Contact button
   overlaps the page title.
2. **Testimonial block (home):** `.kt-hybrid-block` keeps 72px/64px desktop
   padding at phone width → ~215px text column, extremely tall block.
3. **Newsletter signup (site-wide close):** email input + button share one
   flex row; input is unusably narrow at 390px.
4. **iOS input zoom:** `.kt-input` is 14px and `.kt-input-light` is 15px; iOS
   Safari auto-zooms on focus for inputs under 16px.
5. **Contact form:** inline `gridTemplateColumns: '1fr 1fr'` keeps
   first/last-name and email/phone pairs two-column at 390px.
6. **Touch targets:** testimonial carousel dots are 32×2px buttons (WCAG /
   Apple HIG recommend ≥44px hit area).
7. **Already fine:** section grids (intro, services, footer, contact, city
   guides, blog archive) collapse at their 900/980/720px breakpoints; body
   content of each page reads well. Desktop rendering is correct and must not
   change.

## Decisions

- **Mobile menu pattern: full-screen charcoal overlay** (recommended option;
  user was AFK at decision time — confirm before implementation).
- **Scope: whole site** (same caveat).
- Locked decisions stay locked: full-bleed home hero, `--dm: 1`, typography,
  gold crossing rule, dark bookends, `.kt-*` classes as the design system.
- Brand-rule note: CLAUDE.md locks 96px section padding (with a precedent for
  responsive variation — gutters drop to 24px ≤900px). This spec proposes
  `--sect-pad` 96px → 72px at ≤700px as a mobile-rhythm refinement.
  **Flagged for owner approval** since it touches a locked layout value.

## Non-goals

- No visual change at ≥901px (desktop stays 1:1 with the prototype;
  `pnpm shots` parity must hold).
- No Tailwind-utility refactor of components; no restyling of existing
  `.kt-*` rules — only additive mobile rules.
- No server/API/schema changes. No new dependencies.
- No art-direction change to photos (PhotoSlot cover-crop already handles it).

## Approach (chosen from 3)

**A (chosen): additive responsive CSS in `globals.css` + one new client
component (`MobileMenu`).** Smallest diff, follows the existing `.kt-*`
convention, desktop untouched.
**B (rejected): Tailwind responsive-utility refactor** — contradicts the
locked design-system rule, large risky diff.
**C (rejected): separate mobile component tree** — content duplication,
hydration/SEO complexity, unjustified for a static brand site.

## Design

### 1. Mobile nav (all pages)

**Breakpoint:** ≤900px the desktop `.kt-navlinks` row is hidden and a
hamburger button appears. ≥901px is pixel-identical to today (progressive
shrink rules 1200/1100/1024/920px remain).

**Trigger:** `.kt-burger` button in the nav bar right slot — 44×44px hit
area, two 20px ivory hairlines (SVG, no emoji), `aria-label="Open menu"`,
`aria-expanded`, `aria-controls="kt-mobile-menu"`. Visible only ≤900px.

**Panel (`.kt-mobile-menu`):** fixed, full-screen, `z-index` above nav,
charcoal `#262623` (the menu is a dark surface → gold accents allowed):

- Top row: monogram + wordmark (identical lockup) + close button (✕ as SVG,
  44×44px).
- Links: About / Services / Testimonials / Newsletter — Fraunces,
  `"opsz" 36`, ~28px, ivory, generous vertical rhythm; anchors use the same
  `base` prop convention as `KTNav` so they work from non-home pages.
- Client Resources: an inline expandable group (button + caret, same
  aria pattern as `ResourcesDrop`) revealing the 9 `CLIENT_RESOURCES` items
  in smaller serif (18px), indented, gold on hover/active.
- Gold hairline rule (`.kt-rule`), then Contact as `.kt-btn btn-ghost-dark`
  full-width-ish, then `NavSocial` icons row, then the INTERO lockup
  (Fraunces gold caps — brand rule 5) at the bottom.

**Behavior:**

- Opens/closes with fade+slight-slide (0.25s); instant under
  `prefers-reduced-motion`.
- Body scroll locked while open (`overflow: hidden` on `html`/`body`,
  restored on close/unmount).
- Closes on: ✕, Escape, any link tap, and route change.
- Focus management: focus moves to the close button on open and returns to
  the hamburger on close; panel traps Tab while open.
- Implementation: new client component `src/components/nav/mobile-menu.tsx`;
  `KTNav` renders it and the burger (nav stays a client component; no
  server-code impact).

### 2. Home hero

- `min-height: 94vh` → add `min-height: 94svh` (svh line after vh fallback)
  so the hero doesn't jump/overflow with the mobile URL bar; same for the
  inner flex column. `paddingBottom: 12vh` stays.
- Type/eyebrow/buttons already clamp and wrap acceptably at 390px — no change.

### 3. Testimonial block

- `.kt-hybrid-block` padding: ≤900px → `48px 28px`; ≤480px → `40px 24px`.
- Remove the fixed `minHeight: 150px` reliance at mobile (quote heights vary
  more when narrow): keep it desktop-only if needed via class, not inline.
- Carousel dots: keep the 32×2px visual bar but render it inside a
  44×44px-min padded button (transparent padding = larger hit area, zero
  visual change).

### 4. Newsletter signup form

- ≤560px: form stacks (`flex-direction: column`), input full width, button
  full width. New class on the form (e.g. `.kt-news-form`) replacing the
  inline flex style so CSS can respond.

### 5. Inputs — iOS zoom fix

- ≤900px: `.kt-input`, `.kt-input-light`, and the contact textarea/selects
  get `font-size: 16px`. Desktop sizes unchanged.

### 6. Contact form field pairs

- Replace the two inline `gridTemplateColumns: '1fr 1fr'` styles with a
  `.grid-form-pair` class; ≤480px it collapses to one column.

### 7. Section rhythm (flagged)

- `@media (max-width: 700px) { :root { --sect-pad: calc(72px * var(--dm)); } }`
  — pending owner approval per the brand-rule note above.

### 8. Everything else

- Blog archive/reader, neighborhoods, footer: verified acceptable at 390px;
  no changes beyond the shared nav/newsletter/section fixes. Share-row
  buttons stay 40px (borderline but acceptable; not worth diverging from the
  prototype).

## Testing (TDD — tests first per repo convention)

- **New component tests** `src/components/nav/__tests__/mobile-menu.test.tsx`:
  renders all links + 9 resources; burger toggles `aria-expanded` and panel
  visibility; Escape closes; link click closes; body scroll lock applied and
  removed; focus moves to close button on open and returns to burger; INTERO
  lockup present; no emoji.
- **CSS contract tests** (pattern of `tokens.test.ts`, regex over
  `globals.css`): ≤900px burger/menu rules exist; 16px mobile input rule;
  hybrid-block mobile padding; newsletter form stack rule; form-pair
  collapse; svh hero rule.
- **Updated tests:** `kt-nav.test.tsx` (burger present), any snapshot-ish
  assertions touched by the new classes.
- **Gates (all must be green before any commit is "done"):** `pnpm lint` ·
  `pnpm typecheck` · `pnpm test` · `pnpm build`.
- **Visual verification:** Playwright pass at 390/768/1280 against local
  build for every route (home, newsletter, post, contact, both
  neighborhoods, 2 resource pages); DOM horizontal-overflow assertion
  (no element beyond viewport) at 390px and 360px; `pnpm shots` to confirm
  desktop parity with the prototype.

## Security

Change surface is CSS + one presentational client component; no API routes,
no Supabase, no forms logic, no new dependencies. A cursory diff review for
injection surfaces (`dangerouslySetInnerHTML`, external URLs, event-handler
string interpolation) is included in the final review step; no formal scan
warranted.

## Rollout

Work on branch `feat/mobile-optimization` → PR with before/after mobile
screenshots → owner merges → Vercel deploys; verify on a real phone
post-deploy.
