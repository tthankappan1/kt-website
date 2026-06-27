import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'
import { chromium } from 'playwright'
import fs from 'node:fs'

const SYS = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const chromePath = fs.existsSync(SYS) ? SYS : chromium.executablePath()
const URLS = [['/', 'home'], ['/newsletter', 'newsletter'], ['/newsletter/proximity-premium-san-jose', 'post']]
const chrome = await chromeLauncher.launch({
  chromePath,
  chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu', '--no-first-run'],
})
const opts = { port: chrome.port, output: 'json', logLevel: 'error',
  onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] }
const rows = []
for (const [path, name] of URLS) {
  let r
  for (let attempt = 0; attempt < 2; attempt++) {
    r = await lighthouse('http://localhost:3000' + path, opts)
    if (!r.lhr.runtimeError) break
  }
  if (r.lhr.runtimeError) { rows.push({ name, path, err: r.lhr.runtimeError.code }); continue }
  const c = r.lhr.categories
  rows.push({ name, path,
    perf: Math.round(c.performance.score*100), a11y: Math.round(c.accessibility.score*100),
    bp: Math.round(c['best-practices'].score*100), seo: Math.round(c.seo.score*100) })
}
await chrome.kill()
console.log('chromePath:', chromePath)
console.log('\n| Page | Perf | A11y | Best-Practices | SEO |')
console.log('|---|---|---|---|---|')
for (const r of rows) console.log(r.err ? `| ${r.name} | ERROR ${r.err} | | | |` : `| ${r.name} | ${r.perf} | ${r.a11y} | ${r.bp} | ${r.seo} |`)
