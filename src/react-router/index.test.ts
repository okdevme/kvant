import { describe, expect, it, vi } from 'vitest'

// react-router hooks require a router context at runtime
vi.mock('react-router', () => ({
  useSearchParams: vi.fn(() => [new URLSearchParams()]),
  useNavigate: vi.fn(() => vi.fn()),
}))

describe('react-router API surface', () => {
  it('exposes the expected runtime exports', async () => {
    const kvant = await import('./index')
    expect(Object.keys(kvant).sort()).toEqual([
      'SearchParamsOptionsProvider',
      'useSearchParams',
      'useSearchParamsKvantAdapter',
    ].sort())
    expect(typeof kvant.useSearchParams).toBe('function')
    expect(typeof kvant.useSearchParamsKvantAdapter).toBe('function')
  })
})
