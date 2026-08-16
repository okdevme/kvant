// Covers docs/content/docs/_shared/_custom-schema.mdx → Adapting other schema libraries → Valibot.
import type { KvantSchema } from '../../types/schema'
import * as v from 'valibot'
import { describe, expect, it } from 'vitest'

// Adapter copied verbatim from the docs.
function valibot<T>(
  schema: v.BaseSchema<unknown, T, v.BaseIssue<unknown>>,
): KvantSchema<T | undefined> {
  return {
    parse: (value) => {
      const result = v.safeParse(schema, value)
      return result.success ? result.output : undefined
    },
    encode: value => value,
  }
}

describe('valibot adapter (docs)', () => {
  it('parses valid values', () => {
    const schema = valibot(v.pipe(v.string(), v.minLength(2)))
    expect(schema.parse('ab')).toBe('ab')
  })

  it('returns undefined — never throws — for invalid values', () => {
    const schema = valibot(v.pipe(v.string(), v.minLength(2)))
    expect(schema.parse('a')).toBeUndefined()
    expect(schema.parse(undefined)).toBeUndefined()
    expect(() => schema.parse(42)).not.toThrow()
  })

  it('encodes as identity', () => {
    const schema = valibot(v.number())
    expect(schema.encode(3)).toBe(3)
    expect(schema.encode(undefined)).toBeUndefined()
  })

  it('roundtrips through kvant safeParse/safeEncode contract', async () => {
    const { safeParse, safeEncode } = await import('../../utils/schema')
    const schema = valibot(v.picklist(['asc', 'desc'] as const))
    expect(safeParse(schema, 'asc')).toBe('asc')
    expect(safeParse(schema, 'sideways')).toBeUndefined()
    expect(safeParse(schema, safeEncode(schema, 'desc'))).toBe('desc')
  })
})
