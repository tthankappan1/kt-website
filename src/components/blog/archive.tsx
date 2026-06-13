'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { KtInline } from '@/lib/inline'
import { ktMonthLabel, ktMonthName, ktShortDate } from '@/lib/dates'
import { KT_BLOG_CATS } from '@/content/posts/types'
import type { Post } from '@/content/posts/types'

type MonthGroup = {
  key: string
  label: string
  year: string
  posts: Post[]
}

type YearGroup = {
  year: string
  months: MonthGroup[]
}

export function BlogArchive({ posts }: { posts: Post[] }) {
  const [cat, setCat] = useState('All')
  const [activeM, setActiveM] = useState<string | null>(null)

  const filtered = posts.filter((p) => cat === 'All' || p.category === cat)

  // Group by month, then by year for the rail
  const groups: MonthGroup[] = []
  filtered.forEach((p) => {
    const key = p.date.slice(0, 7)
    let g = groups.find((x) => x.key === key)
    if (!g) {
      g = { key, label: ktMonthLabel(p.date), year: p.date.slice(0, 4), posts: [] }
      groups.push(g)
    }
    g.posts.push(p)
  })

  const years: YearGroup[] = []
  groups.forEach((g) => {
    let y = years.find((x) => x.year === g.year)
    if (!y) {
      y = { year: g.year, months: [] }
      years.push(y)
    }
    y.months.push(g)
  })

  useEffect(() => {
    const onScroll = () => {
      const secs = document.querySelectorAll<HTMLElement>('[data-mkey]')
      let cur: string | null = null
      secs.forEach((s) => {
        if (s.getBoundingClientRect().top < 240) cur = s.getAttribute('data-mkey')
      })
      setActiveM(cur ?? (secs[0] ? secs[0].getAttribute('data-mkey') : null))
    }
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [cat])

  const jump = (key: string) => {
    const el = document.querySelector<HTMLElement>('[data-mkey="' + key + '"]')
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 140, behavior: 'smooth' })
  }

  return (
    <section style={{ padding: 'calc(96px * var(--dm, 1)) 0 calc(110px * var(--dm, 1))' }}>
      <div className="kt-container">
        <h2 className="kt-h1">
          Every <em className="kt-em">issue</em>
        </h2>
        <hr className="kt-rule rule-light" />
        <div className="kt-chiprow" style={{ marginBottom: 'calc(56px * var(--dm, 1))' }}>
          {(['All', ...KT_BLOG_CATS] as const).map((c) => (
            <button
              key={c}
              className={'kt-fchip' + (cat === c ? ' on' : '')}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid-blogarch">
          <aside className="kt-blog-rail">
            {years.map((y) => (
              <div key={y.year}>
                <p className="kt-rail-year">{y.year}</p>
                {y.months.map((m) => (
                  <button
                    key={m.key}
                    className={'kt-rail-month' + (activeM === m.key ? ' on' : '')}
                    onClick={() => jump(m.key)}
                  >
                    {ktMonthName(m.key)}
                  </button>
                ))}
              </div>
            ))}
          </aside>
          <div>
            {groups.length === 0 ? (
              <p className="kt-lead">
                Nothing in this topic yet &mdash; new issues are on the way.
              </p>
            ) : (
              groups.map((g, gi) => (
                <div
                  key={g.key}
                  data-mkey={g.key}
                  style={{ marginTop: gi === 0 ? '0' : 'calc(48px * var(--dm, 1))' }}
                >
                  <p className="kt-eyebrow" style={{ marginBottom: '6px' }}>
                    {g.label}
                  </p>
                  {g.posts.map((p) => (
                    <Link key={p.slug} className="kt-arch-row" href={`/home-guide/${p.slug}`}>
                      <span className="ar-date">{ktShortDate(p.date)}</span>
                      <span className="ar-title">
                        <KtInline text={p.title} emClass="kt-em" />
                      </span>
                      <span className="ar-cat">{p.category}</span>
                    </Link>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
