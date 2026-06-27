# kalyanithilak.com — Production Readiness & Owner Handoff

_Build completed June 2026. Branch `build/site-v1`. This document is the state of the site at hand-off and the checklist of what only the owner (Kalyani) can finish._

## What was built

A production, static-first Next.js 15 site recreating the hi-fi prototype 1:1, built in the 7 milestones of README §12 — each milestone's tasks went through a TDD implement → spec-compliance review → code-quality review pipeline.

| Area | Status |
|---|---|
| Scaffold, brand tokens, fonts (Fraunces+Inter via next/font, opsz preserved) | ✅ |
| Shared Nav / Footer / Newsletter + social | ✅ |
| Home, Contact (progressive lead form) | ✅ |
| Newsletter blog: index, 2 real posts, share row, per-post OG images | ✅ |
| 7 resource pages + 2 neighborhood guides (data-driven) | ✅ |
| Favicon, 404, privacy (CCPA draft), sitemap.xml, robots.txt | ✅ |
| Supabase lead + newsletter capture (RLS on, secret-key server route, Zod) | ✅ (code) |
| Security review + M1/M2/M3 remediation | ✅ |

- **28 routes** prerendered static; only `/api/lead` + `/api/newsletter` are server code.
- **417 tests** green (Vitest + RTL). `pnpm lint`, `pnpm typecheck`, `pnpm build` all clean. `pnpm audit` clean.

## Acceptance bar (README §11)

1. **Pixel-faithful desktop + mobile** — verified via side-by-side screenshots vs the prototype across all pages (`pnpm shots`).
2. **Lighthouse** — Home **99 / 100 / 100 / 100**, Newsletter **99 / 96 / 100 / 100**, Post **99 / 94 / 100 / 100** (perf / a11y / best-practices / SEO). Above the ≥90 bar.
3. **No Babel / dev-React / render-blocking fonts** — confirmed: fonts self-hosted + preloaded (woff2), zero `fonts.googleapis.com`, no Babel, production React.
4. **Full click-through** — every nav/dropdown/footer route returns 200 with correct `<h1>`, desktop + mobile, custom 404 (`pnpm verify:routes`).
5. **Lead + newsletter validation** — Zod-validated server routes; invalid payloads rejected; honeypot + rate-limit. (Live inserts require the owner's Supabase env — see below.)
6. **Gates green; deploys GitHub→Vercel** — gates green; Vercel import is an owner step below.

## Security review summary

Read-only audit across 4 lenses (API/abuse, secrets/RLS, XSS/client, headers/deps), each finding adversarially verified. **0 M1 (critical/high).** All 2 M2 and 7 M3 fixed and re-verified:

- **M2** rate-limiting (per-IP sliding window + honeypot; trusted-IP keying; bounded memory; Upstash upgrade seam documented) and **security headers** (CSP, X-Frame-Options DENY, nosniff, Referrer-Policy, HSTS, Permissions-Policy).
- **M3** real-byte body cap (413), generic validation errors (no schema leak), Content-Type enforcement (415), server-only `SHOW_DRAFTS`, PII-safe error logging, `poweredByHeader: false`, postcss advisory pinned out.

### Accepted tradeoffs (not defects)
- **CSP `script-src 'unsafe-inline'`** — required for Next SSG hydration without per-request nonces; safe today (no HTML-injection sinks). Revisit with a nonce-based CSP only if dynamic/user-rendered HTML is ever added.
- **In-memory rate limiter** — best-effort per serverless instance. For hard cross-instance limits, wire Upstash Ratelimit (seam + env documented in `src/lib/rate-limit.ts`).
- **Blog-archive caption contrast** (`.ar-date`/`.ar-cat`) is below WCAG AA — these are the **locked brand palette**; changing them is a brand decision, not a code fix.

## Owner tasks before go-live

**Infrastructure (you provision; code is ready):**
1. **Supabase** — create the project, run `supabase/migrations/0001_leads_newsletter.sql`, set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` (see `.env.local.example`). Then lead + newsletter submissions land live.
   - **Use the NEW API keys** (Dashboard → **Settings → API Keys**; click "Create new API keys" if needed): copy the **Publishable key** (`sb_publishable_…`) and a **Secret key** (`sb_secret_…`). This is the day-one decision — do NOT use the deprecated legacy `anon`/`service_role` JWT keys (legacy support ends 2026). _This supersedes the legacy env names shown in the design-handoff `README.md` §7 / `START-HERE.md`._
   - `SUPABASE_SECRET_KEY` (`sb_secret_…`, `service_role` role) **bypasses RLS** and is the only write path; it is server-only (Supabase 401s a secret key sent from a browser). Pasting the publishable/anon key here makes every insert fail the RLS check — the app throws a clear startup error if it detects an RLS-respecting key in that slot (`src/lib/supabase-admin.ts` → `assertSecretKey`).
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (`sb_publishable_…`, `anon` role) respects RLS and is safe client-side; currently reserved/unused in code.
   - RLS is enabled with **no policies** (migration), so the publishable/`anon` key can neither read nor write — exactly as intended.
2. **Vercel** — import the GitHub repo, add the same env vars, add domain `kalyanithilak.com`.
3. _(Optional)_ **Resend** — `RESEND_API_KEY` if you want new-lead email notifications (not wired yet).
4. _(Optional, recommended at scale)_ **Upstash** — for distributed rate limiting.

**Content (drafts — replace/verify, README §9):**
5. Replace/verify ALL 7 resource-page copy and the neighborhood guide **prices/commutes/school claims** (currently plausible drafts — credibility risk).
6. Replace the **6 draft blog posts** (only 2 real issues ship; drafts are dev-only and excluded from production).
7. Confirm **testimonials** are real + permissioned.
8. Drop the **photos** into `public/images/<slot-id>.jpg` (ids in `design_handoff_kt_website/PHOTOS.md`); day-one must-have is `hero-full-img.jpg`.

**Decisions:**
9. Confirm the permalink scheme **`/newsletter/<slug>`** (permanent once shared).
10. Confirm interim email `kthilak@intero.com` vs a kalyanithilak.com mailbox.
11. Have **legal counsel review `/privacy`** (drafted, flagged in-code).

## Maintenance notes
- Publish a post = add `src/content/posts/<slug>.ts` + one import line in `index.ts`, then push.
- Brand rules + locked decisions live in `CLAUDE.md`. The `.kt-*` CSS in `globals.css` is a verbatim port of the design system — extend with net-new rules, don't restyle.
- Verification tooling: `pnpm shots` (visual diff), `pnpm verify:routes`, `pnpm verify:lighthouse`.
