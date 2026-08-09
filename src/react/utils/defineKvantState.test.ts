import type { ReactNode } from 'react'
// @vitest-environment happy-dom
import type { KvantAdapterInterface } from '../../types/adapter'
import { act, renderHook } from '@testing-library/react'
import { createElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { number } from '../../schema/number'
import { defineKvantState } from './defineKvantState'

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

describe('defineKvantState (react)', () => {
  it('returns a useState hook bound to the adapter', () => {
    const { useState } = defineKvantState(() => memoryAdapter())
    const { result } = renderHook(() => useState('page', number()))
    expect(result.current[0]).toBeUndefined()
    act(() => result.current[1](2))
    expect(result.current[0]).toBe(2)
  })

  it('passes defaultOptions to the adapter factory', () => {
    const factory = vi.fn(() => memoryAdapter())
    const { useState } = defineKvantState(factory, { customOption: 'default' })
    renderHook(() => useState('page', number()))
    expect(factory).toHaveBeenCalledWith(['page'], expect.objectContaining({ customOption: 'default' }))
  })

  it('per-call options override default options', () => {
    const factory = vi.fn(() => memoryAdapter())
    const { useState } = defineKvantState(factory, { opt: 'default' })
    renderHook(() => useState('page', number(), { opt: 'call' } as any))
    expect(factory).toHaveBeenCalledWith(['page'], expect.objectContaining({ opt: 'call' }))
  })

  it('optionsProvider overrides options for its subtree', () => {
    const factory = vi.fn(() => memoryAdapter())
    const { useState, OptionsProvider } = defineKvantState(factory, { opt: 'default' })
    const wrapper = ({ children }: { children?: ReactNode }) =>
      createElement(OptionsProvider, { defaultOptions: { opt: 'provider' } }, children)
    renderHook(() => useState('page', number()), { wrapper })
    expect(factory).toHaveBeenCalledWith(['page'], expect.objectContaining({ opt: 'provider' }))
  })

  it('per-call options win over provider options', () => {
    const factory = vi.fn(() => memoryAdapter())
    const { useState, OptionsProvider } = defineKvantState(factory, { opt: 'default' })
    const wrapper = ({ children }: { children?: ReactNode }) =>
      createElement(OptionsProvider, { defaultOptions: { opt: 'provider' } }, children)
    renderHook(() => useState('page', number(), { opt: 'call' } as any), { wrapper })
    expect(factory).toHaveBeenCalledWith(['page'], expect.objectContaining({ opt: 'call' }))
  })

  it('nested providers extend parent options by default', () => {
    const factory = vi.fn(() => memoryAdapter())
    const { useState, OptionsProvider } = defineKvantState(factory)
    const wrapper = ({ children }: { children?: ReactNode }) =>
      createElement(OptionsProvider, { defaultOptions: { a: 1 } }, createElement(OptionsProvider, { defaultOptions: { b: 2 } }, children))
    renderHook(() => useState('page', number()), { wrapper })
    expect(factory).toHaveBeenCalledWith(['page'], expect.objectContaining({ a: 1, b: 2 }))
  })

  it('nested providers with extend: false replace parent options', () => {
    const factory = vi.fn(() => memoryAdapter())
    const { useState, OptionsProvider } = defineKvantState(factory)
    const wrapper = ({ children }: { children?: ReactNode }) =>
      createElement(OptionsProvider, { defaultOptions: { a: 1 } }, createElement(OptionsProvider, { defaultOptions: { b: 2 }, extend: false }, children))
    renderHook(() => useState('page', number()), { wrapper })
    expect(factory).toHaveBeenCalledWith(['page'], { b: 2 })
  })
})
