// Parser for the content contract (docs/content-contract.md): the minimal
// markdown the content repo emits weekly. Deterministic, zero deps — content
// is data; every presentation decision lives in the site components.

export class IngestError extends Error {}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const IMAGE_RE = /^!\[(.*?)\]\(([^)\s]+)(?:\s+"(.*?)")?\)\s*$/
const SOURCE_LINK_RE = /^-\s+\[(.+?)\]\((\S+?)\)\s*$/

const REQUIRED_META = ['slug', 'title', 'category', 'date', 'excerpt']

function parseFrontmatter(lines) {
  if (lines[0]?.trim() !== '---') throw new IngestError('missing frontmatter: file must open with --- on line 1')
  const meta = {}
  let end = -1
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      end = i
      break
    }
    const line = lines[i].trim()
    if (!line) continue
    const colon = line.indexOf(':')
    if (colon === -1) throw new IngestError(`frontmatter line ${i + 1} is not "key: value": "${line}"`)
    meta[line.slice(0, colon).trim()] = line.slice(colon + 1).trim()
  }
  if (end === -1) throw new IngestError('frontmatter never closes: no second --- found')
  return { meta, bodyStart: end + 1 }
}

function validateMeta(meta, categories) {
  for (const key of REQUIRED_META) {
    if (!meta[key]) throw new IngestError(`frontmatter is missing required field "${key}"`)
  }
  if (!SLUG_RE.test(meta.slug)) throw new IngestError(`slug must be kebab-case (got "${meta.slug}")`)
  if (!DATE_RE.test(meta.date)) throw new IngestError(`date must be YYYY-MM-DD (got "${meta.date}")`)
  if (!categories.includes(meta.category))
    throw new IngestError(`unknown category "${meta.category}" — must be one of: ${categories.join(', ')}`)
}

function validateChart(spec, lineNo) {
  const at = `chart block at line ${lineNo}`
  if (spec.kind !== 'line' && spec.kind !== 'bar' && spec.kind !== 'donut')
    throw new IngestError(`${at}: kind must be "line", "bar", or "donut"`)
  if (typeof spec.title !== 'string' || !spec.title) throw new IngestError(`${at}: title is required`)
  if (spec.kind === 'donut') {
    // Part-to-whole only. Slice order is meaning: the first slice is the story
    // (a two-slice donut renders as a ratio with the first slice's share as the
    // center figure); colors are assigned in that fixed order, never cycled.
    if (!Array.isArray(spec.slices) || spec.slices.length < 2)
      throw new IngestError(`${at}: slices must be an array of at least 2 { "label", "value" } entries`)
    if (spec.slices.length > 5)
      throw new IngestError(`${at}: a donut caps at five slices — fold the tail into an "Other" slice or use a bar chart`)
    for (const s of spec.slices) {
      if (typeof s.label !== 'string' || !s.label || typeof s.value !== 'number')
        throw new IngestError(`${at}: every slice must be { "label": string, "value": number }`)
      if (s.value < 0) throw new IngestError(`${at}: slice "${s.label}" is negative — a donut is part-to-whole, all slices >= 0`)
    }
    if (!spec.slices.some(s => s.value > 0)) throw new IngestError(`${at}: slices sum to zero — nothing to plot`)
  } else if (spec.kind === 'line') {
    if (!Array.isArray(spec.series) || spec.series.length === 0) throw new IngestError(`${at}: series must be a non-empty array`)
    for (const s of spec.series) {
      if (typeof s.label !== 'string' || !s.label) throw new IngestError(`${at}: every series needs a label`)
      if (!Array.isArray(s.points) || s.points.length === 0) throw new IngestError(`${at}: series "${s.label}" needs points`)
      for (const p of s.points) {
        if (typeof p.x !== 'string' || typeof p.y !== 'number')
          throw new IngestError(`${at}: series "${s.label}" points must be { "x": string, "y": number }`)
      }
    }
  } else {
    if (!Array.isArray(spec.bars) || spec.bars.length === 0) throw new IngestError(`${at}: bars must be a non-empty array`)
    for (const b of spec.bars) {
      if (typeof b.label !== 'string' || typeof b.value !== 'number')
        throw new IngestError(`${at}: every bar must be { "label": string, "value": number }`)
    }
  }
}

