import { describe, expect, it, vi } from 'vitest'
import { number } from '../schema/number'
import { string } from '../schema/string'
import { parseMap, syncMap } from './map'

describe('parseMap', () => {
  it('parses each key through its schema', () => {
    const state = parseMap(
      { q: string(), page: number() },
      { q: 'hello', page: '2' },
    )
    expect(state).toEqual({ q: 'hello', page: 2 })
  })

  it('parses missing keys to the schema fallback', () => {
    const state = parseMap(
      { q: string(), page: number() },
      { q: 'hello' },
    )
    expect(state).toEqual({ q: 'hello', page: undefined })
  })

  it('reuses cached state for unchanged snapshot values', () => {
    const keyMap = { q: string(), page: number() }
    // cache.state is populated externally by callers with the last parsed state
    const cache = { snapshot: {}, state: {} }
    const first = parseMap(keyMap, { q: 'a', page: '1' }, cache)
    cache.state = first
    const second = parseMap(keyMap, { q: 'a', page: '1' }, cache)
    expect(second).toBe(first)
  })

  it('re-parses only changed keys', () => {
    const keyMap = { q: string(), page: number() }
    const cache = { snapshot: {}, state: {} }
    const first = parseMap(keyMap, { q: 'a', page: '1' }, cache)
    cache.state = first
    const second = parseMap(keyMap, { q: 'a', page: '2' }, cache)
    expect(second).not.toBe(first)
    expect(second.q).toBe(first.q)
    expect(second.page).toBe(2)
  })

  it('catches thrown parse errors and yields undefined', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const state = parseMap(
      {
        boom: {
          parse: () => {
            throw new Error('boom')
          },
          encode: v => v,
        },
      },
      { boom: 'x' },
    )
    expect(state).toEqual({ boom: undefined })
    error.mockRestore()
  })
})

describe('syncMap', () => {
  it('applies updates for known keys', () => {
    const state = syncMap(
      { q: string(), page: number() },
      { q: 'a', page: 1 },
      [{ key: 'page', value: '2' }],
    )
    expect(state).toEqual({ q: 'a', page: 2 })
  })

  it('ignores updates for unknown keys', () => {
    const state = syncMap(
      { q: string() },
      { q: 'a' },
      [{ key: 'nope', value: 'x' }],
    )
    expect(state).toEqual({ q: 'a' })
  })

  it('returns the same state reference when nothing changed', () => {
    const initial = { q: 'a' }
    const state = syncMap(
      { q: string() },
      initial,
      [{ key: 'q', value: 'a' }],
    )
    expect(state).toBe(initial)
  })

  it('reuses the pre-parsed state when the update schema matches', () => {
    const keyMap = { page: number() }
    const state = syncMap(
      keyMap,
      { page: 1 },
      [{ key: 'page', value: '2', schema: keyMap.page, state: 2 }],
    )
    expect(state.page).toBe(2)
  })

  it('re-parses the value when the update schema differs', () => {
    const keyMap = { page: number() }
    const state = syncMap(
      keyMap,
      { page: 1 },
      [{ key: 'page', value: '5', schema: string(), state: '5' }],
    )
    expect(state.page).toBe(5)
  })
})
