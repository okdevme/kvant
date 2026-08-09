import { describe, expect, it } from 'vitest'
import { normalizeSnapshot } from './snapshot'

describe('normalizeSnapshot', () => {
  it('picks only the given keys from a record', () => {
    expect(
      normalizeSnapshot({ a: 1, b: 2, c: 3 }, ['a', 'c']),
    ).toEqual({ a: 1, c: 3 })
  })

  it('resolves values through a getter function', () => {
    const store: Record<string, string> = { a: 'x', b: 'y' }
    expect(
      normalizeSnapshot(key => store[key], ['a', 'b']),
    ).toEqual({ a: 'x', b: 'y' })
  })

  it('skips keys absent from the record', () => {
    expect(normalizeSnapshot({ a: 1 }, ['a', 'missing'])).toEqual({ a: 1 })
  })
})