// Structural line starts that terminate a paragraph.
function isStructural(line) {
  const t = line.trim()
  return !t || /^#{1,6}\s/.test(t) || t.startsWith('```') || t.startsWith('- ') || t.startsWith('>') || IMAGE_RE.test(t) || /^(-{3,}|\*{3,})$/.test(t)
}

export function parsePostMd(md, { categories }) {
  const lines = md.split(/\r?\n/)
  const { meta, bodyStart } = parseFrontmatter(lines)
  validateMeta(meta, categories)

  const body = []
  const assets = []
  let i = bodyStart

  while (i < lines.length) {
    const raw = lines[i]
    const line = raw.trim()
    const lineNo = i + 1

    if (!line) {
      i++
      continue
    }

    // horizontal rule
    if (/^(-{3,}|\*{3,})$/.test(line)) {
      i++
      continue
    }

    // fenced block — only ```chart is part of the contract
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      if (lang !== 'chart') throw new IngestError(`unsupported fence "${lang || '(none)'}" at line ${lineNo} — only \`\`\`chart is allowed`)
      const buf = []
      i++
      while (i < lines.length && lines[i].trim() !== '```') {
        buf.push(lines[i])
        i++
      }
      if (i >= lines.length) throw new IngestError(`chart fence opened at line ${lineNo} never closes`)
      i++ // closing fence
      let spec
      try {
        spec = JSON.parse(buf.join('\n'))
      } catch (err) {
        throw new IngestError(`invalid chart JSON in fence at line ${lineNo}: ${err.message}`)
      }
      validateChart(spec, lineNo)
      body.push({ chart: spec })
      continue
    }

    // headings — section headings only; the post title lives in frontmatter
    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      if (heading[1].length === 1)
        throw new IngestError(`line ${lineNo}: "#" top-level headings are not allowed — the title comes from frontmatter; use ## for sections`)
      body.push({ h: heading[2].trim() })
      i++
      continue
    }

    // image
    const image = line.match(IMAGE_RE)
    if (image) {
      const [, alt, src, caption] = image
      if (!alt.trim()) throw new IngestError(`image at line ${lineNo} needs alt text: ![describe the image](${src})`)
      const isLocal = !src.startsWith('/') && !/^https?:/.test(src)
      const block = { src: isLocal ? `/images/posts/${meta.slug}/${src}` : src, alt: alt.trim() }
      if (caption) block.caption = caption
      if (isLocal) assets.push(src)
      body.push({ image: block })
      i++
      continue
    }

    // sources section: "Sources:" line followed by a list of markdown links
    if (/^Sources:\s*$/.test(line)) {
      i++
      while (i < lines.length && !lines[i].trim()) i++
      const sources = []
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        const m = lines[i].trim().match(SOURCE_LINK_RE)
        if (!m) throw new IngestError(`line ${i + 1}: sources entries must be "- [Title](https://url)" (got "${lines[i].trim()}")`)
        sources.push({ t: m[1], href: m[2] })
        i++
      }
      if (sources.length === 0) throw new IngestError(`Sources: at line ${lineNo} has no link entries`)
      body.push({ sources })
      continue
    }

    // list
    if (line.startsWith('- ')) {
      const items = []
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2).trim())
        i++
      }
      body.push({ list: items })
      continue
    }

    // blockquote → plain paragraph (the schema has no quote block)
    if (line.startsWith('>')) {
      const buf = []
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        buf.push(lines[i].trim().replace(/^>\s?/, ''))
        i++
      }
      const text = buf.join(' ').trim()
      if (text) body.push(text)
      continue
    }

    // paragraph (may wrap across lines); CTA:/Disclaimer: prefixes type it
    const buf = [line]
    i++
    while (i < lines.length && !isStructural(lines[i])) {
      buf.push(lines[i].trim())
      i++
    }
    const text = buf.join(' ').trim()
    if (text.startsWith('CTA:')) body.push({ cta: text.slice(4).trim() })
    else if (text.startsWith('Disclaimer:')) body.push({ disclaimer: text.slice(11).trim() })
    else body.push(text)
  }

  if (body.length === 0) throw new IngestError('post has no body content')

  const post = {
    slug: meta.slug,
    title: meta.title,
    category: meta.category,
    date: meta.date,
    excerpt: meta.excerpt,
    body,
  }
  if (meta.cover === 'true') post.cover = true
  if (meta.draft === 'true') post.draft = true
  return { post, assets }
}
