import type { Type } from 'arktype'
// Covers docs/content/docs/_shared/_custom-schema.mdx → Adapting other schema libraries → ArkType.
import type { KvantSchema } from '../../types/schema'
import { ArkErrors, type } from 'arktype'
import { describe, expect, it } from 'vitest'

// Adapter copied verbatim from the docs.
function arktype<T>(
  def: Type<T>,
): KvantSchema<T | undefined> {
  return {
    parse: (value) => {
      const out = def(value)
      return out instanceof ArkErrors ? undefined : out as T
    },
    encode: value => value,
  }
}

describe('arktype adapter (docs)', () => {
  it('parses valid values', () => {
    const schema = arktype(type('string'))
    expect(schema.parse('hello')).toBe('hello')
  })

  it('returns undefined — never throws — for invalid values', () => {
    const schema = arktype(type('number'))
    expect(schema.parse('nope')).toBeUndefined()
    expect(schema.parse(undefined)).toBeUndefined()
    expect(() => schema.parse('nope')).not.toThrow()
  })

  it('encodes as identity', () => {
    const schema = arktype(type('number'))
    expect(schema.encode(3)).toBe(3)
    expect(schema.encode(undefined)).toBeUndefined()
  })

  it('supports morphs (string → number)', () => {
    const schema = arktype(type('string.numeric.parse'))
    expect(schema.parse('42')).toBe(42)
    expect(schema.parse('abc')).toBeUndefined()
  })
})
