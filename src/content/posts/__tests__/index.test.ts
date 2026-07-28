import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('posts index', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  async function load() {
    const mod = await import('../index')
    return mod
  }

  // The 6 placeholder drafts (README §9: replaced before they ever ship).
  // Pinned as a set — NOT as a total count — so the weekly ingest of a new
  // real post passes without edits, while a draft flag flipping (or a draft
  // slug disappearing without replacement copy) still fails loudly.
  const DRAFT_SLUGS = [
    'spotlight-ruby-hill',
    'what-staging-returns',
    'rate-buydowns-explained',
    'saturday-downtown-livermore',
    'spring-inventory-early-signals',
    'winter-listings-read-twice',
  ]

  it('the known draft set is present and flagged draft', async () => {
    const { allPosts } = await load()
    const drafts = allPosts.filter(p => p.draft).map(p => p.slug)
    expect(drafts.sort()).toEqual([...DRAFT_SLUGS].sort())
  })

  it('allPosts is sorted descending by date', async () => {
    const { allPosts } = await load()
    for (let i = 1; i < allPosts.length; i++) {
      expect(allPosts[i - 1].date >= allPosts[i].date).toBe(true)
    }
  })

  it('allPosts slugs are unique', async () => {
    const { allPosts } = await load()
    const slugs = allPosts.map(p => p.slug)
    expect(new Set(slugs).size).toBe(allPosts.length)
  })

  it('every category is in KT_BLOG_CATS', async () => {
    const { allPosts } = await load()
    const { KT_BLOG_CATS } = await import('../types')
    for (const post of allPosts) {
      expect(KT_BLOG_CATS as readonly string[]).toContain(post.category)
    }
  })

  it('every date matches ISO format YYYY-MM-DD', async () => {
    const { allPosts } = await load()
    for (const post of allPosts) {
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('production mode returns every real post and no draft', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('SHOW_DRAFTS', '')
    const { allPosts, getPublishedPosts } = await load()
    const published = getPublishedPosts()
    const slugs = published.map(p => p.slug)
    // no draft ever ships, by flag and by pinned slug
    expect(published.every(p => !p.draft)).toBe(true)
    for (const draft of DRAFT_SLUGS) expect(slugs).not.toContain(draft)
    // published + drafts partition the full set
    expect(published).toHaveLength(allPosts.length - DRAFT_SLUGS.length)
    // known real posts are present, newest first (sorting covered above)
    expect(slugs).toContain('down-payment-surprise')
    expect(slugs).toContain('national-headlines-tri-valley-summer')
    expect(slugs).toContain('proximity-premium-san-jose')
    expect(slugs).toContain('two-markets-twenty-minutes')
    expect(slugs).toContain('lender-number-isnt-your-loan-balance')
    expect(slugs).toContain('love-your-neighborhood-outgrowing-your-home')
    expect(slugs[0]).toBe('west-dublin-eight-days-dublin-ranch-29')
  })

  it('SHOW_DRAFTS=true (non-production) returns all posts', async () => {
    vi.stubEnv('NODE_ENV', 'test')
    vi.stubEnv('SHOW_DRAFTS', 'true')
    const { allPosts, getPublishedPosts } = await load()
    expect(getPublishedPosts()).toHaveLength(allPosts.length)
  })

  it('SHOW_DRAFTS=true is ignored when NODE_ENV=production — only real posts returned', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('SHOW_DRAFTS', 'true')
    const { getPublishedPosts } = await load()
    const published = getPublishedPosts()
    const slugs = published.map(p => p.slug)
    expect(slugs).toContain('proximity-premium-san-jose')
    expect(slugs).toContain('two-markets-twenty-minutes')
    // every returned post must not be a draft
    expect(published.every(p => !p.draft)).toBe(true)
  })

  it('real posts have byte-exact titles', async () => {
    const { allPosts } = await load()
    const proximity = allPosts.find(p => p.slug === 'proximity-premium-san-jose')
    const twoMarkets = allPosts.find(p => p.slug === 'two-markets-twenty-minutes')
    expect(proximity?.title).toBe('The Proximity Premium: How the AI Boom Is *Quietly* Redrawing San Jose’s Map')
    expect(twoMarkets?.title).toBe('The 20-Minute Drive That Crosses *Two* Housing Markets')
  })

  it('proximity post body structure: 5 h-blocks, 1 cta, 1 disclaimer, 1 sources with 4 entries', async () => {
    const { allPosts } = await load()
    const post = allPosts.find(p => p.slug === 'proximity-premium-san-jose')!
    expect(post).toBeDefined()

    const hBlocks = post.body.filter(b => typeof b === 'object' && 'h' in b)
    const ctaBlocks = post.body.filter(b => typeof b === 'object' && 'cta' in b)
    const disclaimerBlocks = post.body.filter(b => typeof b === 'object' && 'disclaimer' in b)
    const sourcesBlocks = post.body.filter(b => typeof b === 'object' && 'sources' in b)

    expect(hBlocks).toHaveLength(5)
    expect(ctaBlocks).toHaveLength(1)
    expect(disclaimerBlocks).toHaveLength(1)
    expect(sourcesBlocks).toHaveLength(1)
    const sb = sourcesBlocks[0] as { sources: { t: string; href: string }[] }
    expect(sb.sources).toHaveLength(4)
  })

  it('getPublishedPosts() returns a copy — mutating the result does not affect subsequent calls', async () => {
    vi.stubEnv('NODE_ENV', 'test')
    vi.stubEnv('SHOW_DRAFTS', 'true')
    const { getPublishedPosts } = await load()
    const first = getPublishedPosts()
    first.pop()
    const second = getPublishedPosts()
    expect(second.length).toBeGreaterThan(first.length)
  })

  it('getPost returns undefined for unknown slug in production', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('SHOW_DRAFTS', '')
    const { getPost } = await load()
    expect(getPost('does-not-exist')).toBeUndefined()
  })

  it('getPost returns draft post only when drafts shown', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('SHOW_DRAFTS', '')
    const { getPost: getProdPost } = await load()
    expect(getProdPost('spotlight-ruby-hill')).toBeUndefined()

    vi.resetModules()
    vi.stubEnv('NODE_ENV', 'test')
    vi.stubEnv('SHOW_DRAFTS', 'true')
    const { getPost: getDevPost } = await load()
    expect(getDevPost('spotlight-ruby-hill')).toBeDefined()
  })
})
