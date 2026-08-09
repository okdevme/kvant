import { describe, expect, it } from 'vitest'
import { isoDateToDate } from './date'
import { _default, prefault } from './default'
import { number } from './number'
import { string } from './string'

describe('_default', () => {
  it('returns the default when raw input is undefined', () => {
    expect(_default(number(), 42).parse(undefined)).toBe(42)
  })

  it('returns the default when parsing fails', () => {
    expect(_default(number(), 42).parse('nope')).toBe(42)
  })

  it('supports factory defaults', () => {
    let i = 0
    const schema = _default(number(), () => ++i)
    expect(schema.parse(undefined)).toBe(1)
    expect(schema.parse(undefined)).toBe(2)
  })

  it('shallow-clones object defaults', () => {
    const defaultValue = { a: [1] }
    const schema = _default(string().array(), ['x'])
    const a = schema.parse(undefined)!
    const b = schema.parse(undefined)!
    expect(a).not.toBe(b)

    const obj = _default(string().array() as any, defaultValue)
    expect(obj.parse(undefined)).not.toBe(defaultValue)
  })

  it('clears the stored value when it equals the default', () => {
    expect(_default(number(), 42).encode(42)).toBeUndefined()
    expect(_default(number(), 42).encode(1)).toBe(1)
  })

  it('respects clearOnDefault: false', () => {
    const schema = _default(number(), 42, { clearOnDefault: false })
    expect(schema.encode(42)).toBe(42)
    expect(schema.encode(1)).toBe(1)
  })

  it('supports custom isDefault equality', () => {
    const schema = _default(
      string().array(),
      ['a', 'b'],
      { isDefault: (value, def) => JSON.stringify(value) === JSON.stringify(def) },
    )
    expect(schema.encode(['a', 'b'])).toBeUndefined()
    expect(schema.encode(['a'])).toEqual(['a'])
  })

  it('unwraps back to the inner schema', () => {
    const inner = number()
    expect(_default(inner, 0).unwrap()).toBe(inner)
  })

  it('exposes the schema type tag', () => {
    expect(_default(number(), 0).type).toBe('default')
  })
})

describe('prefault', () => {
  it('parses the default input through the schema', () => {
    // prefault takes the *input* type (stored form)
    expect(prefault(number(), 42).parse(undefined)).toBe(42)
  })

  it('parses the default input through an input-transforming schema', () => {
    const schema = prefault(isoDateToDate(), '2026-08-09')
    expect(schema.parse(undefined)).toEqual(new Date('2026-08-09T00:00:00.000Z'))
    expect(schema.encode(new Date('2026-08-09T00:00:00.000Z'))).toBeUndefined()
    expect(schema.encode(new Date('2026-01-01T00:00:00.000Z'))).toBe('2026-01-01')
  })

  it('yields undefined when the default itself fails to parse', () => {
    expect(prefault(number(), 'nope' as any).parse(undefined)).toBeUndefined()
  })

  it('does not re-fallback when a present value fails to parse', () => {
    // prefault only applies to undefined raw input
    expect(prefault(number(), 42).parse('nope')).toBeUndefined()
  })

  it('clears the stored value when it encodes to the default', () => {
    const schema = prefault(number(), 42)
    expect(schema.encode(42)).toBeUndefined()
    expect(schema.encode(1)).toBe(1)
  })

  it('respects clearOnDefault: false', () => {
    const schema = prefault(number(), 42, { clearOnDefault: false })
    expect(schema.encode(42)).toBe(42)
  })

  it('supports factory defaults', () => {
    let i = 0
    const schema = prefault(number(), () => ++i)
    expect(schema.parse(undefined)).toBe(1)
    expect(schema.parse(undefined)).toBe(2)
  })

  it('unwraps back to the inner schema', () => {
    const inner = number()
    expect(prefault(inner, 0).unwrap()).toBe(inner)
  })

  it('exposes the schema type tag', () => {
    expect(prefault(number(), 0).type).toBe('prefault')
  })
})
