import { describe, expect, it } from 'vitest'
import * as kvant from './index'

describe('public API surface', () => {
  it('exposes the expected runtime exports', () => {
    expect(Object.keys(kvant).sort()).toEqual([
      'createEventHook',
      'normalizeSnapshot',
      'parseSearch',
      'stringifySearch',
      'useCookiesKvantAdapter',
      'useEventBus',
      'useLocalStorageKvantAdapter',
      'useSearchParamsKvantAdapter',
      'useSessionStorageKvantAdapter',
      'useStorageKvantAdapter',
      'withSearch',
    ].sort())
  })

  it('adapter factories are functions', () => {
    expect(typeof kvant.useCookiesKvantAdapter).toBe('function')
    expect(typeof kvant.useSearchParamsKvantAdapter).toBe('function')
    expect(typeof kvant.useLocalStorageKvantAdapter).toBe('function')
    expect(typeof kvant.useSessionStorageKvantAdapter).toBe('function')
    expect(typeof kvant.useStorageKvantAdapter).toBe('function')
  })

  it('event bus is a function', () => {
    expect(typeof kvant.useEventBus).toBe('function')
  })
})
