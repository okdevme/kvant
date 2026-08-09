// @vitest-environment happy-dom
import type { Ref } from 'vue'
import type { KvantAdapterInterface } from '../../types/adapter'
import { cleanup, render, screen } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { number } from '../../schema/number'
import { string } from '../../schema/string'
import { useKvantState } from './useKvantState'
import { useKvantStates } from './useKvantStates'

afterEach(cleanup)

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

function renderState(
  useState: () => Ref<unknown>,
): { unmount: () => void } {
  const Component = defineComponent({
    setup() {
      const state = useState()
      return () => h('pre', JSON.stringify(state.value))
    },
  })
  return render(Component) as any
}

describe('useKvantState (vue)', () => {
  it('returns a ref with the parsed value', async () => {
    const adapterInstance = memoryAdapter({ page: '2' })
    const adapter = () => adapterInstance
    renderState(() => useKvantState(adapter, 'page', number()))
    await nextTick()
    expect(screen.getByText('2')).toBeTruthy()
  })

  it('writes to the adapter when the ref is set', async () => {
    const adapterInstance = memoryAdapter()
    const adapter = () => adapterInstance
    renderState(() => {
      const page = useKvantState(adapter, 'page', number())
      page.value = 3
      return page
    })
    await nextTick()
    expect(adapterInstance.calls.updates[0]).toEqual({ page: 3 })
  })

  it('defaults to a pass-through schema', async () => {
    const adapterInstance = memoryAdapter({ q: 'hello' })
    const adapter = () => adapterInstance
    renderState(() => useKvantState(adapter, 'q'))
    await nextTick()
    expect(screen.getByText('"hello"')).toBeTruthy()
  })

  it('supports the key map form', async () => {
    const adapterInstance = memoryAdapter({ q: 'a', page: '1' })
    const adapter = () => adapterInstance
    renderState(() => useKvantState(adapter, { q: string(), page: number() }))
    await nextTick()
    expect(screen.getByText('{"q":"a","page":1}')).toBeTruthy()
  })
})

describe('useKvantStates (vue)', () => {
  it('updates when the adapter snapshot changes externally', async () => {
    const adapterInstance = memoryAdapter({ page: '1' })
    const adapter = () => adapterInstance
    renderState(() => useKvantStates(adapter, { page: number() }))
    await nextTick()
    expect(screen.getByText('{"page":1}')).toBeTruthy()
    adapterInstance.update({ page: '5' })
    await nextTick()
    await nextTick()
    expect(screen.getByText('{"page":5}')).toBeTruthy()
  })

  it('runs adapter effects and cleans up on unmount', async () => {
    const cleanup = vi.fn()
    const adapterInstance = {
      ...memoryAdapter(),
      effects: vi.fn(() => cleanup),
    }
    const adapter = () => adapterInstance
    const { unmount } = renderState(() => useKvantStates(adapter, { page: number() }))
    await nextTick()
    unmount()
    expect(cleanup).toHaveBeenCalledOnce()
  })
})
