import { describe, expect, it, vi } from 'vitest'
import { safeEncode } from '../utils/schema'
import { json } from './json'
import { number } from './number'
import { object } from './object'
import { string } from './string'

describe('json', () => {
  it('parses JSON strings through the inner schema', () => {
    const schema = json(object({ count: number() }))
    expect(schema.parse('{"count":"3"}')).toEqual({ count: 3 })
  })

  it('parses invalid JSON to undefined', () => {
    expect(json(number()).parse('{broken')).toBeUndefined()
  })

  it('parses non-strings to undefined', () => {
    expect(json(number()).parse(42)).toBeUndefined()
  })

  it('parses undefined to undefined', () => {
    expect(json(number()).parse(undefined)).toBeUndefined()
  })

  it('encodes through the inner schema', () => {
    const schema = json(object({ count: number() }))
    expect(schema.encode({ count: 3 })).toBe('{"count":3}')
  })

  it('supports reviver/replacer/space', () => {
    const schema = json(object({ count: number() }), { space: 2 })
    expect(schema.encode({ count: 3 })).toBe('{\n  "count": 3\n}')
  })

  it('roundtrips', () => {
    const schema = json(object({ count: number() }))
    expect(schema.parse(schema.encode({ count: 7 }))).toEqual({ count: 7 })
  })

  it('exposes the schema type tag', () => {
    expect(json(number()).type).toBe('json')
  })

  it('parses malformed JSON to undefined', () => {
    const schema = json(object({ q: string() }))
    expect(schema.parse('{')).toBeUndefined()
    expect(schema.parse('"unterminated')).toBeUndefined()
    expect(schema.parse('')).toBeUndefined()
  })

  it('parse rejects non-string raw values', () => {
    const schema = json(object({ q: string() }))
    expect(schema.parse(undefined)).toBeUndefined()
    expect(schema.parse(42)).toBeUndefined()
    expect(schema.parse({})).toBeUndefined()
  })

  it('parse smart-casts member values via the inner schema', () => {
    // kvant/schema is intentionally loose: string() casts numbers to strings.
    const schema = json(object({ q: string() }))
    expect(schema.parse('{"q":1}')).toEqual({ q: '1' })
  })

  it('roundtrips valid values', () => {
    const schema = json(object({ q: string(), page: number() }))
    const value = { q: 'a', page: 2 }
    expect(schema.parse(schema.encode(value))).toEqual(value)
  })

  it('encode strips unknown keys, defusing circular structures', () => {
    // object({}) encode drops all keys, so the circular ref never reaches JSON.stringify.
    const schema = json(object({}))
    const circular: Record<string, unknown> = {}
    circular.self = circular
    expect(safeEncode(schema, circular)).toBe('{}')
  })

  it('encode throws on circular values — caught by safeEncode', () => {
    // transform passes the value through untouched, so the circular ref reaches JSON.stringify.
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const passthrough = json(string().transform(v => v))
    const circular: Record<string, unknown> = {}
    circular.self = circular
    expect(safeEncode(passthrough, circular as any)).toBeUndefined()
    expect(error).toHaveBeenCalled()
    error.mockRestore()
  })
})
