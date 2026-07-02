# Mobile Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make kalyanithilak.com first-class on mobile (80% of traffic) — net-new full-screen mobile menu plus mobile fixes for hero, testimonials, newsletter form, contact form, inputs, and section rhythm — with zero visual change at ≥901px.

**Architecture:** All responsive rules are additive CSS in `src/app/globals.css` following the existing `.kt-*` design-system convention (never restyle existing rules). One new client component `MobileMenu` renders a full-screen charcoal menu; `KTNav` gains a hamburger that mounts it. Components swap inline styles for new classes only where a breakpoint must apply.

**Tech Stack:** Next.js 15 App Router · React 19 · TS 5 · plain CSS in globals.css · Vitest + Testing Library (jsdom) · Playwright (verification only).

**Spec:** `docs/superpowers/specs/2026-07-01-mobile-optimization-design.md` (approved by owner 2026-07-01, all three flagged decisions approved: full-screen overlay menu, whole-site scope, `--sect-pad` 72px ≤700px).

## Global Constraints

- **Desktop unchanged:** no visual change at ≥901px. `pnpm shots` desktop parity must hold.
- **Brand hard rules (CLAUDE.md):** gold `#C0A278` on dark only; gold-deep `#7E6A4F` on light only; Fraunces + Inter only; 1px hairlines with TOP-LEFT-ONLY radius; no emoji anywhere; INTERO always re-typed in Fraunces gold caps.
- **Do not restyle existing `.kt-*` rules** — only add new rules/media queries.
- **No new dependencies. No server/API/schema changes.**
- **TDD:** test first, watch it fail, minimal implementation, watch it pass, commit.
- **Gates before any commit is "done":** `pnpm lint` · `pnpm typecheck` · `pnpm test` · `pnpm build`.
- **Branch:** all work on `feat/mobile-optimization` (already created; spec + this plan are its first commits).
- **jsdom caveat:** media queries do NOT apply in jsdom. Component tests assert DOM structure, classes, ARIA, and behavior — never computed visibility from CSS. CSS breakpoint rules are covered by string/regex contract tests over `globals.css` (pattern: `src/app/__tests__/tokens.test.ts`).
- **Copy rule:** any new string containing an apostrophe uses template literals or JSX entities (`&rsquo;`) — never raw curly quotes in single-quoted strings.

---

### Task 1: Mobile CSS foundation in globals.css (contract-tested)

All new CSS lands here in one task so later tasks only touch components. Class names defined here are the interface for Tasks 2–7.

**Files:**
- Test: `src/app/__tests__/mobile-css.test.ts` (create)
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: existing tokens (`--charcoal`, `--ivory`, `--gold`, `--serif`, `--sect-pad`, `--dm`), existing classes (`.kt-btn`, `.kt-rule`, `.kt-wordmark`, `.drop-caret`).
- Produces (used by later tasks): `.kt-burger`, `.kt-mobile-menu`, `.kt-mm-top`, `.kt-mm-close`, `.kt-mm-links`, `.kt-mm-link`, `.kt-mm-group`, `.kt-mm-sub`, `.kt-mm-subitem`, `.kt-mm-foot`, `.kt-mm-contact`, `.kt-mm-intero`, `.kt-hero-full`, `.kt-hero-full-inner`, `.kt-quote-well`, `.kt-dot`, `.kt-dot-bar`, `.kt-news-form`, `.grid-form-pair`.

- [ ] **Step 1: Write the failing contract test**

