import { describe, expect, it } from 'vitest'
import { hex, index, int, number } from './number'

describe('number', () => {
  it('parses numeric strings', () => {
    expect(number().parse('42')).toBe(42)
    expect(number().parse('3.14')).toBe(3.14)
    expect(number().parse('-7')).toBe(-7)
  })

  it('passes numbers through', () => {
    expect(number().parse(42)).toBe(42)
  })

  it('parses non-finite results to undefined', () => {
    expect(number().parse('nope')).toBeUndefined()
    expect(number().parse('Infinity')).toBeUndefined()
    expect(number().parse(Number.NaN)).toBeUndefined()
  })

  it('parses undefined to undefined', () => {
    expect(number().parse(undefined)).toBeUndefined()
  })

  it('encodes finite numbers', () => {
    expect(number().encode(42)).toBe(42)
    expect(number().encode(Number.NaN)).toBeUndefined()
    expect(number().encode(Number.POSITIVE_INFINITY)).toBeUndefined()
    expect(number().encode(undefined)).toBeUndefined()
  })

  it('validates gt/gte/lt/lte and aliases', () => {
    expect(number().gt(2).parse(3)).toBe(3)
    expect(number().gt(2).parse(2)).toBeUndefined()
    expect(number().gte(2).parse(2)).toBe(2)
    expect(number().min(2).parse(2)).toBe(2)
    expect(number().lt(2).parse(1)).toBe(1)
    expect(number().lt(2).parse(2)).toBeUndefined()
    expect(number().lte(2).parse(2)).toBe(2)
    expect(number().max(2).parse(2)).toBe(2)
  })

  it('validates sign constraints', () => {
    expect(number().positive().parse(1)).toBe(1)
    expect(number().positive().parse(0)).toBeUndefined()
    expect(number().nonnegative().parse(0)).toBe(0)
    expect(number().negative().parse(-1)).toBe(-1)
    expect(number().negative().parse(0)).toBeUndefined()
    expect(number().nonpositive().parse(0)).toBe(0)
  })

  it('validates multiples', () => {
    const schema = number().multipleOf(3)
    expect(schema.parse(9)).toBe(9)
    expect(schema.parse(10)).toBeUndefined()
    expect(number().step(0.5).parse(2.5)).toBe(2.5)
  })

  it('clamps values', () => {
    expect(number().clamp(10).parse(20)).toBe(10)
    expect(number().clamp(10).parse(5)).toBe(5)
    expect(number().clamp(2, 10).parse(20)).toBe(10)
    expect(number().clamp(2, 10).parse(0)).toBe(2)
    expect(number().clamp(2, 10).parse(5)).toBe(5)
  })

  it('applies rounding transforms', () => {
    expect(number().floor().parse(3.7)).toBe(3)
    expect(number().ceil().parse(3.2)).toBe(4)
    expect(number().round().parse(3.5)).toBe(4)
    expect(number().trunc().parse(-3.7)).toBe(-3)
  })

  it('exposes the schema type tag', () => {
    expect(number().type).toBe('number')
  })
})

describe('int', () => {
  it('truncates to an integer', () => {
    expect(int().parse('3.9')).toBe(3)
    expect(int().parse('-3.9')).toBe(-3)
  })

  it('clamps to the safe integer range', () => {
    expect(int().parse(Number.MAX_VALUE)).toBe(Number.MAX_SAFE_INTEGER)
    expect(int().parse(-Number.MAX_VALUE)).toBe(Number.MIN_SAFE_INTEGER)
  })
})

describe('index', () => {
  it('maps one-based stored values to zero-based state', () => {
    expect(index().parse('1')).toBe(0)
    expect(index().parse('3')).toBe(2)
    expect(index().parse('0')).toBe(0)
    expect(index().parse('-5')).toBe(0)
  })

  it('maps zero-based state to one-based stored values', () => {
    expect(index().encode(0)).toBe(1)
    expect(index().encode(2)).toBe(3)
    expect(index().encode(-5)).toBe(1)
  })

  it('roundtrips', () => {
    expect(index().parse(index().encode(4))).toBe(4)
  })
})

describe('hex', () => {
  it('parses hex strings', () => {
    expect(hex().parse('ff')).toBe(255)
    expect(hex().parse('00')).toBe(0)
    expect(hex().parse(255)).toBe(255)
  })

  it('encodes with an even digit count', () => {
    expect(hex().encode(255)).toBe('ff')
    expect(hex().encode(15)).toBe('0f')
  })

  it('encodes negative values with a minus sign', () => {
    expect(hex().encode(-255)).toBe('-ff')
    expect(hex().parse('-ff')).toBe(-255)
  })

  it('exposes the schema type tag', () => {
    expect(hex().type).toBe('hex')
  })
})
