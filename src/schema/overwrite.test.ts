import { describe, expect, it } from 'vitest'
import { number } from './number'
import { overwrite } from './overwrite'

describe('overwrite', () => {
  it('applies a bare function in both directions', () => {
    const schema = overwrite(number(), v => v * 2)
    expect(schema.parse('3')).toBe(6)
    expect(schema.encode(3)).toBe(6)
  })

  it('applies decode/encode separately', () => {
    const schema = overwrite(number(), {
      decode: v => v + 1,
      encode: v => v - 1,
    })
    expect(schema.parse('1')).toBe(2)
    expect(schema.encode(2)).toBe(1)
  })

  it('skips undefined outputs', () => {
    const schema = overwrite(number(), v => v * 2)
    expect(schema.parse('nope')).toBeUndefined()
    expect(schema.encode(undefined)).toBeUndefined()
  })

  it('preserves the schema type tag and combinators', () => {
    const schema = overwrite(number(), v => v)
    expect(schema.type).toBe('number')
    expect(schema.gt(5).parse(3)).toBeUndefined()
  })
})
