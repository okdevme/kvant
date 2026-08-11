import type { KvantNumber } from './number'
import { describe, expect, it } from 'vitest'
import { isoDateToDate } from './date'
import { number } from './number'
import { string } from './string'

describe('kvantType combinators', () => {
  it('decode is an alias of parse', () => {
    expect(number().decode('42')).toBe(42)
  })

  it('optional allows undefined through', () => {
    const schema = number().optional()
    expect(schema.parse(undefined)).toBeUndefined()
    expect(schema.parse('1')).toBe(1)
  })

  it('nullable allows null through', () => {
    const schema = number().nullable()
    expect(schema.parse(null)).toBeNull()
    expect(schema.parse('1')).toBe(1)
  })

  it('nullish allows null and undefined through', () => {
    const schema = number().nullish()
    expect(schema.parse(null)).toBeNull()
    expect(schema.parse(undefined)).toBeUndefined()
    expect(schema.parse('1')).toBe(1)
  })

  it('array wraps into an array schema', () => {
    expect(number().array().parse(['1', '2'])).toEqual([1, 2])
  })

  it('default falls back on undefined', () => {
    const schema = number().default(7)
    expect(schema.parse(undefined)).toBe(7)
    expect(schema.encode(7)).toBeUndefined()
  })

  it('prefault falls back on undefined using the stored form', () => {
    const schema = number().prefault(7)
    expect(schema.parse(undefined)).toBe(7)
    expect(schema.encode(7)).toBeUndefined()
  })

  it('singular picks one element of an array raw value', () => {
    expect(string().singular().parse(['a', 'b'])).toBe('a')
  })

  it('overwrite transforms the parsed value', () => {
    expect(number().overwrite(v => v * 2).parse('2')).toBe(4)
  })

  it('refine keeps values passing the check', () => {
    const schema = number().refine(v => v > 0)
    expect(schema.parse('1')).toBe(1)
    expect(schema.parse('-1')).toBeUndefined()
  })

  it('pipe chains schemas', () => {
    const schema = string().pipe(isoDateToDate())
    expect(schema.parse('2026-08-09')).toEqual(new Date('2026-08-09T00:00:00.000Z'))
  })

  it('transform pipes into a transformation', () => {
    const schema = number().transform(v => (v ?? 0) * 2)
    expect(schema.parse('2')).toBe(4)
  })

  it('apply passes the schema to a function', () => {
    const double = (s: KvantNumber) => s.overwrite(v => v * 2)
    const schema = number()
    expect(schema.apply(double).parse('2')).toBe(4)
  })

  it('chains fluently', () => {
    const schema = number()
      .default(-1)
      .array()
      .transform(arr => arr?.filter(v => v >= 0))
    expect(schema.parse(['1', '-2', undefined, '2'])).toEqual([1, 2])
  })
})
