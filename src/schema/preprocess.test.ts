import { describe, expect, it } from 'vitest'
import { number } from './number'
import { preprocess } from './preprocess'

describe('preprocess', () => {
  it('transforms the raw input before parsing', () => {
    const schema = preprocess(
      {
        decode: v => typeof v === 'string' ? v.trim() : v,
        encode: v => v,
      },
      number(),
    )
    expect(schema.parse('  42 ')).toBe(42)
  })

  it('encodes through the inner schema and the transform', () => {
    const schema = preprocess(
      { decode: Number, encode: v => v },
      number(),
    )
    expect(schema.encode(5)).toBe(5)
  })

  it('exposes the schema type tag', () => {
    const schema = preprocess(
      { decode: Number, encode: v => v },
      number(),
    )
    expect(schema.type).toBe('preprocess')
  })
})
