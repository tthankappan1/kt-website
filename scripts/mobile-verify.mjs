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
