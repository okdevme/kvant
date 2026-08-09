import { describe, expect, it } from 'vitest'
import { number } from './number'
import { string } from './string'
import { tuple } from './tuple'

describe('tuple', () => {
  it('parses each position through its schema', () => {
    const schema = tuple([string(), number()])
    expect(schema.parse(['a', '1'])).toEqual(['a', 1])
  })

  it('wraps a single raw value into a one-item tuple', () => {
    expect(tuple([string(), number()]).parse('a')).toEqual(['a'])
  })

  it('parses undefined to undefined', () => {
    expect(tuple([string()]).parse(undefined)).toBeUndefined()
  })

  it('supports a rest schema for extra items', () => {
    const schema = tuple([string()], number())
    expect(schema.parse(['a', '1', '2'])).toEqual(['a', 1, 2])
  })

  it('drops extra items without a rest schema', () => {
    expect(tuple([string()]).parse(['a', 'b'])).toEqual(['a'])
  })

  it('strips trailing undefined values', () => {
    const schema = tuple([string(), number().optional()])
    expect(schema.parse(['a'])).toEqual(['a'])
  })

  it('encodes position-wise', () => {
    const schema = tuple([string(), number()])
    expect(schema.encode(['a', 1])).toEqual(['a', 1])
  })

  it('exposes the schema type tag', () => {
    expect(tuple([string()]).type).toBe('tuple')
  })
})
