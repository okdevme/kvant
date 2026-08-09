// @vitest-environment happy-dom
import type { KvantAdapterInterface } from '../../types/adapter'
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { number } from '../../schema/number'
import { string } from '../../schema/string'
import { useKvantState } from './useKvantState'
import { useKvantStates } from './useKvantStates'

function memoryAdapter(
  initial: Record<string, string | undefined> = {},
): KvantAdapterInterface<string> & { calls: { updates: Record<string, unknown>[] } } {
  let snapshot = { ...initial }
  const listeners = new Set<() => void>()
  const calls = { updates: [] as Record<string, unknown>[] }
  return {
    key: 'memory',
    calls,
    subscribe(callback) {
      listeners.add(callback)
      return () => listeners.delete(callback)
    },
    getSnapshot: () => snapshot,
    update(values) {
      calls.updates.push(values)
      snapshot = { ...snapshot, ...values } as Record<string, string | undefined>
      listeners.forEach(l => l())
    },
  }
}

describe('useKvantState', () => {
  it('returns the parsed value for a key', () => {
    const adapterInstance = memoryAdapter({ page: '2' })
    const adapter = () => adapterInstance
    const { result } = renderHook(() => useKvantState(adapter, 'page', number()))
    expect(result.current[0]).toBe(2)
  })

  it('defaults to a pass-through schema', () => {
    const adapterInstance = memoryAdapter({ q: 'hello' })
    const adapter = () => adapterInstance
    const { result } = renderHook(() => useKvantState(adapter, 'q'))
    expect(result.current[0]).toBe('hello')
  })

  it('parses missing keys through the schema', () => {
    const adapterInstance = memoryAdapter()
    const adapter = () => adapterInstance
    const { result } = renderHook(() => useKvantState(adapter, 'page', number()))
    expect(result.current[0]).toBeUndefined()
  })

  it('applies schema defaults', () => {
    const adapterInstance = memoryAdapter()
    const adapter = () => adapterInstance
    const { result } = renderHook(() => useKvantState(adapter, 'page', number().default(1)))
    expect(result.current[0]).toBe(1)
  })

  it('setState writes encoded values through the adapter', () => {
    const adapterInstance = memoryAdapter()
    const adapter = () => adapterInstance
    const { result } = renderHook(() => useKvantState(adapter, 'page', number()))
    act(() => result.current[1](3))
    expect(adapterInstance.calls.updates).toEqual([{ page: 3 }])
    expect(result.current[0]).toBe(3)
  })

  it('setState supports updater functions', () => {
    const adapterInstance = memoryAdapter({ page: '1' })
    const adapter = () => adapterInstance
    const { result } = renderHook(() => useKvantState(adapter, 'page', number()))
    act(() => result.current[1](prev => prev! + 1))
    expect(result.current[0]).toBe(2)
  })

  it('supports the key map form', () => {
    const adapterInstance = memoryAdapter({ q: 'a', page: '1' })
    const adapter = () => adapterInstance
    const { result } = renderHook(() =>
      useKvantState(adapter, { q: string(), page: number() }),
    )
    expect(result.current[0]).toEqual({ q: 'a', page: 1 })
    act(() => result.current[1](prev => ({ ...prev, page: 2 })))
    expect(result.current[0]).toEqual({ q: 'a', page: 2 })
  })
})

describe('useKvantStates', () => {
  it('returns parsed state for a key map', () => {
    const adapterInstance = memoryAdapter({ q: 'a', page: '2' })
    const adapter = () => adapterInstance
    const { result } = renderHook(() =>
      useKvantStates(adapter, { q: string(), page: number() }),
    )
    expect(result.current[0]).toEqual({ q: 'a', page: 2 })
  })

  it('setState merges partial updates', () => {
    const adapterInstance = memoryAdapter({ q: 'a' })
    const adapter = () => adapterInstance
    const { result } = renderHook(() =>
      useKvantStates(adapter, { q: string(), page: number() }),
    )
    act(() => result.current[1](prev => ({ ...prev, q: 'b' })))
    expect(adapterInstance.calls.updates[0]).toEqual({ q: 'b', page: undefined })
    expect(result.current[0]).toEqual({ q: 'b', page: undefined })
  })

  it('re-renders when the adapter snapshot changes externally', () => {
    const adapterInstance = memoryAdapter({ page: '1' })
    const adapter = () => adapterInstance
    const { result } = renderHook(() =>
      useKvantStates(adapter, { page: number() }),
    )
    expect(result.current[0].page).toBe(1)
    act(() => adapterInstance.update({ page: '5' }))
    expect(result.current[0].page).toBe(5)
  })

  it('syncs state across hooks sharing an adapter key', () => {
    // two hooks over the same underlying adapter key sync via the react bus
    const a = () => memoryAdapter({ page: '1' })
    const b = () => memoryAdapter({ page: '1' })
    const first = renderHook(() => useKvantStates(a, { page: number() }))
    const second = renderHook(() => useKvantStates(b, { page: number() }))
    act(() => first.result.current[1](prev => ({ ...prev, page: 9 })))
    expect(first.result.current[0].page).toBe(9)
    expect(second.result.current[0].page).toBe(9)
  })

  it('runs adapter effects on mount and cleans up on unmount', () => {
    const cleanup = vi.fn()
    const adapterInstance = {
      ...memoryAdapter(),
      effects: vi.fn(() => cleanup),
    }
    const adapter = () => adapterInstance
    const { unmount } = renderHook(() => useKvantStates(adapter, { page: number() }))
    expect(adapterInstance.effects).toHaveBeenCalledOnce()
    unmount()
    expect(cleanup).toHaveBeenCalledOnce()
  })
})
