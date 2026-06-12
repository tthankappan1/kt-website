// Side-by-side screenshot harness: captures the design prototype (file://)
// and the built site (localhost) for visual comparison after each milestone.
//
// Usage:
//   pnpm build && pnpm start &           # or: pnpm dev
//   node scripts/shots.mjs [outDir] [pageName ...]
//
// Requires: pnpm add -D playwright && pnpm exec playwright install chromium

import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import path from 'node:path'

const DESIGN_DIR = path.resolve(process.cwd(), 'design_handoff_kt_website/design')
const BASE = process.env.SHOTS_BASE_URL ?? 'http://localhost:3000'

const PAGES = [
  { name: 'home', prototype: 'KT Home.html', route: '/' },
  { name: 'contact', prototype: 'Contact.html', route: '/contact' },
  { name: 'home-guide', prototype: 'Blog.html', route: '/home-guide' },
  { name: 'post', prototype: 'Blog Post.html?post=proximity-premium-san-jose', route: '/home-guide/proximity-premium-san-jose' },
  { name: 'selling', prototype: 'Selling.html', route: '/resources/selling' },
  { name: 'buying', prototype: 'Buying.html', route: '/resources/buying' },
  { name: 'cost-of-selling', prototype: 'Cost of Selling.html', route: '/resources/cost-of-selling' },
  { name: 'intero-concierge', prototype: 'Intero Concierge.html', route: '/resources/intero-concierge' },
  { name: 'schools', prototype: 'Schools in Alameda and Contra Costa.html', route: '/resources/schools' },
  { name: 'market-updates', prototype: 'Market Updates.html', route: '/resources/market-updates' },
  { name: 'buyers-guide', prototype: 'Buyers Guide.html', route: '/resources/buyers-guide' },
  { name: 'alameda', prototype: 'Alameda County Neighborhoods.html', route: '/neighborhoods/alameda-county' },
  { name: 'contra-costa', prototype: 'Contra Costa County Neighborhoods.html', route: '/neighborhoods/contra-costa-county' },
]

const VIEWPORTS = [
  { tag: 'desktop', width: 1440, height: 900 },
  { tag: 'mobile', width: 390, height: 844 },
]

const [, , outDirArg, ...names] = process.argv
const outDir = path.resolve(process.cwd(), outDirArg ?? 'shots/latest')
const selected = names.length ? PAGES.filter((p) => names.includes(p.name)) : PAGES

const browser = await chromium.launch()
try {
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
    const page = await ctx.newPage()
    mkdirSync(outDir, { recursive: true })
    for (const p of selected) {
      const targets = [
        { kind: 'prototype', url: `file://${path.join(DESIGN_DIR, p.prototype)}` },
        { kind: 'built', url: `${BASE}${p.route}` },
      ]
      for (const t of targets) {
        try {
          await page.goto(t.url, { waitUntil: 'networkidle', timeout: 30000 })
          await page.waitForTimeout(800) // fonts + prototype babel settle
          const file = path.join(outDir, `${p.name}--${t.kind}--${vp.tag}.png`)
          await page.screenshot({ path: file, fullPage: true })
          console.log(`✓ ${p.name} ${t.kind} ${vp.tag}`)
        } catch (err) {
          console.error(`✗ ${p.name} ${t.kind} ${vp.tag}: ${err.message}`)
        }
      }
    }
    await ctx.close()
  }
} finally {
  await browser.close()
}
