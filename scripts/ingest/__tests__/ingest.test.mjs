import fs from 'node:fs'
import { describe, expect, test } from 'vitest'
import { parsePostMd } from '../parse-post-md.mjs'
import { emitPostTs } from '../emit-post-ts.mjs'
import { registerPost } from '../register-post.mjs'

const CATS = ['Market Update', 'Neighborhoods', 'Buying', 'Selling', 'Lifestyle']

const fm = (over = {}) => {
  const meta = {
    slug: 'test-post',
    title: 'A Test Post',
    category: 'Market Update',
    date: '2026-07-02',
    excerpt: 'An excerpt.',
    ...over,
  }
  return `---\n${Object.entries(meta)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')}\n---\n`
}

const parse = (md, opts = {}) => parsePostMd(md, { categories: CATS, ...opts })

describe('parsePostMd — frontmatter', () => {
  test('reads required fields', () => {
    const { post } = parse(fm() + '\nHello.\n')
    expect(post.slug).toBe('test-post')
    expect(post.title).toBe('A Test Post')
    expect(post.category).toBe('Market Update')
    expect(post.date).toBe('2026-07-02')
    expect(post.excerpt).toBe('An excerpt.')
  })

  test('rejects a missing required field', () => {
    expect(() => parse('---\nslug: x\n---\nBody.\n')).toThrow(/title/)
  })

  test('rejects an unknown category', () => {
    expect(() => parse(fm({ category: 'Gossip' }) + '\nBody.\n')).toThrow(/category/i)
  })

  test('rejects a malformed date', () => {
    expect(() => parse(fm({ date: 'July 2nd' }) + '\nBody.\n')).toThrow(/date/i)
  })

  test('rejects a slug that is not kebab-case', () => {
    expect(() => parse(fm({ slug: 'Not A Slug' }) + '\nBody.\n')).toThrow(/slug/i)
  })
})

describe('parsePostMd — body blocks', () => {
  test('paragraphs join wrapped lines and keep inline markdown', () => {
    const { post } = parse(fm() + '\nFirst line\nwraps here with **bold** and *italic*.\n\nSecond para.\n')
    expect(post.body[0]).toBe('First line wraps here with **bold** and *italic*.')
    expect(post.body[1]).toBe('Second para.')
  })

  test('## and ### headings become h blocks', () => {
    const { post } = parse(fm() + '\n## Two\n\nPara.\n\n### Three\n')
    expect(post.body[0]).toEqual({ h: 'Two' })
    expect(post.body[2]).toEqual({ h: 'Three' })
  })

  test('dash lists become list blocks', () => {
    const { post } = parse(fm() + '\n- **First.** thing\n- second thing\n')
    expect(post.body[0]).toEqual({ list: ['**First.** thing', 'second thing'] })
  })

  test('horizontal rules are skipped', () => {
    const { post } = parse(fm() + '\nPara one.\n\n---\n\nPara two.\n')
    expect(post.body).toEqual(['Para one.', 'Para two.'])
  })

  test('blockquotes flow through as paragraphs', () => {
    const { post } = parse(fm() + '\n> "A quoted line,"\n> she said.\n')
    expect(post.body[0]).toBe('"A quoted line," she said.')
  })

  test('CTA: and Disclaimer: prefixes become typed blocks', () => {
    const { post } = parse(fm() + '\nCTA: Call or text me.\n\nDisclaimer: I am not a financial advisor.\n')
    expect(post.body[0]).toEqual({ cta: 'Call or text me.' })
    expect(post.body[1]).toEqual({ disclaimer: 'I am not a financial advisor.' })
  })

  test('Sources: section of markdown links becomes a sources block', () => {
    const md = fm() + '\nSources:\n\n- [Realtor.com](https://realtor.com/research)\n- [Urban Institute](https://urban.org)\n'
    const { post } = parse(md)
    expect(post.body[0]).toEqual({
      sources: [
        { t: 'Realtor.com', href: 'https://realtor.com/research' },
        { t: 'Urban Institute', href: 'https://urban.org' },
      ],
    })
  })

  test('a text-only post degrades to plain blocks (no chart/image)', () => {
    const { post, assets } = parse(fm() + '\nJust words.\n\n## And a heading\n\nMore words.\n')
    expect(post.body).toEqual(['Just words.', { h: 'And a heading' }, 'More words.'])
    expect(assets).toEqual([])
  })
})

