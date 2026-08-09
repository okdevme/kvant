import { describe, expect, it } from 'vitest'
import { json } from './json'
import { number } from './number'
import { object } from './object'

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
})
