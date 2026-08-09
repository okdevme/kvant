import { describe, expect, it, vi } from 'vitest'

// vue-router composables require an installed router at runtime
vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(),
}))

describe('vue-router API surface', () => {
  it('exposes the expected runtime exports', async () => {
    const kvant = await import('./index')
    expect(Object.keys(kvant).sort()).toEqual([
      'provideRouteParamsOptions',
      'provideRouteQueryOptions',
      'useRouteParams',
      'useRouteParamsKvantAdapter',
      'useRouteQuery',
      'useRouteQueryKvantAdapter',
    ].sort())
    expect(typeof kvant.useRouteParams).toBe('function')
    expect(typeof kvant.useRouteQuery).toBe('function')
    expect(typeof kvant.useRouteParamsKvantAdapter).toBe('function')
    expect(typeof kvant.useRouteQueryKvantAdapter).toBe('function')
  })
})
