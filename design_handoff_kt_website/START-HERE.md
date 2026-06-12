# Start Here — Building kalyanithilak.com with Claude Code

## 0. One-time setup (before opening Claude Code)

1. **GitHub repo** — create an empty repo (e.g. `kalyanithilak-com`) and put this handoff folder in it at `design_handoff/` (or keep it beside the repo and reference it by path).
2. **Supabase** — create a project at supabase.com. Note the project URL, anon key, and service-role key.
3. **Vercel** — create the project later by importing the GitHub repo (after first scaffold commit). Add the domain `kalyanithilak.com` in Vercel → Domains and follow its DNS instructions at your registrar.
4. **Resend (optional, for lead-notification email)** — create account, verify the sending domain.

Environment variables (set in Vercel dashboard AND a local `.env.local`, never committed):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # server-only, used by the lead/newsletter route
RESEND_API_KEY=...              # optional
```

## 1. Open Claude Code in the repo

```bash
cd kalyanithilak-com
claude
```

## 2. Kickoff prompt (paste this)

> Read `design_handoff/README.md` first — it is the complete build spec — then `design_handoff/PROJECT-STATUS.md` for decision history and `design_handoff/PHOTOS.md` for image slots. The `design_handoff/design/` folder contains a working hi-fi HTML prototype of the entire site; it is the design source of truth. Open the `kt-*.jsx` files to read exact markup, copy, and behavior — recreate them, don't ship them.
>
> Scaffold a production site per the spec: Next.js 15 (App Router) + React 19 + TypeScript, Tailwind CSS with the brand tokens from `design/kt-tokens.css` mapped into the theme, Fraunces + Inter via next/font (NOT Geist), pnpm via corepack, ESLint + typecheck scripts, Vitest + React Testing Library. Static-first: every page pre-rendered, blog posts via generateStaticParams at `/home-guide/<slug>`. Supabase for the lead + newsletter tables exactly as specified in README §7 (RLS on, writes only through a server route with Zod validation and the service-role key).
>
> Build in the order README §12 suggests, starting with the scaffold and the shared Nav/Footer/Newsletter components. After each milestone, run lint + typecheck + tests, and show me the page next to the prototype so I can compare. Create a `CLAUDE.md` in the repo root capturing the brand hard rules (README §4) so future sessions follow them.

## 3. Milestone checkpoints

After each of these, compare against the prototype in a browser before moving on:

1. Scaffold + tokens + fonts render (a styled type-specimen page is fine)
2. Nav + Footer + Newsletter band match the prototype
3. Home page complete
4. Contact form writing to Supabase
5. Blog index + the 2 real posts
6. Resource pages + neighborhood guides
7. Meta/OG + privacy page + 404 + favicon + Lighthouse pass

## 4. Before go-live (owner tasks — Kalyani)

- Replace/verify all resource-page copy and guide prices/commutes (drafts!)
- Replace the 6 draft blog posts; confirm testimonials are real + permissioned
- Day-one home hero photo (rest per PHOTOS.md)
- Confirm permalink scheme `/home-guide/<slug>` — permanent once shared
- Confirm interim email `kthilak@intero.com` vs. a kalyanithilak.com mailbox
