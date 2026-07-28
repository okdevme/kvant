import type { KvantAdapter, KvantAdapterInterface, KvantAdapterUpdateFn } from '../defs/adapter'
import type { SyncEvent, SyncEventItem } from '../defs/events'
import { useEventBus } from '../events/bus'
import { createEventHook } from '../events/hook'
import { defaultWindow } from '../globals'

export function useStorageKvantAdapter(
  storage: Storage | undefined,
  storageKey: string,
  keys: string[],
): KvantAdapterInterface<string> {
  let cache: Record<string, string | undefined> = Object.fromEntries(
    keys.map(key => [key, storage?.getItem(key) ?? undefined]),
  )

  const adapterKey = `storage:${storageKey}`
  const bus = useEventBus<SyncEvent>(`adapter:${adapterKey}`)
  const hook = createEventHook()

  const onSync = (event: SyncEvent): void => {
    let hasChanged = false
    for (const item of event.updates) {
      if (
        !keys.includes(item.key)
        || item.rawValue === cache[item.key]
      ) {
        continue
      }

      cache = { ...cache, [item.key]: item.rawValue }
      hasChanged = true
    }

    if (hasChanged)
      hook.trigger()
  }

  const onStorageEvent = (event: StorageEvent): void => {
    if (event.storageArea !== storage)
      return

    if (event.key === null) {
      onSync({
        type: 'sync',
        updates: keys.map(key => ({ key, rawValue: undefined })),
      })
    }
    else if (keys.includes(event.key)) {
      onSync({
        type: 'sync',
        updates: [{ key: event.key, rawValue: event.newValue ?? undefined }],
      })
    }
  }

  bus.on(onSync)
  defaultWindow?.addEventListener('storage', onStorageEvent)
  const dispose = (): void => {
    hook.clear()
    bus.off(onSync)
    defaultWindow?.removeEventListener('storage', onStorageEvent)
  }

  const update: KvantAdapterUpdateFn = (values) => {
    const updates: SyncEventItem[] = []
    for (const key in values) {
      const value = values[key] !== undefined ? String(values[key]) : undefined
      if (value === cache[key])
        continue

      if (value !== undefined)
        storage?.setItem(key, value)
      else
        storage?.removeItem(key)

      updates.push({ key, rawValue: value })
    }

    if (updates.length)
      bus.emit({ type: 'sync', updates })
  }

  return {
    key: adapterKey,
    subscribe: hook.on,
    getSnapshot: () => cache,
    update,
    dispose,
  }
}

export type StorageKvantAdapter = KvantAdapter<string>

export const useLocalStorageKvantAdapter: StorageKvantAdapter
  = keys => useStorageKvantAdapter(defaultWindow?.localStorage, 'local', keys)

export const useSessionStorageKvantAdapter: StorageKvantAdapter
  = keys => useStorageKvantAdapter(defaultWindow?.sessionStorage, 'session', keys)
