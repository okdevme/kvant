import { describe, expect, it } from 'vitest'
import { singular } from './singular'
import { string } from './string'

describe('singular', () => {
  it('picks the first array element by default', () => {
    expect(singular(string()).parse(['a', 'b'])).toBe('a')
  })

  it('supports a custom index', () => {
    expect(singular(string(), 1).parse(['a', 'b'])).toBe('b')
    expect(singular(string(), -1).parse(['a', 'b'])).toBe('b')
  })

  it('supports an index function', () => {
    expect(singular(string(), arr => (arr as string[]).length - 1).parse(['a', 'b', 'c'])).toBe('c')
  })

  it('passes non-arrays through to the inner schema', () => {
    expect(singular(string()).parse('a')).toBe('a')
  })

  it('encodes through the inner schema unchanged', () => {
    expect(singular(string()).encode('a')).toBe('a')
  })

  it('unwraps back to the inner schema', () => {
    const inner = string()
    expect(singular(inner).unwrap()).toBe(inner)
  })

  it('exposes the schema type tag', () => {
    expect(singular(string()).type).toBe('singular')
  })
})
