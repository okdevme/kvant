import { describe, expect, it } from 'vitest'
import { number } from './number'
import { looseSet, set } from './set'
import { string } from './string'

describe('looseSet', () => {
  it('parses arrays into a Set, item-wise', () => {
    expect(looseSet(number()).parse(['1', '2', '2'])).toEqual(new Set([1, 2]))
  })

  it('wraps a single raw value into a Set', () => {
    expect(looseSet(number()).parse('42')).toEqual(new Set([42]))
  })

  it('parses undefined to undefined', () => {
    expect(looseSet(string()).parse(undefined)).toBeUndefined()
  })

  it('encodes to an array, item-wise', () => {
    expect(looseSet(number()).encode(new Set([1, 2]))).toEqual([1, 2])
  })

  it('encodes undefined to undefined', () => {
    expect(looseSet(string()).encode(undefined)).toBeUndefined()
  })

  it('keeps failed items as undefined entries', () => {
    expect(looseSet(number()).parse(['1', 'nope', '3'])).toEqual(new Set([1, undefined, 3]))
  })

  it('unwraps back to the inner schema', () => {
    const inner = number()
    expect(looseSet(inner).unwrap()).toBe(inner)
  })

  it('validates min/max/size constraints', () => {
    expect(looseSet(string()).min(2).parse(['a'])).toBeUndefined()
    expect(looseSet(string()).min(2).parse(['a', 'b'])).toEqual(new Set(['a', 'b']))
    expect(looseSet(string()).nonempty().parse([])).toBeUndefined()
    expect(looseSet(string()).nonempty().parse(['a'])).toEqual(new Set(['a']))
    expect(looseSet(string()).max(1).parse(['a', 'b'])).toBeUndefined()
    expect(looseSet(string()).size(2).parse(['a', 'b'])).toEqual(new Set(['a', 'b']))
    expect(looseSet(string()).size(2).parse(['a'])).toBeUndefined()
  })

  it('slices the parsed set (insertion order)', () => {
    expect(looseSet(string()).slice(1).parse(['a', 'b', 'c'])).toEqual(new Set(['b', 'c']))
  })

  it('exposes the schema type tag', () => {
    expect(looseSet(string()).type).toBe('set')
  })
})

describe('set', () => {
  it('parses arrays into a Set, item-wise', () => {
    expect(set(number()).parse(['1', '2', '2'])).toEqual(new Set([1, 2]))
  })

  it('wraps a single raw value into a Set', () => {
    expect(set(number()).parse('42')).toEqual(new Set([42]))
  })

  it('parses undefined to undefined', () => {
    expect(set(string()).parse(undefined)).toBeUndefined()
  })

  it('encodes to an array, item-wise', () => {
    expect(set(number()).encode(new Set([1, 2]))).toEqual([1, 2])
  })

  it('encodes undefined to undefined', () => {
    expect(set(string()).encode(undefined)).toBeUndefined()
  })

  it('filters out failed/undefined entries', () => {
    expect(set(number()).parse(['1', 'nope', '3', undefined])).toEqual(new Set([1, 3]))
  })

  it('unwraps back to the inner schema', () => {
    const inner = number()
    expect(set(inner).unwrap()).toBe(inner)
  })

  it('validates min/max/size constraints', () => {
    expect(set(string()).min(2).parse(['a'])).toBeUndefined()
    expect(set(string()).min(2).parse(['a', 'b'])).toEqual(new Set(['a', 'b']))
    expect(set(string()).nonempty().parse([])).toBeUndefined()
    expect(set(string()).nonempty().parse(['a'])).toEqual(new Set(['a']))
    expect(set(string()).max(1).parse(['a', 'b'])).toBeUndefined()
    expect(set(string()).size(2).parse(['a', 'b'])).toEqual(new Set(['a', 'b']))
    expect(set(string()).size(2).parse(['a'])).toBeUndefined()
  })

  it('slices the parsed set (insertion order)', () => {
    expect(set(string()).slice(1).parse(['a', 'b', 'c'])).toEqual(new Set(['b', 'c']))
  })

  it('exposes the schema type tag', () => {
    expect(set(string()).type).toBe('set')
  })
})
