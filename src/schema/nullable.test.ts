import { describe, expect, it } from 'vitest'
import { nullable } from './nullable'
import { string } from './string'

describe('nullable', () => {
  it('passes null through', () => {
    const schema = nullable(string())
    expect(schema.parse(null)).toBeNull()
    expect(schema.encode(null)).toBeNull()
  })

  it('delegates other values to the inner schema', () => {
    const schema = nullable(string())
    expect(schema.parse('a')).toBe('a')
    expect(schema.encode('a')).toBe('a')
  })

  it('unwraps back to the inner schema', () => {
    const inner = string()
    expect(nullable(inner).unwrap()).toBe(inner)
  })

  it('exposes the schema type tag', () => {
    expect(nullable(string()).type).toBe('nullable')
  })
})
