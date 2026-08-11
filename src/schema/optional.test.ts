import { describe, expect, it } from 'vitest'
import { optional } from './optional'
import { string } from './string'

describe('optional', () => {
  it('passes undefined through', () => {
    const schema = optional(string())
    expect(schema.parse(undefined)).toBeUndefined()
    expect(schema.encode(undefined)).toBeUndefined()
  })

  it('delegates other values to the inner schema', () => {
    const schema = optional(string())
    expect(schema.parse('a')).toBe('a')
    expect(schema.encode('a')).toBe('a')
  })

  it('unwraps back to the inner schema', () => {
    const inner = string()
    expect(optional(inner).unwrap()).toBe(inner)
  })

  it('exposes the schema type tag', () => {
    expect(optional(string()).type).toBe('optional')
  })
})