describe('parsePostMd — chart blocks', () => {
  const chartFence = (json) => '\n```chart\n' + json + '\n```\n'

  test('a line chart fence becomes a chart block', () => {
    const md =
      fm() +
      chartFence(
        JSON.stringify({
          kind: 'line',
          title: 'Trend',
          source: 'Realtor.com',
          note: 'Falling.',
          series: [{ label: 'Median', unit: '$', points: [{ x: '2013', y: 7500 }, { x: '2014', y: 10000 }] }],
        }),
      )
    const { post } = parse(md)
    expect(post.body[0]).toMatchObject({ chart: { kind: 'line', title: 'Trend', source: 'Realtor.com' } })
    expect(post.body[0].chart.series[0].points).toHaveLength(2)
  })

  test('a bar chart fence becomes a chart block', () => {
    const md = fm() + chartFence(JSON.stringify({ kind: 'bar', title: 'Gap', unit: '%', bars: [{ label: 'Qualify', value: 44 }] }))
    const { post } = parse(md)
    expect(post.body[0]).toMatchObject({ chart: { kind: 'bar', title: 'Gap' } })
  })

  test('a donut chart fence becomes a chart block', () => {
    const md =
      fm() +
      chartFence(
        JSON.stringify({
          kind: 'donut',
          title: 'Share',
          source: 'NAR',
          unit: '%',
          slices: [
            { label: 'With student debt', value: 33 },
            { label: 'Without student debt', value: 67 },
          ],
        }),
      )
    const { post } = parse(md)
    expect(post.body[0]).toMatchObject({ chart: { kind: 'donut', title: 'Share' } })
    expect(post.body[0].chart.slices).toHaveLength(2)
  })

  test('rejects a donut missing its slices', () => {
    expect(() => parse(fm() + chartFence('{"kind":"donut","title":"T"}'))).toThrow(/slices/)
  })

  test('rejects a donut with more than five slices', () => {
    const slices = Array.from({ length: 6 }, (_, i) => ({ label: `S${i}`, value: 10 }))
    expect(() => parse(fm() + chartFence(JSON.stringify({ kind: 'donut', title: 'T', slices })))).toThrow(/five/i)
  })

  test('rejects a donut slice with a negative or non-numeric value', () => {
    expect(() =>
      parse(fm() + chartFence(JSON.stringify({ kind: 'donut', title: 'T', slices: [{ label: 'A', value: '33' }] }))),
    ).toThrow(/slice/i)
    expect(() =>
      parse(fm() + chartFence(JSON.stringify({ kind: 'donut', title: 'T', slices: [{ label: 'A', value: -5 }, { label: 'B', value: 10 }] }))),
    ).toThrow(/negative/i)
  })

  test('rejects a donut whose slices sum to zero', () => {
    expect(() =>
      parse(fm() + chartFence(JSON.stringify({ kind: 'donut', title: 'T', slices: [{ label: 'A', value: 0 }, { label: 'B', value: 0 }] }))),
    ).toThrow(/zero/i)
  })

  test('rejects invalid chart JSON with the line number', () => {
    expect(() => parse(fm() + '\n```chart\n{ kind: line }\n```\n')).toThrow(/chart.*line 9/is)
  })

  test('rejects a chart missing its data', () => {
    expect(() => parse(fm() + '\n```chart\n{"kind":"line","title":"T"}\n```\n')).toThrow(/series/)
  })

  test('rejects an unknown fence language', () => {
    expect(() => parse(fm() + '\n```python\nprint(1)\n```\n')).toThrow(/fence/i)
  })
})

