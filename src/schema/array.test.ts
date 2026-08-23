import { describe, expect, it } from 'vitest'
import { array, looseArray } from './array'
import { number } from './number'
import { string } from './string'

describe('looseArray', () => {
  it('parses arrays item-wise', () => {
    expect(looseArray(number()).parse(['1', '2', '3'])).toEqual([1, 2, 3])
  })

  it('wraps a single raw value into an array', () => {
    expect(looseArray(number()).parse('42')).toEqual([42])
  })

  it('parses undefined to undefined', () => {
    expect(looseArray(string()).parse(undefined)).toBeUndefined()
  })

  it('encodes arrays item-wise', () => {
    expect(looseArray(number()).encode([1, 2])).toEqual([1, 2])
  })

  it('encodes undefined to undefined', () => {
    expect(looseArray(string()).encode(undefined)).toBeUndefined()
  })

  it('keeps failed items as undefined entries', () => {
    expect(looseArray(number()).parse(['1', 'nope', '3'])).toEqual([1, undefined, 3])
  })

  it('unwraps back to the inner schema', () => {
    const inner = number()
    expect(looseArray(inner).unwrap()).toBe(inner)
  })

  it('validates min/max/length constraints', () => {
    const schema = looseArray(string()).min(2)
    expect(schema.parse(['a'])).toBeUndefined()
    expect(schema.parse(['a', 'b'])).toEqual(['a', 'b'])

    expect(looseArray(string()).nonempty().parse([])).toBeUndefined()
    expect(looseArray(string()).nonempty().parse(['a'])).toEqual(['a'])
    expect(looseArray(string()).max(1).parse(['a', 'b'])).toBeUndefined()
    expect(looseArray(string()).length(2).parse(['a', 'b'])).toEqual(['a', 'b'])
    expect(looseArray(string()).length(2).parse(['a'])).toBeUndefined()
  })

  it('slices the parsed array', () => {
    const schema = looseArray(string()).slice(1)
    expect(schema.parse(['a', 'b', 'c'])).toEqual(['b', 'c'])
    expect(schema.encode(['a', 'b', 'c'])).toEqual(['b', 'c'])
  })

  it('exposes the schema type tag', () => {
    expect(looseArray(string()).type).toBe('array')
  })
})

describe('array', () => {
  it('parses arrays item-wise', () => {
    expect(array(number()).parse(['1', '2', '3'])).toEqual([1, 2, 3])
  })

  it('wraps a single raw value into an array', () => {
    expect(array(number()).parse('42')).toEqual([42])
  })

  it('parses undefined to undefined', () => {
    expect(array(string()).parse(undefined)).toBeUndefined()
  })

  it('encodes arrays item-wise', () => {
    expect(array(number()).encode([1, 2])).toEqual([1, 2])
  })

  it('encodes undefined to undefined', () => {
    expect(array(string()).encode(undefined)).toBeUndefined()
  })

  it('filters out failed/undefined entries', () => {
    expect(array(number()).parse(['1', 'nope', '3', undefined])).toEqual([1, 3])
  })

  it('unwraps back to the inner schema', () => {
    const inner = number()
    expect(array(inner).unwrap()).toBe(inner)
  })

  it('validates min/max/length constraints', () => {
    const schema = array(string()).min(2)
    expect(schema.parse(['a'])).toBeUndefined()
    expect(schema.parse(['a', 'b'])).toEqual(['a', 'b'])

    expect(array(string()).nonempty().parse([])).toBeUndefined()
    expect(array(string()).nonempty().parse(['a'])).toEqual(['a'])
    expect(array(string()).max(1).parse(['a', 'b'])).toBeUndefined()
    expect(array(string()).length(2).parse(['a', 'b'])).toEqual(['a', 'b'])
    expect(array(string()).length(2).parse(['a'])).toBeUndefined()
  })

  it('slices the parsed array', () => {
    const schema = array(string()).slice(1)
    expect(schema.parse(['a', 'b', 'c'])).toEqual(['b', 'c'])
    expect(schema.encode(['a', 'b', 'c'])).toEqual(['b', 'c'])
  })

  it('exposes the schema type tag', () => {
    expect(array(string()).type).toBe('array')
  })
})
