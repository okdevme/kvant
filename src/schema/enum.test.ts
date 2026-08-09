import { describe, expect, it } from 'vitest'
import { _enum } from './enum'

describe('enum', () => {
  it('parses values from a string array', () => {
    const schema = _enum(['asc', 'desc'])
    expect(schema.parse('asc')).toBe('asc')
    expect(schema.parse('desc')).toBe('desc')
    expect(schema.parse('up')).toBeUndefined()
  })

  it('parses values from an enum-like object', () => {
    const schema = _enum({ ASC: 'asc', DESC: 'desc' } as const)
    expect(schema.parse('asc')).toBe('asc')
    expect(schema.parse('ASC')).toBeUndefined()
  })

  it('supports numeric TS enums (reverse mapping)', () => {
    enum Direction {
      Up,
      Down,
    }
    const schema = _enum(Direction)
    expect(schema.parse(Direction.Up)).toBe(0)
    expect(schema.parse(Direction.Down)).toBe(1)
    expect(schema.parse(5)).toBeUndefined()
  })

  it('encodes unchanged', () => {
    expect(_enum(['a']).encode('a')).toBe('a')
  })

  it('exposes the enum entries and value set', () => {
    const schema = _enum(['a', 'b'])
    expect(schema.enum).toEqual({ a: 'a', b: 'b' })
    expect([...schema.values]).toEqual(['a', 'b'])
  })

  it('extract narrows to a subset of keys', () => {
    const schema = _enum(['a', 'b', 'c']).extract(['a', 'b'])
    expect(schema.parse('a')).toBe('a')
    expect(schema.parse('c')).toBeUndefined()
    expect(schema.enum).toEqual({ a: 'a', b: 'b' })
  })

  it('exclude removes keys', () => {
    const schema = _enum(['a', 'b', 'c']).exclude(['c'])
    expect(schema.parse('c')).toBeUndefined()
    expect(schema.parse('b')).toBe('b')
  })

  it('exposes the schema type tag', () => {
    expect(_enum(['a']).type).toBe('enum')
  })
})
