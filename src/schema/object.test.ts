import { describe, expect, it } from 'vitest'
import { number } from './number'
import { looseObject, object } from './object'
import { string } from './string'

describe('object', () => {
  it('parses each key through its schema', () => {
    const schema = object({ q: string(), page: number() })
    expect(schema.parse({ q: 'hello', page: '2' })).toEqual({ q: 'hello', page: 2 })
  })

  it('keeps keys present in input even when parsing fails', () => {
    const schema = object({ page: number() })
    expect(schema.parse({ page: 'nope' })).toEqual({ page: undefined })
  })

  it('drops absent keys that fail to parse', () => {
    const schema = object({ page: number() })
    expect(schema.parse({})).toEqual({})
  })

  it('drops unknown keys by default', () => {
    const schema = object({ q: string() })
    expect(schema.parse({ q: 'a', extra: 'b' })).toEqual({ q: 'a' })
  })

  it('parses non-objects to undefined', () => {
    expect(object({ q: string() }).parse('nope')).toBeUndefined()
    expect(object({ q: string() }).parse([1])).toBeUndefined()
    expect(object({ q: string() }).parse(null)).toBeUndefined()
  })

  it('encodes through the inner schemas', () => {
    const schema = object({ page: number() })
    expect(schema.encode({ page: 3 })).toEqual({ page: 3 })
  })

  it('catchall parses unknown keys through a schema', () => {
    const schema = object({ q: string() }).catchall(number())
    expect(schema.parse({ q: 'a', other: '2' })).toEqual({ q: 'a', other: 2 })
  })

  it('looseObject keeps unknown keys as-is', () => {
    const schema = looseObject({ q: string() })
    expect(schema.parse({ q: 'a', other: 'kept' })).toEqual({ q: 'a', other: 'kept' })
  })

  it('keyof returns an enum of shape keys', () => {
    const schema = object({ q: string(), page: number() }).keyof()
    expect(schema.parse('q')).toBe('q')
    expect(schema.parse('nope')).toBeUndefined()
  })

  it('extend adds and overrides keys', () => {
    const base = object({ q: string() })
    const extended = base.extend({ page: number() })
    expect(extended.parse({ q: 'a', page: '1' })).toEqual({ q: 'a', page: 1 })
    expect(extended.shape).toHaveProperty('page')
  })

  it('safeExtend overrides keys with compatible schemas', () => {
    const base = object({ page: number() })
    const extended = base.safeExtend({ page: number().default(1) })
    expect(extended.parse({})).toEqual({ page: 1 })
  })

  it('pick keeps only masked keys', () => {
    const schema = object({ q: string(), page: number() }).pick({ q: true })
    expect(schema.shape).not.toHaveProperty('page')
    expect(schema.parse({ q: 'a', page: '1' })).toEqual({ q: 'a' })
  })

  it('omit removes masked keys', () => {
    const schema = object({ q: string(), page: number() }).omit({ page: true })
    expect(schema.shape).not.toHaveProperty('page')
  })

  it('pick/omit throw on unrecognized keys', () => {
    const schema = object({ q: string() })
    expect(() => schema.pick({ nope: true } as any)).toThrow('Unrecognized key')
    expect(() => schema.omit({ nope: true } as any)).toThrow('Unrecognized key')
  })

  it('partial makes all keys optional', () => {
    const schema = object({
      q: string().default('x'),
      page: number(),
    }).partial()
    expect(schema.parse({})).toEqual({ q: undefined })
  })

  it('partial with a mask only affects masked keys', () => {
    const schema = object({
      q: string().default('x'),
      page: number(),
    }).partial({ q: true })
    expect(schema.parse({ page: 1 })).toEqual({ page: 1 })
    expect(schema.parse({})).toEqual({ q: undefined, page: undefined })
  })

  it('exposes the schema type tag', () => {
    expect(object({}).type).toBe('object')
  })
})
