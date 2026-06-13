// Publishing workflow: add a new post file under src/content/posts/<slug>.ts
// then add one import line here. Sorting and draft-filtering are automatic.
import type { Post } from './types'

import { post as proximityPremiumSanJose } from './proximity-premium-san-jose'
import { post as twoMarketsTwentyMinutes } from './two-markets-twenty-minutes'
import { post as spotlightRubyHill } from './spotlight-ruby-hill'
import { post as whatStagingReturns } from './what-staging-returns'
import { post as rateBuydownsExplained } from './rate-buydowns-explained'
import { post as saturdayDowntownLivermore } from './saturday-downtown-livermore'
import { post as springInventoryEarlySignals } from './spring-inventory-early-signals'
import { post as winterListingsReadTwice } from './winter-listings-read-twice'

export const allPosts: Post[] = [
  proximityPremiumSanJose,
  twoMarketsTwentyMinutes,
  spotlightRubyHill,
  whatStagingReturns,
  rateBuydownsExplained,
  saturdayDowntownLivermore,
  springInventoryEarlySignals,
  winterListingsReadTwice,
].sort((a, b) => b.date.localeCompare(a.date))

// README §8: drafts NEVER appear in production builds.
// showDrafts() is evaluated at call time so test environments can stub process.env.
// NEXT_PUBLIC_SHOW_DRAFTS=true is reserved for non-production preview deploys only;
// it is ignored when NODE_ENV === 'production' so drafts can never ship to production.
export function showDrafts(): boolean {
  if (process.env.NODE_ENV === 'production') return false
  return process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SHOW_DRAFTS === 'true'
}

// Returns published posts computed at call time (respects env stubs in tests).
// Do NOT call getPublishedPosts() at module level — env stubbing wouldn't work.
// Always returns a copy so callers cannot mutate module-level state.
export function getPublishedPosts(): Post[] {
  if (showDrafts()) return [...allPosts]
  return allPosts.filter(p => !p.draft)
}

export function getPost(slug: string): Post | undefined {
  return getPublishedPosts().find(p => p.slug === slug)
}
