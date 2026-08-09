import { describe, expect, it } from 'vitest'
import { parseSearch, stringifySearch, withSearch } from './search'

describe('parseSearch', () => {
  it('parses a query string into a record', () => {
    expect(parseSearch('?a=1&b=2')).toEqual({ a: '1', b: '2' })
  })

  it('keeps repeated keys as arrays', () => {
    expect(parseSearch('a=1&a=2&b=3')).toEqual({ a: ['1', '2'], b: '3' })
  })

  it('accepts a bare query string without a leading ?', () => {
    expect(parseSearch('a=1')).toEqual({ a: '1' })
  })

  it('parses empty input to an empty record', () => {
    expect(parseSearch('')).toEqual({})
  })
})

describe('stringifySearch', () => {
  it('serializes a record into a query string', () => {
    expect(stringifySearch({ a: '1', b: 2 })).toBe('a=1&b=2')
  })

  it('serializes arrays as repeated keys', () => {
    expect(stringifySearch({ a: ['1', '2'] })).toBe('a=1&a=2')
  })

  it('skips undefined values', () => {
    expect(stringifySearch({ a: undefined, b: 'x' })).toBe('b=x')
  })
})

describe('parseSearch/stringifySearch roundtrip', () => {
  it('roundtrips', () => {
    const input = '?a=1&a=2&b=x%20y'
    expect(stringifySearch(parseSearch(input))).toBe('a=1&a=2&b=x+y')
  })
})

describe('withSearch', () => {
  it('replaces the search string of a URL', () => {
    const url = withSearch('https://example.com/path?old=1#hash', 'a=1')
    expect(url.search).toBe('?a=1')
    expect(url.hash).toBe('#hash')
    expect(url.pathname).toBe('/path')
  })

  it('accepts URLSearchParams', () => {
    const url = withSearch(
      new URL('https://example.com/'),
      new URLSearchParams('a=1'),
    )
    expect(url.search).toBe('?a=1')
  })

  it('accepts Location', () => {
    const url = withSearch(window.location, 'a=1')
    expect(url.search).toBe('?a=1')
    expect(url.origin).toBe(window.location.origin)
  })
})
