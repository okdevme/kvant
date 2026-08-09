import { describe, expect, it } from 'vitest'
import { custom } from './custom'

describe('custom', () => {
  it('delegates parse/encode to the definition', () => {
    const schema = custom<number, string>({
      parse: value => Number(value),
      encode: value => String(value),
    })
    expect(schema.parse('42')).toBe(42)
    expect(schema.encode(42)).toBe('42')
  })

  it('supports fluent combinators', () => {
    const schema = custom<number, string>({
      parse: value => Number(value),
      encode: value => String(value),
    }).default(0)
    expect(schema.parse('1')).toBe(1)
    expect(schema.parse(undefined)).toBe(0)
    expect(schema.encode(0)).toBeUndefined()
  })

  it('exposes the schema type tag', () => {
    expect(custom({ parse: v => v, encode: v => v }).type).toBe('custom')
  })
})
