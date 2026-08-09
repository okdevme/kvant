import { describe, expect, it } from 'vitest'
import { _enum } from './enum'
import { number } from './number'
import { partialRecord, record } from './record'
import { string } from './string'

describe('record', () => {
  it('parses values through the value schema', () => {
    const schema = record(string(), number())
    expect(schema.parse({ a: '1', b: '2' })).toEqual({ a: 1, b: 2 })
  })

  it('parses keys through the key schema', () => {
    const schema = record(number(), string())
    expect(schema.parse({ 1: 'a', nope: 'b' })).toEqual({ 1: 'a' })
  })

  it('parses non-plain-objects to undefined', () => {
    expect(record(string(), number()).parse('nope')).toBeUndefined()
    expect(record(string(), number()).parse([1])).toBeUndefined()
    expect(record(string(), number()).parse(null)).toBeUndefined()
  })

  it('with an enum key schema, fills missing keys with undefined', () => {
    const schema = record(_enum(['a', 'b']), string())
    expect(schema.parse({ a: 'x' })).toEqual({ a: 'x', b: undefined })
  })

  it('partialRecord allows missing enum keys', () => {
    const schema = partialRecord(_enum(['a', 'b']), string())
    expect(schema.parse({ a: 'x' })).toEqual({ a: 'x' })
  })

  it('encodes values through the inner schemas', () => {
    const schema = record(string(), number())
    expect(schema.encode({ a: 1 })).toEqual({ a: 1 })
  })

  it('exposes the schema type tag', () => {
    expect(record(string(), string()).type).toBe('record')
  })
})
