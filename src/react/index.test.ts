import { describe, expect, it } from 'vitest'
import * as kvant from './index'

describe('react API surface', () => {
  it('exposes the expected runtime exports', () => {
    expect(Object.keys(kvant).sort()).toEqual([
      'CookiesOptionsProvider',
      'LocalStorageOptionsProvider',
      'SearchParamsOptionsProvider',
      'SessionStorageOptionsProvider',
      'defineKvantState',
      'useCookies',
      'useKvantState',
      'useKvantStates',
      'useLocalStorage',
      'useSearchParams',
      'useSessionStorage',
    ].sort())
  })

  it('hooks are functions', () => {
    expect(typeof kvant.useKvantState).toBe('function')
    expect(typeof kvant.useKvantStates).toBe('function')
    expect(typeof kvant.defineKvantState).toBe('function')
    expect(typeof kvant.useCookies).toBe('function')
    expect(typeof kvant.useSearchParams).toBe('function')
    expect(typeof kvant.useLocalStorage).toBe('function')
    expect(typeof kvant.useSessionStorage).toBe('function')
  })
})
