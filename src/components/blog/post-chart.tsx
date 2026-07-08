import type { ChartSeries, ChartSpec } from '@/content/posts/types'

// Charts render on the light ivory reader surface only (posts have no dark
// variant), so the palette is fixed: gold-deep marks, charcoal text tokens.
// Validated (dataviz six-checks): gold-deep↔charcoal CVD ΔE 33.7, contrast
// vs ivory ≥ 3:1. Never a dual axis — series with different units split into
// small-multiple panels sharing one figure.
const ACCENT = '#7E6A4F'
const INK = '#262623'
const SURFACE = '#F3F0EB'
const GRID = 'rgba(38,38,35,0.08)'
const AXIS = 'rgba(38,38,35,0.28)'
const MUTED = 'rgba(38,38,35,0.55)'
const SERIES_COLORS = [ACCENT, INK]
// Donut slice palettes (dataviz six-checks, all-pairs on ivory): the 5-slot
// categorical order holds worst-pair CVD ΔE 12.9 (≥ 12 target); the lighter
// steps sit under 3:1 contrast, which is legal only with relief — provided
// here by the value-bearing legend, the 2px surface gaps, and the table twin.
// A two-slice donut is a ratio, not two categories: first slice = the story
// in gold-deep, remainder = a lighter step of the same ramp (the meter-track
// pattern), with the first slice's share as the center figure.
const DONUT_COLORS = [ACCENT, INK, '#A9987B', '#57503F', '#C7BCA4']
const DONUT_TRACK = '#D5CBBA'

function fmtValue(v: number, unit?: string): string {
  const n = v.toLocaleString('en-US', { maximumFractionDigits: 1 })
  if (unit === '$') return `$${n}`
  if (unit === '%') return `${n}%`
  return unit ? `${n} ${unit}` : n
}

function fmtTick(v: number, unit?: string): string {
  if (unit === '$') return v >= 1000 ? `$${v / 1000}K` : `$${v}`
  if (unit === '%') return `${v}%`
  return v.toLocaleString('en-US')
}

// Clean tick interval (1/2/5 × 10^k) giving at most 5 intervals from zero.
function niceScale(maxValue: number): { step: number; max: number } {
  for (let pow = 1; pow <= 1e12; pow *= 10) {
    for (const m of [1, 2, 5]) {
      const step = m * pow
      const n = Math.ceil(maxValue / step)
      if (n <= 5) return { step, max: Math.max(n, 1) * step }
    }
  }
  return { step: maxValue || 1, max: maxValue || 1 }
}

// Horizontal bar with the brand data-end: 4px rounded at the value end,
// square at the baseline.
function barPath(x: number, y: number, w: number, h: number): string {
  const r = Math.min(4, w / 2)
  return `M ${x},${y} H ${x + w - r} A ${r},${r} 0 0 1 ${x + w},${y + r} V ${y + h - r} A ${r},${r} 0 0 1 ${x + w - r},${y + h} H ${x} Z`
}

