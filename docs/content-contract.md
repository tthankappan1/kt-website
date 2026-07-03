# Newsletter content contract

The format the content repo emits for every weekly issue, and the only thing
the website needs to publish it. **Content is data; presentation is code.**
The issue file carries words, numbers, and structure — zero CSS, zero SVG for
standard charts, no styled HTML. The website renders everything in the KT
design system via `pnpm ingest`.

This file is the canonical spec. A copy of it belongs in the content repo's
skill (kt-content) so generation targets it directly.

## Weekly pipeline

1. Content repo generates `Newsletter_<Mon>_Week<N>.md` per this contract
   (+ any photo/SVG assets in the same folder) into the shared drop folder.
2. Kalyani approves the content.
3. On the website: `pnpm ingest <path-to-md>` → typed post + registered route
   + assets copied to `public/images/posts/<slug>/`.
4. `pnpm dev` → review `http://localhost:3000/newsletter/<slug>`.
5. Gates (`pnpm typecheck && pnpm lint && pnpm test && pnpm build`) → commit →
   push to main → Vercel deploys.

The ingest script fails loudly on anything malformed (bad frontmatter, invalid
chart JSON, unknown category, duplicate slug) — a broken issue never reaches
the site half-parsed.

## File format

One markdown file per issue. Plain paragraphs, no HTML.

### Frontmatter (required)

```markdown
---
slug: down-payment-surprise-buying-with-less
title: The Down Payment Surprise: Why Buyers Are Getting In With Less Right Now
category: Market Update
date: 2026-07-02
excerpt: One or two sentences used on the archive page and in previews.
---
```

- `slug` — kebab-case, becomes the URL `/newsletter/<slug>`. Never reuse one.
- `category` — exactly one of: `Market Update`, `Neighborhoods`, `Buying`,
  `Selling`, `Lifestyle`.
- `date` — `YYYY-MM-DD` (publish date).
- Optional: `draft: true` (visible in dev only, never ships to production).

### Body blocks

| You write | The site renders |
|---|---|
| Plain paragraph (`**bold**`, `*italic*` allowed) | body paragraph |
| `## Section Heading` or `###` | styled section heading (`#` is not allowed — the title lives in frontmatter) |
| `- item` lines | gold-hairline bullet list |
| `> quoted lines` | a plain paragraph (keep the quotation marks in the text) |
| `---` | ignored (visual separator for the reviewer only) |
| `CTA: Call or text me…` | the gold-edged call-to-action callout (one per issue, near the end) |
| `Disclaimer: I am not a financial advisor…` | small-print disclaimer line |
| `Sources:` followed by `- [Title](https://url)` lines | the Sources footer row |
| ` ```chart ` fenced block (JSON) | brand-styled SVG chart (see below) |
| `![Alt text](photo-1.jpg "Optional caption")` | framed post image (see below) |

### Charts — data only, never drawings

A chart is a fenced block whose body is JSON. Two kinds exist. **Never emit
SVG, HTML, or a description-table for a standard chart — just the numbers.**

Trend over time (`line`). One entry per series; a series carries its own
`unit` (`"$"`, `"%"`, or a word). Series with different units are automatically
rendered as separate stacked panels (never a dual axis):

````markdown
```chart
{
  "kind": "line",
  "title": "Down Payments Are the Lowest They've Been Since 2021",
  "source": "Realtor.com",
  "note": "Both lines climbed together through the frenzy — and both are now on their way back down.",
  "series": [
    {
      "label": "Median down payment",
      "unit": "$",
      "points": [
        { "x": "2013", "y": 7500 }, { "x": "2014", "y": 10000 },
        { "x": "2015", "y": 9500 }, { "x": "2016", "y": 9500 },
        { "x": "2017", "y": 10500 }, { "x": "2018", "y": 13500 },
        { "x": "2019", "y": 12000 }, { "x": "2020", "y": 13000 },
        { "x": "2021", "y": 17000 }, { "x": "2022", "y": 30000 },
        { "x": "2023", "y": 24000 }, { "x": "2024", "y": 32000 },
        { "x": "2025", "y": 30000 }, { "x": "2026", "y": 23396 }
      ]
    }
  ]
}
```
````

Category comparison (`bar`):

````markdown
```chart
{
  "kind": "bar",
  "title": "Many Buyers Qualify for Assistance, but Few Use It",
  "source": "Urban Institute & Down Payment Resource",
  "note": "A 34-point gap between who's eligible and who claims it — that's money left on the table.",
  "unit": "%",
  "bars": [
    { "label": "Qualify for down payment assistance", "value": 44 },
    { "label": "Actually use down payment assistance", "value": 10 }
  ]
}
```
````

Field notes: `title` and one of `series`/`bars` are required; `source` and
`note` (the one-line italic takeaway under the plot) are optional but almost
always wanted. Keep numbers real — the site plots exactly what's here.

### Images and bespoke visuals

`![Alt text](filename.jpg "Optional caption")` — the file ships **in the same
folder** as the markdown; ingest copies it to `public/images/posts/<slug>/`.
Alt text is required.

- A referenced file that isn't in the folder is a **warning, not an error**:
  the post publishes and the image appears when the file is later dropped into
  `public/images/posts/<slug>/` (same fill-later model as the site's photo slots).
- **Bespoke one-off visuals** (a diagram that isn't a line/bar chart): ship a
  finished SVG asset. It renders on the light ivory surface (`#F3F0EB`), so
  use light-surface brand colors — charcoal `#262623`, gold-deep `#7E6A4F` —
  **never bright gold `#C0A278` on light**. Fraunces for display text, Inter
  for labels. If the same "bespoke" shape recurs across weeks, stop shipping
  it — ask for it to be promoted to a site chart kind.

### Degradation guarantee

Charts and images are optional. An issue with neither renders exactly like the
plain-text newsletters already on the site. Nothing about a missing visual
ever blocks publishing.

### House rules (unchanged from the brand)

- No emoji, anywhere.
- Voice: confident, calm, premium advisor — never pushy.
- Financial-advice disclaimer on any issue that discusses money decisions.
- The website path needs **no styled HTML artifact** — do not generate one for
  this pipeline. (Social/IG assets are a separate output and unaffected.)
