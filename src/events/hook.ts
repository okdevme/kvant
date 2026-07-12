/**
 * The source code for this function was inspired by vue-apollo's `useEventHook` util
 * https://github.com/vuejs/vue-apollo/blob/v4/packages/vue-apollo-composable/src/util/useEventHook.ts
 */
import type { IsAny } from '../utils'

// any extends void = true
// so we need to check if T is any first
type Callback<T> = IsAny<T> extends true
  ? (...param: any) => void
  : (
      [T] extends [void]
        ? (...param: unknown[]) => void
        : [T] extends [any[]]
            ? (...param: T) => void
            : (...param: [T, ...unknown[]]) => void
    )

export type EventHookOn<T = any> = (fn: Callback<T>) => () => void
export type EventHookOff<T = any> = (fn: Callback<T>) => void
export type EventHookTrigger<T = any> = (...param: Parameters<Callback<T>>) => Promise<unknown[]>

export interface EventHook<T = any> {
  on: EventHookOn<T>
  off: EventHookOff<T>
  trigger: EventHookTrigger<T>
  clear: () => void
}

export type EventHookReturn<T> = EventHook<T>

export function createEventHook<T = any>(): EventHookReturn<T> {
  const fns: Set<Callback<T>> = new Set()

  const off = (fn: Callback<T>): void => {
    fns.delete(fn)
  }

  const clear = (): void => {
    fns.clear()
  }

  const on = (fn: Callback<T>) => {
    fns.add(fn)
    return () => off(fn)
  }

  const trigger: EventHookTrigger<T> = (...args) => {
    return Promise.all(Array.from(fns).map(fn => fn(...args)))
  }

  return {
    on,
    off,
    trigger,
    clear,
  }
}
