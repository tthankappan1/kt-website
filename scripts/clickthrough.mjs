import { chromium } from 'playwright'
const BASE = 'http://localhost:3000'
const PAGES = [
  '/', '/contact', '/newsletter',
  '/newsletter/proximity-premium-san-jose', '/newsletter/two-markets-twenty-minutes',
  '/resources/selling', '/resources/buying', '/resources/cost-of-selling',
  '/resources/intero-concierge', '/resources/schools', '/resources/market-updates',
  '/resources/buyers-guide',
  '/neighborhoods/alameda-county', '/neighborhoods/contra-costa-county',
  '/privacy',
]
const ASSETS = ['/icon', '/apple-icon', '/opengraph-image', '/sitemap.xml', '/robots.txt',
  '/newsletter/proximity-premium-san-jose/opengraph-image']
const browser = await chromium.launch()
let fail = 0
for (const vp of [{tag:'desktop',width:1440,height:900},{tag:'mobile',width:390,height:844}]) {
  const ctx = await browser.newContext({ viewport: vp })
  const page = await ctx.newPage()
  for (const p of PAGES) {
    const res = await page.goto(BASE + p, { waitUntil: 'load', timeout: 20000 }).catch(e => ({ status: () => 'ERR:'+e.message.split('\n')[0] }))
    const status = res.status()
    const h1 = await page.locator('h1').first().textContent().catch(() => null)
    const ok = status === 200 && h1 && h1.trim().length > 0
    if (!ok) { fail++; console.log(`✗ [${vp.tag}] ${p} status=${status} h1=${JSON.stringify(h1)}`) }
    else if (vp.tag==='desktop') console.log(`✓ ${p} — h1: ${h1.trim().slice(0,52)}`)
  }
  await ctx.close()
}
// 404 behavior
const ctx = await browser.newContext(); const page = await ctx.newPage()
const r404 = await page.goto(BASE + '/this-does-not-exist', { waitUntil: 'load' })
const has404 = (await page.locator('h1').first().textContent().catch(()=>'')) || ''
console.log(`404 route: status=${r404.status()} h1="${has404.trim()}"`)
await ctx.close()
// assets
for (const a of ASSETS) {
  const res = await (await browser.newContext()).request.get(BASE + a).catch(()=>null)
  const s = res ? res.status() : 'ERR'
  if (s !== 200) { fail++; console.log(`✗ asset ${a} status=${s}`) }
  else console.log(`✓ asset ${a} (${res.headers()['content-type']})`)
}
await browser.close()
console.log(fail === 0 ? '\nALL ROUTES OK' : `\n${fail} FAILURES`)
process.exit(fail === 0 ? 0 : 1)
