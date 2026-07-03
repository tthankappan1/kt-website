// Registers a new post in src/content/posts/index.ts: one import line after
// the existing post imports, one entry at the end of the allPosts array
// (sorting is by date at runtime, so append order doesn't matter).
import { IngestError } from './parse-post-md.mjs'

function camelIdent(slug) {
  return slug
    .split('-')
    .map((part, idx) => (idx === 0 ? part : part[0].toUpperCase() + part.slice(1)))
    .join('')
}

export function registerPost(indexSource, slug) {
  if (indexSource.includes(`'./${slug}'`)) throw new IngestError(`post "${slug}" is already registered in index.ts`)
  const ident = camelIdent(slug)

  const importRe = /import \{ post as \w+ \} from '\.\/[^']+'/g
  let lastImport = null
  for (const m of indexSource.matchAll(importRe)) lastImport = m
  if (!lastImport) throw new IngestError('could not find post import lines in index.ts')

  const insertAt = lastImport.index + lastImport[0].length
  let out = indexSource.slice(0, insertAt) + `\nimport { post as ${ident} } from './${slug}'` + indexSource.slice(insertAt)

  const arrayEnd = '\n].sort'
  if (!out.includes(arrayEnd)) throw new IngestError('could not find the allPosts array in index.ts')
  out = out.replace(arrayEnd, `\n  ${ident},${arrayEnd}`)
  return out
}
