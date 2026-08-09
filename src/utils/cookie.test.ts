import { describe, expect, it } from 'vitest'
import {
  decodeCookieValue,
  encodeCookieValue,
  parseCookie,
  stringifySetCookie,
} from './cookie'

describe('parseCookie', () => {
  it('parses a cookie header into a record', () => {
    expect(parseCookie('a=1; b=2')).toEqual({ a: '1', b: '2' })
  })

  it('returns an empty object for too-short strings', () => {
    expect(parseCookie('')).toEqual({})
    expect(parseCookie('a')).toEqual({})
  })

  it('keeps the first occurrence of a duplicate key', () => {
    expect(parseCookie('a=1; a=2')).toEqual({ a: '1' })
  })

  it('decodes percent-encoded values', () => {
    expect(parseCookie('q=a%20b')).toEqual({ q: 'a b' })
  })

  it('keeps the raw value when decoding fails', () => {
    expect(parseCookie('q=%E0%A4%A')).toEqual({ q: '%E0%A4%A' })
  })

  it('trims whitespace around pairs', () => {
    expect(parseCookie('  a = 1 ; b= 2 ')).toEqual({ a: '1', b: '2' })
  })
})

describe('stringifySetCookie', () => {
  it('serializes name and value', () => {
    expect(stringifySetCookie({ name: 'a', value: '1' })).toBe('a=1')
  })

  it('serializes undefined value as empty string', () => {
    expect(stringifySetCookie({ name: 'a', value: undefined })).toBe('a=')
  })

  it('serializes attributes', () => {
    const str = stringifySetCookie({
      name: 'a',
      value: '1',
      maxAge: 100,
      domain: 'example.com',
      path: '/',
      expires: new Date('2026-01-01T00:00:00.000Z'),
      httpOnly: true,
      secure: true,
      partitioned: true,
      priority: 'high',
      sameSite: 'strict',
    })
    expect(str).toBe(
      'a=1; Max-Age=100; Domain=example.com; Path=/; '
      + 'Expires=Thu, 01 Jan 2026 00:00:00 GMT; '
      + 'HttpOnly; Secure; Partitioned; Priority=High; SameSite=Strict',
    )
  })

  it('serializes sameSite variants', () => {
    expect(stringifySetCookie({ name: 'a', value: '1', sameSite: true })).toContain('SameSite=Strict')
    expect(stringifySetCookie({ name: 'a', value: '1', sameSite: 'lax' })).toContain('SameSite=Lax')
    expect(stringifySetCookie({ name: 'a', value: '1', sameSite: 'none' })).toContain('SameSite=None')
  })

  it('encodes values with unsafe characters', () => {
    expect(stringifySetCookie({ name: 'a', value: 'x y' })).toBe('a=x%20y')
  })
})

describe('encodeCookieValue/decodeCookieValue', () => {
  it('skips encoding for roundtrip-safe values', () => {
    expect(encodeCookieValue('abc-123')).toBe('abc-123')
  })

  it('encodes unsafe values and decodes back', () => {
    const value = 'a b;c'
    expect(decodeCookieValue(encodeCookieValue(value))).toBe(value)
  })
})
