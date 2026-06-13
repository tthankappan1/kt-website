// @vitest-environment node
import { describe, expect, it, beforeAll } from 'vitest'

let Icon: () => Promise<Response>
let iconContentType: string
let iconSize: { width: number; height: number }

let AppleIcon: () => Promise<Response>
let appleContentType: string
let appleSize: { width: number; height: number }

beforeAll(async () => {
  const iconMod = await import('../icon')
  Icon = iconMod.default
  iconContentType = iconMod.contentType
  iconSize = iconMod.size

  const appleMod = await import('../apple-icon')
  AppleIcon = appleMod.default
  appleContentType = appleMod.contentType
  appleSize = appleMod.size
})

describe('favicon icon — exports', () => {
  it('exports contentType image/png', () => {
    expect(iconContentType).toBe('image/png')
  })
  it('exports size 32x32', () => {
    expect(iconSize).toEqual({ width: 32, height: 32 })
  })
})

describe('favicon icon — renders', () => {
  it('returns a 200 response with content-type image/png', async () => {
    const res = await Icon()
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('image/png')
  })
})

describe('apple-icon — exports', () => {
  it('exports contentType image/png', () => {
    expect(appleContentType).toBe('image/png')
  })
  it('exports size 180x180', () => {
    expect(appleSize).toEqual({ width: 180, height: 180 })
  })
})

describe('apple-icon — renders', () => {
  it('returns a 200 response with content-type image/png', async () => {
    const res = await AppleIcon()
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('image/png')
  })
})