Create `src/app/__tests__/mobile-css.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const css = readFileSync(path.resolve(__dirname, '../globals.css'), 'utf8')

describe('mobile optimization CSS (spec 2026-07-01)', () => {
  it('hides desktop nav links and shows the burger at ≤900px', () => {
    expect(css).toMatch(/@media \(max-width: 900px\)[\s\S]{0,400}\.kt-nav-inner \.kt-navlinks \{ display: none; \}/)
    expect(css).toMatch(/\.kt-burger \{[\s\S]{0,300}display: none;/)
    expect(css).toMatch(/@media \(max-width: 900px\)[\s\S]{0,500}\.kt-burger \{ display: inline-flex; \}/)
  })

  it('burger and close buttons meet the 44px touch target', () => {
    expect(css).toMatch(/\.kt-burger \{[\s\S]{0,300}width: 44px;\s*height: 44px;/)
    expect(css).toMatch(/\.kt-mm-close \{[\s\S]{0,300}width: 44px;\s*height: 44px;/)
  })

  it('mobile menu is a fixed full-screen charcoal surface above the nav', () => {
    expect(css).toMatch(/\.kt-mobile-menu \{[\s\S]{0,300}position: fixed;\s*inset: 0;/)
    expect(css).toMatch(/\.kt-mobile-menu \{[\s\S]{0,400}background: var\(--charcoal\);/)
    expect(css).toMatch(/\.kt-mobile-menu \{[\s\S]{0,400}z-index: 70;/)
  })

  it('menu links are Fraunces serif with opsz 36', () => {
    expect(css).toMatch(/\.kt-mm-link \{[\s\S]{0,300}font-family: var\(--serif\);/)
    expect(css).toMatch(/\.kt-mm-link \{[\s\S]{0,300}"opsz" 36/)
  })

  it('menu INTERO lockup is Fraunces gold caps (brand rule 5)', () => {
    expect(css).toMatch(/\.kt-mm-intero \{[\s\S]{0,300}font-family: var\(--serif\);/)
    expect(css).toMatch(/\.kt-mm-intero \{[\s\S]{0,300}color: var\(--gold\);/)
    expect(css).toMatch(/\.kt-mm-intero \{[\s\S]{0,300}text-transform: uppercase;/)
  })

  it('hero uses svh with vh fallback', () => {
    expect(css).toMatch(/\.kt-hero-full \{\s*min-height: 94vh;\s*min-height: 94svh;/)
    expect(css).toMatch(/\.kt-hero-full-inner \{[\s\S]{0,200}min-height: 94vh;\s*min-height: 94svh;/)
  })

  it('testimonial block compresses padding on mobile; quote well relaxes', () => {
    expect(css).toMatch(/@media \(max-width: 900px\)[\s\S]{0,600}\.kt-hybrid-block \{ padding: 48px 28px; \}/)
    expect(css).toMatch(/@media \(max-width: 480px\)[\s\S]{0,300}\.kt-hybrid-block \{ padding: 40px 24px; \}/)
    expect(css).toMatch(/\.kt-quote-well \{ min-height: 150px; \}/)
    expect(css).toMatch(/@media \(max-width: 900px\)[\s\S]{0,600}\.kt-quote-well \{ min-height: 0; \}/)
  })

  it('carousel dots keep a 32×2 bar but gain a 44px hit area on mobile', () => {
    expect(css).toMatch(/\.kt-dot-bar \{[\s\S]{0,200}width: 32px;\s*height: 2px;/)
    expect(css).toMatch(/@media \(max-width: 900px\)[\s\S]{0,800}\.kt-dot \{ min-width: 44px; min-height: 44px; \}/)
  })

  it('newsletter form stacks at ≤560px with a full-width button', () => {
    expect(css).toMatch(/\.kt-news-form \{ display: flex; gap: 12px; \}/)
    expect(css).toMatch(/@media \(max-width: 560px\)[\s\S]{0,400}\.kt-news-form \{ flex-direction: column; \}/)
    expect(css).toMatch(/@media \(max-width: 560px\)[\s\S]{0,400}\.kt-news-form \.kt-btn \{ width: 100%; justify-content: center; \}/)
  })

  it('form field pairs collapse to one column at ≤480px', () => {
    expect(css).toMatch(/\.grid-form-pair \{ display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; \}/)
    expect(css).toMatch(/@media \(max-width: 480px\)[\s\S]{0,300}\.grid-form-pair \{ grid-template-columns: 1fr; \}/)
  })

  it('inputs are ≥16px on mobile so iOS Safari does not auto-zoom', () => {
    expect(css).toMatch(/@media \(max-width: 900px\)[\s\S]{0,300}\.kt-input,\s*\.kt-input-light \{ font-size: 16px; \}/)
  })

  it('section rhythm drops to 72px at ≤700px (owner-approved)', () => {
    expect(css).toMatch(/@media \(max-width: 700px\)[\s\S]{0,200}--sect-pad: calc\(72px \* var\(--dm\)\);/)
  })

  it('drops the dead ≤800px navlinks wrap block (links are hidden at 900px)', () => {
    expect(css).not.toMatch(/@media \(max-width: 800px\)/)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/app/__tests__/mobile-css.test.ts`