describe('parsePostMd — image blocks', () => {
  test('an image becomes an image block with slug-scoped public src and is listed as an asset', () => {
    const { post, assets } = parse(fm() + '\n![Downtown Livermore](photo-1.jpg "Evening on First Street")\n')
    expect(post.body[0]).toEqual({
      image: { src: '/images/posts/test-post/photo-1.jpg', alt: 'Downtown Livermore', caption: 'Evening on First Street' },
    })
    expect(assets).toEqual(['photo-1.jpg'])
  })

  test('caption is optional and alt is required', () => {
    const { post } = parse(fm() + '\n![Alt only](fig.svg)\n')
    expect(post.body[0]).toEqual({ image: { src: '/images/posts/test-post/fig.svg', alt: 'Alt only' } })
    expect(() => parse(fm() + '\n![](fig.svg)\n')).toThrow(/alt/i)
  })
})

describe('emitPostTs', () => {
  test('emits body strings as template literals, escaping backticks and ${', () => {
    const src = emitPostTs({
      post: {
        slug: 'test-post',
        title: 'It’s `tricky` with ${money}',
        category: 'Market Update',
        date: '2026-07-02',
        excerpt: 'An excerpt.',
        body: ['A para with `ticks` and ${x}.'],
      },
    })
    expect(src).toContain('title: `It’s \\`tricky\\` with \\${money}`')
    expect(src).toContain('`A para with \\`ticks\\` and \\${x}.`')
    expect(src).toContain("import type { Post } from './types'")
    expect(src).toContain('export const post: Post = {')
  })

  test('emitted chart and image blocks are object literals', () => {
    const src = emitPostTs({
      post: {
        slug: 't',
        title: 'T',
        category: 'Buying',
        date: '2026-01-01',
        excerpt: 'E.',
        body: [
          { chart: { kind: 'bar', title: 'Gap', unit: '%', bars: [{ label: 'Qualify', value: 44 }] } },
          { image: { src: '/images/posts/t/a.jpg', alt: 'A' } },
        ],
      },
    })
    expect(src).toContain('"kind": "bar"')
    expect(src).toContain('image:')
    expect(src).toContain('/images/posts/t/a.jpg')
  })

  test('round-trips through the parser', () => {
    const md = fm() + '\nIt’s a *fine* day.\n\n## Head\n\n- a\n- b\n\nCTA: Call me.\n'
    const parsed = parse(md)
    const src = emitPostTs(parsed)
    expect(src).toContain('It’s a *fine* day.')
    expect(src).toContain('{ h: `Head` }')
    expect(src).toContain('cta:')
  })
})

describe('real issue fixture (July Week 1)', () => {
  test('parses the first real contract issue end to end', () => {
    const md = fs.readFileSync('scripts/ingest/__tests__/fixtures/newsletter-jul-week1.md', 'utf8')
    const { post, assets } = parse(md)
    expect(post.slug).toBe('down-payment-surprise')
    expect(post.category).toBe('Market Update')
    const charts = post.body.filter(b => typeof b === 'object' && 'chart' in b)
    expect(charts).toHaveLength(2)
    expect(charts[0].chart.kind).toBe('line')
    expect(charts[0].chart.series).toHaveLength(2)
    expect(charts[1].chart.kind).toBe('bar')
    expect(post.body.filter(b => typeof b === 'object' && 'h' in b)).toHaveLength(5)
    expect(post.body.filter(b => typeof b === 'object' && 'cta' in b)).toHaveLength(1)
    expect(post.body.filter(b => typeof b === 'object' && 'disclaimer' in b)).toHaveLength(1)
    expect(assets).toEqual([])
    // the emitted TS keeps typographic apostrophes and survives re-emit
    expect(emitPostTs({ post })).toContain('you’re')
  })
})

describe('registerPost', () => {
  const INDEX = `import type { Post } from './types'

import { post as existingPost } from './existing-post'

export const allPosts: Post[] = [
  existingPost,
].sort((a, b) => b.date.localeCompare(a.date))
`

  test('adds the import line and the array entry', () => {
    const out = registerPost(INDEX, 'down-payment-surprise')
    expect(out).toContain("import { post as downPaymentSurprise } from './down-payment-surprise'")
    expect(out).toMatch(/existingPost,\n  downPaymentSurprise,\n\]\.sort/)
  })

  test('throws on a slug that is already registered', () => {
    expect(() => registerPost(INDEX, 'existing-post')).toThrow(/already/i)
  })
})
