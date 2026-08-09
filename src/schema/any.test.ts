import { describe, expect, it } from 'vitest'
import { any, unknown } from './any'

describe('any', () => {
  it('passes values through in both directions', () => {
    const schema = any()
    const value = { nested: ['x', 1] }
    expect(schema.parse(value)).toBe(value)
    expect(schema.encode(value)).toBe(value)
  })

  it('exposes the schema type tag', () => {
    expect(any().type).toBe('any')
  })
})

describe('unknown', () => {
  it('passes values through in both directions', () => {
    const schema = unknown()
    expect(schema.parse('x')).toBe('x')
    expect(schema.encode(42)).toBe(42)
  })

  it('exposes the schema type tag', () => {
    expect(unknown().type).toBe('unknown')
  })
})
