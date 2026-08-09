import { describe, expect, it } from 'vitest'
import * as kvant from './index'

describe('vue API surface', () => {
  it('exposes the expected runtime exports', () => {
    expect(Object.keys(kvant).sort()).toEqual([
      'defineKvantState',
      'provideCookiesOptions',
      'provideLocalStorageOptions',
      'provideSearchParamsOptions',
      'provideSessionStorageOptions',
      'useCookies',
      'useKvantState',
      'useKvantStates',
      'useLocalStorage',
      'useSearchParams',
      'useSessionStorage',
    ].sort())
  })

  it('composables are functions', () => {
    expect(typeof kvant.useKvantState).toBe('function')
    expect(typeof kvant.useKvantStates).toBe('function')
    expect(typeof kvant.defineKvantState).toBe('function')
    expect(typeof kvant.useCookies).toBe('function')
    expect(typeof kvant.useSearchParams).toBe('function')
    expect(typeof kvant.useLocalStorage).toBe('function')
    expect(typeof kvant.useSessionStorage).toBe('function')
    expect(typeof kvant.provideCookiesOptions).toBe('function')
    expect(typeof kvant.provideSearchParamsOptions).toBe('function')
    expect(typeof kvant.provideLocalStorageOptions).toBe('function')
    expect(typeof kvant.provideSessionStorageOptions).toBe('function')
  })
})
