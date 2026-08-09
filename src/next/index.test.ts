import { describe, expect, it, vi } from 'vitest'

// next/navigation is only importable inside a Next.js app
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}))

describe('next API surface', () => {
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
