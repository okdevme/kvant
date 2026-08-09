import { describe, expect, it } from 'vitest'
import { map } from './map'
import { number } from './number'
import { string } from './string'

describe('map', () => {
  it('parses a record into a Map with typed keys and values', () => {
    const schema = map(string(), number())
    expect(schema.parse({ a: '1', b: '2' })).toEqual(new Map([['a', 1], ['b', 2]]))
  })

  it('skips entries whose key fails to parse', () => {
    const schema = map(number(), string())
    expect(schema.parse({ 1: 'a', nope: 'b' })).toEqual(new Map([[1, 'a']]))
  })

  it('skips entries whose value fails to parse', () => {
    const schema = map(string(), number())
    expect(schema.parse({ a: '1', b: 'nope' })).toEqual(new Map([['a', 1]]))
  })

  it('parses non-objects to undefined', () => {
    expect(map(string(), number()).parse('nope')).toBeUndefined()
    expect(map(string(), number()).parse([1])).toBeUndefined()
  })

  it('encodes a Map back into a record', () => {
    const schema = map(number(), string())
    expect(schema.encode(new Map([[1, 'a'], [2, 'b']]))).toEqual({ 1: 'a', 2: 'b' })
  })

  it('skips entries whose encoded key is not a record key', () => {
    const schema = map(number().nullable(), string())
    // null encodes to null, which is not a string/number record key
    expect(schema.encode(new Map([[null, 'a'], [1, 'b']]))).toEqual({ 1: 'b' })
  })

  it('encodes undefined to undefined', () => {
    expect(map(string(), number()).encode(undefined)).toBeUndefined()
  })

  it('roundtrips', () => {
    const schema = map(number(), string())
    const value = new Map([[1, 'a']])
    expect(schema.parse(schema.encode(value))).toEqual(value)
  })

  it('exposes the schema type tag', () => {
    expect(map(string(), string()).type).toBe('map')
  })
})
