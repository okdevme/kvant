import { describe, expect, it, vi } from 'vitest'

// nuxt/app composables require the Nuxt runtime at runtime
vi.mock('nuxt/app', () => ({
  useCookie: vi.fn(),
  useRoute: vi.fn(),
  navigateTo: vi.fn(),
}))

describe('nuxt API surface', () => {
  it('exposes the expected runtime exports', async () => {
    const kvant = await import('./index')
    expect(Object.keys(kvant).sort()).toEqual([
      'provideCookiesOptions',
      'provideRouteParamsOptions',
      'provideRouteQueryOptions',
      'useCookies',
      'useCookiesKvantAdapter',
      'useRouteParams',
      'useRouteParamsKvantAdapter',
      'useRouteQuery',
      'useRouteQueryKvantAdapter',
    ].sort())
    expect(typeof kvant.useCookies).toBe('function')
    expect(typeof kvant.useRouteParams).toBe('function')
    expect(typeof kvant.useRouteQuery).toBe('function')
    expect(typeof kvant.useCookiesKvantAdapter).toBe('function')
    expect(typeof kvant.useRouteParamsKvantAdapter).toBe('function')
    expect(typeof kvant.useRouteQueryKvantAdapter).toBe('function')
  })
})
