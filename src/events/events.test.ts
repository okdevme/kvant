import { describe, expect, it, vi } from 'vitest'
import { createEventHook, useEventBus } from './external'

describe('useEventBus', () => {
  it('delivers events to listeners on the same key', () => {
    const bus = useEventBus<string>(`test:${Math.random()}`)
    const listener = vi.fn()
    bus.on(listener)
    bus.emit('hello', 'payload')
    expect(listener).toHaveBeenCalledWith('hello', 'payload')
  })

  it('shares listeners across instances with the same key', () => {
    const key = `test:${Math.random()}`
    const a = useEventBus<string>(key)
    const b = useEventBus<string>(key)
    const listener = vi.fn()
    a.on(listener)
    b.emit('x')
    expect(listener).toHaveBeenCalledWith('x', undefined)
  })

  it('does not leak across keys', () => {
    const a = useEventBus<string>(`test:${Math.random()}`)
    const b = useEventBus<string>(`test:${Math.random()}`)
    const listener = vi.fn()
    a.on(listener)
    b.emit('x')
    expect(listener).not.toHaveBeenCalled()
  })

  it('off removes a single listener', () => {
    const bus = useEventBus<string>(`test:${Math.random()}`)
    const listener = vi.fn()
    bus.on(listener)
    bus.off(listener)
    bus.emit('x')
    expect(listener).not.toHaveBeenCalled()
  })

  it('on returns an unsubscribe function', () => {
    const bus = useEventBus<string>(`test:${Math.random()}`)
    const listener = vi.fn()
    const off = bus.on(listener)
    off()
    bus.emit('x')
    expect(listener).not.toHaveBeenCalled()
  })

  it('once fires only once', () => {
    const bus = useEventBus<string>(`test:${Math.random()}`)
    const listener = vi.fn()
    bus.once(listener)
    bus.emit('a')
    bus.emit('b')
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('reset clears all listeners', () => {
    const bus = useEventBus<string>(`test:${Math.random()}`)
    const listener = vi.fn()
    bus.on(listener)
    bus.reset()
    bus.emit('x')
    expect(listener).not.toHaveBeenCalled()
  })
})

describe('createEventHook', () => {
  it('triggers registered listeners with arguments', async () => {
    const hook = createEventHook<string>()
    const listener = vi.fn()
    hook.on(listener)
    await hook.trigger('a', 'extra')
    expect(listener).toHaveBeenCalledWith('a', 'extra')
  })

  it('on returns an unsubscribe function', async () => {
    const hook = createEventHook<void>()
    const listener = vi.fn()
    const off = hook.on(listener)
    off()
    await hook.trigger()
    expect(listener).not.toHaveBeenCalled()
  })

  it('off removes a listener', async () => {
    const hook = createEventHook<void>()
    const listener = vi.fn()
    hook.on(listener)
    hook.off(listener)
    await hook.trigger()
    expect(listener).not.toHaveBeenCalled()
  })

  it('clear removes all listeners', async () => {
    const hook = createEventHook<void>()
    const listener = vi.fn()
    hook.on(listener)
    hook.clear()
    await hook.trigger()
    expect(listener).not.toHaveBeenCalled()
  })

  it('trigger resolves with listener results', async () => {
    const hook = createEventHook<number>()
    hook.on(v => v * 2)
    hook.on(async v => v * 3)
    expect(await hook.trigger(2)).toEqual([4, 6])
  })
})
