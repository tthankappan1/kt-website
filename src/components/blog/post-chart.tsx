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

// Screen-reader table twin — every plotted value is reachable without the SVG.
// Wrapped in a hidden div, not hidden itself: a table treats width:1px as a
// MINIMUM, so an absolutely-positioned bare table would still widen the page
// (58px of horizontal scroll at 375px viewports).
function DataTable({ chart }: { chart: ChartSpec }) {
  if (chart.kind === 'bar') {
    return (
      <div className="kt-visually-hidden">
        <table>
          <tbody>
            {chart.bars.map((b, i) => (
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
