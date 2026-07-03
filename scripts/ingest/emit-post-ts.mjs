// Emits src/content/posts/<slug>.ts from a parsed post. All prose is emitted
// as template literals (CLAUDE.md content-ingestion rules): copy-pasted curly
// quotes and apostrophes survive verbatim; backticks and ${ are escaped.

const tpl = s => '`' + String(s).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`'
const sq = s => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

function indent(text, pad) {
  return text
    .split('\n')
    .map((l, idx) => (idx === 0 ? l : pad + l))
    .join('\n')
}

function emitBlock(b) {
  if (typeof b === 'string') return `    ${tpl(b)},`
  if ('h' in b) return `    { h: ${tpl(b.h)} },`
  if ('list' in b) {
    const items = b.list.map(item => `      ${tpl(item)},`).join('\n')
    return `    { list: [\n${items}\n    ] },`
  }
  if ('cta' in b) return `    { cta: ${tpl(b.cta)} },`
  if ('disclaimer' in b) return `    { disclaimer: ${tpl(b.disclaimer)} },`
  if ('sources' in b) {
    const entries = b.sources.map(s => `      { t: ${tpl(s.t)}, href: ${sq(s.href)} },`).join('\n')
    return `    { sources: [\n${entries}\n    ] },`
  }
  if ('chart' in b) return `    { chart: ${indent(JSON.stringify(b.chart, null, 2), '    ')} },`
  if ('image' in b) {
    const img = b.image
    const caption = img.caption ? `, caption: ${tpl(img.caption)}` : ''
    return `    { image: { src: ${sq(img.src)}, alt: ${tpl(img.alt)}${caption} } },`
  }
  throw new Error(`unknown block shape: ${JSON.stringify(b)}`)
}

export function emitPostTs({ post }) {
  const flags = (post.cover ? '  cover: true,\n' : '') + (post.draft ? '  draft: true,\n' : '')
  return `import type { Post } from './types'

export const post: Post = {
  slug: ${sq(post.slug)},
  title: ${tpl(post.title)},
  category: ${sq(post.category)},
  date: ${sq(post.date)},
  excerpt: ${tpl(post.excerpt)},
${flags}  body: [
${post.body.map(emitBlock).join('\n')}
  ],
}
`
}
