import { describe, expect, it, vi } from 'vitest'

// next/router is only importable inside a Next.js app
vi.mock('next/router', () => ({
  useRouter: vi.fn(),
}))

describe('next/pages API surface', () => {
  it('exposes the expected runtime exports', async () => {
    const kvant = await import('./index')
    expect(Object.keys(kvant).sort()).toEqual([
      'RouterQueryOptionsProvider',
      'useRouterQuery',
      'useRouterQueryKvantAdapter',
    ].sort())
    expect(typeof kvant.useRouterQuery).toBe('function')
    expect(typeof kvant.useRouterQueryKvantAdapter).toBe('function')
  })
})
