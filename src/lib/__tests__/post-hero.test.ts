import { describe, expect, it } from 'vitest'
import { splitHero } from '@/lib/post-hero'
import type { Post } from '@/content/posts/types'
import { post as week4 } from '@/content/posts/west-dublin-eight-days-dublin-ranch-29'

const base = {
  slug: 'test-post',
  title: 'Test Post',
  category: 'Market Update',
  date: '2026-07-27',
  excerpt: 'Excerpt.',
} satisfies Omit<Post, 'body'>

const heroBlock = {
  image: {
    src: '/images/posts/test-post/hero-test-post.jpg',
    alt: 'A test hero',
    caption: 'A caption.',
  },
}

describe('splitHero', () => {
  it('leading image block with file present → hero returned, body stripped', () => {
    const { hero, body } = splitHero({ ...base, body: [heroBlock, 'First para.'] }, () => true)
    expect(hero).toEqual(heroBlock.image)
    expect(body).toEqual(['First para.'])
  })

  it('leading image block with file missing → no hero, block still stripped (renders nothing, same as PostFigure)', () => {
    const { hero, body } = splitHero({ ...base, body: [heroBlock, 'First para.'] }, () => false)
    expect(hero).toBeNull()
    expect(body).toEqual(['First para.'])
  })

  it('no leading image block → body untouched, later images stay in-body figures', () => {
    const { hero, body } = splitHero({ ...base, body: ['First para.', heroBlock] }, () => true)
    expect(hero).toBeNull()
    expect(body).toEqual(['First para.', heroBlock])
  })

  it('empty body → no hero', () => {
    const { hero, body } = splitHero({ ...base, body: [] }, () => true)
    expect(hero).toBeNull()
    expect(body).toEqual([])
  })

  it('cover posts keep their body untouched — the PhotoSlot cover wins', () => {
    const { hero, body } = splitHero({ ...base, cover: true, body: [heroBlock, 'First para.'] }, () => true)
    expect(hero).toBeNull()
    expect(body).toEqual([heroBlock, 'First para.'])
  })

  it('resolves the shipped July Week 4 hero from public/ with the default fs check', () => {
    const { hero, body } = splitHero(week4)
    expect(hero?.src).toBe(
      '/images/posts/west-dublin-eight-days-dublin-ranch-29/hero-west-dublin-eight-days-dublin-ranch-29.jpg',
    )
    expect(body).toHaveLength(week4.body.length - 1)
  })
})
