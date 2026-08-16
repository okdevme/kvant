// Covers docs/content/docs/_shared/_custom-schema.mdx → Adapting other schema libraries → Standard Schema.
import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { KvantSchema } from '../../types/schema'
import { describe, expect, it } from 'vitest'

// Adapter copied verbatim from the docs.
function standard<T>(
  schema: StandardSchemaV1<unknown, T>,
): KvantSchema<T | undefined> {
  return {
    parse: (value) => {
      const result = schema['~standard'].validate(value)
      if (result instanceof Promise)
        throw new TypeError('Async schemas are not supported by kvant')
      return result.issues ? undefined : result.value
    },
    encode: value => value,
  }
}

/** Minimal sync Standard Schema implementation for testing the adapter. */
function stringSchema(): StandardSchemaV1<unknown, string> {
  return {
    '~standard': {
      version: 1,
      vendor: 'kvant-test',
      validate: value =>
        typeof value === 'string'
          ? { value }
          : { issues: [{ message: 'Not a string', path: [] }] },
    },
  }
}

function asyncSchema(): StandardSchemaV1<unknown, string> {
  return {
    '~standard': {
      version: 1,
      vendor: 'kvant-test',
      validate: value => Promise.resolve({ value: String(value) }),
    },
  }
}

describe('standard schema adapter (docs)', () => {
  it('parses valid values', () => {
    expect(standard(stringSchema()).parse('hi')).toBe('hi')
  })

  it('returns undefined for values with issues', () => {
    expect(standard(stringSchema()).parse(42)).toBeUndefined()
    expect(standard(stringSchema()).parse(undefined)).toBeUndefined()
  })

  it('throws TypeError for async schemas (documented limitation)', () => {
    expect(() => standard(asyncSchema()).parse('x'))
      .toThrow(TypeError)
  })

  it('encodes as identity', () => {
    expect(standard(stringSchema()).encode('x')).toBe('x')
  })
})
