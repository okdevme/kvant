import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCookiesKvantAdapter } from './cookies'

function clearCookies() {
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0]?.trim()
    if (name)
      document.cookie = `${name}=; Max-Age=0`
  }
}

describe('useCookiesKvantAdapter', () => {
  beforeEach(clearCookies)
  afterEach(clearCookies)

  it('exposes a stable adapter key', () => {
    expect(useCookiesKvantAdapter(['a'], {}).key).toBe('cookies')
  })

  it('reads initial values from document.cookie', () => {
    document.cookie = 'a=hello'
    document.cookie = 'b=ignored'
    const adapter = useCookiesKvantAdapter(['a'], {})
    expect(adapter.getSnapshot()).toEqual({ a: 'hello' })
  })

  it('decodes percent-encoded cookie values', () => {
    document.cookie = 'a=hello%20world'
    const adapter = useCookiesKvantAdapter(['a'], {})
    expect(adapter.getSnapshot()).toEqual({ a: 'hello world' })
  })

  it('update writes cookies and encodes values', () => {
    const adapter = useCookiesKvantAdapter(['a'], {})
    adapter.update({ a: 'x y' })
    expect(document.cookie).toContain('a=x%20y')
  })

  it('update with undefined expires the cookie immediately', () => {
    document.cookie = 'a=x'
    const adapter = useCookiesKvantAdapter(['a'], {})
    const spy = vi.spyOn(document, 'cookie', 'set')
    adapter.update({ a: undefined })
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Max-Age=0'))
    spy.mockRestore()
  })

  it('update passes through cookie options', () => {
    const adapter = useCookiesKvantAdapter(['a'], { path: '/custom', sameSite: 'strict' })
    const spy = vi.spyOn(document, 'cookie', 'set')
    adapter.update({ a: 'x' })
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Path=/custom'))
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('SameSite=Strict'))
    spy.mockRestore()
  })

  it('notifies subscribers on own updates once effects are active', () => {
    const adapter = useCookiesKvantAdapter(['a'], {})
    const cleanup = adapter.effects?.()
    const listener = vi.fn()
    adapter.subscribe(listener)
    adapter.update({ a: 'x' })
    expect(listener).toHaveBeenCalled()
    expect(adapter.getSnapshot()).toEqual({ a: 'x' })
    cleanup?.()
  })

  it('syncs updates across adapter instances', () => {
    const a = useCookiesKvantAdapter(['k'], {})
    const b = useCookiesKvantAdapter(['k'], {})
    const cleanupB = b.effects?.()
    const listener = vi.fn()
    b.subscribe(listener)
    a.update({ k: 'synced' })
    expect(listener).toHaveBeenCalled()
    expect(b.getSnapshot()).toEqual({ k: 'synced' })
    cleanupB?.()
  })

  it('cleanup stops notifications', () => {
    const adapter = useCookiesKvantAdapter(['a'], {})
    const cleanup = adapter.effects?.()
    const listener = vi.fn()
    adapter.subscribe(listener)
    cleanup?.()
    adapter.update({ a: 'x' })
    expect(listener).not.toHaveBeenCalled()
  })
})
