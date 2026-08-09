// @vitest-environment happy-dom
import type { KvantAdapterInterface } from '../../types/adapter'
import { cleanup, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { number } from '../../schema/number'
import { defineKvantState } from './defineKvantState'

afterEach(cleanup)

function memoryAdapter(): KvantAdapterInterface<string> {
  let snapshot: Record<string, string | undefined> = {}
  const listeners = new Set<() => void>()
  return {
    key: 'memory',
    subscribe(callback) {
      listeners.add(callback)
      return () => listeners.delete(callback)
    },
    getSnapshot: () => snapshot,
    update(values) {
      snapshot = { ...snapshot, ...values } as Record<string, string | undefined>
      listeners.forEach(l => l())
    },
  }
}

function mount(setup: () => () => unknown) {
  return render(defineComponent({ setup }))
}

describe('defineKvantState (vue)', () => {
  it('returns a useState composable bound to the adapter', async () => {
    const { useState } = defineKvantState(() => memoryAdapter())
    mount(() => {
      const page = useState('page', number())
      return () => h('pre', JSON.stringify(page.value))
    })
    await nextTick()
    expect(document.body.textContent).toBe('')
  })

  it('passes defaultOptions to the adapter factory', async () => {
    const factory = vi.fn(() => memoryAdapter())
    const { useState } = defineKvantState(factory, { customOption: 'default' })
    mount(() => {
      useState('page', number())
      return () => h('div')
    })
    await nextTick()
    expect(factory).toHaveBeenCalledWith(['page'], expect.objectContaining({ customOption: 'default' }))
  })

  it('provideOptions overrides options for the subtree', async () => {
    const factory = vi.fn(() => memoryAdapter())
    const { useState, provideOptions } = defineKvantState(factory, { opt: 'default' })
    const Child = defineComponent({
      setup() {
        useState('page', number())
        return () => h('div')
      },
    })
    mount(() => {
      provideOptions({ opt: 'provided' })
      return () => h(Child)
    })
    await nextTick()
    expect(factory).toHaveBeenCalledWith(['page'], expect.objectContaining({ opt: 'provided' }))
  })

  it('per-call options win over provided options', async () => {
    const factory = vi.fn(() => memoryAdapter())
    const { useState, provideOptions } = defineKvantState(factory, { opt: 'default' })
    const Child = defineComponent({
      setup() {
        useState('page', number(), { opt: 'call' } as any)
        return () => h('div')
      },
    })
    mount(() => {
      provideOptions({ opt: 'provided' })
      return () => h(Child)
    })
    await nextTick()
    expect(factory).toHaveBeenCalledWith(['page'], expect.objectContaining({ opt: 'call' }))
  })

  it('nested provideOptions extends parent options by default', async () => {
    const factory = vi.fn(() => memoryAdapter())
    const { useState, provideOptions } = defineKvantState(factory)
    const GrandChild = defineComponent({
      setup() {
        useState('page', number())
        return () => h('div')
      },
    })
    const Child = defineComponent({
      setup() {
        provideOptions({ b: 2 })
        return () => h(GrandChild)
      },
    })
    mount(() => {
      provideOptions({ a: 1 })
      return () => h(Child)
    })
    await nextTick()
    expect(factory).toHaveBeenCalledWith(['page'], expect.objectContaining({ a: 1, b: 2 }))
  })

  it('nested provideOptions with extend: false replaces parent options', async () => {
    const factory = vi.fn(() => memoryAdapter())
    const { useState, provideOptions } = defineKvantState(factory)
    const GrandChild = defineComponent({
      setup() {
        useState('page', number())
        return () => h('div')
      },
    })
    const Child = defineComponent({
      setup() {
        provideOptions({ b: 2 }, { extend: false })
        return () => h(GrandChild)
      },
    })
    mount(() => {
      provideOptions({ a: 1 })
      return () => h(Child)
    })
    await nextTick()
    expect(factory).toHaveBeenCalledWith(['page'], { b: 2 })
  })
})
