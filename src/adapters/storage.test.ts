import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLocalStorageKvantAdapter, useSessionStorageKvantAdapter } from './storage'

describe('useLocalStorageKvantAdapter', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  afterEach(() => {
    localStorage.clear()
  })

  it('exposes a stable adapter key', () => {
    const adapter = useLocalStorageKvantAdapter(['a'], {})
    expect(adapter.key).toBe('storage:local')
  })

  it('reads initial values from storage', () => {
    localStorage.setItem('a', 'hello')
    localStorage.setItem('b', 'ignored')
    const adapter = useLocalStorageKvantAdapter(['a'], {})
    expect(adapter.getSnapshot()).toEqual({ a: 'hello' })
  })

  it('update writes values and undefined removes keys', () => {
    const adapter = useLocalStorageKvantAdapter(['a', 'b'], {})
    adapter.update({ a: 'x' })
    expect(localStorage.getItem('a')).toBe('x')

    adapter.update({ a: undefined })
    expect(localStorage.getItem('a')).toBeNull()
  })

  it('update serializes non-string values', () => {
    const adapter = useLocalStorageKvantAdapter(['n'], {})
    adapter.update({ n: 42 })
    expect(localStorage.getItem('n')).toBe('42')
  })

  it('notifies subscribers on own updates once effects are active', () => {
    const adapter = useLocalStorageKvantAdapter(['a'], {})
    const cleanup = adapter.effects?.()
    const listener = vi.fn()
    adapter.subscribe(listener)
    adapter.update({ a: 'x' })
    expect(listener).toHaveBeenCalled()
    expect(adapter.getSnapshot()).toEqual({ a: 'x' })
    cleanup?.()
  })

  it('syncs updates across adapter instances of the same storage', () => {
    const a = useLocalStorageKvantAdapter(['k'], {})
    const b = useLocalStorageKvantAdapter(['k'], {})
    const cleanupB = b.effects?.()
    const listener = vi.fn()
    b.subscribe(listener)
    a.update({ k: 'synced' })
    expect(listener).toHaveBeenCalled()
    expect(b.getSnapshot()).toEqual({ k: 'synced' })
    cleanupB?.()
  })

  it('does not notify when the value is unchanged', () => {
    localStorage.setItem('a', 'x')
    const adapter = useLocalStorageKvantAdapter(['a'], {})
    const cleanup = adapter.effects?.()
    const listener = vi.fn()
    adapter.subscribe(listener)
    adapter.update({ a: 'x' })
    expect(listener).not.toHaveBeenCalled()
    cleanup?.()
  })

  it('reacts to storage events from other contexts', () => {
    const adapter = useLocalStorageKvantAdapter(['a'], {})
    const cleanup = adapter.effects?.()
    const listener = vi.fn()
    adapter.subscribe(listener)

    window.dispatchEvent(new StorageEvent('storage', {
      key: 'a',
      newValue: 'external',
      storageArea: localStorage,
    }))
    expect(listener).toHaveBeenCalled()
    expect(adapter.getSnapshot()).toEqual({ a: 'external' })
    cleanup?.()
  })

  it('ignores storage events for other storage areas', () => {
    const adapter = useLocalStorageKvantAdapter(['a'], {})
    const cleanup = adapter.effects?.()
    const listener = vi.fn()
    adapter.subscribe(listener)
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'a',
      newValue: 'nope',
      storageArea: sessionStorage,
    }))
    expect(listener).not.toHaveBeenCalled()
    cleanup?.()
  })

  it('clears all keys on a null-key storage event (clear())', () => {
    localStorage.setItem('a', 'x')
    const adapter = useLocalStorageKvantAdapter(['a'], {})
    const cleanup = adapter.effects?.()
    window.dispatchEvent(new StorageEvent('storage', {
      key: null,
      storageArea: localStorage,
    }))
    expect(adapter.getSnapshot()).toEqual({ a: undefined })
    cleanup?.()
  })

  it('cleanup stops notifications', () => {
    const adapter = useLocalStorageKvantAdapter(['a'], {})
    const cleanup = adapter.effects?.()
    const listener = vi.fn()
    adapter.subscribe(listener)
    cleanup?.()
    adapter.update({ a: 'x' })
    expect(listener).not.toHaveBeenCalled()
  })

  it('getServerSnapshot defaults to empty values', () => {
    localStorage.setItem('a', 'client')
    const adapter = useLocalStorageKvantAdapter(['a'], {})
    expect(adapter.getServerSnapshot?.()).toEqual({ a: undefined })
  })

  it('getServerSnapshot derives from the fallback, not from client storage', () => {
    localStorage.setItem('a', 'client')
    const adapter = useLocalStorageKvantAdapter(['a'], { fallback: { a: 'server' } })
    expect(adapter.getServerSnapshot?.()).toEqual({ a: 'server' })
    expect(adapter.getSnapshot()).toEqual({ a: 'client' })
  })

  it('getServerSnapshot stays stable across client updates', () => {
    const adapter = useLocalStorageKvantAdapter(['a'], { fallback: { a: 'server' } })
    const cleanup = adapter.effects?.()
    adapter.update({ a: 'client-write' })
    expect(adapter.getServerSnapshot?.()).toEqual({ a: 'server' })
    expect(adapter.getSnapshot()).toEqual({ a: 'client-write' })
    cleanup?.()
  })

  it('session storage adapter uses sessionStorage', () => {
    sessionStorage.clear()
    const adapter = useSessionStorageKvantAdapter(['a'], {})
    adapter.update({ a: 'x' })
    expect(sessionStorage.getItem('a')).toBe('x')
    expect(localStorage.getItem('a')).toBeNull()
    expect(adapter.key).toBe('storage:session')
  })
})