function LinePanel({ series, subtitle }: { series: ChartSeries[]; subtitle?: string }) {
  const W = 640
  const H = 300
  const M = { top: 16, right: 92, bottom: 34, left: 60 }
  const pw = W - M.left - M.right
  const ph = H - M.top - M.bottom
  const unit = series[0]?.unit
  const { step, max } = niceScale(Math.max(...series.flatMap(s => s.points.map(p => p.y))))
  const len = Math.max(...series.map(s => s.points.length))
  const xAt = (i: number) => M.left + (len <= 1 ? pw / 2 : (i / (len - 1)) * pw)
  const yAt = (v: number) => M.top + ph - (v / max) * ph
  const ticks: number[] = []
  for (let t = 0; t <= max; t += step) ticks.push(t)
  // Label every k-th x category; endpoint values are direct-labeled instead.
  const xEvery = Math.ceil(len / 5)
  const label = series.map(s => `${s.label}: ${fmtValue(s.points[s.points.length - 1]?.y ?? 0, unit)} latest`).join('; ')
  return (
    <div className="kt-fig-panel">
      {subtitle ? <div className="fig-sub">{subtitle}</div> : null}
      {series.length > 1 ? (
        <div className="fig-legend">
          {series.map((s, si) => (
            <span key={si}>
              <i style={{ background: SERIES_COLORS[si % SERIES_COLORS.length] }} aria-hidden="true" />
              {s.label}
            </span>
          ))}
        </div>
      ) : null}
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
        {ticks.map(t => (
          <g key={t}>
            <line x1={M.left} y1={yAt(t)} x2={W - M.right} y2={yAt(t)} stroke={t === 0 ? AXIS : GRID} strokeWidth="1" />
            <text x={M.left - 10} y={yAt(t) + 4} textAnchor="end" fontSize="13" fill={MUTED}>
              {fmtTick(t, unit)}
            </text>
          </g>
        ))}
        {series[0]?.points.map((p, i) =>
          i % xEvery === 0 ? (
            <text key={i} x={xAt(i)} y={H - 10} textAnchor="middle" fontSize="13" fill={MUTED}>
              {p.x}
            </text>
          ) : null,
        )}
        {series.map((s, si) => {
          const color = SERIES_COLORS[si % SERIES_COLORS.length]
          const pts = s.points.map((p, i) => `${xAt(i)},${yAt(p.y)}`).join(' ')
          const last = s.points[s.points.length - 1]
          const lastX = xAt(s.points.length - 1)
          const lastY = yAt(last?.y ?? 0)
          return (
            <g key={si}>
              {series.length === 1 ? (
                <path
                  d={`M ${s.points.map((p, i) => `${xAt(i)},${yAt(p.y)}`).join(' L ')} L ${lastX},${yAt(0)} L ${xAt(0)},${yAt(0)} Z`}
                  fill={color}
                  opacity="0.1"
                />
              ) : null}
              <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              {last ? (
                <g>
                  <circle cx={lastX} cy={lastY} r="4.5" fill={color} stroke={SURFACE} strokeWidth="2">
                    <title>{`${s.label}, ${last.x}: ${fmtValue(last.y, unit)}`}</title>
                  </circle>
                  <text x={lastX + 10} y={lastY + 5} fontSize="15" fontWeight="600" fill={INK}>
                    {fmtValue(last.y, unit)}
                  </text>
                </g>
              ) : null}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function BarPlot({ bars, unit }: { bars: { label: string; value: number }[]; unit?: string }) {
  const W = 640
  const rowH = 62
  const M = { top: 6, bottom: 6, left: 2, right: 96 }
  const H = M.top + bars.length * rowH + M.bottom
  const pw = W - M.left - M.right
  const { max } = niceScale(Math.max(...bars.map(b => b.value)))
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={bars.map(b => `${b.label}: ${fmtValue(b.value, unit)}`).join('; ')}>
      {bars.map((b, i) => {
        const y = M.top + i * rowH
        const w = (b.value / max) * pw
        return (
          <g key={i}>
            <text x={M.left} y={y + 16} fontSize="14" fill={INK} opacity="0.78">
              {b.label}
            </text>
            <path d={barPath(M.left, y + 26, w, 22)} fill={ACCENT}>
              <title>{`${b.label}: ${fmtValue(b.value, unit)}`}</title>
            </path>
            <text x={M.left + w + 10} y={y + 42} fontSize="15" fontWeight="600" fill={INK}>
              {fmtValue(b.value, unit)}
            </text>
          </g>
        )
      })}
      <line x1={M.left + 0.5} y1={M.top + 20} x2={M.left + 0.5} y2={H - M.bottom} stroke={AXIS} strokeWidth="1" />
    </svg>
  )
}

// Donut ring segment from angle a0 to a1 (radians, clockwise from 12 o'clock).
function slicePath(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number): string {
  // A lone 100% slice would collapse (arc start == arc end) — hold a hairline
  // short of full circle; the surface-gap stroke hides the seam.
  const sweep = Math.min(a1 - a0, Math.PI * 2 - 0.001)
  const end = a0 + sweep
  const large = sweep > Math.PI ? 1 : 0
  const px = (r: number, a: number) => `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`
  return `M ${px(r1, a0)} A ${r1},${r1} 0 ${large} 1 ${px(r1, end)} L ${px(r0, end)} A ${r0},${r0} 0 ${large} 0 ${px(r0, a0)} Z`
}

// Character-budget wrap for legend labels (Inter at 14px runs ~7px/char, and
// the legend column is ~285px wide). Good enough: the visual pass, not text
// metrics, is the check.
function wrapLabel(text: string, first: number, rest: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  let budget = first
  for (const w of words) {
    if (line && line.length + 1 + w.length > budget) {
      lines.push(line)
      line = w
      budget = rest
    } else {
      line = line ? `${line} ${w}` : w
    }
  }
  if (line) lines.push(line)
  return lines
}

function DonutPlot({ slices, unit }: { slices: { label: string; value: number }[]; unit?: string }) {
  const W = 640
  const total = slices.reduce((t, s) => t + s.value, 0)
  const ratio = slices.length === 2
  const colors = ratio ? [ACCENT, DONUT_TRACK] : DONUT_COLORS
  const share = (v: number) => `${Math.round((v / total) * 100)}%`

  // Legend rows: value + label (wrapped), one swatch each — never color alone.
  const rows = slices.map(s => {
    const value = fmtValue(s.value, unit)
    const detail = unit === '%' ? value : `${value} · ${share(s.value)}`
    return { detail, lines: wrapLabel(s.label, 36 - detail.length, 38) }
  })
  const rowHeights = rows.map(r => 16 + (r.lines.length - 1) * 18 + 16)
  const legendH = rowHeights.reduce((a, b) => a + b, 0)
  const H = Math.max(252, legendH + 20)
  const cx = 148
  const cy = H / 2
  const R = 104
  const ring = 30

  let angle = -Math.PI / 2
  const arcs = slices.map((s, i) => {
    const a0 = angle
    angle += total ? (s.value / total) * Math.PI * 2 : 0
    return { ...s, a0, a1: angle, color: colors[i % colors.length] }
  })

  const legendX = 330
  let rowY = (H - legendH) / 2
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={slices.map(s => `${s.label}: ${fmtValue(s.value, unit)}`).join('; ')}>
      {arcs.map((a, i) =>
        a.value > 0 ? (
          <path key={i} className="donut-slice" d={slicePath(cx, cy, R - ring, R, a.a0, a.a1)} fill={a.color} stroke={SURFACE} strokeWidth="2">
            <title>{`${a.label}: ${fmtValue(a.value, unit)}${unit === '%' ? '' : ` (${share(a.value)})`}`}</title>
          </path>
        ) : null,
      )}
      {ratio ? (
        <text className="donut-hero" x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize="40" fontWeight="600" fill={INK}>
          {share(slices[0].value)}
        </text>
      ) : null}
      {rows.map((r, i) => {
        const y = rowY + 16
        rowY += rowHeights[i]
        return (
          <g key={i}>
            {/* swatch wears the slice color; text stays in ink — top-left-only radius is the brand mark */}
            <path d={`M ${legendX + 4},${y - 11} A 4,4 0 0 1 ${legendX + 8},${y - 15} H ${legendX + 14} V ${y - 1} H ${legendX} V ${y - 11} Z`} fill={arcs[i].color} />
            <text x={legendX + 24} y={y}>
              <tspan fontSize="15" fontWeight="600" fill={INK}>
                {r.detail}
              </tspan>
              <tspan dx="8" fontSize="14" fill={INK} opacity="0.78">
                {r.lines[0]}
              </tspan>
              {r.lines.slice(1).map((line, li) => (
                <tspan key={li} x={legendX + 24} dy="18" fontSize="14" fill={INK} opacity="0.78">
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// Screen-reader table twin — every plotted value is reachable without the SVG.
// Wrapped in a hidden div, not hidden itself: a table treats width:1px as a
// MINIMUM, so an absolutely-positioned bare table would still widen the page
// (58px of horizontal scroll at 375px viewports).
function DataTable({ chart }: { chart: ChartSpec }) {
  if (chart.kind === 'bar' || chart.kind === 'donut') {
    const rows = chart.kind === 'bar' ? chart.bars : chart.slices
    return (
      <div className="kt-visually-hidden">
        <table>
          <tbody>
            {rows.map((b, i) => (
              <tr key={i}>
                <th scope="row">{b.label}</th>
                <td>{fmtValue(b.value, chart.unit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  const xs = chart.series[0]?.points.map(p => p.x) ?? []
  return (
    <div className="kt-visually-hidden">
      <table>
        <thead>
          <tr>
            <th scope="col">Period</th>
            {chart.series.map((s, i) => (
              <th key={i} scope="col">
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {xs.map((x, xi) => (
            <tr key={xi}>
              <th scope="row">{x}</th>
              {chart.series.map((s, si) => (
                <td key={si}>{s.points[xi] ? fmtValue(s.points[xi].y, s.unit) : ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function PostChart({ chart }: { chart: ChartSpec }) {
  // One axis per plot, always: series with different units become
  // small-multiple panels (never a second y-scale).
  const panels: ChartSeries[][] = []
  if (chart.kind === 'line') {
    for (const s of chart.series) {
      const group = panels.find(g => g[0].unit === s.unit)
      if (group) group.push(s)
      else panels.push([s])
    }
  }
  return (
    <figure className="kt-figure">
      <figcaption className="fig-title">{chart.title}</figcaption>
      {chart.kind === 'line' ? (
        <div className="kt-fig-panels">
          {panels.map((group, gi) => (
            <LinePanel key={gi} series={group} subtitle={panels.length > 1 && group.length === 1 ? group[0].label : undefined} />
          ))}
        </div>
      ) : chart.kind === 'donut' ? (
        <DonutPlot slices={chart.slices} unit={chart.unit} />
      ) : (
        <BarPlot bars={chart.bars} unit={chart.unit} />
      )}
      {chart.note ? <p className="fig-note">{chart.note}</p> : null}
      {chart.source ? (
        <p className="fig-src">
          <span className="src-label">Source</span>
          {chart.source}
        </p>
      ) : null}
      <DataTable chart={chart} />
    </figure>
  )
}
