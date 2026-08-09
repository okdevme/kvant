import { describe, expect, it } from 'vitest'
import { number } from './number'
import { transform } from './transform'

describe('transform', () => {
  it('applies a bare function in both directions', () => {
    const schema = transform((v: string) => v.toUpperCase())
    expect(schema.parse('ab')).toBe('AB')
    expect(schema.encode('ab')).toBe('AB')
  })

  it('applies decode/encode separately', () => {
    const schema = transform<string, number>({
      decode: v => Number(v),
      encode: v => String(v),
    })
    expect(schema.parse('42')).toBe(42)
    expect(schema.encode(42)).toBe('42')
  })

  it('composes via KvantType.transform', () => {
    const schema = number().transform(v => (v ?? 0) * 10)
    expect(schema.parse('2')).toBe(20)
  })

  it('exposes the schema type tag', () => {
    expect(transform(v => v).type).toBe('transform')
  })
})
