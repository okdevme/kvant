import type { KvantAdapter, KvantAdapterUpdateFn } from '../types/adapter'
import type { SyncEvent, Update } from '../types/sync'
import type { SetCookie } from '../utils/cookie'
import type { SnapshotRaw } from '../utils/snapshot'
import { useEventBus } from '../events/bus'
import { createEventHook } from '../events/hook'
import { defaultWindow, isClient } from '../globals'
import { decodeCookieValue, parseCookie, stringifySetCookie } from '../utils/cookie'
import { normalizeSnapshot } from '../utils/snapshot'

export interface CookiesKvantAdapterOptions extends Omit<SetCookie, 'name' | 'value'> {
  fallback?: string | SnapshotRaw<string | undefined>
}

export type CookiesKvantAdapter = KvantAdapter<
  string,
  CookiesKvantAdapterOptions
>

export const useCookiesKvantAdapter: CookiesKvantAdapter = (keys, options) => {
  const {
    fallback = {},
  } = options

  let snapshot = normalizeSnapshot(
    defaultWindow
      ? parseCookie(defaultWindow.document.cookie)
      : typeof fallback === 'string'
        ? parseCookie(fallback)
        : fallback,
    keys,
  )

  const adapterKey = 'cookies'
  const bus = useEventBus<SyncEvent>(`adapter:${adapterKey}`)
  const hook = createEventHook()

  const onSync = (event: SyncEvent): void => {
    let hasChanged = false
    for (const item of event.updates) {
      if (
        !keys.includes(item.key)
        || item.value === snapshot[item.key]
      ) {
        continue
      }

      snapshot = { ...snapshot, [item.key]: item.value }
      hasChanged = true
    }

    if (hasChanged)
      hook.trigger()
  }

  const onCookieChange = (event: CookieChangeEvent): void => {
    const updates: Update[] = []
    for (const item of event.changed) {
      if (!item.name)
        continue
      updates.push({ key: item.name, value: item.value ? decodeCookieValue(item.value) : item.value })
    }
    for (const item of event.deleted) {
      if (!item.name)
        continue
      updates.push({ key: item.name, value: undefined })
    }

    if (updates.length)
      onSync({ type: 'sync', updates })
  }

  const store = defaultWindow && 'cookieStore' in defaultWindow
    ? defaultWindow.cookieStore
    : undefined

  if (isClient) {
    bus.on(onSync)
    store?.addEventListener('change', onCookieChange)
  }
  const dispose = (): void => {
    hook.clear()
    bus.off(onSync)
    store?.removeEventListener('change', onCookieChange)
  }

  const update: KvantAdapterUpdateFn = (values) => {
    if (!defaultWindow)
      return

    const updates: Update[] = []
    for (const key in values) {
      const value = values[key] !== undefined ? String(values[key]) : undefined

      defaultWindow.document.cookie = stringifySetCookie({
        ...options,
        name: key,
        value,
        expires: value === undefined ? new Date(0) : options.expires,
      })

      updates.push({ key, value })
    }

    if (updates.length)
      bus.emit({ type: 'sync', updates })
  }

  return {
    key: adapterKey,
    subscribe: hook.on,
    getSnapshot: () => snapshot,
    update,
    dispose,
  }
}
