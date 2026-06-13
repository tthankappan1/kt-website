import { describe, expect, it, vi } from 'vitest'
import { isValidElement } from 'react'

// next/font/google is a build-time transform unavailable under vitest — stub it so
// the layout module can load. Each factory returns a font object with a `variable`.
vi.mock('next/font/google', () => ({
  Fraunces: () => ({ variable: '--font-fraunces' }),
  Inter: () => ({ variable: '--font-inter' }),
}))

const { default: RootLayout } = await import('../layout')

// RootLayout returns an <html> tree.
// We inspect the returned element structure directly (mounting <html>/<body> into
// a JSDOM container is unreliable) to assert the skip link is the FIRST child of
// <body>, before {children}.

type AnyEl = {
  type: unknown
  props: { children?: unknown; [k: string]: unknown }
}

describe('RootLayout skip link', () => {
  it('renders <a class="kt-skip" href="#main"> as the first child of <body>', () => {
    const tree = RootLayout({ children: <div data-testid="page-children" /> }) as AnyEl
    expect(isValidElement(tree)).toBe(true)
    expect(tree.type).toBe('html')

    const body = tree.props.children as AnyEl
    expect(body.type).toBe('body')

    const bodyChildren = body.props.children as AnyEl[]
    const first = bodyChildren[0]
    expect(first.type).toBe('a')
    expect(first.props.href).toBe('#main')
    expect(first.props.className).toBe('kt-skip')
    expect(first.props.children).toBe('Skip to content')
  })
})