Expected: FAIL — every `it` fails (rules don't exist yet).

- [ ] **Step 3: Add the CSS to `src/app/globals.css`**

3a. DELETE the now-dead block (its trigger condition can no longer occur once nav links hide at 900px):

```css
@media (max-width: 800px) {
  .kt-navlinks { flex-wrap: wrap; justify-content: flex-end; row-gap: 10px; }
}
```

3b. APPEND this section immediately after the `/* ---------- responsive (nav shrinks progressively…) ---------- */` media-query group (after the deleted 800px block's position):

```css
/* ---------- mobile nav (net-new, spec 2026-07-01; ≤900px only) ---------- */
.kt-burger {
  display: none;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--ivory);
}
@media (max-width: 900px) {
  .kt-nav-inner .kt-navlinks { display: none; }
  .kt-burger { display: inline-flex; }
}

.kt-mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 70;
  background: var(--charcoal);
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow-y: auto;
  animation: kt-menu-in 0.25s ease both;
}
@keyframes kt-menu-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
}
.kt-mm-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 24px;
}
.kt-mm-close {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--ivory);
}
.kt-mm-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 24px;
}
.kt-mm-link {
  font-family: var(--serif);
  font-weight: 400;
  font-variation-settings: "opsz" 36;
  font-size: 28px;
  line-height: 1.3;
  color: var(--ivory);
  text-decoration: none;
  padding: 10px 0;
}
.kt-mm-link:hover, .kt-mm-link:active { color: var(--gold); }
button.kt-mm-link {
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.kt-mm-sub {
  display: flex;
  flex-direction: column;
  margin: 4px 0 8px 4px;
  padding: 4px 0 8px 18px;
  border-left: 1px solid rgba(192, 162, 120, 0.3);
}
.kt-mm-subitem {
  font-family: var(--serif);
  font-weight: 400;
  font-variation-settings: "opsz" 36;
  font-size: 18px;
  line-height: 1.5;
  color: var(--body-on-dark);
  text-decoration: none;
  padding: 8px 0;
}
.kt-mm-subitem:hover, .kt-mm-subitem:active { color: var(--gold); }
.kt-mm-foot {
  margin-top: auto;
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.kt-mm-contact { width: 100%; justify-content: center; }
.kt-mm-intero {
  font-family: var(--serif);
  font-weight: 400;
  font-variation-settings: "opsz" 72;
  font-size: 13px;
  letter-spacing: 0.3em;
  margin-right: -0.3em;
  color: var(--gold);
  text-transform: uppercase;
  line-height: 1;
}

/* ---------- mobile pass: hero, testimonials, forms, rhythm (spec 2026-07-01) ---------- */
.kt-hero-full {
  min-height: 94vh;
  min-height: 94svh;
}
.kt-hero-full-inner {
  min-height: 94vh;
  min-height: 94svh;
  padding-bottom: 12vh;
}

.kt-quote-well { min-height: 150px; }

.kt-dot {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 16px;
}
.kt-dot-bar {
  display: block;
  width: 32px;
  height: 2px;
  transition: background 0.3s;
}

.kt-news-form { display: flex; gap: 12px; }

.grid-form-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }

@media (max-width: 900px) {
  .kt-hybrid-block { padding: 48px 28px; }
  .kt-quote-well { min-height: 0; }
  .kt-dot { min-width: 44px; min-height: 44px; }
  .kt-input, .kt-input-light { font-size: 16px; }
}
@media (max-width: 700px) {
  :root { --sect-pad: calc(72px * var(--dm)); }
}
@media (max-width: 560px) {
  .kt-news-form { flex-direction: column; }
  .kt-news-form .kt-btn { width: 100%; justify-content: center; }
}
@media (max-width: 480px) {
  .kt-hybrid-block { padding: 40px 24px; }
  .grid-form-pair { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Run tests to verify pass (including existing token tests)**

Run: `pnpm vitest run src/app/__tests__/mobile-css.test.ts src/app/__tests__/tokens.test.ts`
Expected: ALL PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/__tests__/mobile-css.test.ts src/app/globals.css
git commit -m "feat(mobile): add mobile CSS foundation — menu, hero svh, touch targets, form stacking"
```

---

### Task 2: MobileMenu component (TDD)

**Files:**
- Test: `src/components/nav/__tests__/mobile-menu.test.tsx` (create)
- Create: `src/components/nav/mobile-menu.tsx`

**Interfaces:**
- Consumes: CSS classes from Task 1; `Monogram` from `@/components/ui/monogram`; `NavSocial` from `@/components/nav/nav-social`; `CLIENT_RESOURCES` from `@/lib/site` (9 items, `{ label, href }`).
- Produces: `export function MobileMenu({ base = '', onClose }: { base?: string; onClose: () => void })` — rendered ONLY while open (parent conditionally mounts it; there is no `open` prop). Root element has `id="kt-mobile-menu"`.

- [ ] **Step 1: Write the failing tests**

Create `src/components/nav/__tests__/mobile-menu.test.tsx`:

```tsx
import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MobileMenu } from '@/components/nav/mobile-menu'
import { CLIENT_RESOURCES } from '@/lib/site'

describe('MobileMenu', () => {
  it('renders primary links with base-prefixed anchors (base="/")', () => {
    render(<MobileMenu base="/" onClose={() => {}} />)
    expect(screen.getByRole('link', { name: 'About' }).getAttribute('href')).toBe('/#about')
    expect(screen.getByRole('link', { name: 'Services' }).getAttribute('href')).toBe('/#services')
    expect(screen.getByRole('link', { name: 'Testimonials' }).getAttribute('href')).toBe('/#testimonials')
    expect(screen.getByRole('link', { name: 'Newsletter' }).getAttribute('href')).toBe('/newsletter')
    expect(screen.getByRole('link', { name: 'Contact' }).getAttribute('href')).toBe('/contact')
  })

  it('uses bare anchors on the home page (base="")', () => {
    render(<MobileMenu base="" onClose={() => {}} />)
    expect(screen.getByRole('link', { name: 'About' }).getAttribute('href')).toBe('#about')
  })

  it('Client Resources group is collapsed initially and expands with all 9 items', () => {
    render(<MobileMenu onClose={() => {}} />)
    const groupBtn = screen.getByRole('button', { name: /client resources/i })
    expect(groupBtn.getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByRole('link', { name: "Buyer's Guide" })).not.toBeInTheDocument()
    fireEvent.click(groupBtn)
    expect(groupBtn.getAttribute('aria-expanded')).toBe('true')
    for (const item of CLIENT_RESOURCES) {
      expect(screen.getByRole('link', { name: item.label }).getAttribute('href')).toBe(item.href)
    }
  })

  it('calls onClose when a link is clicked', () => {
    const onClose = vi.fn()
    render(<MobileMenu base="/" onClose={onClose} />)
    fireEvent.click(screen.getByRole('link', { name: 'About' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose on Escape', () => {
    const onClose = vi.fn()
    render(<MobileMenu base="/" onClose={onClose} />)
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('locks body scroll while mounted and restores on unmount', () => {
    const { unmount } = render(<MobileMenu onClose={() => {}} />)
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('focuses the close button on mount', () => {
    render(<MobileMenu onClose={() => {}} />)
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close menu' }))
  })

  it('is a labelled modal dialog with the INTERO lockup and no emoji', () => {
    const { container } = render(<MobileMenu onClose={() => {}} />)
    const dialog = screen.getByRole('dialog', { name: 'Menu' })
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(dialog.id).toBe('kt-mobile-menu')
    const intero = container.querySelector('.kt-mm-intero')
    expect(intero?.textContent).toBe('Intero')
    expect(container.textContent).not.toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u)
  })

  it('traps Tab focus inside the panel', () => {
    render(<MobileMenu base="/" onClose={() => {}} />)
    const dialog = screen.getByRole('dialog')
    const focusables = dialog.querySelectorAll<HTMLElement>('a[href], button')
    const last = focusables[focusables.length - 1]
    last.focus()
    fireEvent.keyDown(dialog, { key: 'Tab' })
    expect(document.activeElement).toBe(focusables[0])
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(last)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/components/nav/__tests__/mobile-menu.test.tsx`
Expected: FAIL — `Cannot find module '@/components/nav/mobile-menu'`.

- [ ] **Step 3: Write the component**

Create `src/components/nav/mobile-menu.tsx`:

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Monogram } from '@/components/ui/monogram'
import { NavSocial } from '@/components/nav/nav-social'
import { CLIENT_RESOURCES } from '@/lib/site'

interface MobileMenuProps {
  base?: string
  onClose: () => void
}

// Full-screen mobile menu (spec 2026-07-01). Parent mounts it only while
// open — mounting is what triggers the entry animation and scroll lock.
export function MobileMenu({ base = '', onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [resourcesOpen, setResourcesOpen] = useState(false)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
      return
    }
    if (e.key !== 'Tab' || !panelRef.current) return
    const focusables = panelRef.current.querySelectorAll<HTMLElement>('a[href], button')
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      id="kt-mobile-menu"
      className="kt-mobile-menu on-dark"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      onKeyDown={handleKeyDown}
    >
      <div className="kt-mm-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Monogram />
          <span className="kt-wordmark">
            Kalyani Thilak
            <span className="wm-sub">REALTOR&reg; &middot; TRI-VALLEY</span>
          </span>
        </div>
        <button ref={closeRef} className="kt-mm-close" aria-label="Close menu" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 3l14 14M17 3L3 17" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </div>
      <nav className="kt-mm-links" aria-label="Mobile">
        <a className="kt-mm-link" href={base + '#about'} onClick={onClose}>About</a>
        <a className="kt-mm-link" href={base + '#services'} onClick={onClose}>Services</a>
        <a className="kt-mm-link" href={base + '#testimonials'} onClick={onClose}>Testimonials</a>
        <Link className="kt-mm-link" href="/newsletter" onClick={onClose}>Newsletter</Link>
        <button
          className="kt-mm-link kt-mm-group"
          aria-expanded={resourcesOpen}
          aria-controls="kt-mm-resources"
          onClick={() => setResourcesOpen((prev) => !prev)}
        >
          Client Resources
          <svg
            className="drop-caret"
            width="11"
            height="7"
            viewBox="0 0 9 6"
            fill="none"
            aria-hidden="true"
            style={{ transform: resourcesOpen ? 'rotate(180deg)' : undefined }}
          >
            <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
        {resourcesOpen ? (
          <div id="kt-mm-resources" className="kt-mm-sub">
            {CLIENT_RESOURCES.map((item) => (
              <Link key={item.label} className="kt-mm-subitem" href={item.href} onClick={onClose}>
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}
      </nav>
      <div className="kt-mm-foot">
        <hr className="kt-rule" style={{ margin: 0 }} />
        <Link className="kt-btn btn-ghost-dark kt-mm-contact" href="/contact" onClick={onClose}>
          Contact
        </Link>
        <NavSocial />
        <span className="kt-mm-intero">Intero</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/components/nav/__tests__/mobile-menu.test.tsx`
Expected: ALL PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/nav/__tests__/mobile-menu.test.tsx src/components/nav/mobile-menu.tsx
git commit -m "feat(mobile): full-screen mobile menu component — scroll lock, focus trap, resources group"
```

---

### Task 3: Hamburger in KTNav, mounts MobileMenu

**Files:**
- Test: `src/components/nav/__tests__/kt-nav.test.tsx` (modify — append tests)
- Modify: `src/components/nav/kt-nav.tsx`

**Interfaces:**
- Consumes: `MobileMenu({ base, onClose })` from Task 2; `.kt-burger` CSS from Task 1.
- Produces: burger `<button aria-label="Open menu" aria-expanded aria-controls="kt-mobile-menu">` inside `.kt-nav-inner`; menu mounted only while open.

**Caution:** existing tests use `getByRole('link', { name: 'Contact' })` etc. — the menu also contains those names, so it must stay UNMOUNTED unless a test opens it, and new tests that open the menu must scope queries with `within(dialog)`.

- [ ] **Step 1: Append failing tests to `kt-nav.test.tsx`**

Add to imports: `fireEvent`, `within` from `@testing-library/react`.

```tsx
describe('KTNav mobile menu', () => {
  it('renders a burger button, menu closed initially', () => {
    render(<KTNav base="/" />)
    const burger = screen.getByRole('button', { name: 'Open menu' })
    expect(burger.getAttribute('aria-expanded')).toBe('false')
    expect(burger.getAttribute('aria-controls')).toBe('kt-mobile-menu')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('burger opens the menu; close button closes it and returns focus to the burger', () => {
    render(<KTNav base="/" />)
    const burger = screen.getByRole('button', { name: 'Open menu' })
    fireEvent.click(burger)
    expect(burger.getAttribute('aria-expanded')).toBe('true')
    const dialog = screen.getByRole('dialog', { name: 'Menu' })
    expect(within(dialog).getByRole('link', { name: 'About' }).getAttribute('href')).toBe('/#about')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close menu' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.activeElement).toBe(burger)
  })

  it('menu closes when a menu link is clicked', () => {
    render(<KTNav base="/" />)
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    const dialog = screen.getByRole('dialog', { name: 'Menu' })
    fireEvent.click(within(dialog).getByRole('link', { name: 'Newsletter' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify the new ones fail**

Run: `pnpm vitest run src/components/nav/__tests__/kt-nav.test.tsx`
Expected: 3 new tests FAIL (`Unable to find … 'Open menu'`); all pre-existing tests still PASS.

- [ ] **Step 3: Implement in `kt-nav.tsx`**

Replace the imports and component body as follows (full file):

```tsx
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Monogram } from '@/components/ui/monogram'
import { NavSocial } from '@/components/nav/nav-social'
import { ResourcesDrop } from '@/components/nav/resources-drop'
import { MobileMenu } from '@/components/nav/mobile-menu'

interface KTNavProps {
  base?: string
}

export function KTNav({ base = '' }: KTNavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const burgerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    burgerRef.current?.focus()
  }, [])

  return (
    <nav className={'kt-nav' + (scrolled ? ' scrolled' : '')}>
      <div className="kt-nav-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href={base + '#top'} aria-label="Kalyani Thilak — home" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            <Monogram />
          </a>
          <a className="kt-wordmark" href={base + '#top'}>
            Kalyani Thilak
            <span className="wm-sub">REALTOR&reg; &middot; TRI-VALLEY</span>
          </a>
          <span className="kt-nav-divider" aria-hidden="true"></span>
          <span className="kt-nav-intero">Intero</span>
        </div>
        <div className="kt-navlinks">
          <a className="kt-navlink" href={base + '#about'}>About</a>
          <a className="kt-navlink" href={base + '#services'}>Services</a>
          <a className="kt-navlink" href={base + '#testimonials'}>Testimonials</a>
          <Link className="kt-navlink" href="/newsletter">Newsletter</Link>
          <ResourcesDrop />
          <NavSocial />
          <Link className="kt-btn btn-ghost-dark" href="/contact" style={{ padding: '10px 22px' }}>Contact</Link>
        </div>
        <button
          ref={burgerRef}
          className="kt-burger"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="kt-mobile-menu"
          onClick={() => setMenuOpen(true)}
        >
          <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
            <path d="M1 1h20M1 13h20" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </div>
      {menuOpen ? <MobileMenu base={base} onClose={closeMenu} /> : null}
    </nav>
  )
}
```

- [ ] **Step 4: Run the full test suite**

Run: `pnpm test`
Expected: ALL PASS (nav suite, home-page/layout suites that render KTNav, everything else).

- [ ] **Step 5: Commit**

```bash
git add src/components/nav/__tests__/kt-nav.test.tsx src/components/nav/kt-nav.tsx
git commit -m "feat(mobile): hamburger in KTNav mounts full-screen menu at ≤900px"
```

---

### Task 4: Hero — svh classes replace inline minHeight

**Files:**
- Test: `src/components/home/__tests__/hero-full.test.tsx` (modify — append tests)
- Modify: `src/components/home/hero-full.tsx`

**Interfaces:**
- Consumes: `.kt-hero-full`, `.kt-hero-full-inner` from Task 1.
- Produces: no API change (`HeroFull` has no props).

- [ ] **Step 1: Append failing tests to `hero-full.test.tsx`**

```tsx
describe('HeroFull mobile viewport units', () => {
  it('header uses the kt-hero-full class (svh-safe min-height lives in CSS)', () => {
    const { container } = render(<HeroFull />)
    const header = container.querySelector('header#top')
    expect(header?.classList.contains('kt-hero-full')).toBe(true)
    expect(header?.getAttribute('style') ?? '').not.toContain('min-height')
  })

  it('inner container uses kt-hero-full-inner and drops inline min-height/padding-bottom', () => {
    const { container } = render(<HeroFull />)
    const inner = container.querySelector('.kt-hero-full-inner')
    expect(inner).toBeInTheDocument()
    expect(inner?.classList.contains('kt-container')).toBe(true)
    expect(inner?.getAttribute('style') ?? '').not.toContain('min-height')
    expect(inner?.getAttribute('style') ?? '').not.toContain('padding-bottom')
  })
})
```

(Match the existing file's `render` import/pattern; add `describe` import if absent.)

- [ ] **Step 2: Run tests to verify the new ones fail**

Run: `pnpm vitest run src/components/home/__tests__/hero-full.test.tsx`
Expected: 2 new FAIL, existing PASS.

- [ ] **Step 3: Implement in `hero-full.tsx`**

- `<header id="top" className="bg-dark on-dark" style={{ position: 'relative', minHeight: '94vh' }}>` →
  `<header id="top" className="bg-dark on-dark kt-hero-full" style={{ position: 'relative' }}>`
- The inner `<div className="kt-container" style={{ …, minHeight: '94vh', paddingBottom: '12vh', … }}>` →
  `<div className="kt-container kt-hero-full-inner" style={{ position: 'relative', zIndex: 4, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', pointerEvents: 'none' }}>`
  (i.e. remove ONLY `minHeight` and `paddingBottom` from the inline style — both now live in `.kt-hero-full-inner`.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/components/home/__tests__/hero-full.test.tsx src/app/__tests__/home-page.test.tsx`
Expected: ALL PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/__tests__/hero-full.test.tsx src/components/home/hero-full.tsx
git commit -m "feat(mobile): hero min-height via svh classes — no URL-bar jump on phones"
```

---

### Task 5: Testimonials — quote well class + 44px dot hit areas

**Files:**
- Test: `src/components/home/__tests__/testimonials.test.tsx` (modify)
- Modify: `src/components/home/testimonials.tsx`

**Interfaces:**
- Consumes: `.kt-quote-well`, `.kt-dot`, `.kt-dot-bar` from Task 1.
- Produces: dots keep `aria-label="Quote N"`; active-state background moves to the inner `.kt-dot-bar` span.

**Caution:** existing tests may assert the old inline dot styling (background on the button) — update any such assertion to target `.kt-dot-bar`, keep all behavioral assertions (click switches quote, auto-advance, reduced-motion) unchanged.

- [ ] **Step 1: Append failing tests**

```tsx
describe('testimonials mobile touch targets', () => {
  it('blockquote uses kt-quote-well (min-height handled in CSS per breakpoint)', () => {
    const { container } = render(<KTTestimonials />)
    const quote = container.querySelector('blockquote')
    expect(quote?.classList.contains('kt-quote-well')).toBe(true)
    expect(quote?.getAttribute('style') ?? '').not.toContain('min-height')
  })

  it('dots are kt-dot buttons wrapping a kt-dot-bar; active bar is gold', () => {
    const { container } = render(<KTTestimonials />)
    const dots = container.querySelectorAll('button.kt-dot')
    expect(dots.length).toBe(2)
    const bars = container.querySelectorAll('button.kt-dot .kt-dot-bar')
    expect(bars.length).toBe(2)
    expect((bars[0] as HTMLElement).style.background).toContain('--gold')
  })
})
```

- [ ] **Step 2: Run to verify the new tests fail**

Run: `pnpm vitest run src/components/home/__tests__/testimonials.test.tsx`
Expected: new tests FAIL.

- [ ] **Step 3: Implement in `testimonials.tsx`**

- `<blockquote style={{ minHeight: '150px' }}>` → `<blockquote className="kt-quote-well">`
- Dot buttons:

```tsx
{KT_QUOTES.map((_, i) => (
  <button key={i} aria-label={`Quote ${i + 1}`} onClick={() => setIdx(i)} className="kt-dot">
    <span
      className="kt-dot-bar"
      style={{ background: i === idx ? 'var(--gold)' : 'rgba(192,162,120,0.3)' }}
    />
  </button>
))}
```

- [ ] **Step 4: Run the suite; fix any stale assertions on the old button styles**

Run: `pnpm vitest run src/components/home/__tests__/testimonials.test.tsx`
Expected: ALL PASS (after updating any assertion that targeted inline button background/width).

- [ ] **Step 5: Commit**

```bash
git add src/components/home/__tests__/testimonials.test.tsx src/components/home/testimonials.tsx
git commit -m "feat(mobile): testimonial mobile padding hooks + 44px carousel dot hit areas"
```

---

### Task 6: Newsletter form — stack on small screens

**Files:**
- Test: `src/components/close/__tests__/kt-newsletter.test.tsx` (modify)
- Modify: `src/components/close/kt-newsletter.tsx`

**Interfaces:**
- Consumes: `.kt-news-form` from Task 1.
- Produces: no API change (`KTNewsletter({ archiveLink })` unchanged).

- [ ] **Step 1: Append failing test**

```tsx
it('form uses kt-news-form class (stacks ≤560px via CSS) with no inline flex style', () => {
  const { container } = render(<KTNewsletter />)
  const form = container.querySelector('form')
  expect(form?.classList.contains('kt-news-form')).toBe(true)
  expect(form?.getAttribute('style')).toBeNull()
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm vitest run src/components/close/__tests__/kt-newsletter.test.tsx`
Expected: new test FAILS.

- [ ] **Step 3: Implement in `kt-newsletter.tsx`**

`<form onSubmit={submit} noValidate style={{ display: 'flex', gap: '12px' }}>` →
`<form onSubmit={submit} noValidate className="kt-news-form">`

(The submit button keeps `style={{ flex: 'none' }}`.)

- [ ] **Step 4: Run to verify pass**

Run: `pnpm vitest run src/components/close/__tests__/kt-newsletter.test.tsx`
Expected: ALL PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/close/__tests__/kt-newsletter.test.tsx src/components/close/kt-newsletter.tsx
git commit -m "feat(mobile): newsletter signup stacks below 560px"
```

---

### Task 7: Contact form — field pairs collapse at ≤480px

**Files:**
- Test: `src/components/contact/__tests__/contact-form.test.tsx` (modify)
- Modify: `src/components/contact/contact-form.tsx`

**Interfaces:**
- Consumes: `.grid-form-pair` from Task 1.
- Produces: no API change.

- [ ] **Step 1: Append failing test**

```tsx
it('name and email/phone pairs use grid-form-pair (collapses ≤480px via CSS)', () => {
  const { container } = render(<ContactForm />)
  const pairs = container.querySelectorAll('.grid-form-pair')
  expect(pairs.length).toBe(2)
  pairs.forEach((pair) => {
    expect(pair.getAttribute('style')).toBeNull()
    expect(pair.querySelectorAll('input').length).toBe(2)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm vitest run src/components/contact/__tests__/contact-form.test.tsx`
Expected: new test FAILS.

- [ ] **Step 3: Implement in `contact-form.tsx`**

Replace BOTH inline-styled pair wrappers (name grid at ~line 175 and contact grid at ~line 214):

```tsx
<div
  style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '28px',
  }}
>
```

→

```tsx
<div className="grid-form-pair">
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm vitest run src/components/contact/__tests__/contact-form.test.tsx`
Expected: ALL PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/contact/__tests__/contact-form.test.tsx src/components/contact/contact-form.tsx
git commit -m "feat(mobile): contact form field pairs collapse to one column below 480px"
```

---

### Task 8: Full gates + visual verification + cursory security pass

**Files:**
- Create: `scripts/mobile-verify.mjs` (verification harness — committed for reuse)
- No production-code changes expected; fix regressions if verification finds them.

**Interfaces:**
- Consumes: the full built site (`pnpm build` + `pnpm start`), all prior tasks.
- Produces: screenshot evidence + overflow report for the PR body.

- [ ] **Step 1: Run all four gates**

Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
Expected: all green. Fix anything red before proceeding.

- [ ] **Step 2: Create the verification script**

Create `scripts/mobile-verify.mjs`:

```js
// Mobile verification: screenshots + horizontal-overflow audit at phone,
// phablet, and tablet widths for every route. Run against a local server:
//   pnpm build && pnpm start &   then: node scripts/mobile-verify.mjs
import { chromium, devices } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const OUT = 'shots-mobile'
mkdirSync(OUT, { recursive: true })

const ROUTES = [
  ['home', '/'],
  ['newsletter', '/newsletter'],
  ['post', '/newsletter/national-headlines-tri-valley-summer'],
  ['contact', '/contact'],
  ['alameda', '/neighborhoods/alameda-county'],
  ['contra-costa', '/neighborhoods/contra-costa-county'],
  ['buying', '/resources/buying'],
  ['buyers-guide', '/resources/buyers-guide'],
]
const WIDTHS = [360, 390, 768]

const browser = await chromium.launch()
let failures = 0
for (const width of WIDTHS) {
  const ctx = await browser.newContext({
    ...devices['iPhone 14'],
    viewport: { width, height: 844 },
  })
  const page = await ctx.newPage()
  for (const [name, route] of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' })
    await page.screenshot({ path: `${OUT}/${name}-${width}.png`, fullPage: true })
    const overflow = await page.evaluate(() => {
      const cw = document.documentElement.clientWidth
      const bad = []
      document.querySelectorAll('body *').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.width > 0 && (r.right > cw + 1 || r.left < -1)) {
          const cls = [...el.classList].join('.')
          if (cls !== 'kt-skip') bad.push(`${el.tagName}.${cls} L${Math.round(r.left)} R${Math.round(r.right)}`)
        }
      })
      return bad
    })
    if (overflow.length > 0) {
      failures++
      console.log(`OVERFLOW ${name} @${width}px:\n  ${overflow.join('\n  ')}`)
    } else {
      console.log(`ok ${name} @${width}px`)
    }
  }
  await ctx.close()
}

// Menu interaction check at phone width (iPhone 14 descriptor includes hasTouch)
{
  const ctx = await browser.newContext({ ...devices['iPhone 14'] })
  const page = await ctx.newPage()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Open menu' }).tap()
  await page.screenshot({ path: `${OUT}/menu-open-390.png` })
  const scrollLocked = await page.evaluate(() => document.body.style.overflow === 'hidden')
  await page.getByRole('link', { name: 'Newsletter' }).tap()
  await page.waitForURL('**/newsletter')
  if (!scrollLocked) {
    failures++
    console.log('menu: SCROLL NOT LOCKED while open')
  } else {
    console.log('menu: opens, locks scroll, closes and navigates on link tap')
  }
  await ctx.close()
}

await browser.close()
if (failures > 0) {
  console.error(`\n${failures} route/width combos have horizontal overflow`)
  process.exit(1)
}
console.log('\nAll routes clean at all widths')
```

- [ ] **Step 3: Run verification against the production build**

```bash
pnpm start &            # serves the build from Step 1 on :3000
sleep 3
node scripts/mobile-verify.mjs
kill %1
```

Expected: `All routes clean at all widths` + `menu: opens, locks scroll, closes and navigates on link tap`, exit 0. Eyeball `shots-mobile/home-390.png` (single-row nav bar with burger, no clipped links, hero text well-placed) and `shots-mobile/menu-open-390.png` (full-screen charcoal menu, serif links, INTERO lockup at bottom).

- [ ] **Step 4: Desktop parity check**

Run: `pnpm shots` (needs the dev server per repo convention).
Expected: side-by-side prototype/built captures show no desktop drift — the only allowed diffs are at mobile widths.

- [ ] **Step 5: Cursory security pass (per spec: CSS + presentational component only)**

```bash
git diff main --stat
git diff main | grep -iE 'dangerouslySetInnerHTML|innerHTML|http://|eval\(|new Function' || echo CLEAN
git diff main --name-only | grep -E 'api/|supabase|middleware|next.config' || echo "no server surface touched"
```

Expected: `CLEAN` and `no server surface touched`. The diff must contain only: `globals.css`, nav/home/close/contact components + tests, docs, `scripts/mobile-verify.mjs`.

- [ ] **Step 6: Commit verification harness + any fixes**

```bash
git add scripts/mobile-verify.mjs
git commit -m "test(mobile): add mobile verification harness — overflow audit + screenshots per route/width"
```

---

## Verification Checklist (definition of done)

- [ ] All four gates green: `pnpm lint` · `pnpm typecheck` · `pnpm test` · `pnpm build`
- [ ] `mobile-verify.mjs`: zero horizontal overflow on all 8 routes × 3 widths
- [ ] Menu opens/closes on a 390px viewport; body scroll locks; Escape + link-tap close; focus returns to burger
- [ ] `pnpm shots` desktop parity holds (no change ≥901px)
- [ ] Security greps clean; diff limited to expected files
- [ ] PR opened against `main` with before/after mobile screenshots
```
