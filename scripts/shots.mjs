// Side-by-side screenshot harness: captures the design prototype (file://)
// and the built site (localhost) for visual comparison after each milestone.
//
// Usage:
//   pnpm build && pnpm start &           # or: pnpm dev
//   node scripts/shots.mjs [outDir] [pageName ...]
//
// Requires: pnpm add -D playwright && pnpm exec playwright install chromium

import { chromium } from 'playwright'
import { createReadStream, mkdirSync, existsSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'

const DESIGN_DIR = path.resolve(process.cwd(), 'design_handoff_kt_website/design')
const BASE = process.env.SHOTS_BASE_URL ?? 'http://localhost:3000'
const PROTO_PORT = 8123

// The prototype's in-browser Babel XHRs its .jsx files — blocked from file://
// origins, so serve the design dir over a throwaway local HTTP server.
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jsx': 'text/javascript', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' }
const protoServer = createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  const file = path.join(DESIGN_DIR, urlPath)
  if (!file.startsWith(DESIGN_DIR) || !existsSync(file)) {
    res.writeHead(404)
    return res.end()
  }
  res.writeHead(200, { 'content-type': MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream' })
  createReadStream(file).pipe(res)
})
await new Promise((resolve) => protoServer.listen(PROTO_PORT, '127.0.0.1', resolve))

const PAGES = [
  { name: 'home', prototype: 'KT Home.html', route: '/' },
  { name: 'contact', prototype: 'Contact.html', route: '/contact' },
  { name: 'newsletter', prototype: 'Blog.html', route: '/newsletter' },
  { name: 'post', prototype: 'Blog Post.html?post=proximity-premium-san-jose', route: '/newsletter/proximity-premium-san-jose' },
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
const unknown = names.filter((n) => !PAGES.some((p) => p.name === n))
if (unknown.length) {
  console.error(`Unknown page name(s): ${unknown.join(', ')}\nValid: ${PAGES.map((p) => p.name).join(', ')}`)
  process.exit(1)
}
const selected = names.length ? PAGES.filter((p) => names.includes(p.name)) : PAGES
console.log(`Capturing ${selected.length} page(s) → ${outDir}`)

const browser = await chromium.launch()
try {
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
    const page = await ctx.newPage()
    mkdirSync(outDir, { recursive: true })
    for (const p of selected) {
      const targets = [
        { kind: 'prototype', url: `http://127.0.0.1:${PROTO_PORT}/${encodeURI(p.prototype)}` },
        { kind: 'built', url: `${BASE}${p.route}` },
      ]
      for (const t of targets) {
        try {
          // 'networkidle' never settles on some pages; 'load' + explicit readiness is reliable.
          await page.goto(t.url, { waitUntil: 'load', timeout: 30000 })
          if (t.kind === 'prototype') {
            // CDN React + in-browser Babel: wait until the app actually rendered.
            await page.waitForSelector('#root > div', { timeout: 45000 })
            await page.waitForTimeout(1500) // fonts + image slots settle
          } else {
            await page.waitForTimeout(1000)
          }
          const file = path.join(outDir, `${p.name}--${t.kind}--${vp.tag}.png`)
          await page.screenshot({ path: file, fullPage: true })
          console.log(`✓ ${p.name} ${t.kind} ${vp.tag}`)
        } catch (err) {
          console.error(`✗ ${p.name} ${t.kind} ${vp.tag}: ${err.message.split('\n')[0]}`)
        }
      }
    }
    await ctx.close()
  }
} finally {
  await browser.close()
  protoServer.close()
}
