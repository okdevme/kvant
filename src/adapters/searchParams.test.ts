import { describe, expect, it, vi } from 'vitest'
import { parseSearch, stringifySearch } from '../utils/search'
import { useSearchParamsKvantAdapter } from './searchParams'

function makeAdapter(keys: string[], options: Record<string, unknown> = {}) {
  return useSearchParamsKvantAdapter(keys, {
    parseSearch,
    stringifySearch,
    ...options,
  })
}

describe('useSearchParamsKvantAdapter', () => {
  it('exposes a stable adapter key', () => {
    expect(makeAdapter(['a']).key).toBe('search-params')
  })

  it('reads initial values from location.search', () => {
    window.history.replaceState(null, '', '/?a=1&b=2')
    const adapter = makeAdapter(['a'])
    expect(adapter.getSnapshot()).toEqual({ a: '1' })
    window.history.replaceState(null, '', '/')
  })

  it('update writes to the URL via history.replaceState by default', () => {
    window.history.replaceState(null, '', '/')
    const pushSpy = vi.spyOn(window.history, 'pushState')
    const adapter = makeAdapter(['a'])
    adapter.update({ a: 'x' })
    expect(window.location.search).toBe('?a=x')
    expect(pushSpy).not.toHaveBeenCalled()
    pushSpy.mockRestore()
    window.history.replaceState(null, '', '/')
  })

  it('supports push history mode', () => {
    window.history.replaceState(null, '', '/')
    const replaceSpy = vi.spyOn(window.history, 'replaceState')
    const adapter = makeAdapter(['a'], { history: 'push' })
    adapter.update({ a: 'x' })
    expect(replaceSpy).not.toHaveBeenCalled()
    expect(window.location.search).toBe('?a=x')
    replaceSpy.mockRestore()
    window.history.replaceState(null, '', '/')
  })

  it('update merges with existing params', () => {
    window.history.replaceState(null, '', '/?other=keep')
    const adapter = makeAdapter(['a'])
    adapter.update({ a: 'x' })
    expect(window.location.search).toContain('other=keep')
    expect(window.location.search).toContain('a=x')
    window.history.replaceState(null, '', '/')
  })

  it('notifies subscribers on update once effects are active', () => {
    window.history.replaceState(null, '', '/')
    const adapter = makeAdapter(['a'])
    const cleanup = adapter.effects?.()
    const listener = vi.fn()
    adapter.subscribe(listener)
    adapter.update({ a: 'x' })
    expect(listener).toHaveBeenCalled()
    expect(adapter.getSnapshot()).toEqual({ a: 'x' })
    cleanup?.()
    window.history.replaceState(null, '', '/')
  })

  it('reacts to popstate once effects are active', () => {
    window.history.replaceState(null, '', '/?a=before')
    const adapter = makeAdapter(['a'])
    const cleanup = adapter.effects?.()
    const listener = vi.fn()
    adapter.subscribe(listener)

    window.history.replaceState(null, '', '/?a=after')
    window.dispatchEvent(new PopStateEvent('popstate'))
    expect(listener).toHaveBeenCalled()
    expect(adapter.getSnapshot()).toEqual({ a: 'after' })
    cleanup?.()
    window.history.replaceState(null, '', '/')
  })

  it('scrolls to the top when scroll is enabled', () => {
    window.history.replaceState(null, '', '/')
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const adapter = makeAdapter(['a'], { scroll: true })
    adapter.update({ a: 'x' })
    expect(scrollSpy).toHaveBeenCalledWith(0, 0)
    scrollSpy.mockRestore()
    window.history.replaceState(null, '', '/')
  })
})
